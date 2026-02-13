import { NavLink } from "react-router-dom";

export default function Navbar() {
  return (
    <header className="nav">
      <div className="nav__brand">Anime-Verse</div>

      <nav className="nav__links">
        <NavLink to="/" end>Accueil</NavLink>
        <NavLink to="/discover">Découvrir</NavLink>
        <NavLink to="/favorites">Favoris</NavLink>
        <NavLink to="/signup">Inscription</NavLink>
      </nav>
    </header>
  );
}
