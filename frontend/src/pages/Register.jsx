import { useState } from 'react'
import axios from 'axios'
import { useNavigate, Link } from 'react-router-dom'

const API = 'https://fouad1239-gestion-personnel-backend.hf.space'

export default function Register() {
  const [form, setForm] = useState({
    nom: '', prenom: '', email: '', password: '', role: 'employe'
  })
  const [erreur, setErreur] = useState('')
  const [succes, setSucces] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }))

  const handleSubmit = async (e) => {
    e.preventDefault()
    setErreur('')
    setLoading(true)
    try {
      await axios.post(`${API}/api/auth/register`, form)
      setSucces('Compte créé ! Redirection...')
      setTimeout(() => navigate('/login'), 1500)
    } catch (e) {
      setErreur(e.response?.data?.message || 'Erreur inscription')
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;600;700;800&display=swap');
        * { margin: 0; padding: 0; box-sizing: border-box; }
        .auth-root {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          background: #0d0d0d;
          font-family: 'Outfit', sans-serif;
          padding: 1rem;
        }
        .auth-container {
          width: 100%;
          max-width: 900px;
          min-height: 540px;
          display: grid;
          grid-template-columns: 1fr 1fr;
          border-radius: 24px;
          overflow: hidden;
          box-shadow: 0 40px 80px rgba(0,0,0,0.6);
        }
        .welcome-panel {
          background: linear-gradient(145deg, #1a0a05 0%, #2d1000 40%, #e05a2b 120%);
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 3rem 2rem;
          text-align: center;
          position: relative;
          overflow: hidden;
        }
        .welcome-panel::before {
          content: '';
          position: absolute;
          top: -60px; left: -60px;
          width: 250px; height: 250px;
          border-radius: 50%;
          background: rgba(224,90,43,0.15);
        }
        .welcome-panel::after {
          content: '';
          position: absolute;
          bottom: -40px; right: -40px;
          width: 180px; height: 180px;
          border-radius: 50%;
          background: rgba(255,255,255,0.04);
        }
        .gp-badge {
          width: 56px; height: 56px;
          border-radius: 16px;
          background: rgba(255,255,255,0.1);
          border: 1px solid rgba(255,255,255,0.15);
          display: flex; align-items: center; justify-content: center;
          font-size: 1.3rem; font-weight: 800; color: white;
          margin: 0 auto 1.5rem;
          position: relative; z-index: 1;
        }
        .welcome-panel h1 {
          font-size: 2rem;
          font-weight: 800;
          color: white;
          letter-spacing: -1px;
          line-height: 1.2;
          margin-bottom: 1rem;
          position: relative; z-index: 1;
        }
        .welcome-panel p {
          font-size: 0.88rem;
          color: rgba(255,255,255,0.6);
          line-height: 1.65;
          max-width: 240px;
          position: relative; z-index: 1;
        }
        .form-panel {
          background: #111117;
          padding: 3rem 2.5rem;
          display: flex;
          flex-direction: column;
          justify-content: center;
        }
        .form-panel h2 {
          font-size: 2rem;
          font-weight: 800;
          color: #f0f0f0;
          margin-bottom: 0.4rem;
          letter-spacing: -1px;
        }
        .form-panel .subtitle {
          font-size: 0.85rem;
          color: #555;
          margin-bottom: 1.5rem;
        }
        .row-2 { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
        .field { margin-bottom: 1rem; }
        .field label {
          display: block;
          font-size: 0.75rem;
          font-weight: 600;
          color: #666;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          margin-bottom: 0.4rem;
        }
        .field input, .field select {
          width: 100%;
          padding: 0.75rem 1rem;
          background: #1a1a24;
          border: 1px solid #2a2a3a;
          border-radius: 10px;
          color: #f0f0f0;
          font-size: 0.95rem;
          font-family: 'Outfit', sans-serif;
          outline: none;
          transition: border-color 0.2s, box-shadow 0.2s;
        }
        .field input:focus, .field select:focus {
          border-color: #e05a2b;
          box-shadow: 0 0 0 3px rgba(224,90,43,0.12);
        }
        .field input::placeholder { color: #444; }
        .field select option { background: #1a1a24; }
        .err-box {
          background: rgba(224,90,43,0.1);
          border: 1px solid rgba(224,90,43,0.3);
          color: #f87171;
          border-radius: 8px;
          padding: 0.6rem 0.9rem;
          font-size: 0.82rem;
          margin-bottom: 1rem;
        }
        .ok-box {
          background: rgba(29,158,117,0.1);
          border: 1px solid rgba(29,158,117,0.3);
          color: #6ee7b7;
          border-radius: 8px;
          padding: 0.6rem 0.9rem;
          font-size: 0.82rem;
          margin-bottom: 1rem;
        }
        .btn-submit {
          width: 100%;
          padding: 0.85rem;
          background: linear-gradient(135deg, #e05a2b, #c0392b);
          border: none;
          border-radius: 10px;
          color: white;
          font-size: 1rem;
          font-weight: 700;
          font-family: 'Outfit', sans-serif;
          cursor: pointer;
          transition: opacity 0.2s, transform 0.1s;
          margin-top: 0.5rem;
        }
        .btn-submit:hover { opacity: 0.9; transform: translateY(-1px); }
        .btn-submit:disabled { opacity: 0.5; cursor: not-allowed; transform: none; }
        .switch-link {
          margin-top: 1.25rem;
          font-size: 0.82rem;
          color: #555;
          text-align: center;
        }
        .switch-link a { color: #e05a2b; font-weight: 600; text-decoration: none; }
        .back-link {
          margin-top: 0.6rem;
          font-size: 0.78rem;
          color: #444;
          text-align: center;
        }
        .back-link a { color: #555; text-decoration: none; }
        .back-link a:hover { color: #888; }
        @media (max-width: 640px) {
          .auth-container { grid-template-columns: 1fr; max-width: 420px; min-height: unset; }
          .welcome-panel { padding: 2rem 1.5rem 1.5rem; min-height: 160px; }
          .welcome-panel h1 { font-size: 1.4rem; }
          .welcome-panel p { display: none; }
          .form-panel { padding: 2rem 1.5rem; order: 2; }
          .row-2 { grid-template-columns: 1fr; }
        }
      `}</style>

      <div className="auth-root">
        <div className="auth-container">

          {/* WELCOME — gauche */}
          <div className="welcome-panel">
            <div className="gp-badge">GP</div>
            <h1>REJOIGNEZ-<br />NOUS !</h1>
            <p>Créez votre compte et accédez à votre espace de gestion RH en quelques secondes.</p>
          </div>

          {/* FORMULAIRE — droite */}
          <div className="form-panel">
            <h2>Créer un compte</h2>
            <p className="subtitle">Bienvenue parmi nous 🎉</p>

            {erreur && <div className="err-box">⚠️ {erreur}</div>}
            {succes && <div className="ok-box">✅ {succes}</div>}

            <form onSubmit={handleSubmit}>
              <div className="row-2">
                <div className="field">
                  <label>Nom *</label>
                  <input value={form.nom} onChange={e => set('nom', e.target.value)}
                    placeholder="Ex: El Ouafy" required />
                </div>
                <div className="field">
                  <label>Prénom</label>
                  <input value={form.prenom} onChange={e => set('prenom', e.target.value)}
                    placeholder="Ex: Fouad" />
                </div>
              </div>

              <div className="field">
                <label>Email *</label>
                <input type="email" value={form.email}
                  onChange={e => set('email', e.target.value)}
                  placeholder="vous@exemple.com" required />
              </div>

              <div className="field">
                <label>Mot de passe *</label>
                <input type="password" value={form.password}
                  onChange={e => set('password', e.target.value)}
                  placeholder="••••••••" required />
              </div>

              <div className="field">
                <label>Rôle</label>
                <select value={form.role} onChange={e => set('role', e.target.value)}>
                  <option value="employe">👤 Employé</option>
                  <option value="manager">Manager</option>
                  <option value="admin">Admin</option>
                </select>
              </div>

              <button className="btn-submit" type="submit" disabled={loading}>
                {loading ? 'Création...' : "S'inscrire →"}
              </button>
            </form>

            <p className="switch-link">
              Déjà un compte ? <Link to="/login">Se connecter</Link>
            </p>
            <p className="back-link">
              <Link to="/">← Retour à l'accueil</Link>
            </p>
          </div>

        </div>
      </div>
    </>
  )
}
// import { useState } from 'react'
// import axios from 'axios'
// import { useNavigate, Link } from 'react-router-dom'

// function Register() {
//   const [form, setForm]     = useState({
//     nom: '', prenom: '', email: '', password: '', role: 'employe'
//   })
//   const [erreur, setErreur] = useState('')
//   const [succes, setSucces] = useState('')
//   const navigate            = useNavigate()

//   const set = (k, v) => setForm(f => ({ ...f, [k]: v }))

//   const handleSubmit = async (e) => {
//     e.preventDefault()
//     setErreur('')
//     try {
//       await axios.post('https://fouad1239-gestion-personnel-backend.hf.space/api/auth/register', form)
//       setSucces('Compte créé ! Redirection...')
//       setTimeout(() => navigate('/login'), 1500)
//     } catch (e) {
//       setErreur(e.response?.data?.message || 'Erreur inscription')
//     }
//   }

//   return (
//     <div style={styles.page}>
//       <div style={styles.card}>
//         <h4 style={styles.title}>Créer un compte</h4>

//         {erreur && <div className="alert alert-danger py-2">{erreur}</div>}
//         {succes && <div className="alert alert-success py-2">{succes}</div>}

//         <form onSubmit={handleSubmit}>

//           <div className="row g-3 mb-3">
//             <div className="col-6">
//               <label className="form-label">Nom *</label>
//               <input className="form-control" value={form.nom}
//                 onChange={e => set('nom', e.target.value)}
//                 placeholder="Ex: Dupont" required />
//             </div>
//             <div className="col-6">
//               <label className="form-label">Prénom</label>
//               <input className="form-control" value={form.prenom}
//                 onChange={e => set('prenom', e.target.value)}
//                 placeholder="Ex: Jean" />
//             </div>
//           </div>

//           <div className="mb-3">
//             <label className="form-label">Email *</label>
//             <input type="email" className="form-control" value={form.email}
//               onChange={e => set('email', e.target.value)}
//               placeholder="exemple@email.com" required />
//           </div>

//           <div className="mb-3">
//             <label className="form-label">Mot de passe *</label>
//             <input type="password" className="form-control" value={form.password}
//               onChange={e => set('password', e.target.value)}
//               placeholder="••••••••" required />
//           </div>

//           <div className="mb-4">
//             <label className="form-label">Rôle</label>
//             <select className="form-select" value={form.role}
//               onChange={e => set('role', e.target.value)}>
//               <option value="employe">👤 Employé</option>
              
//             </select>
//           </div>

//           <button type="submit" className="btn btn-success w-100">
//             S'inscrire
//           </button>
//         </form>

//         <p className="mt-3 text-center" style={{ fontSize: 14 }}>
//           Déjà un compte ? <Link to="/login">Se connecter</Link>
//         </p>
//       </div>
//     </div>
//   )
// }

// const styles = {
//   page: {
//     minHeight: '100vh', display: 'flex',
//     alignItems: 'center', justifyContent: 'center',
//     background: '#f5f5f5'
//   },
//   card: {
//     background: '#fff', padding: '2rem',
//     borderRadius: 16, border: '1px solid #e8e8e8',
//     width: '100%', maxWidth: 440,
//     boxShadow: '0 4px 24px rgba(0,0,0,0.06)'
//   },
//   title: {
//     fontWeight: 700, marginBottom: '1.5rem',
//     textAlign: 'center', fontSize: 22
//   }
// }

// export default Register
