import { useState } from 'react'
import axios from 'axios'
import { useNavigate, Link } from 'react-router-dom'

function Register() {
  const [form, setForm]     = useState({
    nom: '', prenom: '', email: '', password: '', role: 'employe'
  })
  const [erreur, setErreur] = useState('')
  const [succes, setSucces] = useState('')
  const navigate            = useNavigate()

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }))

  const handleSubmit = async (e) => {
    e.preventDefault()
    setErreur('')
    try {
      await axios.post('http://localhost:3000/api/auth/register', form)
      setSucces('Compte créé ! Redirection...')
      setTimeout(() => navigate('/login'), 1500)
    } catch (e) {
      setErreur(e.response?.data?.message || 'Erreur inscription')
    }
  }

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <h4 style={styles.title}>Créer un compte</h4>

        {erreur && <div className="alert alert-danger py-2">{erreur}</div>}
        {succes && <div className="alert alert-success py-2">{succes}</div>}

        <form onSubmit={handleSubmit}>

          <div className="row g-3 mb-3">
            <div className="col-6">
              <label className="form-label">Nom *</label>
              <input className="form-control" value={form.nom}
                onChange={e => set('nom', e.target.value)}
                placeholder="Ex: Dupont" required />
            </div>
            <div className="col-6">
              <label className="form-label">Prénom</label>
              <input className="form-control" value={form.prenom}
                onChange={e => set('prenom', e.target.value)}
                placeholder="Ex: Jean" />
            </div>
          </div>

          <div className="mb-3">
            <label className="form-label">Email *</label>
            <input type="email" className="form-control" value={form.email}
              onChange={e => set('email', e.target.value)}
              placeholder="exemple@email.com" required />
          </div>

          <div className="mb-3">
            <label className="form-label">Mot de passe *</label>
            <input type="password" className="form-control" value={form.password}
              onChange={e => set('password', e.target.value)}
              placeholder="••••••••" required />
          </div>

          <div className="mb-4">
            <label className="form-label">Rôle</label>
            <select className="form-select" value={form.role}
              onChange={e => set('role', e.target.value)}>
              <option value="employe">👤 Employé</option>
              
            </select>
          </div>

          <button type="submit" className="btn btn-success w-100">
            S'inscrire
          </button>
        </form>

        <p className="mt-3 text-center" style={{ fontSize: 14 }}>
          Déjà un compte ? <Link to="/login">Se connecter</Link>
        </p>
      </div>
    </div>
  )
}

const styles = {
  page: {
    minHeight: '100vh', display: 'flex',
    alignItems: 'center', justifyContent: 'center',
    background: '#f5f5f5'
  },
  card: {
    background: '#fff', padding: '2rem',
    borderRadius: 16, border: '1px solid #e8e8e8',
    width: '100%', maxWidth: 440,
    boxShadow: '0 4px 24px rgba(0,0,0,0.06)'
  },
  title: {
    fontWeight: 700, marginBottom: '1.5rem',
    textAlign: 'center', fontSize: 22
  }
}

export default Register
// import { useState } from 'react'
// import axios from 'axios'
// import { useNavigate, Link } from 'react-router-dom'

// function Register() {
//   const [form, setForm]     = useState({
//     nom: '', email: '', password: '', role: 'employe'  // ← 'employe' par défaut
//   })
//   const [erreur, setErreur] = useState('')
//   const [succes, setSucces] = useState('')
//   const navigate            = useNavigate()

//   const handleSubmit = async (e) => {
//     e.preventDefault()
//     setErreur('')
//     try {
//       await axios.post('http://localhost:3000/api/auth/register', form)
//       setSucces('Compte créé ! Redirection...')
//       setTimeout(() => navigate('/login'), 1500)
//     } catch (e) {
//       setErreur(e.response?.data?.message || 'Erreur inscription')
//     }
//   }

//   return (
//     <div className="container mt-5" style={{ maxWidth: 400 }}>
//       <div className="card shadow p-4">
//         <h3 className="mb-4 text-center">Créer un compte</h3>

//         {erreur  && <div className="alert alert-danger">{erreur}</div>}
//         {succes  && <div className="alert alert-success">{succes}</div>}

//         <form onSubmit={handleSubmit}>
//           <div className="mb-3">
//             <label>Nom</label>
//             <input className="form-control" value={form.nom}
//               onChange={e => setForm({...form, nom: e.target.value})}
//               required />
//           </div>
//           <div className="mb-3">
//   <label className="form-label">Prénom</label>
//   <input
//     className="form-control"
//     value={form.prenom || ''}
//     onChange={e => setForm({...form, prenom: e.target.value})}
//     placeholder="Votre prénom"
//   />
// </div>
//           <div className="mb-3">
//             <label>Email</label>
//             <input type="email" className="form-control" value={form.email}
//               onChange={e => setForm({...form, email: e.target.value})}
//               required />
//           </div>
//           <div className="mb-3">
//             <label>Mot de passe</label>
//             <input type="password" className="form-control" value={form.password}
//               onChange={e => setForm({...form, password: e.target.value})}
//               required />
//           </div>
//           <div className="mb-3">
//             <label>Rôle</label>
//             <select className="form-select" value={form.role}
//               onChange={e => setForm({...form, role: e.target.value})}>
//               <option value="employe">Employé</option>   {/* ← 'employe' pas 'user' */}
//               <option value="manager">Manager</option>
//               <option value="admin">Admin</option>
//             </select>
//           </div>
//           <button type="submit" className="btn btn-success w-100">
//             S'inscrire
//           </button>
//         </form>

//         <p className="mt-3 text-center">
//           Déjà un compte ? <Link to="/login">Se connecter</Link>
//         </p>
//       </div>
//     </div>
//   )
// }

// export default Register