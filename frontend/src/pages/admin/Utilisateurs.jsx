import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import Layout from '../../components/Layout'

const API = 'http://localhost:3000/api/users'
const headers = () => ({
  headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
})

const VIDE = { nom: '', prenom: '', email: '', password: '', role: 'employe', telephone: '', actif: true,departement: '' }

const ROLES = {
  admin:   { label: 'Admin',   color: '#E24B4A', bg: '#FCEBEB' },
  manager: { label: 'Manager', color: '#EF9F27', bg: '#FAEEDA' },
  employe: { label: 'Employé', color: '#1D9E75', bg: '#E1F5EE' },
}

export default function Utilisateurs() {
  const [users, setUsers]         = useState([])
  const [loading, setLoading]     = useState(true)
  const [erreur, setErreur]       = useState('')
  const [succes, setSucces]       = useState('')
  const [showModal, setShowModal] = useState(false)
  const [modeEdit, setModeEdit]   = useState(false)
  const [form, setForm]           = useState(VIDE)
  const [idEdit, setIdEdit]       = useState(null)
  const [recherche, setRecherche] = useState('')
  // const navigate = useNavigate()
  const [departements, setDepartements] = useState([])
  const navigate = useNavigate()

  //useEffect(() => { charger() }, [])
  useEffect(() => { charger(); chargerDepts() }, [])
  const charger = async () => {
    try {
      setLoading(true)
      const res = await axios.get(API, headers())
      setUsers(res.data)
    } catch (e) {
      if (e.response?.status === 401) navigate('/login')
      else setErreur('Erreur de chargement')
    } finally { setLoading(false) }
  }
  const chargerDepts = async () => {
  try {
    const res = await axios.get('http://localhost:3000/api/departements', headers())
    setDepartements(res.data)
  } catch (e) { console.error(e) }
}

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }))

  const ouvrirAjout = () => {
    setForm(VIDE); setModeEdit(false)
    setIdEdit(null); setErreur('')
    setShowModal(true)
  }

  const ouvrirEdit = (u) => {
    setForm({ nom: u.nom, prenom: u.prenom, email: u.email,
      password: '', role: u.role, telephone: u.telephone || '', actif: u.actif , departement: u.departement || '' })
    setIdEdit(u._id); setModeEdit(true)
    setErreur(''); setShowModal(true)
  }

  const fermer = () => { setShowModal(false); setErreur('') }

  const soumettre = async (e) => {
    e.preventDefault()
    try {
      const data = { ...form }
      if (modeEdit && !data.password) delete data.password
      if (modeEdit) await axios.put(`${API}/${idEdit}`, data, headers())
      else await axios.post(API, data, headers())
      setSucces(modeEdit ? 'Utilisateur modifié' : 'Utilisateur créé')
      fermer(); charger()
      setTimeout(() => setSucces(''), 3000)
    } catch (e) { setErreur(e.response?.data?.message || 'Erreur') }
  }

  const supprimer = async (id, nom) => {
    if (!window.confirm(`Supprimer ${nom} ?`)) return
    try {
      await axios.delete(`${API}/${id}`, headers())
      setSucces('Utilisateur supprimé'); charger()
      setTimeout(() => setSucces(''), 3000)
    } catch { setErreur('Erreur de suppression') }
  }

  const filtres = users.filter(u =>
    u.nom?.toLowerCase().includes(recherche.toLowerCase()) ||
    u.prenom?.toLowerCase().includes(recherche.toLowerCase()) ||
    u.email?.toLowerCase().includes(recherche.toLowerCase())
  )

  return (
    <Layout>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h4 className="fw-bold mb-0">🔐 Utilisateurs</h4>
          <p className="text-muted mb-0" style={{ fontSize: 13 }}>
            {users.length} utilisateur(s) enregistré(s)
          </p>
        </div>
        <button className="btn btn-primary" onClick={ouvrirAjout}>
          + Ajouter un utilisateur
        </button>
      </div>

      {succes && <div className="alert alert-success py-2">{succes}</div>}
      {erreur && !showModal && <div className="alert alert-danger py-2">{erreur}</div>}

      {/* STATS */}
      <div className="row g-3 mb-4">
        {Object.entries(ROLES).map(([key, r]) => (
          <div key={key} className="col-4">
            <div className="card border-0 shadow-sm" style={{ borderRadius: 12 }}>
              <div className="card-body p-3 d-flex align-items-center gap-3">
                <div style={{
                  width: 44, height: 44, borderRadius: 10,
                  background: r.bg, display: 'flex',
                  alignItems: 'center', justifyContent: 'center', fontSize: 22
                }}>
                  {key === 'admin' ? '👑' : key === 'manager' ? '🏆' : '👤'}
                </div>
                <div>
                  <p className="text-muted mb-0" style={{ fontSize: 12 }}>{r.label}s</p>
                  <h5 className="fw-bold mb-0" style={{ color: r.color }}>
                    {users.filter(u => u.role === key).length}
                  </h5>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mb-3">
        <input className="form-control"
          placeholder="🔍 Rechercher un utilisateur..."
          value={recherche}
          onChange={e => setRecherche(e.target.value)}
          style={{ maxWidth: 400 }} />
      </div>

      <div className="card border-0 shadow-sm" style={{ borderRadius: 14 }}>
        {loading ? (
          <div className="text-center py-5"><div className="spinner-border text-primary" /></div>
        ) : (
          <div className="table-responsive">
            <table className="table table-hover mb-0" style={{ fontSize: 14 }}>
              <thead style={{ background: '#f8f9fa' }}>
                <tr>
                  <th style={thStyle}>#</th>
                  <th style={thStyle}>Utilisateur</th>
                  <th style={thStyle}>Email</th>
                  <th style={thStyle}>Rôle</th>
                  <th style={thStyle}>Téléphone</th>
                  <th style={thStyle}>Statut</th>
                  <th style={thStyle}>Créé le</th>
                  <th style={thStyle}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtres.length === 0 ? (
                  <tr><td colSpan={8} className="text-center py-4 text-muted">Aucun utilisateur</td></tr>
                ) : (
                  filtres.map((u, i) => {
                    const r = ROLES[u.role] || ROLES.employe
                    return (
                      <tr key={u._id}>
                        <td style={tdStyle}>{i + 1}</td>
                        <td style={tdStyle}>
                          <div className="d-flex align-items-center gap-2">
                            <div style={{
                              width: 36, height: 36, borderRadius: '50%',
                              background: r.bg, display: 'flex',
                              alignItems: 'center', justifyContent: 'center',
                              color: r.color, fontSize: 14, fontWeight: 700
                            }}>
                              {u.nom?.charAt(0).toUpperCase()}
                            </div>
                            <div>
                              <p className="mb-0 fw-semibold" style={{ fontSize: 13 }}>
                                {u.nom} {u.prenom}
                              </p>
                            </div>
                          </div>
                        </td>
                        <td style={tdStyle}>{u.email}</td>
                        <td style={tdStyle}>
                          <span style={{
                            background: r.bg, color: r.color,
                            padding: '3px 12px', borderRadius: 99,
                            fontSize: 12, fontWeight: 600
                          }}>{r.label}</span>
                        </td>
                        <td style={tdStyle}>{u.telephone || '—'}</td>
                        <td style={tdStyle}>
                          <span className={`badge ${u.actif !== false ? 'bg-success' : 'bg-secondary'}`}>
                            {u.actif !== false ? 'Actif' : 'Inactif'}
                          </span>
                        </td>
                        <td style={tdStyle}>
                          <span style={{ fontSize: 12, color: '#999' }}>
                            {new Date(u.createdAt).toLocaleDateString('fr-FR')}
                          </span>
                        </td>
                        <td style={tdStyle}>
                          <div className="d-flex gap-1">
                            <button className="btn btn-sm btn-outline-primary"
                              onClick={() => ouvrirEdit(u)}>✏️ Éditer</button>
                            <button className="btn btn-sm btn-outline-danger"
                              onClick={() => supprimer(u._id, u.nom)}>🗑️</button>
                          </div>
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

      {showModal && (
        <div style={overlayStyle} onClick={fermer}>
          <div style={modalStyle} onClick={e => e.stopPropagation()}>
            <div className="d-flex justify-content-between align-items-center mb-4">
              <h5 className="fw-bold mb-0">
                {modeEdit ? '✏️ Modifier' : '➕ Nouvel utilisateur'}
              </h5>
              <button onClick={fermer} style={closeBtnStyle}>✕</button>
            </div>
            {erreur && <div className="alert alert-danger py-2">{erreur}</div>}
            <form onSubmit={soumettre}>
              <div className="row g-3">
                <div className="col-6">
                  <label className="form-label">Nom *</label>
                  <input className="form-control" value={form.nom}
                    onChange={e => set('nom', e.target.value)} required />
                </div>
                <div className="col-6">
                  <label className="form-label">Prénom *</label>
                  <input className="form-control" value={form.prenom}
                    onChange={e => set('prenom', e.target.value)} required />
                </div>
                <div className="col-12">
                  <label className="form-label">Email *</label>
                  <input className="form-control" type="email" value={form.email}
                    onChange={e => set('email', e.target.value)} required={!modeEdit} />
                </div>
                <div className="col-12">
                  <label className="form-label">
                    Mot de passe {modeEdit ? '(laisser vide = inchangé)' : '*'}
                  </label>
                  <input className="form-control" type="password" value={form.password}
                    onChange={e => set('password', e.target.value)}
                    required={!modeEdit} placeholder={modeEdit ? '••••••••' : ''} />
                </div>
                <div className="col-6">
                  <label className="form-label">Rôle</label>
                  <select className="form-select" value={form.role}
                    onChange={e => set('role', e.target.value)}>
                    <option value="employe">Employé</option>
                    <option value="manager">Manager</option>
                    <option value="admin">Admin</option>
                  </select>
                </div>
               <div className="col-6">
  <label className="form-label">Téléphone</label>
  <input className="form-control" value={form.telephone}
    onChange={e => set('telephone', e.target.value)} />
</div>

{/* Département — visible seulement si rôle manager */}
{form.role === 'manager' && (
  <div className="col-12">
    <label className="form-label">🏢 Département assigné</label>
    <select className="form-select" value={form.departement || ''}
      onChange={e => set('departement', e.target.value)}>
      <option value="">-- Sélectionner un département --</option>
      {departements.map(d => (
        <option key={d._id} value={d._id}>{d.nom}</option>
      ))}
    </select>
    <small className="text-muted" style={{ fontSize: 11 }}>
      Ce manager gérera uniquement ce département
    </small>
  </div>
)}
                <div className="col-6">
                  <label className="form-label">Statut</label>
                  <select className="form-select" value={form.actif}
                    onChange={e => set('actif', e.target.value === 'true')}>
                    <option value="true">Actif</option>
                    <option value="false">Inactif</option>
                  </select>
                </div>
              </div>
              <div className="d-flex gap-2 mt-4">
                <button type="submit" className="btn btn-primary flex-fill">
                  {modeEdit ? 'Enregistrer' : 'Créer'}
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

const thStyle = { padding: '12px 16px', fontSize: 12, fontWeight: 600, color: '#888', borderBottom: '1px solid #eee', whiteSpace: 'nowrap' }
const tdStyle = { padding: '12px 16px', verticalAlign: 'middle', borderBottom: '1px solid #f5f5f5' }
const overlayStyle = { position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999 }
const modalStyle = { background: '#fff', borderRadius: 16, padding: '2rem', width: '100%', maxWidth: 540, maxHeight: '90vh', overflowY: 'auto', boxShadow: '0 20px 60px rgba(0,0,0,0.2)' }
const closeBtnStyle = { background: 'transparent', border: 'none', fontSize: 18, cursor: 'pointer', color: '#999' }