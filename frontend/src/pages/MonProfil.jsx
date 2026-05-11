import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import Layout from '../components/Layout'

const API = 'https://fouad1239-gestion-personnel-backend.hf.space/api/users'
const headers = () => ({
  headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
})

const ROLES = {
  admin:   { label: 'Admin',   color: '#E24B4A', bg: '#FCEBEB' },
  manager: { label: 'Manager', color: '#EF9F27', bg: '#FAEEDA' },
  employe: { label: 'Employé', color: '#1D9E75', bg: '#E1F5EE' },
}

export default function MonProfil() {
  const [user, setUser]           = useState(null)
  const [loading, setLoading]     = useState(true)
  const [onglet, setOnglet]       = useState('profil')
  const [form, setForm]           = useState({})
  const [mdp, setMdp]             = useState({ ancien: '', nouveau: '', confirm: '' })
  const [succes, setSucces]       = useState('')
  const [erreur, setErreur]       = useState('')
  const navigate = useNavigate()

  useEffect(() => {
    axios.get(`${API}/me`, headers())
      .then(res => { setUser(res.data); setForm(res.data) })
      .catch(() => navigate('/login'))
      .finally(() => setLoading(false))
  }, [])

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }))
  const setM = (k, v) => setMdp(f => ({ ...f, [k]: v }))

  const sauvegarderProfil = async (e) => {
    e.preventDefault()
    try {
      const res = await axios.put(`${API}/me`,
        { nom: form.nom, prenom: form.prenom, telephone: form.telephone, adresse: form.adresse },
        headers()
      )
      setUser(res.data)
      localStorage.setItem('nom', res.data.nom)
      setSucces('Profil mis à jour avec succès')
      setErreur('')
      setTimeout(() => setSucces(''), 3000)
    } catch (e) { setErreur(e.response?.data?.message || 'Erreur') }
  }

  const changerMotDePasse = async (e) => {
    e.preventDefault()
    if (mdp.nouveau !== mdp.confirm)
      return setErreur('Les mots de passe ne correspondent pas')
    try {
      await axios.put(`${API}/me/password`,
        { ancienPassword: mdp.ancien, nouveauPassword: mdp.nouveau },
        headers()
      )
      setSucces('Mot de passe modifié avec succès')
      setErreur('')
      setMdp({ ancien: '', nouveau: '', confirm: '' })
      setTimeout(() => setSucces(''), 3000)
    } catch (e) { setErreur(e.response?.data?.message || 'Erreur') }
  }

  if (loading) return <Layout><div className="text-center py-5"><div className="spinner-border text-primary" /></div></Layout>

  const r = ROLES[user?.role] || ROLES.employe

  return (
    <Layout>
      <h4 className="fw-bold mb-4">👤 Mon Profil</h4>

      {succes && <div className="alert alert-success py-2 mb-3">{succes}</div>}
      {erreur && <div className="alert alert-danger py-2 mb-3">{erreur}</div>}

      <div className="row g-4">

        {/* COLONNE GAUCHE — carte identité */}
        <div className="col-md-4">
          <div className="card border-0 shadow-sm text-center" style={{ borderRadius: 16, padding: '2rem 1rem' }}>

            {/* Avatar */}
            <div style={{
              width: 90, height: 90, borderRadius: '50%',
              background: r.bg, display: 'flex',
              alignItems: 'center', justifyContent: 'center',
              fontSize: 36, fontWeight: 700, color: r.color,
              margin: '0 auto 1rem', border: `3px solid ${r.color}33`
            }}>
              {user?.nom?.charAt(0).toUpperCase()}
            </div>

            <h5 className="fw-bold mb-1">{user?.nom} {user?.prenom}</h5>
            <span style={{
              background: r.bg, color: r.color,
              padding: '4px 14px', borderRadius: 99,
              fontSize: 12, fontWeight: 600
            }}>{r.label}</span>

            <hr className="my-3" />

            {/* Infos rapides */}
            {[
              { icon: '📧', label: 'Email',     val: user?.email },
              { icon: '📞', label: 'Téléphone', val: user?.telephone || 'Non renseigné' },
              { icon: '📍', label: 'Adresse',   val: user?.adresse  || 'Non renseignée' },
              { icon: '📅', label: 'Membre depuis', val: new Date(user?.createdAt).toLocaleDateString('fr-FR') },
            ].map((item, i) => (
              <div key={i} style={{
                display: 'flex', alignItems: 'flex-start',
                gap: 10, padding: '8px 0',
                borderBottom: '0.5px solid #f0f0f0',
                textAlign: 'left'
              }}>
                <span style={{ fontSize: 16, flexShrink: 0 }}>{item.icon}</span>
                <div>
                  <p style={{ fontSize: 11, color: '#999', margin: 0 }}>{item.label}</p>
                  <p style={{ fontSize: 13, color: '#333', margin: 0, fontWeight: 500 }}>{item.val}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* COLONNE DROITE — formulaires */}
        <div className="col-md-8">

          {/* ONGLETS */}
          <div className="d-flex gap-2 mb-4">
            {[
              { key: 'profil',    label: '✏️ Modifier le profil' },
              { key: 'password',  label: '🔒 Mot de passe' },
              { key: 'activite',  label: '📊 Activité' },
            ].map(o => (
              <button key={o.key}
                onClick={() => { setOnglet(o.key); setErreur(''); setSucces('') }}
                className={`btn btn-sm ${onglet === o.key ? 'btn-primary' : 'btn-outline-secondary'}`}>
                {o.label}
              </button>
            ))}
          </div>

          {/* ONGLET — Modifier profil */}
          {onglet === 'profil' && (
            <div className="card border-0 shadow-sm" style={{ borderRadius: 14, padding: '1.5rem' }}>
              <h6 className="fw-bold mb-3">Informations personnelles</h6>
              <form onSubmit={sauvegarderProfil}>
                <div className="row g-3">
                  <div className="col-6">
                    <label className="form-label">Nom</label>
                    <input className="form-control" value={form.nom || ''}
                      onChange={e => set('nom', e.target.value)} required />
                  </div>
                  <div className="col-6">
                    <label className="form-label">Prénom</label>
                    <input className="form-control" value={form.prenom || ''}
                      onChange={e => set('prenom', e.target.value)} required />
                  </div>
                  <div className="col-12">
                    <label className="form-label">Email</label>
                    <input className="form-control" value={form.email || ''}
                      disabled style={{ background: '#f8f9fa', color: '#999' }} />
                    <small className="text-muted">L'email ne peut pas être modifié</small>
                  </div>
                  <div className="col-6">
                    <label className="form-label">Téléphone</label>
                    <input className="form-control" value={form.telephone || ''}
                      onChange={e => set('telephone', e.target.value)}
                      placeholder="Ex: +212 6XX XXX XXX" />
                  </div>
                  <div className="col-6">
                    <label className="form-label">Adresse</label>
                    <input className="form-control" value={form.adresse || ''}
                      onChange={e => set('adresse', e.target.value)}
                      placeholder="Ville, Pays" />
                  </div>
                </div>
                <button type="submit" className="btn btn-primary mt-3">
                  💾 Sauvegarder
                </button>
              </form>
            </div>
          )}

          {/* ONGLET — Mot de passe */}
          {onglet === 'password' && (
            <div className="card border-0 shadow-sm" style={{ borderRadius: 14, padding: '1.5rem' }}>
              <h6 className="fw-bold mb-3">Changer le mot de passe</h6>
              <form onSubmit={changerMotDePasse}>
                <div className="mb-3">
                  <label className="form-label">Ancien mot de passe</label>
                  <input className="form-control" type="password"
                    value={mdp.ancien}
                    onChange={e => setM('ancien', e.target.value)} required />
                </div>
                <div className="mb-3">
                  <label className="form-label">Nouveau mot de passe</label>
                  <input className="form-control" type="password"
                    value={mdp.nouveau}
                    onChange={e => setM('nouveau', e.target.value)} required />
                </div>
                <div className="mb-3">
                  <label className="form-label">Confirmer le nouveau</label>
                  <input className="form-control" type="password"
                    value={mdp.confirm}
                    onChange={e => setM('confirm', e.target.value)} required />
                  {mdp.confirm && mdp.nouveau !== mdp.confirm && (
                    <small className="text-danger">Les mots de passe ne correspondent pas</small>
                  )}
                </div>
                <button type="submit" className="btn btn-warning mt-2"
                  disabled={mdp.nouveau !== mdp.confirm && mdp.confirm !== ''}>
                  🔒 Changer le mot de passe
                </button>
              </form>
            </div>
          )}

          {/* ONGLET — Activité */}
          {onglet === 'activite' && (
            <div className="card border-0 shadow-sm" style={{ borderRadius: 14, padding: '1.5rem' }}>
              <h6 className="fw-bold mb-3">📊 Résumé du compte</h6>
              <div className="row g-3">
                {[
                  { icon: '👤', label: 'Rôle',          val: r.label, color: r.color },
                  { icon: '📧', label: 'Email',          val: user?.email, color: '#378ADD' },
                  { icon: '✅', label: 'Statut',         val: 'Actif', color: '#1D9E75' },
                  { icon: '📅', label: 'Membre depuis',  val: new Date(user?.createdAt).toLocaleDateString('fr-FR'), color: '#888' },
                  { icon: '🔄', label: 'Dernière MAJ',   val: new Date(user?.updatedAt).toLocaleDateString('fr-FR'), color: '#888' },
                ].map((item, i) => (
                  <div key={i} className="col-6">
                    <div style={{
                      background: '#f8f9fa', borderRadius: 10,
                      padding: '12px 14px',
                    }}>
                      <p style={{ fontSize: 11, color: '#999', margin: '0 0 4px' }}>
                        {item.icon} {item.label}
                      </p>
                      <p style={{ fontSize: 14, fontWeight: 600, margin: 0, color: item.color }}>
                        {item.val}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>
      </div>
    </Layout>
  )
}
