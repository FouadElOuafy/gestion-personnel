import { useState, useEffect } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import Layout from '../components/Layout'

function Dashboard() {
  const [stats,   setStats]   = useState(null)
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()
  const role     = localStorage.getItem('role')
  const nom      = localStorage.getItem('nom')
  const headers  = () => ({
    Authorization: `Bearer ${localStorage.getItem('token')}`
  })

  useEffect(() => {
    if (!localStorage.getItem('token')) { navigate('/login'); return }
    chargerStats()
  }, [])

  const chargerStats = async () => {
  try {
    const token   = localStorage.getItem('token')
    const h       = { Authorization: `Bearer ${token}` }

    if (role === 'employe') {
      const [userRes, empRes] = await Promise.all([
        axios.get('https://fouad1239-gestion-personnel-backend.hf.space/api/users/me',   { headers: h }),
        axios.get('https://fouad1239-gestion-personnel-backend.hf.space/api/employes',   { headers: h }),
      ])
      const ficheEmp = empRes.data[0] || null
      setStats({ type: 'employe', user: userRes.data, employe: ficheEmp })

    } else if (role === 'manager') {
      // Manager → seulement son équipe
     const [empRes, congeRes, userRes] = await Promise.all([
        axios.get('https://fouad1239-gestion-personnel-backend.hf.space/api/employes',  { headers: h }),
        axios.get('https://fouad1239-gestion-personnel-backend.hf.space/api/conges',    { headers: h }),
        axios.get('https://fouad1239-gestion-personnel-backend.hf.space/api/users/me',  { headers: h }),
      ])
      const employes = empRes.data

      // Récupérer le nom du département du manager
      const deptId = userRes.data.departement
      let nomDept = 'Non assigné'
      if (deptId) {
        try {
          const deptRes = await axios.get(
            `https://fouad1239-gestion-personnel-backend.hf.space/api/departements`,
            { headers: h }
          )
          const dept = deptRes.data.find(d => d._id === deptId || d._id === deptId?._id)
          if (dept) nomDept = dept.nom
        } catch {}
      }

      setStats({
        type:              'manager',
        totalEmployes:     employes.length,
        totalDepartements: 1,
        nomDepartement:    nomDept,
        totalSalaires:     employes.reduce((s, e) => s + (e.salaire || 0), 0),
        congesEnAttente:   congeRes.data.filter(c => c.statut === 'en_attente').length,
        congesApprouves:   congeRes.data.filter(c => c.statut === 'approuve').length,
        congesRefuses:     congeRes.data.filter(c => c.statut === 'refuse').length,
      })

    } else {
      // Admin → tout voir
      const [empRes, deptRes, congeRes] = await Promise.all([
        axios.get('https://fouad1239-gestion-personnel-backend.hf.space/api/employes',     { headers: h }),
        axios.get('https://fouad1239-gestion-personnel-backend.hf.space/api/departements', { headers: h }),
        axios.get('https://fouad1239-gestion-personnel-backend.hf.space/api/conges',       { headers: h }),
      ])
      const employes = empRes.data
      setStats({
        type:              'admin',
        totalEmployes:     employes.length,
        totalDepartements: deptRes.data.length,
        totalSalaires:     employes.reduce((s, e) => s + (e.salaire || 0), 0),
        congesEnAttente:   congeRes.data.filter(c => c.statut === 'en_attente').length,
        congesApprouves:   congeRes.data.filter(c => c.statut === 'approuve').length,
        congesRefuses:     congeRes.data.filter(c => c.statut === 'refuse').length,
      })
    }
  } catch (e) {
    if (e.response?.status === 401) { localStorage.clear(); navigate('/login') }
  } finally {
    setLoading(false)
  }
}

  // ══════════════════════════════════════════
  //  DASHBOARD EMPLOYÉ
  // ══════════════════════════════════════════
  if (!loading && stats?.type === 'employe') {
    const user = stats.user
    return (
      <Layout>
        <div className="mb-4">
          <h4 className="fw-bold">Bonjour, {nom} 👋</h4>
          <p className="text-muted mb-0" style={{ fontSize: 13 }}>
            Espace Employé
          </p>
        </div>

        <div className="row g-3">

          {/* Carte profil */}
          <div className="col-4">
            <div className="card border-0 shadow-sm h-100"
              style={{ borderRadius: 14 }}>
              <div className="card-body p-4 text-center">
                <div style={{
                  width: 70, height: 70, borderRadius: '50%',
                  background: '#1D9E7522',
                  display: 'flex', alignItems: 'center',
                  justifyContent: 'center', fontSize: 30,
                  fontWeight: 700, color: '#1D9E75',
                  margin: '0 auto 12px',
                  border: '3px solid #1D9E7533'
                }}>
                  {nom?.charAt(0).toUpperCase()}
                </div>
                <h6 className="fw-bold mb-1">
                  {user?.nom} {user?.prenom}
                </h6>
                <span style={{
                  background: '#1D9E7522', color: '#1D9E75',
                  padding: '3px 14px', borderRadius: 99,
                  fontSize: 12, fontWeight: 600
                }}>Employé</span>
                <hr />
                {[
                  { icon: '📧', val: user?.email      || '—' },
                  { icon: '📞', val: user?.telephone  || 'Non renseigné' },
                  { icon: '📍', val: user?.adresse    || 'Non renseignée' },
                  { icon: '📅', val: user?.createdAt
                    ? new Date(user.createdAt).toLocaleDateString('fr-FR')
                    : '—'
                  },
                ].map((item, i) => (
                  <p key={i} className="text-muted mb-1" style={{ fontSize: 13 }}>
                    {item.icon} {item.val}
                  </p>
                ))}
              </div>
            </div>
          </div>

          {/* Actions rapides */}
          <div className="col-4">
            <div className="card border-0 shadow-sm h-100"
              style={{ borderRadius: 14 }}>
              <div className="card-body p-4">
                <h6 className="fw-bold mb-3">⚡ Actions rapides</h6>
                {[
                  { icon: '👤', label: 'Mon profil',  to: '/mon-profil',       color: '#378ADD' },
                  { icon: '🏖️', label: 'Mes congés',  to: '/conges',           color: '#E24B4A' },
                  { icon: '⚙️', label: 'Paramètres',  to: '/admin/parametres', color: '#888'    },
                ].map((item, i) => (
                  <div key={i} onClick={() => navigate(item.to)}
                    style={{
                      display: 'flex', alignItems: 'center', gap: 12,
                      padding: '10px 14px', borderRadius: 10,
                      background: item.color + '11', cursor: 'pointer',
                      marginBottom: 8, border: `1px solid ${item.color}22`,
                      transition: '0.2s'
                    }}
                    onMouseEnter={e => e.currentTarget.style.background = item.color + '22'}
                    onMouseLeave={e => e.currentTarget.style.background = item.color + '11'}
                  >
                    <span style={{ fontSize: 20 }}>{item.icon}</span>
                    <span style={{ fontSize: 13, fontWeight: 500, color: item.color }}>
                      {item.label}
                    </span>
                    <span style={{ marginLeft: 'auto', color: item.color }}>→</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Infos compte */}
          <div className="col-4">
            <div className="card border-0 shadow-sm h-100"
              style={{ borderRadius: 14 }}>
              <div className="card-body p-4">
                <h6 className="fw-bold mb-3">ℹ️ Mon compte</h6>
                {[
                  { label: '✅ Statut',        val: 'Actif',    color: '#1D9E75' },
                  { label: '🎭 Rôle',          val: 'Employé',  color: '#378ADD' },
                  { label: '📅 Membre depuis',
                    val: user?.createdAt
                      ? new Date(user.createdAt).toLocaleDateString('fr-FR')
                      : '—',
                    color: '#888'
                  },
                  { label: '🔄 Mis à jour',
                    val: user?.updatedAt
                      ? new Date(user.updatedAt).toLocaleDateString('fr-FR')
                      : '—',
                    color: '#888'
                  },
                  { label: '🕐 Session', val: 'Active', color: '#1D9E75' },
                  { label: '💼 Poste',
                    val: stats.employe?.poste || 'Non défini',
                    color: '#378ADD'
                  },
                  { label: '💰 Salaire',
                    val: stats.employe?.salaire > 0
                      ? stats.employe.salaire + ' MAD'
                      : 'Non renseigné',
                    color: '#EF9F27'
                  },
                ].map((item, i) => (
                  <div key={i} style={{
                    display: 'flex', justifyContent: 'space-between',
                    padding: '8px 0', borderBottom: '0.5px solid #f0f0f0'
                  }}>
                    <span style={{ fontSize: 12, color: '#666' }}>{item.label}</span>
                    <strong style={{ fontSize: 12, color: item.color }}>{item.val}</strong>
                  </div>
                ))}
              </div>
            </div>
          </div>

        </div>
      </Layout>
    )
  }

  // ══════════════════════════════════════════
  //  DASHBOARD ADMIN + MANAGER
  // ══════════════════════════════════════════
  const cards = stats ? [
    {
      label: 'Employés',
      value: stats.totalEmployes,
      icon: '👷', color: '#378ADD'
    },
    {
      label: role === 'manager' ? 'Mon département' : 'Départements',
      value: role === 'manager' ? stats.nomDepartement : stats.totalDepartements,
      icon: '🏢', color: '#1D9E75'
    },
    {
      label: 'Masse salariale',
      value: stats.totalSalaires + ' MAD',
      icon: '💰', color: '#EF9F27'
    },
    {
      label: 'Congés en attente',
      value: stats.congesEnAttente,
      icon: '⏳', color: '#E24B4A'
    },
    {
      label: 'Congés approuvés',
      value: stats.congesApprouves,
      icon: '✅', color: '#1D9E75'
    },
    {
      label: 'Congés refusés',
      value: stats.congesRefuses,
      icon: '❌', color: '#7F77DD'
    },
  ] : []
  // const cards = stats ? [
  //   { label: 'Employés',          value: stats.totalEmployes,          icon: '👷', color: '#378ADD' },
  //   { label: 'Départements',      value: stats.totalDepartements,       icon: '🏢', color: '#1D9E75' },
  //   { label: 'Masse salariale',   value: stats.totalSalaires + ' MAD', icon: '💰', color: '#EF9F27' },
  //   { label: 'Congés en attente', value: stats.congesEnAttente,         icon: '⏳', color: '#E24B4A' },
  //   { label: 'Congés approuvés',  value: stats.congesApprouves,         icon: '✅', color: '#1D9E75' },
  //   { label: 'Congés refusés',    value: stats.congesRefuses,           icon: '❌', color: '#7F77DD' },
  // ] : []

  return (
    <Layout>
      <div className="mb-3 text-center">
        <h4 className="fw-bold">Bonjour, {nom} 👋</h4>
        <p className="text-muted mb-0" style={{ fontSize: 13 }}>
          {role === 'admin' ? '🔴 Vue globale — Admin' : '🟡 Vue département — Manager'}
        </p>
      </div>

      {loading && (
        <div className="text-center py-5">
          <div className="spinner-border text-primary" />
        </div>
      )}

      {!loading && stats && (
        <>
          {/* 6 STAT CARDS */}
          <div className="row g-2 mb-3">
            {cards.map((card, i) => (
              <div key={i} className="col-4">
                <div className="card border-0 shadow-sm"
                  style={{ borderRadius: 12 }}>
                  <div className="card-body p-3 d-flex align-items-center gap-2">
                    <div style={{
                      width: 44, height: 44, borderRadius: 10,
                      background: card.color + '22',
                      display: 'flex', alignItems: 'center',
                      justifyContent: 'center', fontSize: 20, flexShrink: 0
                    }}>
                      {card.icon}
                    </div>
                    <div>
                      <p className="text-muted mb-0" style={{ fontSize: 11 }}>
                        {card.label}
                      </p>
                      <h6 className="fw-bold mb-0" style={{ color: card.color }}>
                        {card.value}
                      </h6>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* 3 COLONNES */}
          <div className="row g-2">

            {/* Activité récente */}
            <div className="col-4">
              <div className="card border-0 shadow-sm h-100"
                style={{ borderRadius: 12 }}>
                <div className="card-body p-3">
                  <h6 className="fw-bold mb-3" style={{ fontSize: 13 }}>
                    🕐 Activité récente
                  </h6>
                  {[
                    { icon: '👷', val: `${stats.totalEmployes} employés`,
                      sub: `dans ${stats.totalDepartements} départements` },
                    { icon: '⏳', val: `${stats.congesEnAttente} congé(s)`,
                      sub: 'en attente de validation' },
                    { icon: '💰', val: `${stats.totalSalaires} MAD`,
                      sub: 'masse salariale totale' },
                  ].map((item, i, arr) => (
                    <div key={i}
                      className="d-flex align-items-center gap-2 py-2"
                      style={{
                        borderBottom: i < arr.length - 1
                          ? '0.5px solid #eee' : 'none'
                      }}>
                      <span style={{ fontSize: 18 }}>{item.icon}</span>
                      <div>
                        <p className="mb-0 fw-semibold" style={{ fontSize: 12 }}>
                          {item.val}
                        </p>
                        <small className="text-muted" style={{ fontSize: 11 }}>
                          {item.sub}
                        </small>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Statut congés */}
            <div className="col-4">
              <div className="card border-0 shadow-sm h-100"
                style={{ borderRadius: 12 }}>
                <div className="card-body p-3">
                  <h6 className="fw-bold mb-3" style={{ fontSize: 13 }}>
                    📊 Statut des congés
                  </h6>
                  {[
                    { label: '⏳ En attente', val: stats.congesEnAttente,  color: 'bg-danger'    },
                    { label: '✅ Approuvés',  val: stats.congesApprouves,  color: 'bg-success'   },
                    { label: '❌ Refusés',    val: stats.congesRefuses,    color: 'bg-secondary' },
                  ].map((item, i) => {
                    const total = stats.congesEnAttente
                      + stats.congesApprouves
                      + stats.congesRefuses || 1
                    return (
                      <div key={i} className="mb-3">
                        <div className="d-flex justify-content-between mb-1">
                          <span style={{ fontSize: 12 }}>{item.label}</span>
                          <strong style={{ fontSize: 12 }}>{item.val}</strong>
                        </div>
                        <div className="progress"
                          style={{ height: 7, borderRadius: 99 }}>
                          <div className={`progress-bar ${item.color}`}
                            style={{ width: `${Math.round((item.val/total)*100)}%` }} />
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            </div>

            {/* Infos système */}
            <div className="col-4">
              <div className="card border-0 shadow-sm h-100"
                style={{ borderRadius: 12 }}>
                <div className="card-body p-3">
                  <h6 className="fw-bold mb-3" style={{ fontSize: 13 }}>
                    ℹ️ Informations système
                  </h6>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 7 }}>
                    {[
                      { label: '👤 Rôle',
                        val: role === 'admin' ? 'Administrateur' : 'Manager',
                        color: role === 'admin' ? '#E24B4A' : '#EF9F27' },
                      { label: '👷 Employés',     val: stats.totalEmployes,          color: '#378ADD' },
                      { label: '🏢 Départements', val: stats.totalDepartements,      color: '#1D9E75' },
                      { label: '💰 Salaires',     val: stats.totalSalaires + ' MAD', color: '#EF9F27' },
                      { label: '🕐 Mis à jour',   val: new Date().toLocaleTimeString(), color: '#888' },
                    ].map((item, i) => (
                      <div key={i} style={{
                        display: 'flex', justifyContent: 'space-between',
                        alignItems: 'center', padding: '6px 10px',
                        background: '#f8f9fa', borderRadius: 8
                      }}>
                        <span style={{ fontSize: 11, color: '#666' }}>{item.label}</span>
                        <strong style={{ fontSize: 11, color: item.color }}>{item.val}</strong>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

          </div>
        </>
      )}
    </Layout>
  )
}

export default Dashboard
