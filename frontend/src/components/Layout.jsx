import { useState } from 'react'
import Sidebar from './Sidebar'

function Layout({ children }) {
  // État pour ouvrir/fermer la sidebar sur mobile
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <div style={{
      minHeight: '100vh',
      background: '#f5f5f5',
      width: '100%',
      display: 'flex',
      flexDirection: 'column'
    }}>

      {/* SIDEBAR GAUCHE — On lui passe l'état mobile */}
      <Sidebar isOpen={sidebarOpen} setIsOpen={setSidebarOpen} />

      {/* BARRE DE NAVIGATION MOBILE (Apparaît uniquement sur petits écrans) */}
      <div className="mobile-top-bar">
        <button className="burger-btn" onClick={() => setSidebarOpen(true)}>
          ☰
        </button>
        <span className="mobile-title">👥 Gestion Personnel</span>
      </div>

      {/* CONTENU PRINCIPAL — Devient fluide */}
      <div className="main-content-wrapper">
        {children}
      </div>

      {/* Styles responsives dédiés au Layout */}
      <style>{`
        .mobile-top-bar {
          display: none;
          background: #1a1a2e;
          color: white;
          padding: 1rem;
          align-items: center;
          gap: 15px;
          position: sticky;
          top: 0;
          z-index: 90;
        }
        .burger-btn {
          background: none;
          border: none;
          color: white;
          font-size: 1.5rem;
          cursor: pointer;
        }
        .mobile-title {
          font-weight: 700;
          font-size: 14px;
        }
        .main-content-wrapper {
          margin-left: 240px; /* Largeur de la sidebar sur PC */
          flex: 1;
          padding: 1.5rem 1rem;
          box-sizing: border-box;
          background: '#f5f5f5';
        }

        /* Mode Tablette et Mobile */
        @media (max-width: 768px) {
          .mobile-top-bar {
            display: flex;
          }
          .main-content-wrapper {
            margin-left: 0 !important;
            width: 100% !important;
            padding: 1rem;
          }
        }
      `}</style>
    </div>
  )
}

export default Layout