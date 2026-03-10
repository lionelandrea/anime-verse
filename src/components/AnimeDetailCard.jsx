import { useEffect, useState } from "react";
import Loading from "./Loading";

export default function AnimeDetailCard({ animeId, onClose }) {
  const [details, setDetails] = useState(null);
  const [staff, setStaff] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (!animeId) return;

    const run = async () => {
      try {
        setLoading(true);
        setError(false);

        const [dRes, sRes] = await Promise.all([
          fetch(`https://api.jikan.moe/v4/anime/${animeId}/full`),
          fetch(`https://api.jikan.moe/v4/anime/${animeId}/staff`),
        ]);

        const dJson = await dRes.json();
        const sJson = await sRes.json();

        setDetails(dJson?.data ?? null);

        const staffShort = (sJson?.data ?? [])
          .slice(0, 8)
          .map((p) => ({
            name: p.person?.name,
            roles: (p.positions ?? []).slice(0, 2).join(", "),
          }));

        setStaff(staffShort);
      } catch (e) {
        console.error(e);
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    run();
  }, [animeId]);

  if (!animeId) return null;

  return (
    <section className="detailCardSection">
      <div className="detailCard">
        <div className="detailCard__top">
          <h2 className="gradientTitle">Détails de l’animé</h2>
          <button className="ghost" onClick={onClose}>
            Fermer
          </button>
        </div>

        {loading && <Loading text="Chargement des détails..." />}
        {error && <p className="error">Impossible de charger les détails.</p>}

        {!loading && !error && details && (
          <div className="detailCard__grid">
            <div className="detailCard__imageWrap">
              <img
                className="detailCard__image"
                src={details.images?.jpg?.large_image_url}
                alt={details.title}
              />
            </div>

            <div className="detailCard__content">
              <h3 className="detailCard__title">{details.title}</h3>

              <div className="badges">
                {details.type && <span className="badge">{details.type}</span>}
                {details.status && (
                  <span className="badge badge2">{details.status}</span>
                )}
                {details.rating && (
                  <span className="badge badge3">{details.rating}</span>
                )}
              </div>

              <div className="infoGrid">
                <Info label="Date de sortie" value={formatAired(details.aired)} />
                <Info label="Studio" value={joinNames(details.studios)} />
                <Info label="Producteurs" value={joinNames(details.producers)} />
                <Info label="Épisodes" value={details.episodes ?? "—"} />
                <Info label="Durée" value={details.duration ?? "—"} />
                <Info label="Score" value={details.score ?? "—"} />
                <Info label="Genres" value={joinNames(details.genres)} />
                <Info label="Source" value={details.source ?? "—"} />
              </div>

              {details.synopsis && (
                <p className="synopsis">{details.synopsis}</p>
              )}

              {staff.length > 0 && (
                <>
                  <h4 className="sectionTitle">Staff clé</h4>
                  <ul className="staffList">
                    {staff.map((s, i) => (
                      <li key={i}>
                        <b>{s.name}</b>
                        {s.roles ? ` — ${s.roles}` : ""}
                      </li>
                    ))}
                  </ul>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

function Info({ label, value }) {
  return (
    <div className="infoItem">
      <span className="infoLabel">{label}</span>
      <span className="infoValue">{value}</span>
    </div>
  );
}

function joinNames(arr) {
  if (!arr || arr.length === 0) return "—";
  return arr.map((x) => x.name).slice(0, 3).join(", ") + (arr.length > 3 ? "…" : "");
}

function formatAired(aired) {
  const from = aired?.from ? new Date(aired.from) : null;
  if (!from) return "—";
  return from.toLocaleDateString();
}