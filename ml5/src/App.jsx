import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Navbar from '../components/Navbar.jsx'
import Footer from '../components/Footer.jsx'
import Bilderkennung from '../pages/Bilderkennung.jsx'
import Dokumentation from '../pages/Dokumentation.jsx'
import Diskussion from '../pages/Diskussion.jsx'

function App() {
    return (
        <BrowserRouter>
            <div className="min-vh-100 d-flex flex-column">
                <Navbar />
                <main className="flex-grow-1">
                    <Routes>
                        <Route path="/" element={<Bilderkennung />} />
                        <Route path="/diskussion" element={<Diskussion />} />
                        <Route path="/dokumentation" element={<Dokumentation />} />
                    </Routes>
                </main>
                <Footer />
            </div>
        </BrowserRouter>
    )
}

export default App