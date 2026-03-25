export default function Dokumentation() {
    return (
        <div className="container py-5">
            <div className="row justify-content-center">
                {/* Begrenzung auf eine angenehme Lesebreite */}
                <div className="col-12 col-lg-8">

                    {/* Haupt-Header */}
                    <h1 className="display-4 fw-bold text-light mb-4">Dokumentation</h1>
                    <p className="lead text-secondary mb-5">
                        Einleitender Text über das Projekt und den Kontext.
                    </p>

                    {/* Erster Inhaltsblock */}
                    <div className="mb-5">
                        <h2 className="h4 fw-bold text-light border-bottom border-secondary pb-2 mb-4">
                            Überschrift 1
                        </h2>
                        <ul className="list-group list-group-flush">
                            <li className="list-group-item bg-transparent text-secondary border-secondary px-0 py-3">
                                <strong className="text-light">Punkt 1:</strong> Beschreibung hier
                            </li>
                            <li className="list-group-item bg-transparent text-secondary border-secondary px-0 py-3">
                                <strong className="text-light">Punkt 2:</strong> Beschreibung hier
                            </li>
                        </ul>
                    </div>

                    {/* Zweiter Inhaltsblock */}
                    <div className="mb-5">
                        <h2 className="h4 fw-bold text-light border-bottom border-secondary pb-2 mb-4">
                            Überschrift 2
                        </h2>
                        <p className="text-secondary lh-lg">
                            Hier steht dein Fließtext. Die Klasse 'lh-lg' sorgt für den
                            großzügigen Zeilenabstand, den man im Screenshot sieht.
                        </p>
                    </div>

                </div>
            </div>
        </div>
    )
}