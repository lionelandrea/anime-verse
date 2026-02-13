import { useState } from "react";

export default function Signup() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const emailOk = email.includes("@") && email.includes(".");
  const passOk = password.length >= 6;
  const isValid = emailOk && passOk;

  const handleSubmit = (e) => {
    e.preventDefault();
    alert(`Compte créé (démo) : ${email}`);
    setEmail("");
    setPassword("");
  };

  return (
    <section className="formWrap">
      <h1 className="heroTitle">
          <span className="gradientTitle">Inscription</span>
      </h1>

      <div className="formCard">
        <form className="form" onSubmit={handleSubmit}>
          <div className="animeField">
            <span className="animeLabel">Email</span>
            <div className="animeInputRow">
              <div className="animeIcon"></div>
              <input
                className="animeInput"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="ex: you@mail.com"
              />
            </div>
            {!emailOk && email.length > 0 && (
              <div className="animeError">Email invalide.</div>
            )}
          </div>

          <div className="animeField">
            <span className="animeLabel">Mot de passe</span>
            <div className="animeInputRow">
              <div className="animeIcon"></div>
              <input
                className="animeInput"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="6 caractères minimum"
              />
            </div>
            {!passOk && password.length > 0 && (
              <div className="animeError">Mot de passe trop court (min 6).</div>
            )}
          </div>

          <button className="animeBtn" disabled={!isValid}>
             Créer mon compte
          </button>

          <p className="animeHelp" style={{ margin: 0 }}>
            Astuce : clique sur “Découvrir” pour explorer, puis ajoute tes favoris 
          </p>
        </form>
      </div>
    </section>
  );
}
