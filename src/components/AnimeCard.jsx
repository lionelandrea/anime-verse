export default function AnimeCard({
  anime,
  onAdd,
  onRemove,
  isFavorite,
  onOpenDetails,
}) {
  return (
    <article className="card" onClick={() => onOpenDetails(anime.id)}>
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
          <button className="ghost" onClick={() => onOpenDetails(anime.id)}>
            Détails
          </button>
        </div>
      </div>
    </article>
  );
}