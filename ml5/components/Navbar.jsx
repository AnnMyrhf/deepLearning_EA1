import { NavLink } from 'react-router-dom'

export default function Navbar() {
    return (
        <nav className="navbar navbar-expand-lg navbar-dark bg-dark border-bottom border-secondary">
            <div className="container">
                <span className="navbar-brand fw-bold" to="/">EA1 – Bilderkennung mit ml5</span>

                <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
                    <span className="navbar-toggler-icon"></span>
                </button>

                <div className="collapse navbar-collapse" id="navbarNav">
                    <ul className="navbar-nav ms-auto">
                        <li className="nav-item">
                            <NavLink className="nav-link" to="/">Bilderkennung</NavLink>
                        </li>
                        <li className="nav-item">
                            <NavLink className="nav-link" to="/diskussion">Diskussion</NavLink>
                        </li>
                        <li className="nav-item">
                            <NavLink className="nav-link" to="/dokumentation">Dokumentation</NavLink>
                        </li>
                    </ul>
                </div>
            </div>
        </nav>
    )
}