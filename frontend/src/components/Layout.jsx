import Sidebar from './Sidebar'


function Layout({ children }) {
  return (
    <div style={{
      // display: 'flex',
      minHeight: '100vh',
      background: '#f5f5f5',
      width: '100%',
        }}>

      {/* SIDEBAR GAUCHE fixe 240px */}
      <Sidebar />

      {/* CONTENU — entre les 2 sidebars */}
      <div style={{
        marginLeft: '100px',
        flex: 1,
        height: '100vh',
        padding: '1.5rem 1rem',
        boxSizing: 'border-box',
        background: '#f5f5f5',
        width: '1250px',
        marginLeft: '340px',
      }}>
        {children}
      </div>
      </div>
  )
}

export default Layout
