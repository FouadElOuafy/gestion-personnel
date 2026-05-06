import { useState, useEffect } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import Layout from '../components/Layout'

const headers = () => ({
  headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
})

function Employes() {
  const [employes, setEmployes] = useState([])
  const [erreur,   setErreur]   = useState('')
  const [loading,  setLoading]  = useState(true)
  const [recherche, setRecherche] = useState('')
  const navigate = useNavigate()
  const role = localStorage.getItem('role')

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (!token) navigate('/login')
    else chargerEmployes()
  }, [])

  const chargerEmployes = async () => {
    try {
      setLoading(true)
      const res = await axios.get('http://localhost:3000/api/employes', headers())
      setEmployes(res.data)
    } catch (e) {
      if (e.response?.status === 401) { localStorage.clear(); navigate('/login') }
      else setErreur('Erreur de chargement')
    } finally { setLoading(false) }
  }

  const filtres = employes.filter(e =>
    e.nom?.toLowerCase().includes(recherche.toLowerCase()) ||
    e.poste?.toLowerCase().includes(recherche.toLowerCase())
  )

  return (
    <Layout>

      {/* HEADER */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h4 className="fw-bold mb-0">
            {role === 'manager' ? '👥 Mon équipe' : '👷 Employés'}
          </h4>
          <p className="text-muted mb-0" style={{ fontSize: 13 }}>
            {employes.length} employé(s)
            {role === 'manager' ? ' dans votre département' : ' au total'}
          </p>
        </div>
        <button className="btn btn-outline-secondary btn-sm" onClick={chargerEmployes}>
          🔄 Rafraîchir
        </button>
      </div>

      {erreur && <div className="alert alert-danger">{erreur}</div>}

      {/* RECHERCHE */}
      <div className="mb-4">
        <input className="form-control"
          placeholder="🔍 Rechercher par nom ou poste..."
          value={recherche}
          onChange={e => setRecherche(e.target.value)}
          style={{ maxWidth: 380 }} />
      </div>

      {loading && (
        <div className="text-center py-5">
          <div className="spinner-border text-primary" />
          <p className="mt-3 text-muted">Chargement...</p>
        </div>
      )}

      {!loading && filtres.length === 0 && !erreur && (
        <div className="text-center py-5">
          <div style={{ fontSize: 60 }}>📭</div>
          <h5 className="mt-3 text-muted">Aucun employé trouvé</h5>
        </div>
      )}

      {!loading && filtres.length > 0 && (
        <div className="row g-3">
          {filtres.map((emp, index) => (
            <div key={emp._id} className="col-md-4 col-sm-6">
              <div className="card border-0 shadow-sm h-100"
                style={{ borderRadius: 14, transition: '0.2s', cursor: 'pointer' }}
                onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-3px)'}
                onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}
              >
                <div className="card-body p-4">
                  <div className="d-flex align-items-center mb-3">
                    <div style={{
                      width: 50, height: 50, borderRadius: '50%',
                      background: `hsl(${index * 60}, 60%, 50%)`,
                      display: 'flex', alignItems: 'center',
                      justifyContent: 'center', fontSize: 20,
                      color: '#fff', fontWeight: 700, flexShrink: 0
                    }}>
                      {emp.nom?.charAt(0).toUpperCase()}
                    </div>
                    <div className="ms-3">
                      <h6 className="mb-0 fw-bold">{emp.nom} {emp.prenom}</h6>
                      <span className="badge mt-1"
                        style={{ background: '#378ADD22', color: '#378ADD', fontSize: 11 }}>
                        {emp.poste}
                      </span>
                    </div>
                  </div>

                  {/* Infos supplémentaires */}
                  <div style={{ fontSize: 12, color: '#888' }}>
                    {emp.email && <p className="mb-1">📧 {emp.email}</p>}
                    {emp.telephone && <p className="mb-1">📞 {emp.telephone}</p>}
                    {emp.departement && <p className="mb-1">🏢 {emp.departement}</p>}
                    {emp.salaire > 0 && (
                      <p className="mb-0">
                        💰 <strong style={{ color: '#EF9F27' }}>{emp.salaire} MAD</strong>
                      </p>
                    )}
                  </div>

                  <span className={`badge mt-2 ${emp.statut === 'actif' ? 'bg-success' : 'bg-secondary'}`}
                    style={{ fontSize: 10 }}>
                    {emp.statut || 'actif'}
                  </span>

                  {/* Modifier — manager seulement */}
                  {role === 'manager' && (
                    <div className="mt-3">
                      <button
                        className="btn btn-outline-primary btn-sm w-100"
                        onClick={() => navigate(`/manager/employe/${emp._id}`)}
                      >
                        ✏️ Modifier
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

    </Layout>
  )
}

export default Employes

// import { useState, useEffect } from 'react'
// import axios from 'axios'
// import { useNavigate } from 'react-router-dom'
// import Layout from '../components/Layout'

// function Employes() {
//   const [employes, setEmployes] = useState([])
//   const [erreur,   setErreur]   = useState('')
//   const [loading,  setLoading]  = useState(true)
//   const navigate = useNavigate()

//   useEffect(() => {
//     const token = localStorage.getItem('token')
//     if (!token) {
//       navigate('/login')
//     } else {
//       chargerEmployes()
//     }
//   }, [])

//   const chargerEmployes = async () => {
//     try {
//       const token = localStorage.getItem('token')
//       const res = await axios.get('http://localhost:3000/api/employes', {
//         headers: { Authorization: `Bearer ${token}` }
//       })
//       setEmployes(res.data)
//     } catch (e) {
//       if (e.response?.status === 401) {
//         localStorage.clear()
//         navigate('/login')
//       } else {
//         setErreur('Erreur de chargement')
//       }
//     } finally {
//       setLoading(false)
//     }
//   }

//   return (
//     <Layout>

//       {/* HEADER */}
//       <div className="d-flex justify-content-between align-items-center mb-4">
//         <div>
//           <h3 className="fw-bold mb-0">Employés</h3>
//           <p className="text-muted mb-0">{employes.length} employé(s) trouvé(s)</p>
//         </div>
//         <button className="btn btn-primary" onClick={chargerEmployes}>
//           🔄 Rafraîchir
//         </button>
//       </div>

//       {/* ERREUR */}
//       {erreur && <div className="alert alert-danger">{erreur}</div>}

//       {/* LOADING */}
//       {loading && (
//         <div className="text-center py-5">
//           <div className="spinner-border text-primary" />
//           <p className="mt-3 text-muted">Chargement...</p>
//         </div>
//       )}

//       {/* LISTE VIDE */}
//       {!loading && employes.length === 0 && !erreur && (
//         <div className="text-center py-5">
//           <div style={{ fontSize: 60 }}>📭</div>
//           <h5 className="mt-3 text-muted">Aucun employé trouvé</h5>
//         </div>
//       )}

//       {/* CARDS */}
//       {!loading && employes.length > 0 && (
//         <div className="row g-4">
//           {employes.map((emp, index) => (
//             <div key={emp._id} className="col-md-4 col-sm-6">
//               <div className="card border-0 shadow-sm h-100"
//                 style={{ borderRadius: 16, transition: '0.2s', cursor: 'pointer' }}
//                 onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-4px)'}
//                 onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}
//               >
//                 <div className="card-body p-4">
//                   <div className="d-flex align-items-center mb-3">
//                     <div style={{
//                       width: 52, height: 52, borderRadius: '50%',
//                       background: `hsl(${index * 60}, 60%, 50%)`,
//                       display: 'flex', alignItems: 'center',
//                       justifyContent: 'center', fontSize: 22,
//                       color: '#fff', fontWeight: 700, flexShrink: 0
//                     }}>
//                       {emp.nom?.charAt(0).toUpperCase()}
//                     </div>
//                     <div className="ms-3">
//                       <h5 className="mb-0 fw-bold">{emp.nom}</h5>
//                       <span className="badge bg-primary bg-opacity-10 text-primary mt-1">
//                         {emp.poste}
//                       </span>
//                     </div>
//                   </div>
//                   <p className="text-muted mb-0" style={{ fontSize: 11 }}>
//                     ID: {emp._id}
//                   </p>
//                 </div>
//               </div>
//             </div>
//           ))}
//         </div>
//       )}

//     </Layout>
//   )
// }

// export default Employes