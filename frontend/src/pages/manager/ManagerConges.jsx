import { useState, useEffect } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import Layout from '../../components/Layout'

const API     = 'https://fouad1239-gestion-personnel-backend.hf.space/api/conges'
const headers = () => ({
  headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
})

const STATUT = {
  en_attente: { label: 'En attente', color: '#EF9F27', bg: '#FFF3CD' },
  approuve:   { label: 'Approuvé',   color: '#1D9E75', bg: '#D4EDDA' },
  refuse:     { label: 'Refusé',     color: '#E24B4A', bg: '#FDECEA' },
}

export default function ManagerConges() {
  const [conges,    setConges]    = useState([])
  const [loading,   setLoading]   = useState(true)
  const [filtre,    setFiltre]    = useState('tous')
  const [succes,    setSucces]    = useState('')
  const [erreur,    setErreur]    = useState('')
  const [commentaire, setCommentaire] = useState({})
  const navigate = useNavigate()

  useEffect(() => {
    if (!localStorage.getItem('token')) { navigate('/login'); return }
    charger()
  }, [])

  const charger = async () => {
    try {
      setLoading(true)
      const res = await axios.get(API, headers())
      setConges(res.data)
    } catch (e) {
      if (e.response?.status === 401) navigate('/login')
    } finally { setLoading(false) }
  }

  const changerStatut = async (id, statut) => {
    try {
      await axios.put(`${API}/${id}/statut`, {
        statut,
        commentaire: commentaire[id] || ''
      }, headers())
      setSucces(`Congé ${statut === 'approuve' ? 'approuvé' : 'refusé'} !`)
      charger()
      setTimeout(() => setSucces(''), 3000)
    } catch (e) {
      setErreur('Erreur lors de la mise à jour')
    }
  }

  const duree = (debut, fin) => {
    const diff = Math.ceil(
      (new Date(fin) - new Date(debut)) / (1000 * 60 * 60 * 24)
    )
    return diff > 0 ? diff : 1
  }

  const congesFiltres = filtre === 'tous'
    ? conges
    : conges.filter(c => c.statut === filtre)

  const stats = {
    total:     conges.length,
    attente:   conges.filter(c => c.statut === 'en_attente').length,
    approuves: conges.filter(c => c.statut === 'approuve').length,
    refuses:   conges.filter(c => c.statut === 'refuse').length,
  }

  return (
    <Layout>

      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h4 className="fw-bold mb-0">🏖️ Gestion des Congés</h4>
          <p className="text-muted mb-0" style={{ fontSize: 13 }}>
            {stats.attente} demande(s) en attente de validation
          </p>
        </div>
        <button className="btn btn-outline-primary btn-sm" onClick={charger}>
          🔄 Rafraîchir
        </button>
      </div>

      {succes && <div className="alert alert-success py-2 mb-3">{succes}</div>}
      {erreur && <div className="alert alert-danger py-2 mb-3">{erreur}</div>}

      {/* STATS */}
      <div className="row g-3 mb-4">
        {[
          { label: 'Total',      val: stats.total,     icon: '📋', color: '#378ADD' },
          { label: 'En attente', val: stats.attente,   icon: '⏳', color: '#EF9F27' },
          { label: 'Approuvés',  val: stats.approuves, icon: '✅', color: '#1D9E75' },
          { label: 'Refusés',    val: stats.refuses,   icon: '❌', color: '#E24B4A' },
        ].map((s, i) => (
          <div key={i} className="col-3">
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
      <div className="d-flex gap-2 mb-3">
        {[
          { key: 'tous',       label: 'Tous'          },
          { key: 'en_attente', label: '⏳ En attente'  },
          { key: 'approuve',   label: '✅ Approuvés'   },
          { key: 'refuse',     label: '❌ Refusés'     },
        ].map(f => (
          <button key={f.key} onClick={() => setFiltre(f.key)}
            className={`btn btn-sm ${filtre === f.key
              ? 'btn-primary' : 'btn-outline-secondary'}`}>
            {f.label}
          </button>
        ))}
      </div>

      {/* LISTE */}
      {loading ? (
        <div className="text-center py-5">
          <div className="spinner-border text-primary" />
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {congesFiltres.length === 0 ? (
            <div className="text-center py-5">
              <div style={{ fontSize: 50 }}>🏖️</div>
              <p className="text-muted mt-2">Aucune demande</p>
            </div>
          ) : (
            congesFiltres.map(c => {
              const s = STATUT[c.statut] || STATUT.en_attente
              return (
                <div key={c._id} className="card border-0 shadow-sm"
                  style={{ borderRadius: 14 }}>
                  <div className="card-body p-4">
                    <div className="d-flex justify-content-between
                      align-items-start flex-wrap gap-3">

                      {/* Infos employé */}
                      <div className="d-flex align-items-center gap-3">
                        <div style={{
                          width: 44, height: 44, borderRadius: '50%',
                          background: '#378ADD22', display: 'flex',
                          alignItems: 'center', justifyContent: 'center',
                          fontSize: 18, fontWeight: 700, color: '#378ADD'
                        }}>
                          {c.employe?.nom?.charAt(0).toUpperCase() || '?'}
                        </div>
                        <div>
                          <p className="fw-bold mb-0" style={{ fontSize: 14 }}>
                            {c.employe?.nom} {c.employe?.prenom}
                          </p>
                          <small className="text-muted">
                            {c.employe?.poste}
                          </small>
                        </div>
                      </div>

                      {/* Dates + durée */}
                      <div style={{ textAlign: 'center' }}>
                        <p className="mb-0 fw-semibold" style={{ fontSize: 13 }}>
                          📅 {new Date(c.dateDebut).toLocaleDateString('fr-FR')}
                          {' → '}
                          {new Date(c.dateFin).toLocaleDateString('fr-FR')}
                        </p>
                        <small className="text-muted">
                          {duree(c.dateDebut, c.dateFin)} jour(s)
                        </small>
                      </div>

                      {/* Motif */}
                      <div style={{ maxWidth: 200 }}>
                        <p className="mb-0" style={{ fontSize: 13 }}>
                          📝 {c.motif}
                        </p>
                      </div>

                      {/* Statut */}
                      <span style={{
                        background: s.bg, color: s.color,
                        padding: '4px 14px', borderRadius: 99,
                        fontSize: 12, fontWeight: 600,
                        alignSelf: 'center'
                      }}>
                        {s.label}
                      </span>

                    </div>

                    {/* Zone approbation — seulement si en attente */}
                    {c.statut === 'en_attente' && (
                      <div style={{
                        marginTop: 16, paddingTop: 16,
                        borderTop: '0.5px solid #eee',
                        display: 'flex', gap: 10, alignItems: 'center',
                        flexWrap: 'wrap'
                      }}>
                        <input
                          className="form-control form-control-sm"
                          placeholder="Commentaire (optionnel)..."
                          value={commentaire[c._id] || ''}
                          onChange={e => setCommentaire(prev => ({
                            ...prev, [c._id]: e.target.value
                          }))}
                          style={{ maxWidth: 300 }}
                        />
                        <button
                          className="btn btn-success btn-sm"
                          onClick={() => changerStatut(c._id, 'approuve')}>
                          ✅ Approuver
                        </button>
                        <button
                          className="btn btn-danger btn-sm"
                          onClick={() => changerStatut(c._id, 'refuse')}>
                          ❌ Refuser
                        </button>
                      </div>
                    )}

                    {/* Commentaire existant */}
                    {c.commentaire && c.statut !== 'en_attente' && (
                      <p style={{
                        marginTop: 10, fontSize: 12,
                        color: '#888', fontStyle: 'italic'
                      }}>
                        💬 {c.commentaire}
                      </p>
                    )}
                  </div>
                </div>
              )
            })
          )}
        </div>
      )}
    </Layout>
  )
}
