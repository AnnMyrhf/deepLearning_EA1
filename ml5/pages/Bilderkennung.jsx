import { useState } from 'react'

export default function Bilderkennung() {
    const [selectedImage, setSelectedImage] = useState(null)
    const [isDragging, setIsDragging] = useState(false)

    // Beispieldaten für die obere Liste
    const examples = [
        { id: 1, title: 'Bild 1', img: 'https://via.placeholder.com/400x250', status: 'KORREKT' },
        { id: 2, title: 'Bild 2', img: 'https://via.placeholder.com/400x250' },
        { id: 3, title: 'Bild 3', img: 'https://via.placeholder.com/400x250' },
    ]

    // Zentrale Funktion für den Bildupload
    const handleImageUpload = (files) => {
        if (files && files[0]) {
            const reader = new FileReader()
            reader.onload = (e) => setSelectedImage(e.target.result)
            reader.readAsDataURL(files[0])
        }
    }

    return (
        <div className="container py-5 mb-5 pb-5">
            <header className="mb-5">
                <h1 className="display-5 fw-bold text-light">Bilderkennung</h1>
                <p className="text-secondary">Klassifizierung von Bildern mit dem ml5 Framework</p>
            </header>

            {/* Liste der Beispiele */}
            <div className="row g-4 mb-5">
                {examples.map((ex) => (
                    <div key={ex.id} className="col-12">
                        <div className="row align-items-center bg-dark border border-secondary rounded-3 overflow-hidden g-0 p-3 shadow-sm">
                            <div className="col-md-5 position-relative">
                                {ex.status && <span className="badge bg-success position-absolute m-2 top-0 start-0">{ex.status}</span>}
                                <img src={ex.img} alt={ex.title} className="img-fluid rounded-2" />
                            </div>
                            <div className="col-md-7 ps-md-4 mt-3 mt-md-0 text-center text-md-start">
                                <h3 className="h5 text-light mb-3">{ex.title}</h3>
                                <div className="p-4 bg-secondary bg-opacity-10 rounded-3 border border-secondary border-opacity-25">
                                    <button className="btn btn-outline-light btn-sm px-4 py-2 rounded-pill fw-bold shadow-sm">
                                        Klassifizieren
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Optimierter Upload-Bereich */}
            <section className="mt-5 pt-5 border-top border-secondary">
                <h2 className="h3 text-light mb-4">Eigenes Bild hochladen & klassifizieren</h2>

                <div
                    onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
                    onDragLeave={() => setIsDragging(false)}
                    onDrop={(e) => { e.preventDefault(); setIsDragging(false); handleImageUpload(e.dataTransfer.files); }}
                    className={`p-5 border rounded-4 text-center transition-all shadow-lg ${
                        isDragging ? 'border-primary bg-primary bg-opacity-10 scale-102' : 'border-secondary bg-dark bg-opacity-50'
                    }`}
                    style={{ borderStyle: 'dashed', borderWidth: '2px', cursor: 'pointer', transition: 'all 0.2s ease-in-out' }}
                >
                    <div className="py-4 pointer-events-none">
                        {selectedImage ? (
                            <div>
                                <img src={selectedImage} alt="Vorschau" className="img-fluid rounded-3 shadow mb-3" style={{ maxHeight: '350px' }} />
                                <div>
                                    <button
                                        className="btn btn-sm btn-outline-danger rounded-pill px-4"
                                        style={{ pointerEvents: 'auto' }}
                                        onClick={(e) => { e.stopPropagation(); setSelectedImage(null); }}
                                    >
                                        Bild entfernen
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <div className="d-flex flex-column align-items-center">
                                {/* Das Upload-Icon für mehr Klarheit */}
                                <div className={`mb-4 transition-all ${isDragging ? 'text-primary' : 'text-secondary opacity-25'}`}>
                                    <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" fill="currentColor" viewBox="0 0 16 16">
                                        <path d="M.5 9.9a.5.5 0 0 1 .5.5v2.5a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-2.5a.5.5 0 0 1 1 0v2.5a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2v-2.5a.5.5 0 0 1 .5-.5z"/>
                                        <path d="M7.646 1.146a.5.5 0 0 1 .708 0l3 3a.5.5 0 0 1-.708.708L8.5 2.707V11.5a.5.5 0 0 1-1 0V2.707L5.354 4.854a.5.5 0 1 1-.708-.708l3-3z"/>
                                    </svg>
                                </div>
                                <h4 className="text-light fw-bold">Bild hierher ziehen</h4>
                                <p className="text-secondary mb-3 small">oder klicke, um eine Datei auszuwählen</p>
                                <input type="file" className="d-none" id="fileUpload" accept="image/*" onChange={(e) => handleImageUpload(e.target.files)} />
                                <label htmlFor="fileUpload" className="btn btn-secondary px-4 py-2 rounded-pill fw-bold shadow-sm" style={{ pointerEvents: 'auto', cursor: 'pointer' }}>
                                    Datei auswählen
                                </label>
                            </div>
                        )}
                    </div>
                </div>
            </section>
        </div>
    )
}