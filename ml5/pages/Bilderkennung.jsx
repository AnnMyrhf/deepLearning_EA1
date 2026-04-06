import { useState, useEffect, useRef } from 'react'
import ml5 from 'ml5'

export default function Bilderkennung() {
    const [selectedImage, setSelectedImage] = useState(null)
    const [isDragging, setIsDragging] = useState(false)
    const [isAnalyzing, setIsAnalyzing] = useState(false)
    const [classifier, setClassifier] = useState(null)
    const [resultsMap, setResultsMap] = useState({})
    const [uploadResults, setUploadResults] = useState([])
    const imageRefs = useRef({})

    useEffect(() => {
        const model = ml5.imageClassifier('MobileNet', () => {
            setClassifier(model)
        })
    }, [])

    const examples = [
        { id: 1, title: 'Dreirad', img: '/images/correct/dreirad.jpg', alt: 'Ein Dreirad auf einem Kiesweg', status: 'KORREKT' },
        { id: 2, title: 'Königspinguin', img: '/images/correct/pinguins.jpg', alt: 'Mehrere Kaiserpinguine in der Arktis mit Berglandschaft im Hintergrund', status: 'KORREKT' },
        { id: 3, title: 'Taxi', img: '/images/correct/taxi.jpg', alt: 'Ein fahrendes Taxi in einer Großstadt', status: 'KORREKT' },
        { id: 4, title: 'Kaffeebohnen', img: '/images/incorrect/kaffee.jpg', alt: 'Kaffebohnen',status: 'FALSCH' },
        { id: 5, title: 'Muffin', img: '/images/incorrect/muffin.jpg', alt: 'Blauberrmuffin auf einer grauen Fläche', status: 'FALSCH' },
        { id: 6, title: 'Wald', img: '/images/incorrect/wald.jpg', alt: 'Wallichtung mit Sonnenstrahlen', status: 'FALSCH' }
    ]

    const translateText = async (text) => {
        try {
            const sanitizedText = encodeURIComponent(text.split(',')[0])
            const response = await fetch(`https://api.mymemory.translated.net/get?q=${sanitizedText}&langpair=en|de`)
            const data = await response.json()
            return data.responseData.translatedText
        } catch { return text }
    }

    const classifyImage = async (imgElement, id = null) => {
        if (!classifier || !imgElement) return
        setIsAnalyzing(true)
        classifier.classify(imgElement, async (results) => {
            if (results && results.length > 0) {
                const translatedResults = await Promise.all(
                    results.map(async (p) => {
                        const germanLabel = await translateText(p.label)
                        return { ...p, label: germanLabel }
                    })
                )
                if (id) {
                    setResultsMap(prev => ({ ...prev, [id]: translatedResults }))
                } else {
                    setUploadResults(translatedResults)
                }
            }
            setIsAnalyzing(false)
        })
    }

    const handleImageUpload = (files) => {
        if (files && files[0]) {
            const reader = new FileReader()
            reader.onload = (e) => {
                setSelectedImage(e.target.result)
                setUploadResults([])
            }
            reader.readAsDataURL(files[0])
        }
    }

    const AnalysisBox = ({ show, onClose, isAnalyzing, predictions }) => {
        if (!show) return null;
        return (
            <div className="p-4 bg-dark border border-secondary rounded-4 shadow h-100 position-relative d-flex flex-column justify-content-center">
                <button type="button" className="btn-close btn-close-white position-absolute top-0 end-0 m-3" aria-label="Close" onClick={onClose}></button>
                <h3 className="h6 fw-bold text-light mb-3 text-uppercase">Ergebnis</h3>
                {isAnalyzing ? (
                    <div className="text-center py-3">
                        <div className="spinner-border spinner-border-sm text-primary mb-2"></div>
                        <p className="text-secondary small">Bild wird analysiert...</p>
                    </div>
                ) : predictions && predictions.length > 0 ? (
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
                ) : (
                    <p className="text-secondary small m-0 text-center">Keine Daten verfügbar</p>
                )}
            </div>
        );
    };

    return (
        <div className="container py-5 mb-5">
            <header className="mb-5">
                <h1 className="display-4 fw-bold text-light mb-4">Bilderkennung</h1>
                <p className="lead text-secondary mb-3">
                    Schaue dir Beispielbilder an oder lade deine eigenen Bilder hoch, um die automatisierte Bildklassifizierung mit dem ml5.js-Framework und dem vortrainierten MobileNet-Modell zu testen.
                </p>
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

                    {/* Der verschobene, dezentere Button */}
                    {Object.keys(resultsMap).length > 0 && (
                        <button
                            className="btn btn-reset-small rounded-pill d-flex align-items-center gap-2"
                            onClick={() => setResultsMap({})}
                        >
                            <span>Alles zurücksetzen</span>
                            <span className="fw-bold">✕</span>
                        </button>
                    )}
                </div>

                {examples.map((ex) => {
                    const hasResult = !!resultsMap[ex.id];
                    return (
                        <div key={ex.id} className="row g-4 mb-4 align-items-stretch">
                            <div className="col-md-7">
                                <div className={`p-3 rounded-4 border h-100 d-flex flex-column justify-content-center ${hasResult ? 'border-primary bg-primary bg-opacity-10' : 'border-secondary bg-dark'}`}>
                                    <div className="row align-items-center">
                                        <div className="col-5">
                                            <div className="position-relative">
                                                <img
                                                    src={ex.img}
                                                    className="img-fluid rounded-3"
                                                    alt={ex.alt}
                                                    ref={el => imageRefs.current[ex.id] = el}
                                                />
                                                {hasResult && (
                                                    <span className={`badge position-absolute top-0 start-0 m-2 ${ex.status === 'KORREKT' ? 'bg-success' : 'bg-danger'}`}>
                                                        {ex.status}
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                        <div className="col-7">
                                            <h3 className="h5 text-light mb-3">{ex.title}</h3>
                                            <button
                                                className={`btn rounded-pill w-100 btn-theme-ai ${hasResult ? 'active' : ''}`}
                                                onClick={() => {
                                                    if (hasResult) {
                                                        const newMap = { ...resultsMap };
                                                        delete newMap[ex.id];
                                                        setResultsMap(newMap);
                                                    } else {
                                                        classifyImage(imageRefs.current[ex.id], ex.id);
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
                                    show={hasResult}
                                    isAnalyzing={isAnalyzing && !resultsMap[ex.id]}
                                    predictions={resultsMap[ex.id]}
                                    onClose={() => {
                                        const newMap = { ...resultsMap };
                                        delete newMap[ex.id];
                                        setResultsMap(newMap);
                                    }}
                                />
                            </div>
                        </div>
                    );
                })}
            </section>

            <section id="upload-sektion" className="mb-5 pb-5">
                <h2 className="h4 text-light mb-4">Eigenes Bild hochladen</h2>
                <div className="row g-4 align-items-stretch">
                    <div className="col-md-7">
                        <div
                            className={`p-4 border-2 rounded-4 text-center h-100 d-flex flex-column justify-content-center ${isDragging ? 'bg-primary bg-opacity-10' : 'bg-dark border-secondary'}`}
                            style={{ borderStyle: 'dashed' }}
                            onDragOver={(e) => { e.preventDefault(); setIsDragging(true) }}
                            onDragLeave={() => setIsDragging(false)}
                            onDrop={(e) => { e.preventDefault(); setIsDragging(false); handleImageUpload(e.dataTransfer.files) }}
                        >
                            {selectedImage ? (
                                <div>
                                    <img
                                        src={selectedImage}
                                        className="img-fluid rounded-3 shadow mb-3"
                                        alt="Hochgeladenes Bild zur Analyse"
                                        style={{ maxHeight: '300px' }}
                                        onLoad={(e) => classifyImage(e.target)}
                                    />
                                    <button className="btn btn-sm btn-outline-danger d-block mx-auto rounded-pill" onClick={() => { setSelectedImage(null); setUploadResults([]) }}>
                                        Bild entfernen
                                    </button>
                                </div>
                            ) : (
                                <div onClick={() => document.getElementById('fileInput').click()} style={{ cursor: 'pointer' }} className="py-4">
                                    <p className="text-secondary m-0">Zieh ein Bild hierher oder klicke zum Hochladen</p>
                                    <input type="file" id="fileInput" className="d-none" accept="image/*" onChange={(e) => handleImageUpload(e.target.files)} />
                                </div>
                            )}
                        </div>
                    </div>
                    <div className="col-md-5">
                        <AnalysisBox
                            show={!!selectedImage}
                            isAnalyzing={isAnalyzing && uploadResults.length === 0}
                            predictions={uploadResults}
                            onClose={() => { setSelectedImage(null); setUploadResults([]) }}
                        />
                    </div>
                </div>
            </section>
        </div>
    )
}