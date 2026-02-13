import { useEffect, useState } from "react";
import Loading from "./Loading";

export default function AnimeModal({ animeId, onClose }) {
  const [details, setDetails] = useState(null);
  const [staff, setStaff] = useState([]);
  const [loading, setLoading] = useState(true);
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

        // staff = liste de personnes avec leurs positions (Director, etc.)
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
    <div className="modalOverlay" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <button className="iconBtn" onClick={onClose} aria-label="Fermer">
          ✕
        </button>

        {loading && <Loading text="Chargement des détails..." />}
        {error && <p className="error">Impossible de charger les détails.</p>}

        {!loading && !error && details && (
          <div className="modalGrid">
            <img
              className="modalImg"
              src={details.images?.jpg?.large_image_url}
              alt={details.title}
            />

            <div className="modalContent">
              <h2 className="gradientTitle">{details.title}</h2>

              <div className="badges">
                {details.type && <span className="badge">{details.type}</span>}
                {details.status && <span className="badge badge2">{details.status}</span>}
                {details.rating && <span className="badge badge3">{details.rating}</span>}
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
                <p className="synopsis">
                  {details.synopsis.length > 380
                    ? details.synopsis.slice(0, 380) + "…"
                    : details.synopsis}
                </p>
              )}

              {staff.length > 0 && (
                <>
                  <h3 className="sectionTitle">Staff clé (≈ “auteur”)</h3>
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
    </div>
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
