import { useState } from 'react'
import axios from 'axios'
import { useNavigate, Link } from 'react-router-dom'

const API = 'https://fouad1239-gestion-personnel-backend.hf.space'

export default function Login() {
  const [form, setForm] = useState({ email: '', password: '' })
  const [erreur, setErreur] = useState('')
  const [loading, setLoading] = useState(false)
  const [isRegister, setIsRegister] = useState(false)
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setErreur('')
    setLoading(true)
    try {
      const res = await axios.post(`${API}/api/auth/login`, form)
      localStorage.setItem('token', res.data.token)
      localStorage.setItem('role', res.data.role)
      localStorage.setItem('nom', res.data.nom)
      navigate('/dashboard')
    } catch (e) {
      setErreur(e.response?.data?.message || 'Erreur de connexion')
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
          position: relative;
        }

        /* PANEL GAUCHE — formulaire */
        .form-panel {
          background: #111117;
          padding: 3rem 2.5rem;
          display: flex;
          flex-direction: column;
          justify-content: center;
          position: relative;
          z-index: 2;
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
          margin-bottom: 2rem;
        }

        .field {
          margin-bottom: 1.1rem;
        }

        .field label {
          display: block;
          font-size: 0.75rem;
          font-weight: 600;
          color: #666;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          margin-bottom: 0.4rem;
        }

        .field input {
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

        .field input:focus {
          border-color: #e05a2b;
          box-shadow: 0 0 0 3px rgba(224,90,43,0.12);
        }

        .field input::placeholder { color: #444; }

        .err-box {
          background: rgba(224,90,43,0.1);
          border: 1px solid rgba(224,90,43,0.3);
          color: #f87171;
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

        .switch-link a {
          color: #e05a2b;
          font-weight: 600;
          text-decoration: none;
        }

        .back-link {
          margin-top: 0.6rem;
          font-size: 0.78rem;
          color: #444;
          text-align: center;
        }

        .back-link a { color: #555; text-decoration: none; }
        .back-link a:hover { color: #888; }

        /* PANEL DROIT — welcome */
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
          top: -60px; right: -60px;
          width: 250px; height: 250px;
          border-radius: 50%;
          background: rgba(224,90,43,0.15);
        }

        .welcome-panel::after {
          content: '';
          position: absolute;
          bottom: -40px; left: -40px;
          width: 180px; height: 180px;
          border-radius: 50%;
          background: rgba(255,255,255,0.04);
        }

        .welcome-panel .gp-badge {
          width: 56px; height: 56px;
          border-radius: 16px;
          background: rgba(255,255,255,0.1);
          backdrop-filter: blur(10px);
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

        /* RESPONSIVE MOBILE */
        @media (max-width: 768px) {
  .auth-container { grid-template-columns: 1fr; max-width: 420px; min-height: unset; }
  .welcome-panel { padding: 2rem 1.5rem 1.5rem; min-height: 160px; }
  .welcome-panel h1 { font-size: 1.4rem; }
  .welcome-panel p { display: none; }
  .form-panel { padding: 2rem 1.5rem; order: 2; }
  /* Ajout pour être sûr que les champs Nom/Prénom passent l'un sous l'autre */
  .row-2 { grid-template-columns: 1fr; gap: 0; } 
}

          .welcome-panel {
            padding: 2rem 1.5rem 1.5rem;
            min-height: 180px;
          }

          .welcome-panel h1 { font-size: 1.4rem; }
          .welcome-panel p { display: none; }

          .form-panel {
            padding: 2rem 1.5rem;
          }

          .form-panel h2 { font-size: 1.5rem; }
        }
      `}</style>

      <div className="auth-root">
        <div className="auth-container">

          {/* FORMULAIRE */}
          <div className="form-panel">
            <h2>Connexion</h2>
            <p className="subtitle">Content de vous revoir 👋</p>

            {erreur && <div className="err-box">⚠️ {erreur}</div>}

            <form onSubmit={handleSubmit}>
              <div className="field">
                <label>Email</label>
                <input
                  type="email"
                  placeholder="vous@exemple.com"
                  value={form.email}
                  onChange={e => setForm({ ...form, email: e.target.value })}
                  required
                />
              </div>
              <div className="field">
                <label>Mot de passe</label>
                <input
                  type="password"
                  placeholder="••••••••"
                  value={form.password}
                  onChange={e => setForm({ ...form, password: e.target.value })}
                  required
                />
              </div>
              <button className="btn-submit" type="submit" disabled={loading}>
                {loading ? 'Connexion...' : 'Se connecter →'}
              </button>
            </form>

            <p className="switch-link">
              Pas de compte ? <Link to="/register">S'inscrire</Link>
            </p>
            <p className="back-link">
              <Link to="/">← Retour à l'accueil</Link>
            </p>
          </div>

          {/* WELCOME */}
          <div className="welcome-panel">
            <div className="gp-badge">GP</div>
            <h1>BIENVENUE<br />DE RETOUR !</h1>
            <p>Nous sommes ravis de vous retrouver. Accédez à votre espace de gestion RH.</p>
          </div>

        </div>
      </div>
    </>
  )
}
// import { useState } from 'react'
// import axios from 'axios'
// import { useNavigate, Link } from 'react-router-dom'

// function Login() {
//   const [form, setForm]     = useState({ email: '', password: '' })
//   const [erreur, setErreur] = useState('')
//   const [loading, setLoading] = useState(false)
//   const navigate            = useNavigate()

//   const handleSubmit = async (e) => {
//     e.preventDefault()
//     setErreur('')
//     setLoading(true)
//     try {
//       const res = await axios.post('https://fouad1239-gestion-personnel-backend.hf.space/api/auth/login', form)
//       localStorage.setItem('token', res.data.token)
//       localStorage.setItem('role',  res.data.role)
//       localStorage.setItem('nom',   res.data.nom)
//       navigate('/dashboard')
//     } catch (e) {
//       setErreur(e.response?.data?.message || 'Erreur de connexion')
//     } finally {
//       setLoading(false)
//     }
//   }

//   return (
//     <div style={{
//       minHeight: '100vh',
//       background: 'radial-gradient(ellipse 80% 60% at 60% 40%, rgba(99,102,241,0.2) 0%, transparent 70%), #0f172a',
//       display: 'flex',
//       alignItems: 'center',
//       justifyContent: 'center',
//       fontFamily: "'Sora', 'Segoe UI', sans-serif",
//       position: 'relative',
//       overflow: 'hidden'
//     }}>

//       <link href="https://fonts.googleapis.com/css2?family=Sora:wght@300;400;600;700&display=swap" rel="stylesheet" />

//       {/* Orbes décoratifs */}
//       <div style={{ position: 'absolute', top: '10%', right: '10%', width: 300, height: 300, borderRadius: '50%', background: 'radial-gradient(circle, rgba(6,182,212,0.1), transparent 70%)', pointerEvents: 'none' }} />
//       <div style={{ position: 'absolute', bottom: '10%', left: '8%', width: 250, height: 250, borderRadius: '50%', background: 'radial-gradient(circle, rgba(139,92,246,0.12), transparent 70%)', pointerEvents: 'none' }} />

//       <div style={{ width: '100%', maxWidth: 420, padding: '0 1.5rem', position: 'relative', zIndex: 1 }}>

//         {/* Logo / titre */}
//         <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
//           <div style={{
//             width: 52, height: 52, borderRadius: 14,
//             background: 'linear-gradient(135deg, #6366f1, #06b6d4)',
//             display: 'flex', alignItems: 'center', justifyContent: 'center',
//             fontWeight: 700, fontSize: 18, color: 'white',
//             margin: '0 auto 1rem'
//           }}>GP</div>
//           <h1 style={{ fontSize: 26, fontWeight: 700, color: '#f1f5f9', margin: 0, letterSpacing: '-0.5px' }}>Connexion</h1>
//           <p style={{ color: '#64748b', fontSize: 14, marginTop: '0.4rem' }}>Accédez à votre espace de gestion</p>
//         </div>

//         {/* Card */}
//         <div style={{
//           background: 'rgba(30,41,59,0.7)',
//           backdropFilter: 'blur(16px)',
//           border: '1px solid rgba(99,102,241,0.2)',
//           borderRadius: 18,
//           padding: '2rem',
//           boxShadow: '0 25px 50px rgba(0,0,0,0.4)'
//         }}>

//           {erreur && (
//             <div style={{
//               background: 'rgba(239,68,68,0.12)',
//               border: '1px solid rgba(239,68,68,0.3)',
//               color: '#fca5a5',
//               borderRadius: 10,
//               padding: '0.75rem 1rem',
//               marginBottom: '1.25rem',
//               fontSize: 14
//             }}>⚠️ {erreur}</div>
//           )}

//           <form onSubmit={handleSubmit}>

//             {/* Email */}
//             <div style={{ marginBottom: '1.25rem' }}>
//               <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#94a3b8', marginBottom: '0.5rem' }}>
//                 Email
//               </label>
//               <input
//                 type="email"
//                 value={form.email}
//                 onChange={e => setForm({...form, email: e.target.value})}
//                 required
//                 placeholder="vous@exemple.com"
//                 style={{
//                   width: '100%', padding: '0.75rem 1rem',
//                   background: 'rgba(15,23,42,0.6)',
//                   border: '1px solid rgba(99,102,241,0.25)',
//                   borderRadius: 10, color: '#f1f5f9',
//                   fontSize: 15, outline: 'none',
//                   boxSizing: 'border-box',
//                   transition: 'border-color 0.2s'
//                 }}
//                 onFocus={e => e.target.style.borderColor = '#6366f1'}
//                 onBlur={e => e.target.style.borderColor = 'rgba(99,102,241,0.25)'}
//               />
//             </div>

//             {/* Mot de passe */}
//             <div style={{ marginBottom: '1.75rem' }}>
//               <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#94a3b8', marginBottom: '0.5rem' }}>
//                 Mot de passe
//               </label>
//               <input
//                 type="password"
//                 value={form.password}
//                 onChange={e => setForm({...form, password: e.target.value})}
//                 required
//                 placeholder="••••••••"
//                 style={{
//                   width: '100%', padding: '0.75rem 1rem',
//                   background: 'rgba(15,23,42,0.6)',
//                   border: '1px solid rgba(99,102,241,0.25)',
//                   borderRadius: 10, color: '#f1f5f9',
//                   fontSize: 15, outline: 'none',
//                   boxSizing: 'border-box',
//                   transition: 'border-color 0.2s'
//                 }}
//                 onFocus={e => e.target.style.borderColor = '#6366f1'}
//                 onBlur={e => e.target.style.borderColor = 'rgba(99,102,241,0.25)'}
//               />
//             </div>

//             {/* Bouton */}
//             <button
//               type="submit"
//               disabled={loading}
//               style={{
//                 width: '100%', padding: '0.85rem',
//                 background: loading ? 'rgba(99,102,241,0.5)' : 'linear-gradient(135deg, #6366f1, #4f46e5)',
//                 border: 'none', borderRadius: 10,
//                 color: 'white', fontWeight: 700,
//                 fontSize: 16, cursor: loading ? 'not-allowed' : 'pointer',
//                 boxShadow: loading ? 'none' : '0 0 20px rgba(99,102,241,0.4)',
//                 transition: 'all 0.2s'
//               }}
//             >
//               {loading ? 'Connexion...' : 'Se connecter →'}
//             </button>
//           </form>
//         </div>

//         {/* Lien inscription */}
//         <p style={{ textAlign: 'center', marginTop: '1.5rem', color: '#64748b', fontSize: 14 }}>
//           Pas de compte ?{' '}
//           <Link to="/register" style={{ color: '#a5b4fc', fontWeight: 600, textDecoration: 'none' }}>
//             S'inscrire
//           </Link>
//         </p>

//         {/* Lien retour landing */}
//         <p style={{ textAlign: 'center', marginTop: '0.5rem' }}>
//           <Link to="/" style={{ color: '#d0ceee', fontSize: 13, textDecoration: 'none' }}>
//             ← Retour à l'accueil
//           </Link>
//         </p>
//       </div>
//     </div>
//   )
// }

// export default Login
