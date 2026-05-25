import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import Layout from '../../components/Layout'

const API = 'https://fouad1239-gestion-personnel-backend.hf.space/api/conges'

const headers = () => ({
  headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
})

const STATUTS = {
  en_attente: { label: 'En attente', color: '#EF9F27', bg: '#FAEEDA' },
  approuve:   { label: 'Approuvé',   color: '#1D9E75', bg: '#E1F5EE' },
  refuse:     { label: 'Refusé',     color: '#E24B4A', bg: '#FCEBEB' },
}

export default function ValidationConges() {
  const [conges, setConges]           = useState([])
  const [loading, setLoading]         = useState(true)
  const [erreur, setErreur]           = useState('')
  const [succes, setSucces]           = useState('')
  const [showModal, setShowModal]     = useState(false)
  const [congeSelec, setCongeSelec]   = useState(null)
  const [decision, setDecision]       = useState('')
  const [commentaire, setCommentaire] = useState('')
  const [filtre, setFiltre]           = useState('en_attente')
  const navigate = useNavigate()

  useEffect(() => { charger() }, [])

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

  const ouvrirDecision = (conge, choix) => {
    setCongeSelec(conge)
    setDecision(choix)
    setCommentaire('')
    setShowModal(true)
  }

  const fermer = () => { setShowModal(false); setCongeSelec(null) }

  const valider = async () => {
    try {
      await axios.put(
        `${API}/${congeSelec._id}/statut`,
        { statut: decision, commentaire },
        headers()
      )
      setSucces(decision === 'approuve' ? '✅ Congé approuvé' : '❌ Congé refusé')
      fermer()
      charger()
      setTimeout(() => setSucces(''), 3000)
    } catch { setErreur('Erreur lors de la décision') }
  }

  const nbJours = (d1, d2) => {
    const diff = new Date(d2) - new Date(d1)
    return Math.ceil(diff / (1000 * 60 * 60 * 24)) + 1
  }

  const filtrés = conges.filter(c =>
    filtre === 'tous' ? true : c.statut === filtre
  )

  return (
    <Layout>

      {/* EN-TÊTE */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h4 className="fw-bold mb-0">📋 Validation des congés</h4>
          <p className="text-muted mb-0" style={{ fontSize: 13 }}>
            {conges.filter(c => c.statut === 'en_attente').length} demande(s) en attente
          </p>
        </div>
      </div>

      {/* MESSAGES */}
      {succes && <div className="alert alert-success py-2">{succes}</div>}
      {erreur && <div className="alert alert-danger py-2">{erreur}</div>}

      {/* STATS RESPONSIVE */}
      <div className="row g-3 mb-4">
        {[
          { label: 'En attente', val: conges.filter(c => c.statut === 'en_attente').length, color: '#EF9F27', icon: '⏳' },
          { label: 'Approuvés',  val: conges.filter(c => c.statut === 'approuve').length,   color: '#1D9E75', icon: '✅' },
          { label: 'Refusés',    val: conges.filter(c => c.statut === 'refuse').length,     color: '#E24B4A', icon: '❌' },
          { label: 'Total',      val: conges.length,                                         color: '#378ADD', icon: '📋' },
        ].map((s, i) => (
          <div key={i} className="col-12 col-sm-6 col-md-3">
            <div className="card border-0 shadow-sm" style={{ borderRadius: 12 }}>
              <div className="card-body p-3 d-flex align-items-center gap-3">
                <span style={{ fontSize: 28, flexShrink: 0 }}>{s.icon}</span>
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
          { val: 'en_attente', label: '⏳ En attente' },
          { val: 'approuve',   label: '✅ Approuvés' },
          { val: 'refuse',     label: '❌ Refusés' },
          { val: 'tous',       label: 'Tous' },
        ].map(f => (
          <button key={f.val}
            onClick={() => setFiltre(f.val)}
            className={`btn btn-sm ${filtre === f.val ? 'btn-primary' : 'btn-outline-secondary'}`}>
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
                  <th style={thStyle}>Période</th>
                  <th style={thStyle}>Durée</th>
                  <th style={thStyle}>Statut</th>
                  <th style={thStyle}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtrés.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="text-center py-5 text-muted">
                      <div style={{ fontSize: 40 }}>📭</div>
                      <p className="mt-2">Aucune demande {filtre !== 'tous' ? 'dans cette catégorie' : ''}</p>
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
                              width: 34, height: 34, borderRadius: '50%',
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
                          <span style={{ fontSize: 13 }}>
                            Du {new Date(c.dateDebut).toLocaleDateString('fr-FR')}
                            <br />
                            Au {new Date(c.dateFin).toLocaleDateString('fr-FR')}
                          </span>
                        </td>
                        <td style={tdStyle}>
                          <span className="badge bg-light text-dark border px-2 py-1">
                            {nbJours(c.dateDebut, c.dateFin)} jours
                          </span>
                        </td>
                        <td style={tdStyle}>
                          <span style={{
                            background: st.bg, color: st.color,
                            padding: '4px 12px', borderRadius: 99,
                            fontSize: 12, fontWeight: 600
                          }}>
                            {st.label}
                          </span>
                        </td>
                        <td style={tdStyle}>
                          {c.statut === 'en_attente' ? (
                            <div className="d-flex gap-1">
                              <button className="btn btn-sm btn-success px-2 py-1"
                                onClick={() => ouvrirDecision(c, 'approuve')}>
                                ✓ Approuver
                              </button>
                              <button className="btn btn-sm btn-danger px-2 py-1"
                                onClick={() => ouvrirDecision(c, 'refuse')}>
                                ✕ Refuser
                              </button>
                            </div>
                          ) : (
                            <span className="text-muted" style={{ fontSize: 12 }}>
                              {c.commentaire || 'Aucun commentaire'}
                            </span>
                          )}
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

      {/* MODAL DECISION */}
      {showModal && (
        <div style={overlayStyle} onClick={fermer}>
          <div style={modalStyle} onClick={e => e.stopPropagation()}>
            <h5 className="fw-bold mb-3">
              {decision === 'approuve' ? '✅ Approuver la demande' : '❌ Refuser la demande'}
            </h5>
            <p className="text-muted mb-3" style={{ fontSize: 13 }}>
              Employé : <strong>{congeSelec?.employe?.nom} {congeSelec?.employe?.prenom}</strong>
            </p>

            <div className="mb-3">
              <label className="form-label style={{ fontSize: 13 }}">Commentaire (optionnel)</label>
              <textarea className="form-control" rows={3}
                value={commentaire} onChange={e => setCommentaire(e.target.value)}
                placeholder="Ex: Bonnes vacances ! ou Solde insuffisant..." />
            </div>

            <div className="d-flex gap-2">
              <button className={`btn flex-fill ${decision === 'approuve' ? 'btn-success' : 'btn-danger'}`}
                onClick={valider}>
                Confirmer
              </button>
              <button className="btn btn-light flex-fill" onClick={fermer}>
                Annuler
              </button>
            </div>
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
  justifyContent: 'center', zIndex: 9999
}
const modalStyle = {
  background: '#fff', borderRadius: 16,
  padding: '2rem', width: '100%',
  maxWidth: 450, boxShadow: '0 20px 60px rgba(0,0,0,0.2)'
}
// import { useState, useEffect } from 'react'
// import { useNavigate } from 'react-router-dom'
// import axios from 'axios'
// import Layout from '../../components/Layout'

// const API = 'https://fouad1239-gestion-personnel-backend.hf.space/api/conges'

// const headers = () => ({
//   headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
// })

// const STATUTS = {
//   en_attente: { label: 'En attente', color: '#EF9F27', bg: '#FAEEDA' },
//   approuve:   { label: 'Approuvé',   color: '#1D9E75', bg: '#E1F5EE' },
//   refuse:     { label: 'Refusé',     color: '#E24B4A', bg: '#FCEBEB' },
// }

// export default function ValidationConges() {
//   const [conges, setConges]           = useState([])
//   const [loading, setLoading]         = useState(true)
//   const [erreur, setErreur]           = useState('')
//   const [succes, setSucces]           = useState('')
//   const [showModal, setShowModal]     = useState(false)
//   const [congeSelec, setCongeSelec]   = useState(null)
//   const [decision, setDecision]       = useState('')
//   const [commentaire, setCommentaire] = useState('')
//   const [filtre, setFiltre]           = useState('en_attente')
//   const navigate = useNavigate()

//   useEffect(() => { charger() }, [])

//   const charger = async () => {
//     try {
//       setLoading(true)
//       const res = await axios.get(API, headers())
//       setConges(res.data)
//     } catch (e) {
//       if (e.response?.status === 401) navigate('/login')
//       else setErreur('Erreur de chargement')
//     } finally { setLoading(false) }
//   }

//   const ouvrirDecision = (conge, choix) => {
//     setCongeSelec(conge)
//     setDecision(choix)
//     setCommentaire('')
//     setShowModal(true)
//   }

//   const fermer = () => { setShowModal(false); setCongeSelec(null) }

//   const valider = async () => {
//     try {
//       await axios.put(
//         `${API}/${congeSelec._id}/statut`,
//         { statut: decision, commentaire },
//         headers()
//       )
//       setSucces(decision === 'approuve' ? '✅ Congé approuvé' : '❌ Congé refusé')
//       fermer()
//       charger()
//       setTimeout(() => setSucces(''), 3000)
//     } catch { setErreur('Erreur lors de la décision') }
//   }

//   const nbJours = (d1, d2) => {
//     const diff = new Date(d2) - new Date(d1)
//     return Math.ceil(diff / (1000 * 60 * 60 * 24)) + 1
//   }

//   const filtrés = conges.filter(c =>
//     filtre === 'tous' ? true : c.statut === filtre
//   )

//   return (
//     <Layout>

//       {/* EN-TÊTE */}
//       <div className="d-flex justify-content-between align-items-center mb-4">
//         <div>
//           <h4 className="fw-bold mb-0">📋 Validation des congés</h4>
//           <p className="text-muted mb-0" style={{ fontSize: 13 }}>
//             {conges.filter(c => c.statut === 'en_attente').length} demande(s) en attente
//           </p>
//         </div>
//       </div>

//       {/* MESSAGES */}
//       {succes && <div className="alert alert-success py-2">{succes}</div>}
//       {erreur && <div className="alert alert-danger py-2">{erreur}</div>}

//       {/* STATS */}
//       <div className="row g-3 mb-4">
//         {[
//           { label: 'En attente', val: conges.filter(c => c.statut === 'en_attente').length, color: '#EF9F27', icon: '⏳' },
//           { label: 'Approuvés',  val: conges.filter(c => c.statut === 'approuve').length,   color: '#1D9E75', icon: '✅' },
//           { label: 'Refusés',    val: conges.filter(c => c.statut === 'refuse').length,     color: '#E24B4A', icon: '❌' },
//           { label: 'Total',      val: conges.length,                                        color: '#378ADD', icon: '📋' },
//         ].map((s, i) => (
//           <div key={i} className="col-3">
//             <div className="card border-0 shadow-sm" style={{ borderRadius: 12 }}>
//               <div className="card-body p-3 d-flex align-items-center gap-3">
//                 <span style={{ fontSize: 28 }}>{s.icon}</span>
//                 <div>
//                   <p className="text-muted mb-0" style={{ fontSize: 12 }}>{s.label}</p>
//                   <h5 className="fw-bold mb-0" style={{ color: s.color }}>{s.val}</h5>
//                 </div>
//               </div>
//             </div>
//           </div>
//         ))}
//       </div>

//       {/* FILTRES */}
//       <div className="d-flex gap-2 mb-3">
//         {[
//           { val: 'en_attente', label: '⏳ En attente' },
//           { val: 'approuve',   label: '✅ Approuvés' },
//           { val: 'refuse',     label: '❌ Refusés' },
//           { val: 'tous',       label: 'Tous' },
//         ].map(f => (
//           <button key={f.val}
//             onClick={() => setFiltre(f.val)}
//             className={`btn btn-sm ${filtre === f.val ? 'btn-primary' : 'btn-outline-secondary'}`}>
//             {f.label}
//           </button>
//         ))}
//       </div>

//       {/* TABLEAU */}
//       <div className="card border-0 shadow-sm" style={{ borderRadius: 14 }}>
//         {loading ? (
//           <div className="text-center py-5">
//             <div className="spinner-border text-primary" />
//           </div>
//         ) : (
//           <div className="table-responsive">
//             <table className="table table-hover mb-0" style={{ fontSize: 14 }}>
//               <thead style={{ background: '#f8f9fa' }}>
//                 <tr>
//                   <th style={thStyle}>#</th>
//                   <th style={thStyle}>Employé</th>
//                   <th style={thStyle}>Motif</th>
//                   <th style={thStyle}>Période</th>
//                   <th style={thStyle}>Durée</th>
//                   <th style={thStyle}>Statut</th>
//                   <th style={thStyle}>Actions</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {filtrés.length === 0 ? (
//                   <tr>
//                     <td colSpan={7} className="text-center py-5 text-muted">
//                       <div style={{ fontSize: 40 }}>📭</div>
//                       <p className="mt-2">Aucune demande {filtre !== 'tous' ? 'dans cette catégorie' : ''}</p>
//                     </td>
//                   </tr>
//                 ) : (
//                   filtrés.map((c, i) => {
//                     const st = STATUTS[c.statut] || STATUTS['en_attente']
//                     return (
//                       <tr key={c._id}>
//                         <td style={tdStyle}>{i + 1}</td>
//                         <td style={tdStyle}>
//                           <div className="d-flex align-items-center gap-2">
//                             <div style={{
//                               width: 34, height: 34, borderRadius: '50%',
//                               background: `hsl(${i * 60}, 60%, 50%)`,
//                               display: 'flex', alignItems: 'center',
//                               justifyContent: 'center', color: '#fff',
//                               fontSize: 13, fontWeight: 700
//                             }}>
//                               {c.employe?.nom?.charAt(0).toUpperCase() || '?'}
//                             </div>
//                             <div>
//                               <p className="mb-0 fw-semibold" style={{ fontSize: 13 }}>
//                                 {c.employe?.nom} {c.employe?.prenom}
//                               </p>
//                               <small className="text-muted">{c.employe?.poste}</small>
//                             </div>
//                           </div>
//                         </td>
//                         <td style={tdStyle}>{c.motif}</td>
//                         <td style={tdStyle} style={{ fontSize: 12 }}>
//                           {new Date(c.dateDebut).toLocaleDateString('fr-FR')}
//                           {' → '}
//                           {new Date(c.dateFin).toLocaleDateString('fr-FR')}
//                         </td>
//                         <td style={tdStyle}>
//                           <span style={{
//                             background: '#f0f0f0', padding: '2px 10px',
//                             borderRadius: 99, fontSize: 12, fontWeight: 600
//                           }}>
//                             {nbJours(c.dateDebut, c.dateFin)}j
//                           </span>
//                         </td>
//                         <td style={tdStyle}>
//                           <span style={{
//                             background: st.bg, color: st.color,
//                             padding: '3px 12px', borderRadius: 99,
//                             fontSize: 12, fontWeight: 600
//                           }}>
//                             {st.label}
//                           </span>
//                         </td>
//                         <td style={tdStyle}>
//                           {c.statut === 'en_attente' ? (
//                             <div className="d-flex gap-1">
//                               <button
//                                 className="btn btn-sm btn-success"
//                                 onClick={() => ouvrirDecision(c, 'approuve')}
//                               >
//                                 ✅ Approuver
//                               </button>
//                               <button
//                                 className="btn btn-sm btn-danger"
//                                 onClick={() => ouvrirDecision(c, 'refuse')}
//                               >
//                                 ❌ Refuser
//                               </button>
//                             </div>
//                           ) : (
//                             <span style={{ fontSize: 12, color: '#999' }}>
//                               {c.commentaire || 'Traité'}
//                             </span>
//                           )}
//                         </td>
//                       </tr>
//                     )
//                   })
//                 )}
//               </tbody>
//             </table>
//           </div>
//         )}
//       </div>

//       {/* MODAL DÉCISION */}
//       {showModal && congeSelec && (
//         <div style={overlayStyle} onClick={fermer}>
//           <div style={modalStyle} onClick={e => e.stopPropagation()}>

//             <div className="d-flex justify-content-between align-items-center mb-3">
//               <h5 className="fw-bold mb-0">
//                 {decision === 'approuve' ? '✅ Approuver' : '❌ Refuser'} le congé
//               </h5>
//               <button onClick={fermer} style={closeBtnStyle}>✕</button>
//             </div>

//             {/* Résumé du congé */}
//             <div style={{
//               background: '#f8f9fa', borderRadius: 10,
//               padding: '12px 16px', marginBottom: 16
//             }}>
//               <p className="fw-semibold mb-1">
//                 {congeSelec.employe?.nom} {congeSelec.employe?.prenom}
//               </p>
//               <p className="text-muted mb-1" style={{ fontSize: 13 }}>
//                 {congeSelec.motif}
//               </p>
//               <p className="mb-0" style={{ fontSize: 12, color: '#999' }}>
//                 {new Date(congeSelec.dateDebut).toLocaleDateString('fr-FR')}
//                 {' → '}
//                 {new Date(congeSelec.dateFin).toLocaleDateString('fr-FR')}
//                 {' — '}
//                 <strong>{nbJours(congeSelec.dateDebut, congeSelec.dateFin)} jour(s)</strong>
//               </p>
//             </div>

//             <div className="mb-3">
//               <label className="form-label">
//                 Commentaire {decision === 'refuse' ? '(obligatoire)' : '(optionnel)'}
//               </label>
//               <textarea
//                 className="form-control"
//                 rows={3}
//                 value={commentaire}
//                 onChange={e => setCommentaire(e.target.value)}
//                 placeholder={
//                   decision === 'approuve'
//                     ? 'Bon congé !'
//                     : 'Raison du refus...'
//                 }
//                 required={decision === 'refuse'}
//               />
//             </div>

//             <div className="d-flex gap-2">
//               <button
//                 className={`btn flex-fill ${decision === 'approuve' ? 'btn-success' : 'btn-danger'}`}
//                 onClick={valider}
//                 disabled={decision === 'refuse' && !commentaire.trim()}
//               >
//                 Confirmer
//               </button>
//               <button className="btn btn-light flex-fill" onClick={fermer}>
//                 Annuler
//               </button>
//             </div>

//           </div>
//         </div>
//       )}

//     </Layout>
//   )
// }

// const thStyle = {
//   padding: '12px 16px', fontSize: 12,
//   fontWeight: 600, color: '#888',
//   borderBottom: '1px solid #eee', whiteSpace: 'nowrap'
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
//   maxWidth: 480, maxHeight: '90vh',
//   overflowY: 'auto',
//   boxShadow: '0 20px 60px rgba(0,0,0,0.2)'
// }
// const closeBtnStyle = {
//   background: 'transparent', border: 'none',
//   fontSize: 18, cursor: 'pointer', color: '#999'
// }
