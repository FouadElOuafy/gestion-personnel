import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import Layout from '../components/Layout'

const API = 'https://fouad1239-gestion-personnel-backend.hf.space/api/conges'
const API_EMP = 'https://fouad1239-gestion-personnel-backend.hf.space/api/employes'

const headers = () => ({
  headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
})

const VIDE = { employe: '', dateDebut: '', dateFin: '', motif: '' }

export default function Conges() {
  const [conges, setConges]         = useState([])
  const [employes, setEmployes]     = useState([])
  const [loading, setLoading]       = useState(true)
  const [erreur, setErreur]         = useState('')
  const [succes, setSucces]         = useState('')
  const [showModal, setShowModal]   = useState(false)
  const [form, setForm]             = useState(VIDE)
  const [filtre, setFiltre]         = useState('tous')
  const navigate = useNavigate()
  const role = localStorage.getItem('role')

  useEffect(() => { charger(); chargerEmployes() }, [])

  const charger = async () => {
    try {
      setLoading(true)
      const res = await axios.get(API, headers())
      setConges(res.data)
    } catch (e) {
      if (e.response?.status === 401) navigate('/login')
      else setErreur('Erreur de chargement')
    } finally { setLoading(false) }
  }

  const chargerEmployes = async () => {
    try {
      const res = await axios.get(API_EMP, headers())
      setEmployes(res.data)
    } catch {}
  }

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }))

  const ouvrirModal = () => {
    setForm(VIDE)
    setErreur('')
    setShowModal(true)
  }

  const fermer = () => { setShowModal(false); setErreur('') }

  const soumettre = async (e) => {
    e.preventDefault()
    try {
      await axios.post(API, form, headers())
      setSucces('Demande de congé envoyée avec succès')
      fermer()
      charger()
      setTimeout(() => setSucces(''), 3000)
    } catch (e) {
      setErreur(e.response?.data?.message || 'Erreur')
    }
  }

  const nbJours = (d1, d2) => {
    const diff = new Date(d2) - new Date(d1)
    return Math.ceil(diff / (1000 * 60 * 60 * 24)) + 1
  }

  const STATUTS = {
    en_attente: { label: 'En attente', color: '#EF9F27', bg: '#FAEEDA' },
    approuve:   { label: 'Approuvé',   color: '#1D9E75', bg: '#E1F5EE' },
    refuse:     { label: 'Refusé',     color: '#E24B4A', bg: '#FCEBEB' },
  }

  const filtrés = conges.filter(c =>
    filtre === 'tous' ? true : c.statut === filtre
  )

  return (
    <Layout>

      {/* EN-TÊTE */}
      <div className="d-flex flex-column flex-sm-row justify-content-between align-items-start align-items-sm-center gap-3 mb-4">
        <div>
          <h4 className="fw-bold mb-0">🏖️ Congés</h4>
          <p className="text-muted mb-0" style={{ fontSize: 13 }}>
            {conges.length} demande(s) au total
          </p>
        </div>
        {(role === 'employe' || role === 'manager') && (
          <button className="btn btn-primary w-100 w-sm-auto" onClick={ouvrirModal}>
            + Nouvelle demande
          </button>
        )}
      </div>

      {/* MESSAGES */}
      {succes && <div className="alert alert-success py-2">{succes}</div>}
      {erreur && !showModal && <div className="alert alert-danger py-2">{erreur}</div>}

      {/* STATS RAPIDES RESPONSIVE (CORRIGÉ POUR MOBILE) */}
      <div className="row g-2 g-md-3 mb-4">
        {[
          { label: 'Total',      val: conges.length,                                         color: '#378ADD', icon: '📋' },
          { label: 'En attente', val: conges.filter(c => c.statut === 'en_attente').length, color: '#EF9F27', icon: '⏳' },
          { label: 'Approuvés',  val: conges.filter(c => c.statut === 'approuve').length,   color: '#1D9E75', icon: '✅' },
          { label: 'Refusés',    val: conges.filter(c => c.statut === 'refuse').length,     color: '#E24B4A', icon: '❌' },
        ].map((s, i) => (
          <div key={i} className="col-6 col-md-3">
            <div className="card border-0 shadow-sm h-100" style={{ borderRadius: 12 }}>
              <div className="card-body p-2 p-sm-3 d-flex align-items-center gap-2 gap-sm-3">
                <span style={{ fontSize: 24, flexShrink: 0 }}>{s.icon}</span>
                <div style={{ minWidth: 0 }}>
                  <p className="text-muted mb-0 text-truncate" style={{ fontSize: 11 }}>{s.label}</p>
                  <h5 className="fw-bold mb-0" style={{ color: s.color, fontSize: '1.1rem' }}>{s.val}</h5>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* FILTRES RESPONSIVE (CORRIGÉ AVEC SCROLL SUR MOBILE) */}
      <div className="d-flex gap-2 mb-3 pb-2" style={{ overflowX: 'auto', WebkitOverflowScrolling: 'touch', whiteSpace: 'nowrap' }}>
        {[
          { val: 'tous',       label: 'Tous' },
          { val: 'en_attente', label: '⏳ En attente' },
          { val: 'approuve',   label: '✅ Approuvés' },
          { val: 'refuse',     label: '❌ Refusés' },
        ].map(f => (
          <button key={f.val}
            onClick={() => setFiltre(f.val)}
            className={`btn btn-sm flex-shrink-0 ${filtre === f.val ? 'btn-primary' : 'btn-outline-secondary'}`}>
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
        ) : (
          <div className="table-responsive">
            <table className="table table-hover mb-0" style={{ fontSize: 14 }}>
              <thead style={{ background: '#f8f9fa' }}>
                <tr>
                  <th style={thStyle}>#</th>
                  <th style={thStyle}>Employé</th>
                  <th style={thStyle}>Motif</th>
                  <th style={thStyle}>Date début</th>
                  <th style={thStyle}>Date fin</th>
                  <th style={thStyle}>Durée</th>
                  <th style={thStyle}>Statut</th>
                  <th style={thStyle}>Commentaire</th>
                </tr>
              </thead>
              <tbody>
                {filtrés.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="text-center py-4 text-muted">
                      Aucune demande trouvée
                    </td>
                  </tr>
                ) : (
                  filtrés.map((c, i) => {
                    const st = STATUTS[c.statut] || STATUTS['en_attente']
                    return (
                      <tr key={c._id}>
                        <td style={tdStyle}>{i + 1}</td>
                        <td style={tdStyle}>
                          <div className="d-flex align-items-center gap-2">
                            <div style={{
                              width: 32, height: 32, borderRadius: '50%',
                              background: `hsl(${i * 60}, 60%, 50%)`,
                              display: 'flex', alignItems: 'center',
                              justifyContent: 'center', color: '#fff',
                              fontSize: 13, fontWeight: 700, flexShrink: 0
                            }}>
                              {c.employe?.nom?.charAt(0).toUpperCase() || '?'}
                            </div>
                            <div>
                              <p className="mb-0 fw-semibold" style={{ fontSize: 13 }}>
                                {c.employe?.nom} {c.employe?.prenom}
                              </p>
                              <small className="text-muted">{c.employe?.poste}</small>
                            </div>
                          </div>
                        </td>
                        <td style={tdStyle}>{c.motif}</td>
                        <td style={tdStyle}>
                          {new Date(c.dateDebut).toLocaleDateString('fr-FR')}
                        </td>
                        <td style={tdStyle}>
                          {new Date(c.dateFin).toLocaleDateString('fr-FR')}
                        </td>
                        <td style={tdStyle}>
                          <span style={{
                            background: '#f0f0f0', padding: '2px 10px',
                            borderRadius: 99, fontSize: 12, fontWeight: 600
                          }}>
                            {nbJours(c.dateDebut, c.dateFin)}j
                          </span>
                        </td>
                        <td style={tdStyle}>
                          <span style={{
                            background: st.bg, color: st.color,
                            padding: '3px 12px', borderRadius: 99,
                            fontSize: 12, fontWeight: 600
                          }}>
                            {st.label}
                          </span>
                        </td>
                        <td style={tdStyle}>
                          <span style={{ fontSize: 12, color: '#999' }}>
                            {c.commentaire || '—'}
                          </span>
                        </td>
                      </tr>
                    )
                  })
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* MODAL — Nouvelle demande */}
      {showModal && (
        <div style={overlayStyle} onClick={fermer}>
          <div style={modalStyle} onClick={e => e.stopPropagation()}>

            <div className="d-flex justify-content-between align-items-center mb-4">
              <h5 className="fw-bold mb-0">🏖️ Nouvelle demande de congé</h5>
              <button onClick={fermer} style={closeBtnStyle}>✕</button>
            </div>

            {erreur && <div className="alert alert-danger py-2">{erreur}</div>}

            <form onSubmit={soumettre}>

              <div className="mb-3">
                <label className="form-label">Employé *</label>
                <select className="form-select" value={form.employe}
                  onChange={e => set('employe', e.target.value)} required>
                  <option value="">-- Sélectionner --</option>
                  {employes.map(emp => (
                    <option key={emp._id} value={emp._id}>
                      {emp.nom} {emp.prenom} — {emp.poste}
                    </option>
                  ))}
                </select>
              </div>

              <div className="row g-3 mb-3">
                <div className="col-6">
                  <label className="form-label">Date début *</label>
                  <input type="date" className="form-control"
                    value={form.dateDebut}
                    onChange={e => set('dateDebut', e.target.value)} required />
                </div>
                <div className="col-6">
                  <label className="form-label">Date fin *</label>
                  <input type="date" className="form-control"
                    value={form.dateFin}
                    onChange={e => set('dateFin', e.target.value)} required />
                </div>
              </div>

              {form.dateDebut && form.dateFin && (
                <div className="alert alert-info py-2 mb-3" style={{ fontSize: 13 }}>
                  📅 Durée : <strong>{nbJours(form.dateDebut, form.dateFin)} jour(s)</strong>
                </div>
              )}

              <div className="mb-3">
                <label className="form-label">Motif *</label>
                <textarea className="form-control" rows={3}
                  value={form.motif}
                  onChange={e => set('motif', e.target.value)}
                  placeholder="Raison de la demande de congé..."
                  required />
              </div>

              <div className="d-flex gap-2 mt-4">
                <button type="submit" className="btn btn-primary flex-fill">
                  Envoyer la demande
                </button>
                <button type="button" className="btn btn-light flex-fill" onClick={fermer}>
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

const thStyle = {
  padding: '12px 16px', fontSize: 12,
  fontWeight: 600, color: '#888',
  borderBottom: '1px solid #eee', whiteSpace: 'nowrap'
}
const tdStyle = {
  padding: '12px 16px',
  verticalAlign: 'middle',
  borderBottom: '1px solid #f5f5f5'
}
const overlayStyle = {
  position: 'fixed', inset: 0,
  background: 'rgba(0,0,0,0.4)',
  display: 'flex', alignItems: 'center',
  justifyContent: 'center', zIndex: 9999,
  padding: '10px'
}
const modalStyle = {
  background: '#fff', borderRadius: 16,
  padding: '1.5rem', width: '100%',
  maxWidth: 520, maxHeight: '90vh',
  overflowY: 'auto',
  boxShadow: '0 20px 60px rgba(0,0,0,0.2)'
}
const closeBtnStyle = {
  background: 'transparent', border: 'none',
  fontSize: 18, cursor: 'pointer', color: '#999'
}