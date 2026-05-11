import { useNavigate } from "react-router-dom";

export default function LandingPage() {
  const navigate = useNavigate();

  return (
    <div style={{ fontFamily: "'Sora', 'Segoe UI', sans-serif", minHeight: "100vh", background: "#0f172a", color: "#f1f5f9", overflowX: "hidden" }}>

      <link href="https://fonts.googleapis.com/css2?family=Sora:wght@300;400;600;700&display=swap" rel="stylesheet" />

      {/* NAVBAR */}
      <nav style={{
        position: "fixed", top: 0, left: 0, right: 0, zIndex: 100,
        display: "flex", alignItems: "center", justifyContent: "space-between",
        padding: "1rem 3rem",
        background: "rgba(15,23,42,0.85)",
        backdropFilter: "blur(12px)",
        borderBottom: "1px solid rgba(99,102,241,0.15)"
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: "0.6rem" }}>
          <div style={{
            width: 36, height: 36, borderRadius: 10,
            background: "linear-gradient(135deg, #6366f1, #06b6d4)",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontWeight: 700, fontSize: 16
          }}>GP</div>
          <span style={{ fontWeight: 700, fontSize: 18, letterSpacing: "-0.5px" }}>GestionPersonnel</span>
        </div>
        <div style={{ display: "flex", gap: "1.5rem", alignItems: "center" }}>
          <a href="#fonctionnalites" style={{ color: "#94a3b8", textDecoration: "none", fontSize: 14 }}>Fonctionnalités</a>
          <a href="#avantages" style={{ color: "#94a3b8", textDecoration: "none", fontSize: 14 }}>Avantages</a>
          <button
            onClick={() => navigate("/login")}
            style={{
              padding: "0.5rem 1.25rem", borderRadius: 8, border: "1px solid rgba(99,102,241,0.4)",
              background: "transparent", color: "#a5b4fc", cursor: "pointer", fontSize: 14, fontWeight: 600,
            }}
            onMouseOver={e => e.target.style.background = "rgba(99,102,241,0.15)"}
            onMouseOut={e => e.target.style.background = "transparent"}
          >Connexion</button>
        </div>
      </nav>

      {/* HERO */}
      <section style={{
        minHeight: "100vh", display: "flex", alignItems: "center",
        padding: "8rem 3rem 4rem",
        position: "relative",
        background: "radial-gradient(ellipse 80% 60% at 50% 20%, rgba(99,102,241,0.18) 0%, transparent 70%), #0f172a"
      }}>
        <div style={{ position: "absolute", top: "15%", right: "8%", width: 320, height: 320, borderRadius: "50%", background: "radial-gradient(circle, rgba(6,182,212,0.12), transparent 70%)", pointerEvents: "none" }} />
        <div style={{ position: "absolute", bottom: "20%", left: "5%", width: 200, height: 200, borderRadius: "50%", background: "radial-gradient(circle, rgba(139,92,246,0.14), transparent 70%)", pointerEvents: "none" }} />

        <div style={{ maxWidth: 720, position: "relative", zIndex: 1 }}>
          <div style={{
            display: "inline-flex", alignItems: "center", gap: "0.5rem",
            background: "rgba(99,102,241,0.12)", border: "1px solid rgba(99,102,241,0.3)",
            borderRadius: 20, padding: "0.35rem 0.9rem", marginBottom: "1.5rem",
            fontSize: 13, color: "#a5b4fc", fontWeight: 500
          }}>
            <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#6366f1", display: "inline-block" }} />
            Système de gestion RH moderne
          </div>

          <h1 style={{
            fontSize: "clamp(2.5rem, 5vw, 4rem)", fontWeight: 700, lineHeight: 1.15,
            margin: "0 0 1.5rem", letterSpacing: "-1px",
            background: "linear-gradient(135deg, #f1f5f9 30%, #a5b4fc 100%)",
            WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text"
          }}>
            Gérez vos équipes avec précision et simplicité
          </h1>

          <p style={{ fontSize: 18, color: "#94a3b8", lineHeight: 1.75, marginBottom: "2.5rem", maxWidth: 580 }}>
            Une plateforme centralisée pour la gestion des employés, des congés, des présences et des performances. Tout ce dont vous avez besoin, en un seul endroit.
          </p>

          <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}>
            <button
              onClick={() => navigate("/register")}
              style={{
                padding: "0.85rem 2rem", borderRadius: 10,
                background: "linear-gradient(135deg, #6366f1, #4f46e5)",
                border: "none", color: "white", fontWeight: 700, fontSize: 16, cursor: "pointer",
                boxShadow: "0 0 24px rgba(99,102,241,0.4)"
              }}
            >Commencer gratuitement →</button>
            <button
              onClick={() => navigate("/login")}
              style={{
                padding: "0.85rem 2rem", borderRadius: 10, background: "transparent",
                border: "1px solid rgba(148,163,184,0.3)", color: "#94a3b8", fontWeight: 600, fontSize: 16, cursor: "pointer"
              }}
            >Se connecter</button>
          </div>

          <div style={{ display: "flex", gap: "2.5rem", marginTop: "3.5rem", flexWrap: "wrap" }}>
            {[{ val: "500+", label: "Entreprises" }, { val: "10k+", label: "Employés gérés" }, { val: "99.9%", label: "Disponibilité" }].map(s => (
              <div key={s.label}>
                <div style={{ fontSize: 26, fontWeight: 700, color: "#f1f5f9" }}>{s.val}</div>
                <div style={{ fontSize: 13, color: "#64748b" }}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section id="fonctionnalites" style={{ padding: "5rem 3rem", background: "#0f172a" }}>
        <div style={{ textAlign: "center", marginBottom: "3rem" }}>
          <h2 style={{ fontSize: 32, fontWeight: 700, marginBottom: "0.75rem", color: "#f1f5f9" }}>Tout ce qu'il vous faut</h2>
          <p style={{ color: "#64748b", fontSize: 16 }}>Des outils puissants pour une gestion RH efficace</p>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: "1.25rem", maxWidth: 1100, margin: "0 auto" }}>
          {[
            { icon: "👥", title: "Gestion des employés", desc: "Fiches complètes, historique, documents et informations contractuelles de chaque employé.", color: "#6366f1" },
            { icon: "📅", title: "Congés & absences", desc: "Planification et validation des demandes de congés avec un calendrier d'équipe en temps réel.", color: "#06b6d4" },
            { icon: "⏰", title: "Présences & pointage", desc: "Suivi automatique des heures de travail, retards et heures supplémentaires.", color: "#10b981" },
            { icon: "📊", title: "Rapports & analyses", desc: "Tableaux de bord et rapports détaillés sur les performances et les ressources humaines.", color: "#f59e0b" },
            { icon: "💼", title: "Paie & avantages", desc: "Gestion des salaires, primes, avantages sociaux et fiches de paie mensuelles.", color: "#8b5cf6" },
            { icon: "🔒", title: "Sécurité & rôles", desc: "Contrôle d'accès granulaire avec gestion des rôles administrateur, RH et employé.", color: "#ef4444" },
          ].map(f => (
            <div key={f.title}
              style={{ background: "rgba(30,41,59,0.6)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 14, padding: "1.75rem", transition: "border-color 0.2s, transform 0.2s" }}
              onMouseOver={e => { e.currentTarget.style.borderColor = f.color + "55"; e.currentTarget.style.transform = "translateY(-3px)"; }}
              onMouseOut={e => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.06)"; e.currentTarget.style.transform = "none"; }}
            >
              <div style={{ fontSize: 30, marginBottom: "0.9rem" }}>{f.icon}</div>
              <h3 style={{ fontSize: 17, fontWeight: 700, color: "#f1f5f9", marginBottom: "0.5rem" }}>{f.title}</h3>
              <p style={{ fontSize: 14, color: "#64748b", lineHeight: 1.6, margin: 0 }}>{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section id="avantages" style={{
        padding: "5rem 3rem",
        background: "radial-gradient(ellipse 80% 60% at 50% 50%, rgba(99,102,241,0.12) 0%, transparent 70%), #0f172a",
        textAlign: "center"
      }}>
        <h2 style={{ fontSize: 36, fontWeight: 700, marginBottom: "1rem", color: "#f1f5f9" }}>Prêt à optimiser votre gestion RH ?</h2>
        <p style={{ color: "#64748b", fontSize: 17, marginBottom: "2rem" }}>Rejoignez des centaines d'entreprises qui font confiance à notre plateforme.</p>
        <button
          onClick={() => navigate("/login")}
          style={{
            padding: "1rem 2.5rem", borderRadius: 12,
            background: "linear-gradient(135deg, #6366f1, #4f46e5)",
            border: "none", color: "white", fontWeight: 700, fontSize: 17, cursor: "pointer",
            boxShadow: "0 0 30px rgba(99,102,241,0.35)"
          }}
        >Accéder à l'application →</button>
      </section>

      {/* FOOTER */}
      <footer style={{
        padding: "2rem 3rem",
        borderTop: "1px solid rgba(255,255,255,0.06)",
        display: "flex", justifyContent: "space-between", alignItems: "center",
        fontSize: 13, color: "#475569", flexWrap: "wrap", gap: "1rem"
      }}>
        <span>© 2025 GestionPersonnel. Tous droits réservés.</span>
        <span>Construit avec ❤️ pour simplifier les RH</span>
      </footer>
    </div>
  );
}
