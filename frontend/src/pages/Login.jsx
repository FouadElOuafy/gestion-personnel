import { useState } from 'react'
import axios from 'axios'
import { useNavigate, Link } from 'react-router-dom'

function Login() {
  const [form, setForm]     = useState({ email: '', password: '' })
  const [erreur, setErreur] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate            = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setErreur('')
    setLoading(true)
    try {
      const res = await axios.post('http://localhost:3000/api/auth/login', form)
      localStorage.setItem('token', res.data.token)
      localStorage.setItem('role',  res.data.role)
      localStorage.setItem('nom',   res.data.nom)
      navigate('/dashboard')
    } catch (e) {
      setErreur(e.response?.data?.message || 'Erreur de connexion')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: 'radial-gradient(ellipse 80% 60% at 60% 40%, rgba(99,102,241,0.2) 0%, transparent 70%), #0f172a',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontFamily: "'Sora', 'Segoe UI', sans-serif",
      position: 'relative',
      overflow: 'hidden'
    }}>

      <link href="https://fonts.googleapis.com/css2?family=Sora:wght@300;400;600;700&display=swap" rel="stylesheet" />

      {/* Orbes décoratifs */}
      <div style={{ position: 'absolute', top: '10%', right: '10%', width: 300, height: 300, borderRadius: '50%', background: 'radial-gradient(circle, rgba(6,182,212,0.1), transparent 70%)', pointerEvents: 'none' }} />
      <div style={{ position: 'absolute', bottom: '10%', left: '8%', width: 250, height: 250, borderRadius: '50%', background: 'radial-gradient(circle, rgba(139,92,246,0.12), transparent 70%)', pointerEvents: 'none' }} />

      <div style={{ width: '100%', maxWidth: 420, padding: '0 1.5rem', position: 'relative', zIndex: 1 }}>

        {/* Logo / titre */}
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div style={{
            width: 52, height: 52, borderRadius: 14,
            background: 'linear-gradient(135deg, #6366f1, #06b6d4)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontWeight: 700, fontSize: 18, color: 'white',
            margin: '0 auto 1rem'
          }}>GP</div>
          <h1 style={{ fontSize: 26, fontWeight: 700, color: '#f1f5f9', margin: 0, letterSpacing: '-0.5px' }}>Connexion</h1>
          <p style={{ color: '#64748b', fontSize: 14, marginTop: '0.4rem' }}>Accédez à votre espace de gestion</p>
        </div>

        {/* Card */}
        <div style={{
          background: 'rgba(30,41,59,0.7)',
          backdropFilter: 'blur(16px)',
          border: '1px solid rgba(99,102,241,0.2)',
          borderRadius: 18,
          padding: '2rem',
          boxShadow: '0 25px 50px rgba(0,0,0,0.4)'
        }}>

          {erreur && (
            <div style={{
              background: 'rgba(239,68,68,0.12)',
              border: '1px solid rgba(239,68,68,0.3)',
              color: '#fca5a5',
              borderRadius: 10,
              padding: '0.75rem 1rem',
              marginBottom: '1.25rem',
              fontSize: 14
            }}>⚠️ {erreur}</div>
          )}

          <form onSubmit={handleSubmit}>

            {/* Email */}
            <div style={{ marginBottom: '1.25rem' }}>
              <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#94a3b8', marginBottom: '0.5rem' }}>
                Email
              </label>
              <input
                type="email"
                value={form.email}
                onChange={e => setForm({...form, email: e.target.value})}
                required
                placeholder="vous@exemple.com"
                style={{
                  width: '100%', padding: '0.75rem 1rem',
                  background: 'rgba(15,23,42,0.6)',
                  border: '1px solid rgba(99,102,241,0.25)',
                  borderRadius: 10, color: '#f1f5f9',
                  fontSize: 15, outline: 'none',
                  boxSizing: 'border-box',
                  transition: 'border-color 0.2s'
                }}
                onFocus={e => e.target.style.borderColor = '#6366f1'}
                onBlur={e => e.target.style.borderColor = 'rgba(99,102,241,0.25)'}
              />
            </div>

            {/* Mot de passe */}
            <div style={{ marginBottom: '1.75rem' }}>
              <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#94a3b8', marginBottom: '0.5rem' }}>
                Mot de passe
              </label>
              <input
                type="password"
                value={form.password}
                onChange={e => setForm({...form, password: e.target.value})}
                required
                placeholder="••••••••"
                style={{
                  width: '100%', padding: '0.75rem 1rem',
                  background: 'rgba(15,23,42,0.6)',
                  border: '1px solid rgba(99,102,241,0.25)',
                  borderRadius: 10, color: '#f1f5f9',
                  fontSize: 15, outline: 'none',
                  boxSizing: 'border-box',
                  transition: 'border-color 0.2s'
                }}
                onFocus={e => e.target.style.borderColor = '#6366f1'}
                onBlur={e => e.target.style.borderColor = 'rgba(99,102,241,0.25)'}
              />
            </div>

            {/* Bouton */}
            <button
              type="submit"
              disabled={loading}
              style={{
                width: '100%', padding: '0.85rem',
                background: loading ? 'rgba(99,102,241,0.5)' : 'linear-gradient(135deg, #6366f1, #4f46e5)',
                border: 'none', borderRadius: 10,
                color: 'white', fontWeight: 700,
                fontSize: 16, cursor: loading ? 'not-allowed' : 'pointer',
                boxShadow: loading ? 'none' : '0 0 20px rgba(99,102,241,0.4)',
                transition: 'all 0.2s'
              }}
            >
              {loading ? 'Connexion...' : 'Se connecter →'}
            </button>
          </form>
        </div>

        {/* Lien inscription */}
        <p style={{ textAlign: 'center', marginTop: '1.5rem', color: '#64748b', fontSize: 14 }}>
          Pas de compte ?{' '}
          <Link to="/register" style={{ color: '#a5b4fc', fontWeight: 600, textDecoration: 'none' }}>
            S'inscrire
          </Link>
        </p>

        {/* Lien retour landing */}
        <p style={{ textAlign: 'center', marginTop: '0.5rem' }}>
          <Link to="/" style={{ color: '#d0ceee', fontSize: 13, textDecoration: 'none' }}>
            ← Retour à l'accueil
          </Link>
        </p>
      </div>
    </div>
  )
}

export default Login