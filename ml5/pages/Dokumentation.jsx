export default function Dokumentation() {
    return (<div className="container py-5 mb-5 pb-5">
        <div className="row justify-content-center">
            {/* Haupt-Header */}
            <h1 className="display-4 fw-bold text-light mb-4">Dokumentation</h1>
            <p className="lead text-secondary mb-5">
                Die folgende Übersicht beschreibt die eingesetzten Frameworks und Tools sowie die technischen
                Besonderheiten, die bei der Entwicklung der Web-Anwendung zum Einsatz kamen. </p>

            {/* Frameworks & Tools */}
            <div className="mb-5">
                <h2 className="h4 fw-bold text-light border-bottom border-secondary pb-2 mb-4">
                    Verwendete Frameworks & Tools
                </h2>
                <p>
                    Die Auswahl des TechStacks basierte auf praktischen Erfahrungen aus vergangenen Projekten. Der
                    Fokus lag auf einer performanten, schlanken und wartbaren Architektur. Um die Komplexität gering
                    zu halten, wurden bewusst nur die notwendigsten Technologien eingesetzt.</p>
                <ul className="list-group list-group-flush">
                    <li className="list-group-item bg-transparent text-secondary border-secondary px-0 py-3">
                        <strong className="text-light">React</strong><p>Frontend-Framework, das aufgrund der
                        komponentenbasierten Architektur sowie der Nutzung von Hooks (useState,
                        useEffect, useRef) eine effiziente Zustandsverwaltung und eine reaktive
                        Benutzeroberfläche ermöglicht.</p>
                    </li>
                    <li className="list-group-item bg-transparent text-secondary border-secondary px-0 py-3">
                        <strong className="text-light">ml5.js (Pflicht)</strong> <p>Dient als High-Level-Schnittstelle
                        zu TensorFlow.js. Darüber wird das vortrainierte Modell MobileNet geladen und direkt im Browser
                        ausgeführt. Dadurch ist keine serverseitige Verarbeitung notwendig.
                    </p></li>
                    <li className="list-group-item bg-transparent text-secondary border-secondary px-0 py-3">
                        <strong className="text-light">Bootstrap 5</strong> <p>Wird für das responsive Layout sowie die
                        UI-Komponenten genutzt. Dadurch kann mit geringem Aufwand eine konsistente und mobiloptimierte
                        Benutzeroberfläche umgesetzt werden.</p></li>
                    <li className="list-group-item bg-transparent text-secondary border-secondary px-0 py-3">
                        <strong className="text-light">Vite</strong> <p>Modernes Build-Tool für schnelle
                        Entwicklungszyklen sowie optimierte Productions Builds.</p></li>
                    <li className="list-group-item bg-transparent text-secondary border-secondary px-0 py-3">
                        <strong className="text-light">My Memory API</strong> <p>Externe API zur Übersetzung der
                        englischen Klassifizierungsergebnisse ins Deutsche in Echtzeit (siehe auch <a
                            href="#automatische-uebersetzung">Automatische Übersetzung der Klassifizierungsergebnisse
                        </a>).
                    </p></li>
                    <li className="list-group-item bg-transparent text-secondary border-secondary px-0 py-3">
                        <strong className="text-light">Vite</strong> <p>Modernes Build-Tool, das eine performante
                        Entwicklungsumgebung sowie ein hochgradig optimiertes Deployment der React-Anwendung
                        sicherstellt</p>
                    </li>
                    <li className="list-group-item bg-transparent text-secondary border-secondary px-0 py-3">
                        <strong className="text-light">Render</strong> <p>Hosting und Webserver mit Continuous
                        Deployment (CD) zur automatisierten Bereitstellung von Aktualisierungen</p></li>
                    <li className="list-group-item bg-transparent text-secondary border-secondary px-0 py-3">
                        <strong className="text-light">Beispielbilder</strong> <p>Die sechs verwendeten
                        Beispielbilder stammen aus den lizenzfreien Bilddatenbanken Unsplash und Pixabay.</p></li>
                </ul>
            </div>
            {/* Technische Besonderheiten */}
            <div className="mb-5">
                <h2 className="h4 fw-bold text-light border-bottom border-secondary pb-2 mb-4">
                    Technische Besonderheiten
                </h2>
                <ul className="list-group list-group-flush">
                    <li id="automatische-uebersetzung"
                        className="list-group-item bg-transparent text-secondary border-secondary px-0 py-3">
                        <strong className="text-light">Automatische Übersetzung der Klassifizierungsergebnisse</strong>
                        <p> MobileNet liefert die Klassifizierungsergebnisse ausschließlich auf Englisch aus.
                            Deshalb habe ich noch eine automatische Übersetzung hinzugefügt. Gerade bei einer ansonsten
                            komplett deutschen Seite empfand ich das in puncto Barrierefreiheit und UX als notwendig.
                            Technisch habe ich es so gelöst, dass die Labels vorab bereinigt werden, indem nur der
                            Hauptbegriff vor dem Komma genommen wird. Diese Begriffe werden dann gebündelt als
                            Batch-Request an die kostenlose MyMemory API geschickt, was die Performance deutlich
                            verbessert.
                            Sollte die API einmal nicht erreichbar sein, greift ein Fallback-Mechanismus, der einfach
                            die englischen Originalbegriffe anzeigt, damit die Anwendung stabil bleibt. Die
                            Übersetzungsqualität der MyMemory API ist allerdings teilweise eher mittelmäßig, was mir
                            während der Entwicklung auch aufgefallen ist. Gerade bei spezifischeren Begriffen sind die
                            Ergebnisse nicht immer optimal. Alternativen wie Google Cloud Translation API oder DeepL API
                            würden hier mit Sicherheit deutlich präzisere Ergbenisse liefern. Für die beispielhafte
                            Klassifizierung war mir jedoch eine kostenfreie und unkompliziert integrierbare
                            Schnittstelle wichtiger.</p>
                    </li>
                    <li className="list-group-item bg-transparent text-secondary border-secondary px-0 py-3">
                        <strong className="text-light">Dynamische Ergebnisverwaltung</strong> <p>Durch die Speicherung
                        der Analysedaten in einer Map-Struktur (resultsMap) können die einzelnen
                        Klassifizierungsergebnisse der Bilder unabhängig voneinander verwaltet werden. Die Ergebnisse
                        bereits klassifizierter Bilder bleiben sichtbar, während andere zurückgesetzt oder neu
                        analysiert werden können.
                    </p>
                    </li>
                    <li className="list-group-item bg-transparent text-secondary border-secondary px-0 py-3">
                        <strong className="text-light">Asynchrone Verarbeitung & State-Management</strong> <p>Die
                        Bildklassifizierung und die anschließende Übersetzung erfolgen vollständig asynchron.
                        Verschiedene States (z. B. isAnalyzing, resultsMap, uploadResults) steuern dabei gezielt die
                        UI-Elemente (z. B. den Lade-Spinner). Dadurch ist die Anwendung auch während rechenintensiver
                        Modell-Abfragen jederzeit reaktionsfähig und
                        performant.
                    </p>
                    </li>
                    <li className="list-group-item bg-transparent text-secondary border-secondary px-0 py-3">
                        <strong className="text-light">User Interface & Interaktionsdesign</strong> <p>Ich persönlich
                        bevorzuge den Dark
                        Mode, wollte aber bewusst auch andere Nutzerpräferenzen berücksichtigen. Daher ist der Dark Mode
                        auch als Default gesetzt. Über einen integrierten Theme-Switcher kann jedoch jederzeit in den
                        Light Mode gewechselt werden. Die Theme-Implementierung erfolgt über zentrale CSS-Variablen,
                        wodurch sich das Design flexibel und konsistent anpassen lässt.

                        Das User Interface ist ansonsten bewusst reduziert gehalten. Einerseits ergibt sich dies aus der
                        Aufgabenstellung, andererseits war mir ein klarer Fokus auf die Kernfunktion
                        (Bildklassifizierung) wichtig. Mein Ziel war eine intuitive und möglichst kognitiv entlastende
                        Anwendung.
                        Durch den Einsatz von Sprungmarken wird zudem eine einfache und konsistente Navigation
                        ermöglicht. Das ist insbesondere für die Nutzung mit mobilen Endgeräten vorteilhaft. Darüber
                        hinaus reagiert die Anwendung unmittelbar auf Nutzerinteraktionen. Zum Beispiel durch die
                        automatische Analyse nach dem Bildupload.
                    </p>
                    </li>
                    <li className="list-group-item bg-transparent text-secondary border-secondary px-0 py-3">
                        <strong className="text-light">Feedback & Hilfen</strong> <p>Die Anwendung bietet durch
                        Lade-Indikatoren (Spinner) und kontextsensitive Fehlermeldungen stets eine angemessene
                        Rückmeldung
                        über den Systemstatus. Ein integrierter Schutzmechanismus prüft z. B. bei Bild-Upload dasss
                        Dateien bereits
                        vor der
                        Verarbeitung auf zulässige Formate (JPG, PNG, WebP) und eine maximale Dateigröße von 5
                        MB.</p>
                    </li>

                </ul>
            </div>
        </div>
    </div>)
}