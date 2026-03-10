import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Loading from "../components/Loading";

export default function AnimeDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [details, setDetails] = useState(null);
  const [staff, setStaff] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        setLoading(true);
        setError("");

        const [res1, res2] = await Promise.all([
          fetch(`https://api.jikan.moe/v4/anime/${id}/full`),
          fetch(`https://api.jikan.moe/v4/anime/${id}/staff`),
        ]);

        const data1 = await res1.json();
        const data2 = await res2.json();

        setDetails(data1?.data || null);

        const shortStaff = (data2?.data || []).slice(0, 8).map((item) => ({
          name: item.person?.name,
          role: item.positions?.join(", "),
        }));

        setStaff(shortStaff);
      } catch (err) {
        console.error(err);
        setError("Impossible de charger les détails.");
      } finally {
        setLoading(false);
      }
    };

    fetchDetails();
  }, [id]);

  if (loading) {
    return (
      <main className="detailsPage">
        <Loading text="Chargement des détails..." />
      </main>
    );
  }

  if (error || !details) {
    return (
      <main className="detailsPage">
        <div className="detailsModal">
          <p className="error">{error || "Aucun détail trouvé."}</p>
          <button className="btn" onClick={() => navigate("/")}>
            Retour
          </button>
        </div>
      </main>
    );
  }

  return (
    <main className="detailsPage">
      <div className="detailsOverlay" onClick={() => navigate("/")}></div>

      <section className="detailsModal">
        <button className="closeBtn" onClick={() => navigate("/")}>
          ✕
        </button>

        <div className="detailsContent">
          <div className="detailsPosterBox">
            <img
              src={details.images?.jpg?.large_image_url}
              alt={details.title}
              className="detailsPoster"
            />
          </div>

          <div className="detailsInfo">
            <h2 className="detailsTitle">{details.title}</h2>

            <div className="badges">
              {details.type && <span className="badge">{details.type}</span>}
              {details.status && <span className="badge">{details.status}</span>}
              {details.rating && <span className="badge">{details.rating}</span>}
            </div>

            <div className="infoGrid">
              <Info label="Épisodes" value={details.episodes ?? "—"} />
              <Info label="Score" value={details.score ?? "—"} />
              <Info label="Durée" value={details.duration ?? "—"} />
              <Info label="Source" value={details.source ?? "—"} />
              <Info label="Studio" value={joinNames(details.studios)} />
              <Info label="Genres" value={joinNames(details.genres)} />
            </div>

            <p className="synopsis">
              {details.synopsis || "Pas de synopsis disponible."}
            </p>

            {staff.length > 0 && (
              <>
                <h3 className="staffTitle">Staff principal</h3>
                <ul className="staffList">
                  {staff.map((member, index) => (
                    <li key={index}>
                      <strong>{member.name}</strong>
                      {member.role ? ` — ${member.role}` : ""}
                    </li>
                  ))}
                </ul>
              </>
            )}
          </div>
        </div>
      </section>
    </main>
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
  return arr.map((item) => item.name).slice(0, 3).join(", ");
}