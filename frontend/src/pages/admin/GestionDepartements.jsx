import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import Layout from '../../components/Layout'  // ← deux niveaux au lieu d'un

const API = 'http://localhost:3000/api/departements'

const headers = () => ({
  headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
})

const VIDE = { nom: '', description: '' }

export default function Departements() {
  const [departements, setDepartements] = useState([])
  const [loading, setLoading]           = useState(true)
  const [erreur, setErreur]             = useState('')
  const [succes, setSucces]             = useState('')
  const [showModal, setShowModal]       = useState(false)
  const [modeEdit, setModeEdit]         = useState(false)
  const [form, setForm]                 = useState(VIDE)
  const [idEdit, setIdEdit]             = useState(null)
  const [recherche, setRecherche]       = useState('')
  const navigate = useNavigate()

  useEffect(() => { charger() }, [])

  const charger = async () => {
    try {
      setLoading(true)
      const res = await axios.get(API, headers())
      setDepartements(res.data)
    } catch (e) {
      if (e.response?.status === 401) navigate('/login')
      else setErreur('Erreur de chargement')
    } finally { setLoading(false) }
  }

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }))

  const ouvrirAjout = () => {
    setForm(VIDE)
    setModeEdit(false)
    setIdEdit(null)
    setErreur('')
    setShowModal(true)
  }

  const ouvrirEdit = (dept) => {
    setForm({ nom: dept.nom, description: dept.description || '' })
    setIdEdit(dept._id)
    setModeEdit(true)
    setErreur('')
    setShowModal(true)
  }

  const fermer = () => { setShowModal(false); setErreur('') }

  const soumettre = async (e) => {
    e.preventDefault()
    try {
      if (modeEdit) {
        await axios.put(`${API}/${idEdit}`, form, headers())
        setSucces('Département modifié avec succès')
      } else {
        await axios.post(API, form, headers())
        setSucces('Département ajouté avec succès')
      }
      fermer()
      charger()
      setTimeout(() => setSucces(''), 3000)
    } catch (e) {
      setErreur(e.response?.data?.message || 'Erreur')
    }
  }

  const supprimer = async (id, nom) => {
    if (!window.confirm(`Supprimer le département "${nom}" ?`)) return
    try {
      await axios.delete(`${API}/${id}`, headers())
      setSucces('Département supprimé')
      charger()
      setTimeout(() => setSucces(''), 3000)
    } catch { setErreur('Erreur de suppression') }
  }

  const filtres = departements.filter(d =>
    d.nom?.toLowerCase().includes(recherche.toLowerCase()) ||
    d.description?.toLowerCase().includes(recherche.toLowerCase())
  )

  const COULEURS = ['#378ADD', '#1D9E75', '#E24B4A', '#EF9F27', '#7F77DD', '#D85A30']

  return (
    <Layout>

      {/* EN-TÊTE */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h4 className="fw-bold mb-0">🏢 Départements</h4>
          <p className="text-muted mb-0" style={{ fontSize: 13 }}>
            {departements.length} département(s) enregistré(s)
          </p>
        </div>
        <button className="btn btn-primary" onClick={ouvrirAjout}>
          + Ajouter un département
        </button>
      </div>

      {/* MESSAGES */}
      {succes && <div className="alert alert-success py-2">{succes}</div>}
      {erreur && !showModal && <div className="alert alert-danger py-2">{erreur}</div>}

      {/* RECHERCHE */}
      <div className="mb-3">
        <input
          className="form-control"
          placeholder="🔍 Rechercher un département..."
          value={recherche}
          onChange={e => setRecherche(e.target.value)}
          style={{ maxWidth: 400 }}
        />
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
                  <th style={thStyle}>Département</th>
                  <th style={thStyle}>Description</th>
                  <th style={thStyle}>Créé le</th>
                  <th style={thStyle}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtres.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="text-center py-4 text-muted">
                      Aucun département trouvé
                    </td>
                  </tr>
                ) : (
                  filtres.map((dept, i) => (
                    <tr key={dept._id}>
                      <td style={tdStyle}>{i + 1}</td>
                      <td style={tdStyle}>
                        <div className="d-flex align-items-center gap-2">
                          <div style={{
                            width: 36, height: 36, borderRadius: 10,
                            background: COULEURS[i % COULEURS.length] + '22',
                            display: 'flex', alignItems: 'center',
                            justifyContent: 'center', fontSize: 18,
                          }}>
                            🏢
                          </div>
                          <strong>{dept.nom}</strong>
                        </div>
                      </td>
                      <td style={tdStyle}>
                        <span style={{ color: '#888', fontSize: 13 }}>
                          {dept.description || '—'}
                        </span>
                      </td>
                      <td style={tdStyle}>
                        <span style={{ fontSize: 12, color: '#999' }}>
                          {new Date(dept.createdAt).toLocaleDateString('fr-FR')}
                        </span>
                      </td>
                      <td style={tdStyle}>
                        <div className="d-flex gap-1">
                          <button
                            className="btn btn-sm btn-outline-primary"
                            onClick={() => ouvrirEdit(dept)}
                          >
                            ✏️ Éditer
                          </button>
                          <button
                            className="btn btn-sm btn-outline-danger"
                            onClick={() => supprimer(dept._id, dept.nom)}
                          >
                            🗑️ Supprimer
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* MODAL */}
      {showModal && (
        <div style={overlayStyle} onClick={fermer}>
          <div style={modalStyle} onClick={e => e.stopPropagation()}>

            <div className="d-flex justify-content-between align-items-center mb-4">
              <h5 className="fw-bold mb-0">
                {modeEdit ? '✏️ Modifier le département' : '➕ Ajouter un département'}
              </h5>
              <button onClick={fermer} style={closeBtnStyle}>✕</button>
            </div>

            {erreur && <div className="alert alert-danger py-2">{erreur}</div>}

            <form onSubmit={soumettre}>
              <div className="mb-3">
                <label className="form-label">Nom du département *</label>
                <input
                  className="form-control"
                  value={form.nom}
                  onChange={e => set('nom', e.target.value)}
                  placeholder="Ex: Informatique"
                  required
                />
              </div>

              <div className="mb-3">
                <label className="form-label">Description</label>
                <textarea
                  className="form-control"
                  value={form.description}
                  onChange={e => set('description', e.target.value)}
                  placeholder="Description du département..."
                  rows={3}
                />
              </div>

              <div className="d-flex gap-2 mt-4">
                <button type="submit" className="btn btn-primary flex-fill">
                  {modeEdit ? 'Enregistrer' : 'Ajouter'}
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
  borderBottom: '1px solid #eee',
  whiteSpace: 'nowrap'
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
  justifyContent: 'center', zIndex: 9999
}
const modalStyle = {
  background: '#fff', borderRadius: 16,
  padding: '2rem', width: '100%',
  maxWidth: 480, maxHeight: '90vh',
  overflowY: 'auto',
  boxShadow: '0 20px 60px rgba(0,0,0,0.2)'
}
const closeBtnStyle = {
  background: 'transparent', border: 'none',
  fontSize: 18, cursor: 'pointer', color: '#999'
}