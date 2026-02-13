import { useEffect, useMemo, useState } from "react";
import AnimeCard from "../components/AnimeCard";
import AnimeModal from "../components/AnimeModal";
import Loading from "../components/Loading";

export default function Discover() {
  const [query, setQuery] = useState("one piece");
  const [animes, setAnimes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  
  const [selectedId, setSelectedId] = useState(null);

  
  const [favorites, setFavorites] = useState(() => {
    const saved = localStorage.getItem("animeverse_favs");
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem("animeverse_favs", JSON.stringify(favorites));
  }, [favorites]);

  const favIds = useMemo(() => new Set(favorites.map((f) => f.id)), [favorites]);

  const addFav = (anime) => {
    if (favIds.has(anime.id)) return;
    setFavorites((prev) => [...prev, anime]);
  };

  const removeFav = (id) => {
    setFavorites((prev) => prev.filter((f) => f.id !== id));
  };

  
  useEffect(() => {
    const timer = setTimeout(() => {
      const run = async () => {
        try {
          setError(false);
          setLoading(true);

          const resp = await fetch(
            `https://api.jikan.moe/v4/anime?q=${encodeURIComponent(query)}&limit=12`
          );
          const json = await resp.json();

          const mapped = (json?.data ?? []).map((a) => ({
            id: a.mal_id,
            title: a.title,
            image: a.images?.jpg?.image_url,
            score: a.score,
            type: a.type,
            episodes: a.episodes,
            releaseDate: a.aired?.from
              ? new Date(a.aired.from).toLocaleDateString()
              : "—",
            studio: a.studios?.[0]?.name ?? "—",
            synopsis: a.synopsis,
            genres: (a.genres ?? []).map((g) => g.name),
            producers: (a.producers ?? []).map((p) => p.name),
          }));

          setAnimes(mapped);
        } catch (e) {
          console.error("Problème API", e);
          setError(true);
        } finally {
          setLoading(false);
        }
      };

      
      if (query.trim().length > 0) run();
      else {
        setAnimes([]);
        setLoading(false);
      }
    }, 450);

    return () => clearTimeout(timer);
  }, [query]);

  return (
    <section>
      <div className="heroBox" style={{ marginBottom: 14 }}>
        <div className="heroLeft">
          <h1 className="heroTitle">
            🔎 <span className="gradientTitle">Découvrir</span>
          </h1>
          <p className="heroText">
            Recherche un animé et clique sur une carte pour voir les détails (studio,
            producteurs, genres, staff clé…).
          </p>

          <div className="search" style={{ margin: "10px 0 0" }}>
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Tape un animé (ex: Naruto, Bleach, Demon Slayer)"
            />
            <span className="muted">Résultats : {animes.length}</span>
          </div>
        </div>

        <div className="heroRight">
          <div className="statsCard">
            <div>
              <div className="statBig">{favorites.length}</div>
              <div className="muted">Favoris</div>
            </div>
            <div>
              <div className="statBig">{query.trim() ? "" : "—"}</div>
              <div className="muted">Recherche</div>
            </div>
          </div>
          <div className="sparkle" />
        </div>
      </div>

      {loading && <Loading text="Chargement des animés..." />}
      {error && <p className="error">Service indisponible. Réessaie.</p>}

      {!loading && !error && (
        <>
          {animes.length === 0 ? (
            <p className="muted">Aucun résultat. Essaie un autre titre.</p>
          ) : (
            <div className="grid">
              {animes.map((a) => (
                <AnimeCard
                  key={a.id}
                  anime={a}
                  isFavorite={favIds.has(a.id)}
                  onAdd={() => addFav(a)}
                  onRemove={() => removeFav(a.id)}
                  onOpenDetails={(id) => setSelectedId(id)}
                />
              ))}
            </div>
          )}
        </>
      )}

      
      <AnimeModal animeId={selectedId} onClose={() => setSelectedId(null)} />
    </section>
  );
}
