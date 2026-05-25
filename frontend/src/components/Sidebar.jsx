import { Link, useLocation, useNavigate } from 'react-router-dom'

// Réception des props isOpen et setIsOpen pour le responsive
function Sidebar({ isOpen, setIsOpen }) {
  const location = useLocation()
  const navigate = useNavigate()
  const nom  = localStorage.getItem('nom')
  const role = localStorage.getItem('role')

  const logout = () => {
    localStorage.clear()
    navigate('/login')
  }

  const isActive = (path) => location.pathname === path

  const menuPrincipal = role === 'employe' ? [
    { path: '/dashboard',  icon: '📊', label: 'Accueil'    },
    { path: '/mon-profil', icon: '👤', label: 'Mon profil' },
    { path: '/mes-conges', icon: '🏖️', label: 'Mes congés'    },
  ] : role === 'manager' ? [
    { path: '/dashboard',      icon: '📊', label: 'Dashboard'   },
    { path: '/mon-equipe',     icon: '👥', label: 'Mon équipe'  },
    { path: '/manager/conges', icon: '🏖️', label: 'Congés'      },
    { path: '/departements',   icon: '🏢', label: 'Départements'},
  ] : [
    { path: '/dashboard',    icon: '📊', label: 'Dashboard'    },
    { path: '/employes',     icon: '👷', label: 'Employés'     },
    { path: '/departements', icon: '🏢', label: 'Départements' },
    { path: '/conges',       icon: '🏖️', label: 'Congés'       },
  ]

  const menuAdmin = [
    { path: '/admin/employes',     icon: '👥', label: 'Gérer les employés' },
    { path: '/admin/departements', icon: '🏗️', label: 'Gérer les dép.' },
    { path: '/admin/conges',       icon: '📋', label: 'Valider les congés' },
    { path: '/admin/utilisateurs', icon: '🔐', label: 'Utilisateurs' },
  ]

  const menuProfil = [
    { path: '/mon-profil',       icon: '👤', label: 'Mon profil' },
    { path: '/admin/parametres', icon: '⚙️', label: 'Paramètres' },
  ]

  const styleItem = (path) => ({
    display: 'flex',
    alignItems: 'center',
    gap: 10,
    padding: '8px 12px',
    borderRadius: 10,
    marginBottom: 2,
    cursor: 'pointer',
    textDecoration: 'none',
    fontSize: 13,
    fontWeight: isActive(path) ? 600 : 400,
    background: isActive(path) ? '#378ADD' : 'transparent',
    color: isActive(path) ? '#fff' : '#aaa',
    transition: '0.15s',
  })

  return (
    <>
      {/* Sombre arrière-plan cliquable pour fermer la barre sur mobile */}
      {isOpen && (
        <div className="sidebar-overlay" onClick={() => setIsOpen(false)} />
      )}

      <div className={`sidebar-container ${isOpen ? 'mobile-open' : ''}`} style={{
        width: 240,
        height: '100vh',
        background: '#1a1a2e',
        position: 'fixed',
        top: 0,
        left: 0,
        display: 'flex',
        flexDirection: 'column',
        padding: '1rem',
        zIndex: 100,
        boxSizing: 'border-box',
        overflow: 'hidden',
      }}>

        {/* Bouton pour fermer la barre sur Mobile */}
        <div className="close-sidebar-row" style={{ display: 'none', justifyContent: 'flex-end', marginBottom: '1rem' }}>
          <button onClick={() => setIsOpen(false)} style={{ background: 'none', border: 'none', color: '#fff', fontSize: '20px', cursor: 'pointer' }}>✕</button>
        </div>

        {/* LOGO */}
        <div style={{ marginBottom: '1rem', flexShrink: 0 }}>
          <p style={{ color: '#fff', fontWeight: 700, fontSize: 15, margin: '0 0 2px' }}>
            👥 Gestion
          </p>
          <p style={{ color: '#555', fontSize: 11, margin: 0 }}>Personnel RH</p>
        </div>

        {/* ZONE SCROLLABLE */}
        <div style={{ flex: 1, overflowY: 'auto', overflowX: 'hidden' }}>
          <p style={styleSection}>MENU</p>
          {menuPrincipal.map(item => (
            <Link key={item.path} to={item.path} style={styleItem(item.path)} onClick={() => setIsOpen(false)}
              onMouseEnter={e => { if (!isActive(item.path)) e.currentTarget.style.background = '#ffffff11' }}
              onMouseLeave={e => { if (!isActive(item.path)) e.currentTarget.style.background = 'transparent' }}>
              <span style={{ fontSize: 15 }}>{item.icon}</span>
              {item.label}
            </Link>
          ))}

          {role === 'admin' && (
            <>
              <div style={styleSep} />
              <p style={styleSection}>ADMINISTRATION</p>
              {menuAdmin.map(item => (
                <Link key={item.path} to={item.path} style={styleItem(item.path)} onClick={() => setIsOpen(false)}
                  onMouseEnter={e => { if (!isActive(item.path)) e.currentTarget.style.background = '#ffffff11' }}
                  onMouseLeave={e => { if (!isActive(item.path)) e.currentTarget.style.background = 'transparent' }}>
                  <span style={{ fontSize: 15 }}>{item.icon}</span>
                  {item.label}
                </Link>
              ))}
            </>
          )}

          {(role === 'admin' || role === 'manager') && (
            <>
              <div style={styleSep} />
              <p style={styleSection}>MON COMPTE</p>
              {menuProfil.map(item => (
                <Link key={item.path} to={item.path} style={styleItem(item.path)} onClick={() => setIsOpen(false)}
                  onMouseEnter={e => { if (!isActive(item.path)) e.currentTarget.style.background = '#ffffff11' }}
                  onMouseLeave={e => { if (!isActive(item.path)) e.currentTarget.style.background = 'transparent' }}>
                  <span style={{ fontSize: 15 }}>{item.icon}</span>
                  {item.label}
                </Link>
              ))}
            </>
          )}
        </div>

        {/* BAS FIXE */}
        <div style={{ flexShrink: 0 }}>
          <div style={styleSep} />
          <div style={{
            background: '#ffffff11',
            borderRadius: 10,
            padding: '8px 10px',
            marginBottom: 8,
            display: 'flex',
            alignItems: 'center',
            gap: 8,
          }}>
            <div style={{
              width: 34, height: 34, borderRadius: '50%',
              background: role === 'admin' ? '#E24B4A' : '#1D9E75',
              display: 'flex', alignItems: 'center',
              justifyContent: 'center', fontSize: 15,
              fontWeight: 700, color: '#fff', flexShrink: 0,
            }}>
              {nom?.charAt(0).toUpperCase()}
            </div>
            <div style={{ overflow: 'hidden' }}>
              <p style={{
                color: '#fff', fontSize: 13, fontWeight: 600,
                margin: 0, whiteSpace: 'nowrap',
                overflow: 'hidden', textOverflow: 'ellipsis'
              }}>
                {nom}
              </p>
              <span style={{
                fontSize: 10, padding: '1px 7px', borderRadius: 99,
                background: role === 'admin' ? '#E24B4A33' : '#1D9E7533',
                color: role === 'admin' ? '#E24B4A' : '#1D9E75',
                fontWeight: 600, textTransform: 'capitalize',
              }}>
                {role}
              </span>
            </div>
          </div>

          <button onClick={logout} style={{
            width: '100%', padding: '8px',
            background: 'transparent',
            border: '0.5px solid #ce8a66',
            borderRadius: 10, color: '#e5e0e0',
            fontSize: 13, cursor: 'pointer',
            display: 'flex', alignItems: 'center',
            justifyContent: 'center', gap: 8,
          }}
            onMouseEnter={e => e.currentTarget.style.background = '#f2ebecc1'}
            onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
          >
            🚪 Déconnexion
          </button>
        </div>

      </div>

      {/* Style CSS Responsive pour la Sidebar */}
      <style>{`
        .sidebar-overlay {
          position: fixed;
          top: 0; left: 0;
          width: 100vw; height: 100vh;
          background: rgba(0, 0, 0, 0.5);
          z-index: 99;
        }
        
        @media (max-width: 768px) {
          .sidebar-container {
            transform: translateX(-100%);
            transition: transform 0.3s ease;
          }
          .sidebar-container.mobile-open {
            transform: translateX(0);
          }
          .close-sidebar-row {
            display: flex !important;
          }
        }
      `}</style>
    </>
  )
}

const styleSection = {
  color: '#444', fontSize: 10, fontWeight: 600,
  textTransform: 'uppercase', letterSpacing: 1,
  margin: '0 0 6px 4px',
}

const styleSep = {
  borderTop: '0.5px solid #2a2a3e',
  margin: '10px 0',
}

export default Sidebar