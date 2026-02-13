import { NavLink } from "react-router-dom";
import { useEffect, useMemo, useState } from "react";
import Loading from "../components/Loading";
import AnimeCard from "../components/AnimeCard";
import AnimeModal from "../components/AnimeModal";

export default function Home() {
  
  const [seasonAnimes, setSeasonAnimes] = useState([]);

  
  const [homeQuery, setHomeQuery] = useState("");
  const [searchAnimes, setSearchAnimes] = useState([]);
  const [searchLoading, setSearchLoading] = useState(false);
  const [searchError, setSearchError] = useState(false);

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

  const mapAnime = (a) => ({
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
  });

  
  useEffect(() => {
    const run = async () => {
      try {
        setLoading(true);
        setError(false);

        const res = await fetch("https://api.jikan.moe/v4/seasons/now?limit=12");
        const json = await res.json();

        setSeasonAnimes((json?.data ?? []).map(mapAnime));
      } catch (e) {
        console.error(e);
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    run();
  }, []);

  
  useEffect(() => {
    const q = homeQuery.trim();

    
    if (!q) {
      setSearchAnimes([]);
      setSearchLoading(false);
      setSearchError(false);
      return;
    }

    const timer = setTimeout(() => {
      const run = async () => {
        try {
          setSearchLoading(true);
          setSearchError(false);

          const res = await fetch(
            `https://api.jikan.moe/v4/anime?q=${encodeURIComponent(q)}&limit=12`
          );
          const json = await res.json();

          setSearchAnimes((json?.data ?? []).map(mapAnime));
        } catch (e) {
          console.error(e);
          setSearchError(true);
        } finally {
          setSearchLoading(false);
        }
      };

      run();
    }, 450);

    return () => clearTimeout(timer);
  }, [homeQuery]);

  return (
    <section>
      <div className="heroBox">
        <div className="heroLeft">
          <h1 className="heroTitle">
            Bienvenue dans <span className="gradientTitle">Anime-Verse</span>
          </h1>
          <p className="heroText">
            Recherche des animés directement ici, ouvre les détails, et ajoute-les en favoris.
          </p>

          <div className="quickActions">
            <NavLink className="cta" to="/discover"> Découvrir</NavLink>
            <NavLink className="cta cta2" to="/favorites"> Favoris</NavLink>
            <NavLink className="cta cta3" to="/signup"> Inscription</NavLink>
          </div>

          
          <div className="search" style={{ marginTop: 14 }}>
            <input
              value={homeQuery}
              onChange={(e) => setHomeQuery(e.target.value)}
              placeholder="Rechercher un animé sur l’accueil (ex: Naruto, Bleach)"
            />
            <span className="muted">
              {homeQuery.trim()
                ? `Résultats : ${searchAnimes.length}`
                : `Saison : ${seasonAnimes.length}`}
            </span>
          </div>
        </div>

        <div className="heroRight">
          <div className="statsCard">
            <div>
              <div className="statBig">{favorites.length}</div>
              <div className="muted">Favoris</div>
            </div>
            <div>
              <div className="statBig">{seasonAnimes.length}</div>
              <div className="muted">Animés saison</div>
            </div>
          </div>
          <div className="sparkle" />
        </div>
      </div>

      
      {homeQuery.trim() ? (
        <>
          <h2 className="sectionTitle">🔍 Résultats de recherche</h2>

          {searchLoading && <Loading text="Recherche en cours..." />}
          {searchError && <p className="error">Impossible de rechercher. Réessaie.</p>}

          {!searchLoading && !searchError && (
            <>
              {searchAnimes.length === 0 ? (
                <p className="muted">Aucun résultat. Essaie un autre titre.</p>
              ) : (
                <div className="grid">
                  {searchAnimes.map((a) => (
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
        </>
      ) : (
        <>
          <h2 className="sectionTitle">🔥 Animés de la saison (avec infos)</h2>

          {loading && <Loading text="Chargement des animés…" />}
          {error && <p className="error">Impossible de charger les animés.</p>}

          {!loading && !error && (
            <div className="grid">
              {seasonAnimes.map((a) => (
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
