import { useState, useEffect } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import Layout from '../components/Layout'

const API     = 'https://fouad1239-gestion-personnel-backend.hf.space/api'
const headers = () => ({
  headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
})

const STATUT = {
  en_attente: { label: 'En attente', color: '#EF9F27', bg: '#FFF3CD' },
  approuve:   { label: 'Approuvé',   color: '#1D9E75', bg: '#D4EDDA' },
  refuse:     { label: 'Refusé',     color: '#E24B4A', bg: '#FDECEA' },
}

const VIDE = {
  dateDebut: '', dateFin: '', motif: ''
}

export default function MesConges() {
  const [conges,     setConges]     = useState([])
  const [loading,    setLoading]    = useState(true)
  const [filtre,     setFiltre]     = useState('tous')
  const [showModal,  setShowModal]  = useState(false)
  const [form,       setForm]       = useState(VIDE)
  const [employe,    setEmploye]    = useState(null)
  const [erreur,     setErreur]     = useState('')
  const [succes,     setSucces]     = useState('')
  const navigate = useNavigate()

  useEffect(() => {
    if (!localStorage.getItem('token')) { navigate('/login'); return }
    charger()
  }, [])

  const charger = async () => {
    try {
      setLoading(true)
      // Charger mes congés
      const res = await axios.get(`${API}/conges/mes-conges`, headers())
      setConges(res.data)

      // Charger mon profil employé pour avoir l'_id
      const empRes = await axios.get(`${API}/employes`, headers())
      const moi = empRes.data.find(e =>
        e.user === localStorage.getItem('userId') || true
      )
      setEmploye(moi)

    } catch (e) {
      if (e.response?.status === 401) navigate('/login')
      setErreur('Erreur de chargement')
    } finally {
      setLoading(false)
    }
  }

  const duree = (debut, fin) => {
    const d1 = new Date(debut)
    const d2 = new Date(fin)
    const diff = Math.ceil((d2 - d1) / (1000 * 60 * 60 * 24))
    return diff > 0 ? diff : 1
  }

  const soumettre = async (e) => {
    e.preventDefault()
    setErreur('')
    try {
      // Récupérer l'id de l'employé connecté
      const empRes = await axios.get(`${API}/employes`, headers())
      const userRes = await axios.get(`${API}/users/me`, headers())

      // Trouver l'employé lié à l'utilisateur connecté
      const monEmploye = empRes.data.find(
        emp => emp.user === userRes.data._id ||
               emp.email === userRes.data.email
      )

      if (!monEmploye) {
        setErreur("Votre fiche employé n'existe pas encore. Contactez l'admin.")
        return
      }

      await axios.post(`${API}/conges`, {
        employe:   monEmploye._id,
        dateDebut: form.dateDebut,
        dateFin:   form.dateFin,
        motif:     form.motif,
      }, headers())

      setSucces('Demande envoyée avec succès !')
      setShowModal(false)
      setForm(VIDE)
      charger()
      setTimeout(() => setSucces(''), 3000)
    } catch (e) {
      setErreur(e.response?.data?.message || 'Erreur lors de la demande')
    }
  }

  const congesFiltres = filtre === 'tous'
    ? conges
    : conges.filter(c => c.statut === filtre)

  const stats = {
    total:      conges.length,
    enAttente:  conges.filter(c => c.statut === 'en_attente').length,
    approuves:  conges.filter(c => c.statut === 'approuve').length,
    refuses:    conges.filter(c => c.statut === 'refuse').length,
  }

  return (
    <Layout>

      {/* HEADER */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h4 className="fw-bold mb-0">🏖️ Mes Congés</h4>
          <p className="text-muted mb-0" style={{ fontSize: 13 }}>
            {conges.length} demande(s) au total
          </p>
        </div>
        <button className="btn btn-primary"
          onClick={() => { setShowModal(true); setErreur('') }}>
          + Nouvelle demande
        </button>
      </div>

      {succes && <div className="alert alert-success py-2 mb-3">{succes}</div>}
      {erreur && !showModal && <div className="alert alert-danger py-2 mb-3">{erreur}</div>}

      {/* STAT CARDS RESPONSIVE */}
      <div className="row g-3 mb-4">
        {[
          { label: 'Total',       val: stats.total,    icon: '📋', color: '#378ADD' },
          { label: 'En attente',  val: stats.enAttente, icon: '⏳', color: '#EF9F27' },
          { label: 'Approuvés',   val: stats.approuves, icon: '✅', color: '#1D9E75' },
          { label: 'Refusés',     val: stats.refuses,   icon: '❌', color: '#E24B4A' },
        ].map((s, i) => (
          <div key={i} className="col-12 col-sm-6 col-md-3">
            <div className="card border-0 shadow-sm" style={{ borderRadius: 12 }}>
              <div className="card-body p-3 d-flex align-items-center gap-3">
                <div style={{
                  width: 44, height: 44, borderRadius: 10,
                  background: s.color + '22', display: 'flex',
                  alignItems: 'center', justifyContent: 'center',
                  fontSize: 20, flexShrink: 0
                }}>{s.icon}</div>
                <div>
                  <p className="text-muted mb-0" style={{ fontSize: 12 }}>{s.label}</p>
                  <h5 className="fw-bold mb-0" style={{ color: s.color }}>{s.val}</h5>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* FILTRES */}
      <div className="d-flex flex-wrap gap-2 mb-3">
        {[
          { key: 'tous',       label: 'Tous'        },
          { key: 'en_attente', label: '⏳ En attente' },
          { key: 'approuve',   label: '✅ Approuvés'  },
          { key: 'refuse',     label: '❌ Refusés'    },
        ].map(f => (
          <button key={f.key}
            onClick={() => setFiltre(f.key)}
            className={`btn btn-sm ${filtre === f.key ? 'btn-primary' : 'btn-outline-secondary'}`}>
            {f.label}
          </button>
        ))}
      </div>

      {/* TABLEAU */}
      <div className="card border-0 shadow-sm" style={{ borderRadius: 14 }}>
        {loading ? (
          <div className="text-center py-5">
            <div className="spinner-border text-primary" />
          </div>
        ) : congesFiltres.length === 0 ? (
          <div className="text-center py-5">
            <div style={{ fontSize: 50 }}>🏖️</div>
            <p className="text-muted mt-2">Aucune demande de congé</p>
            <button className="btn btn-primary btn-sm"
              onClick={() => setShowModal(true)}>
              Faire une demande
            </button>
          </div>
        ) : (
          <div className="table-responsive">
            <table className="table table-hover mb-0" style={{ fontSize: 14 }}>
              <thead style={{ background: '#f8f9fa' }}>
                <tr>
                  {['#','Motif','Date début','Date fin','Durée','Statut','Commentaire'].map(h => (
                    <th key={h} style={{
                      padding: '12px 16px', fontSize: 12,
                      fontWeight: 600, color: '#888',
                      borderBottom: '1px solid #eee'
                    }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {congesFiltres.map((c, i) => {
                  const s = STATUT[c.statut] || STATUT.en_attente
                  return (
                    <tr key={c._id}>
                      <td style={td}>{i + 1}</td>
                      <td style={td}>
                        <p className="mb-0 fw-semibold" style={{ fontSize: 13 }}>
                          {c.motif}
                        </p>
                      </td>
                      <td style={td}>
                        {new Date(c.dateDebut).toLocaleDateString('fr-FR')}
                      </td>
                      <td style={td}>
                        {new Date(c.dateFin).toLocaleDateString('fr-FR')}
                      </td>
                      <td style={td}>
                        <span style={{
                          background: '#f0f0f0', padding: '2px 10px',
                          borderRadius: 99, fontSize: 12, fontWeight: 600
                        }}>
                          {duree(c.dateDebut, c.dateFin)}j
                        </span>
                      </td>
                      <td style={td}>
                        <span style={{
                          background: s.bg, color: s.color,
                          padding: '3px 12px', borderRadius: 99,
                          fontSize: 12, fontWeight: 600
                        }}>
                          {s.label}
                        </span>
                      </td>
                      <td style={td}>
                        <span style={{ fontSize: 12, color: '#999' }}>
                          {c.commentaire || '—'}
                        </span>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* MODAL — Nouvelle demande */}
      {showModal && (
        <div style={{
          position: 'fixed', inset: 0,
          background: 'rgba(0,0,0,0.4)',
          display: 'flex', alignItems: 'center',
          justifyContent: 'center', zIndex: 9999
        }} onClick={() => setShowModal(false)}>
          <div style={{
            background: '#fff', borderRadius: 16,
            padding: '2rem', width: '100%', maxWidth: 480,
            boxShadow: '0 20px 60px rgba(0,0,0,0.2)'
          }} onClick={e => e.stopPropagation()}>

            <div className="d-flex justify-content-between align-items-center mb-4">
              <h5 className="fw-bold mb-0">🏖️ Nouvelle demande de congé</h5>
              <button onClick={() => setShowModal(false)}
                style={{ background: 'none', border: 'none',
                  fontSize: 18, cursor: 'pointer', color: '#999' }}>
                ✕
              </button>
            </div>

            {erreur && (
              <div className="alert alert-danger py-2 mb-3">{erreur}</div>
            )}

            <form onSubmit={soumettre}>
              <div className="mb-3">
                <label className="form-label fw-semibold">
                  📅 Date de début
                </label>
                <input type="date" className="form-control"
                  value={form.dateDebut}
                  min={new Date().toISOString().split('T')[0]}
                  onChange={e => setForm({...form, dateDebut: e.target.value})}
                  required />
              </div>

              <div className="mb-3">
                <label className="form-label fw-semibold">
                  📅 Date de fin
                </label>
                <input type="date" className="form-control"
                  value={form.dateFin}
                  min={form.dateDebut || new Date().toISOString().split('T')[0]}
                  onChange={e => setForm({...form, dateFin: e.target.value})}
                  required />
              </div>

              {/* Aperçu durée */}
              {form.dateDebut && form.dateFin && (
                <div style={{
                  background: '#E8F4FD', borderRadius: 8,
                  padding: '8px 14px', marginBottom: 12,
                  fontSize: 13, color: '#378ADD'
                }}>
                  📊 Durée : <strong>
                    {duree(form.dateDebut, form.dateFin)} jour(s)
                  </strong>
                </div>
              )}

              <div className="mb-4">
                <label className="form-label fw-semibold">
                  📝 Motif
                </label>
                <textarea className="form-control" rows={3}
                  placeholder="Expliquez le motif de votre congé..."
                  value={form.motif}
                  onChange={e => setForm({...form, motif: e.target.value})}
                  required />
              </div>

              <div className="d-flex gap-2">
                <button type="submit" className="btn btn-primary flex-fill">
                  📤 Envoyer la demande
                </button>
                <button type="button"
                  className="btn btn-light flex-fill"
                  onClick={() => setShowModal(false)}>
                  Annuler
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </Layout>
  )
}

const td = {
  padding: '12px 16px',
  verticalAlign: 'middle',
  borderBottom: '1px solid #f5f5f5'
}