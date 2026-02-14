import { useEffect, useMemo, useState } from "react";
import AnimeCard from "../components/AnimeCard";
import AnimeModal from "../components/AnimeModal";

export default function Favorites() {
  const [favorites, setFavorites] = useState(() => {
    const saved = localStorage.getItem("animeverse_favs");
    return saved ? JSON.parse(saved) : [];
  });

  
  const [selectedId, setSelectedId] = useState(null);

  useEffect(() => {
    localStorage.setItem("animeverse_favs", JSON.stringify(favorites));
  }, [favorites]);

  const favIds = useMemo(() => new Set(favorites.map((f) => f.id)), [favorites]);

  const removeFav = (id) => {
    setFavorites((prev) => prev.filter((f) => f.id !== id));
  };

  const toggleWatched = (id) => {
    setFavorites((prev) =>
      prev.map((f) => (f.id === id ? { ...f, watched: !f.watched } : f))
    );
  };

  return (
    <section>
      <h1 className="heroTitle">
         <span className="gradientTitle">Mes Favoris</span>
      </h1>

      {favorites.length === 0 ? (
        <p className="muted">Aucun favori. Va dans “Découvrir” ou cherche sur l’accueil.</p>
      ) : (
        <>
          <p className="muted" style={{ marginTop: 6 }}>
            Clique sur une carte pour voir les détails. Clique sur le titre pour “Vu / Pas vu”.
          </p>

          <div className="grid" style={{ marginTop: 12 }}>
            {favorites.map((a) => (
              <div key={a.id} style={{ position: "relative" }}>
                
                <div
                  className="pill"
                  style={{
                    position: "absolute",
                    left: 12,
                    top: 12,
                    zIndex: 2,
                    background: a.watched ? "rgba(34,211,238,0.35)" : "rgba(0,0,0,0.45)",
                    borderColor: a.watched ? "rgba(34,211,238,0.45)" : "rgba(255,255,255,0.14)",
                    cursor: "pointer",
                  }}
                  title="Clique pour marquer vu / pas vu"
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleWatched(a.id);
                  }}
                >
                  {a.watched ? " Vu" : " Pas vu"}
                </div>

                <AnimeCard
                  anime={a}
                  isFavorite={favIds.has(a.id)}
                  onAdd={() => {}}
                  onRemove={() => removeFav(a.id)}
                  onOpenDetails={(id) => setSelectedId(id)}
                />
              </div>
            ))}
          </div>
        </>
      )}

      {/* Modal détails */}
      <AnimeModal animeId={selectedId} onClose={() => setSelectedId(null)} />
    </section>
  );
}
