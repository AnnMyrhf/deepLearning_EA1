import { BrowserRouter, Routes, Route } from 'react-router-dom' // BrowserRouter direkt importiert
import Navbar from "../components/Navbar.jsx";
import Footer from "../components/Footer.jsx";
import Dokumentation from "../pages/Dokumentation.jsx";
import Diskussion from "../pages/Diskussion.jsx";

function App() {
    return (
        <BrowserRouter>
            <div className="min-vh-100 bg-dark text-light d-flex flex-column">
                <Navbar />

                <main className="flex-grow-1">
                    <Routes>
                        {/* Hier kommen nur die URL-Namen rein, KEINE Dateipfade */}
                        <Route path="/" element={<div>Startseite / Bilderkennung</div>} />
                        <Route path="/diskussion" element={<Diskussion />} />
                        <Route path="/dokumentation" element={<Dokumentation />} />

                        <Route path="*" element={<div>Seite nicht gefunden</div>} />
                    </Routes>
                </main>

                <Footer />
            </div>
        </BrowserRouter>
    )
}

export default App
