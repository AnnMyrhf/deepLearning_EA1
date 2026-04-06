import { useState, useEffect, useRef } from 'react'
import ml5 from 'ml5'

export default function Bilderkennung() {
    const [selectedImage, setSelectedImage] = useState(null)
    const [isDragging, setIsDragging] = useState(false)
    const [isAnalyzing, setIsAnalyzing] = useState(false)
    const [analyzingId, setAnalyzingId] = useState(null)
    const [classifier, setClassifier] = useState(null)
    const [resultsMap, setResultsMap] = useState({})
    const [uploadResults, setUploadResults] = useState([])
    const imageRefs = useRef({})
    const uploadImageRef = useRef(null)

    useEffect(() => {
        const loadModel = async () => {
            try {
                // Erzwinge WebGL, um den WebGPU-Fehler (t.requestAdapterMix) zu umgehen
                if (ml5.tf) {
                    await ml5.tf.setBackend('webgl')
                    await ml5.tf.ready()
                }
                const model = await ml5.imageClassifier('MobileNet')
                setClassifier(model)
                console.log("MobileNet v1.3.1 (WebGL) geladen")
            } catch (err) {
                console.error("Fehler beim Modell-Setup:", err)
            }
        }
        loadModel()
    }, [])

    const examples = [
        { id: 1, title: 'Dreirad', img: '/images/correct/dreirad.jpg', alt: 'Ein Dreirad auf einem Kiesweg', status: 'KORREKT' },
        { id: 2, title: 'Königspinguin', img: '/images/correct/pinguins.jpg', alt: 'Mehrere Königspinguine in der Arktis mit Berglandschaft im Hintergrund', status: 'KORREKT' },
        { id: 3, title: 'Taxi', img: '/images/correct/taxi.jpg', alt: 'Ein fahrendes Taxi in einer Großstadt', status: 'KORREKT' },
        { id: 4, title: 'Kaffeebohnen', img: '/images/incorrect/kaffee.jpg', alt: 'Kaffebohnen', status: 'FALSCH' },
        { id: 5, title: 'Muffin', img: '/images/incorrect/muffin.jpg', alt: 'Blauberrmuffin auf einer grauen Fläche', status: 'FALSCH' },
        { id: 6, title: 'Wald', img: '/images/incorrect/wald.jpg', alt: 'Wallichtung mit Sonnenstrahlen', status: 'FALSCH' }
    ]

    const translateText = async (labelsArray) => {
        if (!labelsArray || labelsArray.length === 0) return []

        // Nur den Hauptbegriff vor dem Komma nehmen und formatieren
        const cleaned = labelsArray.map(l => {
            const first = l.split(',')[0].trim()
            return first.charAt(0).toUpperCase() + first.slice(1)
        })

        try {
            const query = cleaned.join(' | ')
            const response = await fetch(`https://api.mymemory.translated.net/get?q=${encodeURIComponent(query)}&langpair=en|de`)

            if (!response.ok) return cleaned

            const data = await response.json()
            const rawTranslation = data.responseData?.translatedText

            if (!rawTranslation || data.responseStatus !== 200) return cleaned

            return rawTranslation.split('|').map((s, index) => {
                const word = s.trim()
                return word ? word.charAt(0).toUpperCase() + word.slice(1) : cleaned[index]
            })
        } catch (error) {
            console.error("Übersetzungsfehler:", error)
            return cleaned
        }
    }

    const classifyImage = async (imgElement, id = null) => {
        if (!classifier || !imgElement) return

        if (id) {
            setAnalyzingId(id)
            setResultsMap(prev => ({ ...prev, [id]: null }))
        } else {
            setIsAnalyzing(true)
            setUploadResults([])
        }

        try {
            // In v1.3.1 nutzen wir await direkt am classifier
            const results = await classifier.classify(imgElement)

            if (results && results.length > 0) {
                const deLabels = await translateText(results.map(r => r.label))

                const finalResults = results.map((r, i) => ({
                    ...r,
                    label: deLabels[i] || r.label
                }))

                if (id) {
                    setResultsMap(prev => ({ ...prev, [id]: finalResults }))
                } else {
                    setUploadResults(finalResults)
                }
            }
        } catch (err) {
            console.error("Analysefehler:", err)
        } finally {
            setAnalyzingId(null)
            setIsAnalyzing(false)
        }
    }

    const resetAllResults = () => {
        setResultsMap({}) // Leert alle Analyseergebnisse der Beispielbilder
        setAnalyzingId(null) // Stoppt eventuelle laufende Analysen
    }

    const handleImageUpload = (files) => {
        if (files && files[0]) {
            const reader = new FileReader()
            reader.onload = (e) => {
                setSelectedImage(e.target.result)
                setUploadResults([])
                setIsAnalyzing(true)
                // Analyse wird im useEffect für das selectedImage getriggert
            }
            reader.readAsDataURL(files[0])
        }
    }

    // Effekt, um die Analyse des hochgeladenen Bildes zu starten, sobald das Bild geladen ist
    useEffect(() => {
        if (selectedImage && uploadImageRef.current && isAnalyzing && uploadResults.length === 0) {
            classifyImage(uploadImageRef.current)
        }
    }, [selectedImage, isAnalyzing])

    const AnalysisBox = ({ show, onClose, isAnalyzing, predictions }) => {
        if (!show) return null
        const isLoading = isAnalyzing || !predictions || predictions.length === 0
        return (
            <div className="p-4 bg-dark border border-secondary rounded-4 shadow h-100 position-relative d-flex flex-column justify-content-center">
                <button type="button" className="btn-close btn-close-white position-absolute top-0 end-0 m-3" onClick={onClose}></button>
                <h3 className="h6 fw-bold text-light mb-3 text-uppercase">Ergebnis</h3>
                {isLoading ? (
                    <div className="text-center py-3">
                        <div className="spinner-border spinner-border-sm text-primary mb-2"></div>
                        <p className="text-secondary small m-0">Bild wird analysiert...</p>
                    </div>
                ) : (
                    predictions.map((p, i) => (
                        <div key={i} className="mb-3">
                            <div className="d-flex justify-content-between small mb-1">
                                <span className="text-light">{p.label}</span>
                                <span className="text-primary">{(p.confidence * 100).toFixed(1)}%</span>
                            </div>
                            <div className="progress" style={{ height: '4px' }}>
                                <div className="progress-bar bg-primary" style={{ width: `${p.confidence * 100}%` }}></div>
                            </div>
                        </div>
                    ))
                )}
            </div>
        )
    }

    return (
        <div className="container py-5 mb-5">
            <header className="mb-5">
                <h1 className="display-4 fw-bold text-light mb-4">Bilderkennung</h1>
                <p className="lead text-secondary mb-3">Beispielbilder oder eigene Bilder analysieren.</p>
                <nav>
                    <ul className="list-unstyled d-flex flex-column gap-2">
                        <li><a href="#beispiel-sektion" className="text-primary text-decoration-none hover-link">→ Beispielbilder analysieren</a></li>
                        <li><a href="#upload-sektion" className="text-primary text-decoration-none hover-link">→ Eigenes Bild hochladen</a></li>
                    </ul>
                </nav>
            </header>

            <section id="beispiel-sektion" className="mb-5 pb-5 border-bottom border-secondary border-opacity-25">
                <div className="d-flex justify-content-between align-items-center mb-4">
                    <h2 className="h4 text-light m-0">Beispielbilder klassifizieren</h2>

                    {/* Der "Alle zurücksetzen" Button */}
                    {Object.keys(resultsMap).length > 0 && (
                        <button
                            className="btn btn-sm btn-outline-secondary rounded-pill px-3"
                            onClick={resetAllResults}
                        >
                            <span className="me-1">✕</span> Alle Ergebnisse löschen
                        </button>
                    )}
                </div>
                {examples.map((ex) => {
                    const isCurrentlyAnalyzing = analyzingId === ex.id
                    const hasResult = !!resultsMap[ex.id]
                    return (
                        <div key={ex.id} className="row g-4 mb-4 align-items-stretch">
                            <div className="col-md-7">
                                <div className={`p-3 rounded-4 border h-100 d-flex flex-column justify-content-center ${hasResult ? 'border-primary bg-primary bg-opacity-10' : 'border-secondary bg-dark'}`}>
                                    <div className="row align-items-center">
                                        <div className="col-5">
                                            <div className="position-relative">
                                                <img src={ex.img} className="img-fluid rounded-3" alt={ex.alt} ref={el => imageRefs.current[ex.id] = el} />
                                                {hasResult && <span className={`badge position-absolute top-0 start-0 m-2 ${ex.status === 'KORREKT' ? 'bg-success' : 'bg-danger'}`}>{ex.status}</span>}
                                            </div>
                                        </div>
                                        <div className="col-7">
                                            <h3 className="h5 text-light mb-3">{ex.title}</h3>
                                            <button
                                                className={`btn rounded-pill w-100 btn-theme-ai ${hasResult ? 'active' : ''}`}
                                                onClick={() => {
                                                    if (hasResult) {
                                                        setResultsMap(prev => {
                                                            const n = { ...prev }
                                                            delete n[ex.id]
                                                            return n
                                                        })
                                                    } else {
                                                        classifyImage(imageRefs.current[ex.id], ex.id)
                                                    }
                                                }}
                                            >
                                                {hasResult ? 'Zurücksetzen' : 'Analyse starten'}
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="col-md-5">
                                <AnalysisBox
                                    show={isCurrentlyAnalyzing || hasResult}
                                    isAnalyzing={isCurrentlyAnalyzing}
                                    predictions={resultsMap[ex.id]}
                                    onClose={() => {
                                        const n={...resultsMap};
                                        delete n[ex.id];
                                        setResultsMap(n);
                                        if (analyzingId === ex.id) setAnalyzingId(null);
                                    }}
                                />
                            </div>
                        </div>
                    )
                })}
            </section>

            <section id="upload-sektion" className="mb-5 pb-5">
                <h2 className="h4 text-light mb-4">Eigenes Bild hochladen</h2>
                <div className="row g-4 align-items-stretch">
                    <div className="col-md-7">
                        <div className={`p-4 border-2 rounded-4 text-center h-100 d-flex flex-column justify-content-center ${isDragging ? 'bg-primary bg-opacity-10' : 'bg-dark border-secondary'}`}
                             style={{ borderStyle: 'dashed', cursor: 'pointer' }}
                             onDragOver={(e) => { e.preventDefault(); setIsDragging(true) }}
                             onDragLeave={() => setIsDragging(false)}
                             onDrop={(e) => { e.preventDefault(); setIsDragging(false); handleImageUpload(e.dataTransfer.files) }}
                             onClick={() => !selectedImage && document.getElementById('fileInput').click()}
                        >
                            {selectedImage ? (
                                <div>
                                    <img src={selectedImage} ref={uploadImageRef} className="img-fluid rounded-3 shadow mb-3" alt="Vorschau" style={{ maxHeight: '300px' }} />
                                    <button className="btn btn-sm btn-outline-danger d-block mx-auto rounded-pill" onClick={(e) => { e.stopPropagation(); setSelectedImage(null); setUploadResults([]); setIsAnalyzing(false) }}>Bild entfernen</button>
                                </div>
                            ) : (
                                <div className="py-4">
                                    <p className="text-secondary m-0">Zieh ein Bild hierher oder klicke zum Hochladen</p>
                                    <input type="file" id="fileInput" className="d-none" accept="image/*" onChange={(e) => handleImageUpload(e.target.files)} />
                                </div>
                            )}
                        </div>
                    </div>
                    <div className="col-md-5">
                        <AnalysisBox show={!!selectedImage} isAnalyzing={isAnalyzing} predictions={uploadResults} onClose={() => { setSelectedImage(null); setUploadResults([]); setIsAnalyzing(false) }} />
                    </div>
                </div>
            </section>
        </div>
    )
}