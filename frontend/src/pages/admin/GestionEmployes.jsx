import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import Layout from '../../components/Layout'

const API = 'https://fouad1239-gestion-personnel-backend.hf.space/api/employes'

const headers = () => ({
  headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
})

const VIDE = {
  nom: '', prenom: '', email: '',
  poste: '', departement: '', salaire: '',
  telephone: '', statut: 'actif',
  emailUser: ''
}

export default function GestionEmployes() {
  const [employes,     setEmployes]     = useState([])
  const [departements, setDepartements] = useState([])  // ← NOUVEAU
  const [loading,      setLoading]      = useState(true)
  const [erreur,       setErreur]       = useState('')
  const [succes,       setSucces]       = useState('')
  const [showModal,    setShowModal]    = useState(false)
  const [modeEdit,     setModeEdit]     = useState(false)
  const [form,         setForm]         = useState(VIDE)
  const [idEdit,       setIdEdit]       = useState(null)
  const [recherche,    setRecherche]    = useState('')
  const navigate = useNavigate()

  useEffect(() => {
    charger()
    chargerDepts()  // ← NOUVEAU
  }, [])

  const charger = async () => {
    try {
      setLoading(true)
      const res = await axios.get(API, headers())
      setEmployes(res.data)
    } catch (e) {
      if (e.response?.status === 401) navigate('/login')
      else setErreur('Erreur de chargement')
    } finally { setLoading(false) }
  }

  // ← NOUVEAU
  const chargerDepts = async () => {
    try {
      const res = await axios.get(
        'https://fouad1239-gestion-personnel-backend.hf.space/api/departements',
        headers()
      )
      setDepartements(res.data)
    } catch (e) { console.error(e) }
  }

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }))

  const ouvrirAjout = () => {
    setForm(VIDE)
    setModeEdit(false)
    setIdEdit(null)
    setShowModal(true)
  }

  const ouvrirEdit = (emp) => {
    setForm({
      nom: emp.nom, prenom: emp.prenom, email: emp.email,
      poste: emp.poste,
      departement: emp.departement?._id || emp.departement || '',
      salaire: emp.salaire || '', telephone: emp.telephone || '',
      statut: emp.statut || 'actif',
      emailUser: ''
    })
    setIdEdit(emp._id)
    setModeEdit(true)
    setShowModal(true)
  }

  const fermer = () => { setShowModal(false); setErreur('') }

  const soumettre = async (e) => {
    e.preventDefault()
    try {
      if (modeEdit) {
        await axios.put(`${API}/${idEdit}`, form, headers())
        setSucces('Employé modifié avec succès')
      } else {
        await axios.post(API, form, headers())
        setSucces('Employé ajouté avec succès')
      }
      fermer()
      charger()
      setTimeout(() => setSucces(''), 3000)
    } catch (e) {
      setErreur(e.response?.data?.message || 'Erreur')
    }
  }

  const supprimer = async (id, nom) => {
    if (!window.confirm(`Supprimer ${nom} ?`)) return
    try {
      await axios.delete(`${API}/${id}`, headers())
      setSucces('Employé supprimé')
      charger()
      setTimeout(() => setSucces(''), 3000)
    } catch { setErreur('Erreur de suppression') }
  }

  const getNomDept = (dept) => {
    if (!dept) return '—'
    const found = departements.find(d => d._id === dept || d._id === dept?._id)
    return found ? found.nom : '—'
  }

  const filtres = employes.filter(e =>
    e.nom?.toLowerCase().includes(recherche.toLowerCase()) ||
    e.prenom?.toLowerCase().includes(recherche.toLowerCase()) ||
    e.email?.toLowerCase().includes(recherche.toLowerCase()) ||
    e.poste?.toLowerCase().includes(recherche.toLowerCase())
  )

  return (
    <Layout>

      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h4 className="fw-bold mb-0">👥 Gestion des employés</h4>
          <p className="text-muted mb-0" style={{ fontSize: 13 }}>
            {employes.length} employé(s) enregistré(s)
          </p>
        </div>
        <button className="btn btn-primary" onClick={ouvrirAjout}>
          + Ajouter un employé
        </button>
      </div>

      {succes && <div className="alert alert-success py-2">{succes}</div>}
      {erreur && !showModal && <div className="alert alert-danger py-2">{erreur}</div>}

      <div className="mb-3">
        <input
          className="form-control"
          placeholder="🔍 Rechercher par nom, prénom, email, poste..."
          value={recherche}
          onChange={e => setRecherche(e.target.value)}
          style={{ maxWidth: 400 }}
        />
      </div>

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
                  <th style={thStyle}>Nom</th>
                  <th style={thStyle}>Prénom</th>
                  <th style={thStyle}>Email</th>
                  <th style={thStyle}>Poste</th>
                  <th style={thStyle}>Département</th>  {/* ← NOUVEAU */}
                  <th style={thStyle}>Statut</th>
                  <th style={thStyle}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtres.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="text-center py-4 text-muted">
                      Aucun employé trouvé
                    </td>
                  </tr>
                ) : (
                  filtres.map((emp, i) => (
                    <tr key={emp._id}>
                      <td style={tdStyle}>{i + 1}</td>
                      <td style={tdStyle}>
                        <div className="d-flex align-items-center gap-2">
                          <div style={{
                            width: 32, height: 32, borderRadius: '50%',
                            background: `hsl(${i * 47}, 60%, 50%)`,
                            display: 'flex', alignItems: 'center',
                            justifyContent: 'center', color: '#fff',
                            fontSize: 13, fontWeight: 700, flexShrink: 0
                          }}>
                            {emp.nom?.charAt(0).toUpperCase()}
                          </div>
                          <strong>{emp.nom}</strong>
                        </div>
                      </td>
                      <td style={tdStyle}>{emp.prenom}</td>
                      <td style={tdStyle}>{emp.email}</td>
                      <td style={tdStyle}>
                        <span className="badge"
                          style={{ background: '#378ADD22', color: '#378ADD', fontSize: 12 }}>
                          {emp.poste}
                        </span>
                      </td>
                      {/* ← NOUVEAU — affiche le nom du département */}
                      <td style={tdStyle}>
                        <span style={{
                          background: '#1D9E7522', color: '#1D9E75',
                          padding: '2px 10px', borderRadius: 99,
                          fontSize: 12, fontWeight: 500
                        }}>
                          {getNomDept(emp.departement)}
                        </span>
                      </td>
                      <td style={tdStyle}>
                        <span className={`badge ${emp.statut === 'actif' ? 'bg-success' : 'bg-secondary'}`}>
                          {emp.statut || 'actif'}
                        </span>
                      </td>
                      <td style={tdStyle}>
                        <div className="d-flex gap-1">
                          <button
                            className="btn btn-sm btn-outline-primary"
                            onClick={() => ouvrirEdit(emp)}>
                            ✏️ Éditer
                          </button>
                          <button
                            className="btn btn-sm btn-outline-danger"
                            onClick={() => supprimer(emp._id, emp.nom)}>
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

      {showModal && (
        <div style={overlayStyle} onClick={fermer}>
          <div style={modalStyle} onClick={e => e.stopPropagation()}>

            <div className="d-flex justify-content-between align-items-center mb-4">
              <h5 className="fw-bold mb-0">
                {modeEdit ? '✏️ Modifier l\'employé' : '➕ Ajouter un employé'}
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
                    onChange={e => set('email', e.target.value)} required />
                </div>

                <div className="col-6">
                  <label className="form-label">Poste *</label>
                  <input className="form-control" value={form.poste}
                    onChange={e => set('poste', e.target.value)} required />
                </div>

                {/* ← NOUVEAU — select département */}
                <div className="col-6">
                  <label className="form-label">Département</label>
                  <select className="form-select" value={form.departement}
                    onChange={e => set('departement', e.target.value)}>
                    <option value="">-- Choisir un département --</option>
                    {departements.map(d => (
                      <option key={d._id} value={d._id}>
                        {d.nom}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="col-6">
                  <label className="form-label">Salaire (MAD)</label>
                  <input className="form-control" type="number" value={form.salaire}
                    onChange={e => set('salaire', e.target.value)} />
                </div>

                <div className="col-6">
                  <label className="form-label">Téléphone</label>
                  <input className="form-control" value={form.telephone}
                    onChange={e => set('telephone', e.target.value)} />
                </div>

                <div className="col-6">
                  <label className="form-label">Statut</label>
                  <select className="form-select" value={form.statut}
                    onChange={e => set('statut', e.target.value)}>
                    <option value="actif">Actif</option>
                    <option value="inactif">Inactif</option>
                  </select>
                </div>

                <div className="col-6">
                  <label className="form-label">Email compte utilisateur</label>
                  <input className="form-control"
                    placeholder="email@compte.com"
                    value={form.emailUser || ''}
                    onChange={e => set('emailUser', e.target.value)} />
                  <small className="text-muted" style={{ fontSize: 11 }}>
                    Lie cet employé à son compte de connexion
                  </small>
                </div>

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
  maxWidth: 560, maxHeight: '90vh',
  overflowY: 'auto', boxShadow: '0 20px 60px rgba(0,0,0,0.2)'
}
const closeBtnStyle = {
  background: 'transparent', border: 'none',
  fontSize: 18, cursor: 'pointer', color: '#999'
}


// import { useState, useEffect } from 'react'
// import { useNavigate } from 'react-router-dom'
// import axios from 'axios'
// import Layout from '../../components/Layout'

// const API = 'https://fouad1239-gestion-personnel-backend.hf.space/api/employes'

// const headers = () => ({
//   headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
// })

// const VIDE = {
//   nom: '', prenom: '', email: '',
//   poste: '', departement: '', salaire: '',
//   telephone: '', statut: 'actif',
//   emailUser: ''   // ← ajoute juste cette ligne
// }

// export default function GestionEmployes() {
//   const [employes, setEmployes]   = useState([])
//   const [loading, setLoading]     = useState(true)
//   const [erreur, setErreur]       = useState('')
//   const [succes, setSucces]       = useState('')
//   const [showModal, setShowModal] = useState(false)
//   const [modeEdit, setModeEdit]   = useState(false)
//   const [form, setForm]           = useState(VIDE)
//   const [idEdit, setIdEdit]       = useState(null)
//   const [recherche, setRecherche] = useState('')
//   const navigate = useNavigate()

//   useEffect(() => { charger() }, [])

//   const charger = async () => {
//     try {
//       setLoading(true)
//       const res = await axios.get(API, headers())
//       setEmployes(res.data)
//     } catch (e) {
//       if (e.response?.status === 401) navigate('/login')
//       else setErreur('Erreur de chargement')
//     } finally { setLoading(false) }
//   }

//   const set = (k, v) => setForm(f => ({ ...f, [k]: v }))

//   const ouvrirAjout = () => {
//     setForm(VIDE)
//     setModeEdit(false)
//     setIdEdit(null)
//     setShowModal(true)
//   }

//   const ouvrirEdit = (emp) => {
//     setForm({
//       nom: emp.nom, prenom: emp.prenom, email: emp.email,
//       poste: emp.poste, departement: emp.departement || '',
//       salaire: emp.salaire || '', telephone: emp.telephone || '',
//       statut: emp.statut || 'actif',
//       emailUser: ''   // ← ajoute cette ligne
//     })
//     setIdEdit(emp._id)
//     setModeEdit(true)
//     setShowModal(true)
//   }

//   const fermer = () => { setShowModal(false); setErreur('') }

//   const soumettre = async (e) => {
//     e.preventDefault()
//     try {
//       if (modeEdit) {
//         await axios.put(`${API}/${idEdit}`, form, headers())
//         setSucces('Employé modifié avec succès')
//       } else {
//         await axios.post(API, form, headers())
//         setSucces('Employé ajouté avec succès')
//       }
//       fermer()
//       charger()
//       setTimeout(() => setSucces(''), 3000)
//     } catch (e) {
//       setErreur(e.response?.data?.message || 'Erreur')
//     }
//   }

//   const supprimer = async (id, nom) => {
//     if (!window.confirm(`Supprimer ${nom} ?`)) return
//     try {
//       await axios.delete(`${API}/${id}`, headers())
//       setSucces('Employé supprimé')
//       charger()
//       setTimeout(() => setSucces(''), 3000)
//     } catch { setErreur('Erreur de suppression') }
//   }

//   const filtres = employes.filter(e =>
//     e.nom?.toLowerCase().includes(recherche.toLowerCase()) ||
//     e.prenom?.toLowerCase().includes(recherche.toLowerCase()) ||
//     e.email?.toLowerCase().includes(recherche.toLowerCase()) ||
//     e.poste?.toLowerCase().includes(recherche.toLowerCase())
//   )

//   return (
//     <Layout>

//       {/* EN-TÊTE */}
//       <div className="d-flex justify-content-between align-items-center mb-4">
//         <div>
//           <h4 className="fw-bold mb-0">👥 Gestion des employés</h4>
//           <p className="text-muted mb-0" style={{ fontSize: 13 }}>
//             {employes.length} employé(s) enregistré(s)
//           </p>
//         </div>
//         <button className="btn btn-primary" onClick={ouvrirAjout}>
//           + Ajouter un employé
//         </button>
//       </div>

//       {/* MESSAGES */}
//       {succes && <div className="alert alert-success py-2">{succes}</div>}
//       {erreur && !showModal && <div className="alert alert-danger py-2">{erreur}</div>}

//       {/* BARRE DE RECHERCHE */}
//       <div className="mb-3">
//         <input
//           className="form-control"
//           placeholder="🔍 Rechercher par nom, prénom, email, poste..."
//           value={recherche}
//           onChange={e => setRecherche(e.target.value)}
//           style={{ maxWidth: 400 }}
//         />
//       </div>

//       {/* TABLEAU */}
//       <div className="card border-0 shadow-sm" style={{ borderRadius: 14 }}>
//         {loading ? (
//           <div className="text-center py-5">
//             <div className="spinner-border text-primary" />
//           </div>
//         ) : (
//           <div className="table-responsive">
//             <table className="table table-hover mb-0" style={{ fontSize: 16 }}>
//               <thead style={{ background: '#f8f9fa' }}>
//                 <tr>
//                   <th style={thStyle}>#</th>
//                   <th style={thStyle}>Nom</th>
//                   <th style={thStyle}>Prénom</th>
//                   <th style={thStyle}>Email</th>
//                   <th style={thStyle}>Poste</th>
//                   <th style={thStyle}>Statut</th>
//                   <th style={thStyle}>Actions</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {filtres.length === 0 ? (
//                   <tr>
//                     <td colSpan={7} className="text-center py-4 text-muted">
//                       Aucun employé trouvé
//                     </td>
//                   </tr>
//                 ) : (
//                   filtres.map((emp, i) => (
//                     <tr key={emp._id}>
//                       <td style={tdStyle}>{i + 1}</td>
//                       <td style={tdStyle}>
//                         <div className="d-flex align-items-center gap-2">
//                           <div style={{
//                             width: 32, height: 32, borderRadius: '50%',
//                             background: `hsl(${i * 47}, 60%, 50%)`,
//                             display: 'flex', alignItems: 'center',
//                             justifyContent: 'center', color: '#fff',
//                             fontSize: 13, fontWeight: 700, flexShrink: 0
//                           }}>
//                             {emp.nom?.charAt(0).toUpperCase()}
//                           </div>
//                           <strong>{emp.nom}</strong>
//                         </div>
//                       </td>
//                       <td style={tdStyle}>{emp.prenom}</td>
//                       <td style={tdStyle}>{emp.email}</td>
//                       <td style={tdStyle}>
//                         <span className="badge"
//                           style={{ background: '#378ADD22', color: '#378ADD', fontSize: 12 }}>
//                           {emp.poste}
//                         </span>
//                       </td>
//                       <td style={tdStyle}>
//                         <span className={`badge ${emp.statut === 'actif' ? 'bg-success' : 'bg-secondary'}`}>
//                           {emp.statut || 'actif'}
//                         </span>
//                       </td>
//                       <td style={tdStyle}>
//                         <div className="d-flex gap-1">
//                           <button
//                             className="btn btn-sm btn-outline-primary"
//                             onClick={() => ouvrirEdit(emp)}
//                           >
//                             ✏️ Éditer
//                           </button>
//                           <button
//                             className="btn btn-sm btn-outline-danger"
//                             onClick={() => supprimer(emp._id, emp.nom)}
//                           >
//                             🗑️ Supprimer
//                           </button>
//                         </div>
//                       </td>
//                     </tr>
//                   ))
//                 )}
//               </tbody>
//             </table>
//           </div>
//         )}
//       </div>

//       {/* MODAL AJOUT / ÉDITION */}
//       {showModal && (
//         <div style={overlayStyle} onClick={fermer}>
//           <div style={modalStyle} onClick={e => e.stopPropagation()}>

//             <div className="d-flex justify-content-between align-items-center mb-4">
//               <h5 className="fw-bold mb-0">
//                 {modeEdit ? '✏️ Modifier l\'employé' : '➕ Ajouter un employé'}
//               </h5>
//               <button onClick={fermer} style={closeBtnStyle}>✕</button>
//             </div>

//             {erreur && <div className="alert alert-danger py-2">{erreur}</div>}

//             <form onSubmit={soumettre}>
//               <div className="row g-3">

//                 <div className="col-6">
//                   <label className="form-label">Nom *</label>
//                   <input className="form-control" value={form.nom}
//                     onChange={e => set('nom', e.target.value)} required />
//                 </div>

//                 <div className="col-6">
//                   <label className="form-label">Prénom *</label>
//                   <input className="form-control" value={form.prenom}
//                     onChange={e => set('prenom', e.target.value)} required />
//                 </div>

//                 <div className="col-12">
//                   <label className="form-label">Email *</label>
//                   <input className="form-control" type="email" value={form.email}
//                     onChange={e => set('email', e.target.value)} required />
//                 </div>

//                 <div className="col-6">
//                   <label className="form-label">Poste *</label>
//                   <input className="form-control" value={form.poste}
//                     onChange={e => set('poste', e.target.value)} required />
//                 </div>

//                 <div className="col-6">
//                   <label className="form-label">Département</label>
//                   <input className="form-control" value={form.departement}
//                     onChange={e => set('departement', e.target.value)} />
//                 </div>

//                 <div className="col-6">
//                   <label className="form-label">Salaire (MAD)</label>
//                   <input className="form-control" type="number" value={form.salaire}
//                     onChange={e => set('salaire', e.target.value)} />
//                 </div>

//                 <div className="col-6">
//                   <label className="form-label">Téléphone</label>
//                   <input className="form-control" value={form.telephone}
//                     onChange={e => set('telephone', e.target.value)} />
//                 </div>

//                 <div className="col-6">
//                   <label className="form-label">Statut</label>
//                   <select className="form-select" value={form.statut}
//                     onChange={e => set('statut', e.target.value)}>
//                     <option value="actif">Actif</option>
//                     <option value="inactif">Inactif</option>
//                   </select>
//                 </div>
//                   {/* ← AJOUTE CE BLOC ICI */}
//                 <div className="col-6">
//                   <label className="form-label">Email du compte utilisateur</label>
//                   <input className="form-control"
//                     placeholder="email@compte.com"
//                     value={form.emailUser || ''}
//                     onChange={e => set('emailUser', e.target.value)} />
//                   <small className="text-muted" style={{ fontSize: 11 }}>
//                     Lie cet employé à son compte de connexion
//                   </small>
//                 </div>

//               </div>

//               <div className="d-flex gap-2 mt-4">
//                 <button type="submit" className="btn btn-primary flex-fill">
//                   {modeEdit ? 'Enregistrer' : 'Ajouter'}
//                 </button>
//                 <button type="button" className="btn btn-light flex-fill"
//                   onClick={fermer}>
//                   Annuler
//                 </button>
//               </div>
//             </form>

//           </div>
//         </div>
//       )}

//     </Layout>
//   )
// }

// const thStyle = {
//   padding: '12px 16px', fontSize: 12,
//   fontWeight: 600, color: '#888',
//   borderBottom: '1px solid #eee',
//   whiteSpace: 'nowrap'
// }

// const tdStyle = {
//   padding: '12px 16px',
//   verticalAlign: 'middle',
//   borderBottom: '1px solid #f5f5f5'
// }

// const overlayStyle = {
//   position: 'fixed', inset: 0,
//   background: 'rgba(0,0,0,0.4)',
//   display: 'flex', alignItems: 'center',
//   justifyContent: 'center', zIndex: 9999
// }

// const modalStyle = {
//   background: '#fff', borderRadius: 16,
//   padding: '2rem', width: '100%',
//   maxWidth: 560, maxHeight: '90vh',
//   overflowY: 'auto', boxShadow: '0 20px 60px rgba(0,0,0,0.2)'
// }

// const closeBtnStyle = {
//   background: 'transparent', border: 'none',
//   fontSize: 18, cursor: 'pointer', color: '#999'
// }
