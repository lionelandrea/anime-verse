import { NavLink } from "react-router-dom";
import { useEffect, useMemo, useState } from "react";
import Loading from "../components/Loading";
import AnimeCard from "../components/AnimeCard";
import AnimeModal from "../components/AnimeModal";

export default function Home() {
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

  useEffect(() => {
    const run = async () => {
      try {
        setLoading(true);
        setError(false);

        
        const res = await fetch("https://api.jikan.moe/v4/seasons/now?limit=12");
        const json = await res.json();

        const mapped = (json?.data ?? []).map((a) => ({
          id: a.mal_id,
          title: a.title,
          image: a.images?.jpg?.image_url,
          score: a.score,
          type: a.type,
          episodes: a.episodes,
          releaseDate: a.aired?.from ? new Date(a.aired.from).toLocaleDateString() : "—",
          studio: a.studios?.[0]?.name ?? "—",
          synopsis: a.synopsis,
          genres: (a.genres ?? []).map((g) => g.name),
          producers: (a.producers ?? []).map((p) => p.name),
        }));

        setAnimes(mapped);
      } catch (e) {
        console.error(e);
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    run();
  }, []);

  const favIds = useMemo(() => new Set(favorites.map((f) => f.id)), [favorites]);

  const addFav = (anime) => {
    if (favIds.has(anime.id)) return;
    setFavorites((prev) => [...prev, anime]);
  };

  const removeFav = (id) => {
    setFavorites((prev) => prev.filter((f) => f.id !== id));
  };

  return (
    <section>
      <div className="heroBox">
        <div className="heroLeft">
          <h1 className="heroTitle">
            Bienvenue dans <span className="gradientTitle">Anime-Verse</span>
          </h1>
          <p className="heroText">
            Découvre des animés, sauvegarde tes favoris, et explore les infos :
            dates de sortie, studio, genres, score, synopsis…
          </p>

          <div className="quickActions">
            <NavLink className="cta" to="/discover"> Découvrir</NavLink>
            <NavLink className="cta cta2" to="/favorites"> Favoris</NavLink>
            <NavLink className="cta cta3" to="/signup"> Inscription</NavLink>
          </div>
        </div>

        <div className="heroRight">
          <div className="statsCard">
            <div>
              <div className="statBig">{favorites.length}</div>
              <div className="muted">Favoris</div>
            </div>
            <div>
              <div className="statBig">{animes.length}</div>
              <div className="muted">Animés du moment</div>
            </div>
          </div>
          <div className="sparkle" />
        </div>
      </div>

      <h2 className="sectionTitle"> Animés de la saison (avec infos)</h2>

      {loading && <Loading text="Chargement des animés…" />}
      {error && <p className="error">Impossible de charger les animés.</p>}

      {!loading && !error && (
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

      <AnimeModal animeId={selectedId} onClose={() => setSelectedId(null)} />
    </section>
  );
}
