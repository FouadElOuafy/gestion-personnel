import { useNavigate, Link } from 'react-router-dom'

function Navbar() {
  const navigate = useNavigate()
  const nom      = localStorage.getItem('nom')
  const role     = localStorage.getItem('role')

  const logout = () => {
    localStorage.clear()
    navigate('/login')
  }

  const couleurRole = {
    admin:   'bg-danger',
    manager: 'bg-warning text-dark',
    employe: 'bg-success'
  }

  return (
    <nav className="navbar navbar-dark bg-dark px-4 shadow sticky-top">
      <Link className="navbar-brand fw-bold fs-5" to="/dashboard">
        👥 Gestion Personnel
      </Link>

      <div className="d-flex gap-3 align-items-center">

        {/* Liens selon rôle */}
        {(role === 'admin' || role === 'manager') && (
          <>
            <Link className="text-white text-decoration-none" to="/employes">
              Employés
            </Link>
            <Link className="text-white text-decoration-none" to="/departements">
              Départements
            </Link>
            <Link className="text-white text-decoration-none" to="/conges">
              Congés
            </Link>
          </>
        )}

        {role === 'employe' && (
          <>
            <Link className="text-white text-decoration-none" to="/mon-profil">
              Mon Profil
            </Link>
            <Link className="text-white text-decoration-none" to="/conges">
              Mes Congés
            </Link>
          </>
        )}

        {/* Infos utilisateur */}
        <span className="text-white">
          👤 <strong>{nom}</strong>
          <span className={`badge ms-2 ${couleurRole[role] || 'bg-secondary'}`}>
            {role}
          </span>
        </span>

        <button className="btn btn-outline-light btn-sm" onClick={logout}>
          Déconnexion
        </button>
      </div>
    </nav>
  )
}

export default Navbar