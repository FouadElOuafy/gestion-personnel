import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import Layout from '../components/Layout'

const API = 'https://fouad1239-gestion-personnel-backend.hf.space/api/departements'
const headers = () => ({
  headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
})

const COULEURS = ['#378ADD', '#1D9E75', '#E24B4A', '#EF9F27', '#7F77DD', '#D85A30']

export default function Departements() {
  const [departements, setDepartements] = useState([])
  const [loading, setLoading]           = useState(true)
  const [recherche, setRecherche]       = useState('')
  const navigate = useNavigate()

  useEffect(() => {
    axios.get(API, headers())
      .then(res => setDepartements(res.data))
      .catch(e => { if (e.response?.status === 401) navigate('/login') })
      .finally(() => setLoading(false))
  }, [])

  const filtres = departements.filter(d =>
    d.nom?.toLowerCase().includes(recherche.toLowerCase()) ||
    d.description?.toLowerCase().includes(recherche.toLowerCase())
  )

  return (
    <Layout>

      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h4 className="fw-bold mb-0">🏢 Départements</h4>
          <p className="text-muted mb-0" style={{ fontSize: 13 }}>
            {departements.length} département(s) disponible(s)
          </p>
        </div>
      </div>

      <div className="mb-3">
        <input
          className="form-control"
          placeholder="🔍 Rechercher un département..."
          value={recherche}
          onChange={e => setRecherche(e.target.value)}
          style={{ maxWidth: 400 }}
        />
      </div>

      {loading ? (
        <div className="text-center py-5">
          <div className="spinner-border text-primary" />
        </div>
      ) : (
        <div className="row g-3">
          {filtres.length === 0 ? (
            <p className="text-muted">Aucun département trouvé.</p>
          ) : (
            filtres.map((dept, i) => (
              <div key={dept._id} className="col-md-6">
                <div className="card border-0 shadow-sm" style={{ borderRadius: 14 }}>
                  <div className="card-body p-4 d-flex align-items-center gap-3">
                    <div style={{
                      width: 52, height: 52, borderRadius: 14,
                      background: COULEURS[i % COULEURS.length] + '22',
                      display: 'flex', alignItems: 'center',
                      justifyContent: 'center', fontSize: 26, flexShrink: 0
                    }}>
                      🏢
                    </div>
                    <div>
                      <h6 className="fw-bold mb-1">{dept.nom}</h6>
                      <p className="text-muted mb-0" style={{ fontSize: 13 }}>
                        {dept.description || 'Aucune description'}
                      </p>
                      <small style={{ color: '#bbb', fontSize: 11 }}>
                        Créé le {new Date(dept.createdAt).toLocaleDateString('fr-FR')}
                      </small>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      )}

    </Layout>
  )
}
