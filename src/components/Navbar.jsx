import { NavLink } from "react-router-dom";

export default function Navbar() {
  const linkClass = ({ isActive }) =>
    "nav__link" + (isActive ? " nav__link--active" : "");

  return (
    <header className="topbar">
      <nav className="nav">
        <NavLink to="/" className="brand">
          <span className="brand__dot" />
          <span className="brand__text">Anime-Verse</span>
        </NavLink>

        <div className="nav__links">
          <NavLink to="/" className={linkClass}>
            Accueil
          </NavLink>
          <NavLink to="/discover" className={linkClass}>
            Découvrir
          </NavLink>
          <NavLink to="/favorites" className={linkClass}>
            Favoris
          </NavLink>
          <NavLink to="/signup" className={linkClass}>
            Inscription
          </NavLink>
        </div>
      </nav>
    </header>
  );
}