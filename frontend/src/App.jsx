import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Login        from './pages/Login'
import Register     from './pages/Register'
import Employes     from './pages/Employes'
import Dashboard    from './pages/Dashboard'
import Departements from './pages/Departements'
import Conges       from './pages/Conges'
import GestionEmployes from './pages/admin/GestionEmployes'
import ValidationConges from './pages/admin/ValidationConges'
import GestionDepartements from './pages/admin/GestionDepartements'
import Utilisateurs    from './pages/admin/Utilisateurs'
import MonProfil       from './pages/MonProfil'
import Parametres      from './pages/Parametres'
import MesConges from './pages/MesConges'
import MonEquipe      from './pages/manager/MonEquipe'
import ManagerConges  from './pages/manager/ManagerConges'
import ModifierEmploye from './pages/manager/ModifierEmploye'
import LandingPage from './pages/LandingPage'

const PrivateRoute = ({ children }) => {
  const token = localStorage.getItem('token')
  return token ? children : <Navigate to="/login" />
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/"      element={<LandingPage />} />
        <Route path="/login"         element={<Login />} />
        <Route path="/register"      element={<Register />} />
        <Route path="/dashboard"     element={<PrivateRoute><Dashboard /></PrivateRoute>} />
        <Route path="/employes"      element={<PrivateRoute><Employes /></PrivateRoute>} />
        <Route path="/departements"  element={<PrivateRoute><Departements /></PrivateRoute>} />
        <Route path="/conges"        element={<PrivateRoute><Conges /></PrivateRoute>} />
        <Route path="/admin/employes" element={<PrivateRoute><GestionEmployes /></PrivateRoute>} />
        <Route path="/admin/conges" element={<PrivateRoute><ValidationConges /></PrivateRoute>} />
        <Route path="/admin/departements" element={<PrivateRoute><GestionDepartements /></PrivateRoute>} />
        <Route path="/admin/utilisateurs" element={<PrivateRoute><Utilisateurs /></PrivateRoute>} />
        <Route path="/mon-profil"         element={<PrivateRoute><MonProfil /></PrivateRoute>} />
        <Route path="/admin/parametres"   element={<PrivateRoute><Parametres /></PrivateRoute>} />
        <Route path="/mes-conges" element={
          <PrivateRoute><MesConges /></PrivateRoute>
        } />

       
       <Route path="/mon-equipe" element={
         <PrivateRoute><MonEquipe /></PrivateRoute>
      } />
      <Route path="/manager/conges" element={
       <PrivateRoute><ManagerConges /></PrivateRoute>
          } />
        <Route path="/manager/employe/:id" element={<PrivateRoute><ModifierEmploye /></PrivateRoute>} />
      </Routes>
    </BrowserRouter>
  )
}

export default App