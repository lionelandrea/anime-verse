import { useNavigate } from "react-router-dom";

export default function AnimeCard({
  anime,
  onAdd,
  onRemove,
  isFavorite,
}) {
  const navigate = useNavigate();

  const animeId = anime.id ?? anime.mal_id;

  const makeSlug = (text) => {
    if (!text) return "anime";

    return text
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");
  };

  const openDetails = () => {
    if (!animeId) return;
    navigate(`/anime/${animeId}/${makeSlug(anime.title)}`);
  };

  return (
    <article className="card" onClick={openDetails}>
      <div className="card__imgWrap">
        <img className="card__img" src={anime.image} alt={anime.title} />
        <span className="pill">⭐ {anime.score ?? "—"}</span>
      </div>

      <div className="card__body">
        <h3 className="card__title">{anime.title}</h3>

        <div className="meta">
          <span>{anime.releaseDate ?? "—"}</span>
          <span>•</span>
          <span>{anime.studio ?? "—"}</span>
        </div>

        <div className="meta">
          <span>{anime.type ?? "—"}</span>
          <span>•</span>
          <span>{anime.episodes ?? "—"} ep</span>
        </div>

        <p className="card__desc">
          {anime.synopsis
            ? anime.synopsis.length > 110
              ? anime.synopsis.slice(0, 110) + "…"
              : anime.synopsis
            : "Synopsis indisponible."}
        </p>

        <div className="card__actions" onClick={(e) => e.stopPropagation()}>
          {!isFavorite ? (
            <button onClick={onAdd}>+ Favori</button>
          ) : (
            <button className="danger" onClick={onRemove}>
              Retirer
            </button>
          )}

          <button className="ghost" onClick={openDetails}>
            Détails
          </button>
        </div>
      </div>
    </article>
  );
}