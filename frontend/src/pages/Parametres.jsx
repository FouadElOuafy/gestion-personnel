import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Layout from '../components/Layout'

export default function Parametres() {
  const [theme, setTheme]         = useState('clair')
  const [langue, setLangue]       = useState('fr')
  const [notifs, setNotifs]       = useState(true)
  const [succes, setSucces]       = useState('')
  const navigate = useNavigate()

  const sauvegarder = () => {
    setSucces('Paramètres sauvegardés !')
    setTimeout(() => setSucces(''), 3000)
  }

  const supprimerCompte = () => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer votre compte ?')) {
      localStorage.clear()
      navigate('/login')
    }
  }

  return (
    <Layout>
      <h4 className="fw-bold mb-4">⚙️ Paramètres</h4>

      {succes && <div className="alert alert-success py-2 mb-3">{succes}</div>}

      <div className="row g-4">

        {/* Préférences */}
        <div className="col-md-6">
          <div className="card border-0 shadow-sm" style={{ borderRadius: 14, padding: '1.5rem' }}>
            <h6 className="fw-bold mb-3">🎨 Préférences d'affichage</h6>

            <div className="mb-3">
              <label className="form-label">Thème</label>
              <select className="form-select" value={theme}
                onChange={e => setTheme(e.target.value)}>
                <option value="clair">☀️ Clair</option>
                <option value="sombre">🌙 Sombre</option>
              </select>
            </div>

            <div className="mb-3">
              <label className="form-label">Langue</label>
              <select className="form-select" value={langue}
                onChange={e => setLangue(e.target.value)}>
                <option value="fr">🇫🇷 Français</option>
                <option value="ar">🇲🇦 Arabe</option>
                <option value="en">🇬🇧 Anglais</option>
              </select>
            </div>

            <div className="form-check form-switch mb-3">
              <input className="form-check-input" type="checkbox"
                checked={notifs} onChange={e => setNotifs(e.target.checked)} />
              <label className="form-check-label">
                🔔 Activer les notifications
              </label>
            </div>

            <button className="btn btn-primary" onClick={sauvegarder}>
              💾 Sauvegarder
            </button>
          </div>
        </div>

        {/* Infos session */}
        <div className="col-md-6">
          <div className="card border-0 shadow-sm" style={{ borderRadius: 14, padding: '1.5rem' }}>
            <h6 className="fw-bold mb-3">🔐 Session & Sécurité</h6>
            {[
              { label: 'Utilisateur connecté', val: localStorage.getItem('nom') },
              { label: 'Rôle',                 val: localStorage.getItem('role') },
              { label: 'Session démarrée',      val: new Date().toLocaleString('fr-FR') },
            ].map((item, i) => (
              <div key={i} style={{
                display: 'flex', justifyContent: 'space-between',
                padding: '10px 0', borderBottom: '0.5px solid #f0f0f0'
              }}>
                <span style={{ fontSize: 13, color: '#666' }}>{item.label}</span>
                <strong style={{ fontSize: 13 }}>{item.val}</strong>
              </div>
            ))}
            <button className="btn btn-outline-danger btn-sm mt-3 w-100"
              onClick={() => { localStorage.clear(); navigate('/login') }}>
              🚪 Se déconnecter
            </button>
          </div>
        </div>

        {/* Zone danger */}
        <div className="col-12">
          <div className="card border-0 shadow-sm"
            style={{ borderRadius: 14, padding: '1.5rem', borderLeft: '4px solid #E24B4A' }}>
            <h6 className="fw-bold mb-2" style={{ color: '#E24B4A' }}>⚠️ Zone de danger</h6>
            <p className="text-muted mb-3" style={{ fontSize: 13 }}>
              Ces actions sont irréversibles. Soyez prudent.
            </p>
            <button className="btn btn-outline-danger btn-sm" onClick={supprimerCompte}>
              🗑️ Supprimer mon compte
            </button>
          </div>
        </div>

      </div>
    </Layout>
  )
}