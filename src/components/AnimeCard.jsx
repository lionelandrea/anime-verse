export default function AnimeCard({
  anime,
  onAdd,
  onRemove,
  isFavorite,
  onOpenDetails,
}) {
  return (
    <article className="card neon" onClick={() => onOpenDetails(anime.id)}>
      <div className="card__imgWrap">
        <img className="card__img" src={anime.image} alt={anime.title} />
        <div className="card__corner">
          <span className="pill">⭐ {anime.score ?? "—"}</span>
        </div>
      </div>

      <div className="card__body">
        <h3 className="card__title">{anime.title}</h3>

        <div className="metaLine">
          <span className="miniTag"> {anime.releaseDate ?? "—"}</span>
          <span className="miniTag"> {anime.studio ?? "—"}</span>
        </div>

        <div className="metaLine">
          <span className="miniTag"> {anime.type ?? "—"}</span>
          <span className="miniTag"> {anime.episodes ?? "—"} ep</span>
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
            <button className="danger" onClick={onRemove}>Retirer</button>
          )}
          <button className="ghost" onClick={() => onOpenDetails(anime.id)}>
            Détails
          </button>
        </div>
      </div>
    </article>
  );
}
