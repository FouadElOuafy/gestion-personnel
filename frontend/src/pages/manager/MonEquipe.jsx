import { useState, useEffect } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import Layout from '../../components/Layout'

const API     = 'http://localhost:3000/api/employes'
const headers = () => ({
  headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
})

export default function MonEquipe() {
  const [employes,   setEmployes]   = useState([])
  const [loading,    setLoading]    = useState(true)
  const [recherche,  setRecherche]  = useState('')
  const [showModal,  setShowModal]  = useState(false)
  const [form,       setForm]       = useState({})
  const [idEdit,     setIdEdit]     = useState(null)
  const [succes,     setSucces]     = useState('')
  const [erreur,     setErreur]     = useState('')
  const navigate = useNavigate()

  useEffect(() => {
    if (!localStorage.getItem('token')) { navigate('/login'); return }
    charger()
  }, [])

  const charger = async () => {
    try {
      setLoading(true)
      // Manager voit tous les employés — filtrage par dept côté backend
      const res = await axios.get(`${API}/mon-equipe`, headers())
      //const res = await axios.get(API, headers())
      setEmployes(res.data)
    } catch (e) {
      if (e.response?.status === 401) navigate('/login')
    } finally { setLoading(false) }
  }

  const ouvrirEdit = (emp) => {
    setForm({
      nom:       emp.nom,
      prenom:    emp.prenom,
      poste:     emp.poste,
      telephone: emp.telephone || '',
      salaire:   emp.salaire   || 0,
    })
    setIdEdit(emp._id)
    setErreur('')
    setShowModal(true)
  }

  const soumettre = async (e) => {
    e.preventDefault()
    try {
      await axios.put(`${API}/${idEdit}`, form, headers())
      setSucces('Employé modifié avec succès')
      setShowModal(false)
      charger()
      setTimeout(() => setSucces(''), 3000)
    } catch (e) {
      setErreur(e.response?.data?.message || 'Erreur')
    }
  }

  const filtres = employes.filter(e =>
    e.nom?.toLowerCase().includes(recherche.toLowerCase()) ||
    e.prenom?.toLowerCase().includes(recherche.toLowerCase()) ||
    e.poste?.toLowerCase().includes(recherche.toLowerCase())
  )

  return (
    <Layout>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h4 className="fw-bold mb-0">👥 Mon Équipe</h4>
          <p className="text-muted mb-0" style={{ fontSize: 13 }}>
            {employes.length} membre(s) dans votre équipe
          </p>
        </div>
        <button className="btn btn-outline-primary btn-sm" onClick={charger}>
          🔄 Rafraîchir
        </button>
      </div>

      {succes && <div className="alert alert-success py-2 mb-3">{succes}</div>}

      <div className="mb-3">
        <input className="form-control"
          placeholder="🔍 Rechercher un membre..."
          value={recherche}
          onChange={e => setRecherche(e.target.value)}
          style={{ maxWidth: 400 }} />
      </div>

      {loading ? (
        <div className="text-center py-5">
          <div className="spinner-border text-primary" />
        </div>
      ) : (
        <div className="row g-3">
          {filtres.length === 0 ? (
            <div className="text-center py-5">
              <div style={{ fontSize: 50 }}>👥</div>
              <p className="text-muted mt-2">Aucun membre trouvé</p>
            </div>
          ) : (
            filtres.map((emp, i) => (
              <div key={emp._id} className="col-md-4">
                <div className="card border-0 shadow-sm h-100"
                  style={{ borderRadius: 14, transition: '0.2s' }}
                  onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-3px)'}
                  onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}
                >
                  <div className="card-body p-4">

                    {/* Avatar + nom */}
                    <div className="d-flex align-items-center gap-3 mb-3">
                      <div style={{
                        width: 50, height: 50, borderRadius: '50%',
                        background: `hsl(${i * 60}, 60%, 50%)`,
                        display: 'flex', alignItems: 'center',
                        justifyContent: 'center', fontSize: 20,
                        color: '#fff', fontWeight: 700, flexShrink: 0
                      }}>
                        {emp.nom?.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <h6 className="fw-bold mb-0">
                          {emp.nom} {emp.prenom}
                        </h6>
                        <span style={{
                          background: '#378ADD22', color: '#378ADD',
                          padding: '2px 10px', borderRadius: 99,
                          fontSize: 11, fontWeight: 600
                        }}>
                          {emp.poste}
                        </span>
                      </div>
                    </div>

                    {/* Infos */}
                    <div style={{
                      display: 'flex', flexDirection: 'column',
                      gap: 6, marginBottom: 12
                    }}>
                      <p style={{ fontSize: 12, color: '#666', margin: 0 }}>
                        📧 {emp.email}
                      </p>
                      <p style={{ fontSize: 12, color: '#666', margin: 0 }}>
                        📞 {emp.telephone || 'Non renseigné'}
                      </p>
                      <p style={{ fontSize: 12, color: '#666', margin: 0 }}>
                        💰 {emp.salaire || 0} MAD
                      </p>
                      <span className={`badge ${emp.statut === 'actif' ? 'bg-success' : 'bg-secondary'}`}
                        style={{ width: 'fit-content', fontSize: 11 }}>
                        {emp.statut || 'actif'}
                      </span>
                    </div>

                    {/* Bouton modifier */}
                    <button
                      className="btn btn-outline-primary btn-sm w-100"
                      onClick={() => ouvrirEdit(emp)}>
                      ✏️ Modifier
                    </button>

                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* MODAL MODIFICATION */}
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
              <h5 className="fw-bold mb-0">✏️ Modifier l'employé</h5>
              <button onClick={() => setShowModal(false)}
                style={{ background: 'none', border: 'none',
                  fontSize: 18, cursor: 'pointer', color: '#999' }}>✕</button>
            </div>

            {erreur && <div className="alert alert-danger py-2">{erreur}</div>}

            <form onSubmit={soumettre}>
              <div className="row g-3">
                <div className="col-6">
                  <label className="form-label">Nom</label>
                  <input className="form-control" value={form.nom || ''}
                    onChange={e => setForm({...form, nom: e.target.value})} required />
                </div>
                <div className="col-6">
                  <label className="form-label">Prénom</label>
                  <input className="form-control" value={form.prenom || ''}
                    onChange={e => setForm({...form, prenom: e.target.value})} />
                </div>
                <div className="col-12">
                  <label className="form-label">Poste</label>
                  <input className="form-control" value={form.poste || ''}
                    onChange={e => setForm({...form, poste: e.target.value})} required />
                </div>
                <div className="col-6">
                  <label className="form-label">Téléphone</label>
                  <input className="form-control" value={form.telephone || ''}
                    onChange={e => setForm({...form, telephone: e.target.value})} />
                </div>
                <div className="col-6">
                  <label className="form-label">Salaire (MAD)</label>
                  <input className="form-control" type="number" value={form.salaire || ''}
                    onChange={e => setForm({...form, salaire: e.target.value})} />
                </div>
              </div>
              <div className="d-flex gap-2 mt-4">
                <button type="submit" className="btn btn-primary flex-fill">
                  💾 Enregistrer
                </button>
                <button type="button" className="btn btn-light flex-fill"
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