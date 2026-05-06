import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import axios from 'axios'
import Layout from '../../components/Layout'

const API = 'http://localhost:3000/api/employes'
const headers = () => ({
  headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
})

export default function ModifierEmploye() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [form, setForm]     = useState({})
  const [succes, setSucces] = useState('')
  const [erreur, setErreur] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    axios.get(API, headers())
      .then(res => {
        const emp = res.data.find(e => e._id === id)
        if (emp) setForm({
          nom: emp.nom, prenom: emp.prenom,
          poste: emp.poste, telephone: emp.telephone || '',
          salaire: emp.salaire || '', statut: emp.statut || 'actif'
        })
      })
      .finally(() => setLoading(false))
  }, [id])

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }))

  const soumettre = async (e) => {
    e.preventDefault()
    try {
      await axios.put(`${API}/${id}`, form, headers())
      setSucces('Employé modifié avec succès')
      setTimeout(() => navigate('/employes'), 1500)
    } catch (e) {
      setErreur(e.response?.data?.message || 'Erreur')
    }
  }

  if (loading) return <Layout><div className="text-center py-5"><div className="spinner-border text-primary" /></div></Layout>

  return (
    <Layout>
      <div className="mb-4">
        <h4 className="fw-bold mb-0">✏️ Modifier l'employé</h4>
        <p className="text-muted" style={{ fontSize: 13 }}>
          Modification limitée à votre département
        </p>
      </div>

      {succes && <div className="alert alert-success py-2">{succes}</div>}
      {erreur && <div className="alert alert-danger py-2">{erreur}</div>}

      <div className="card border-0 shadow-sm" style={{ borderRadius: 14, maxWidth: 500 }}>
        <div className="card-body p-4">
          <form onSubmit={soumettre}>
            <div className="row g-3">
              <div className="col-6">
                <label className="form-label">Nom</label>
                <input className="form-control" value={form.nom || ''}
                  onChange={e => set('nom', e.target.value)} required />
              </div>
              <div className="col-6">
                <label className="form-label">Prénom</label>
                <input className="form-control" value={form.prenom || ''}
                  onChange={e => set('prenom', e.target.value)} />
              </div>
              <div className="col-12">
                <label className="form-label">Poste</label>
                <input className="form-control" value={form.poste || ''}
                  onChange={e => set('poste', e.target.value)} required />
              </div>
              <div className="col-6">
                <label className="form-label">Téléphone</label>
                <input className="form-control" value={form.telephone || ''}
                  onChange={e => set('telephone', e.target.value)} />
              </div>
              <div className="col-6">
                <label className="form-label">Salaire (MAD)</label>
                <input className="form-control" type="number" value={form.salaire || ''}
                  onChange={e => set('salaire', e.target.value)} />
              </div>
              <div className="col-6">
                <label className="form-label">Statut</label>
                <select className="form-select" value={form.statut || 'actif'}
                  onChange={e => set('statut', e.target.value)}>
                  <option value="actif">Actif</option>
                  <option value="inactif">Inactif</option>
                </select>
              </div>
            </div>
            <div className="d-flex gap-2 mt-4">
              <button type="submit" className="btn btn-primary flex-fill">
                💾 Enregistrer
              </button>
              <button type="button" className="btn btn-light flex-fill"
                onClick={() => navigate('/employes')}>
                Annuler
              </button>
            </div>
          </form>
        </div>
      </div>
    </Layout>
  )
}