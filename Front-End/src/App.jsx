import { Navigate, Route, Routes } from 'react-router-dom'
import Footer from './components/Footer'
import Navbar from './components/Navbar'
import PrivateRoute from './components/PrivateRoute'
import AboutUs from './pages/AboutUs'
import Home from './pages/Home'
import Login from './pages/Login'
import MyRegistrations from './pages/MyRegistrations'
import RaceDetails from './pages/RaceDetails'
import Register from './pages/Register'
import AdminRaces from './pages/admin/AdminRaces'
import OrganizerProfile from './pages/admin/OrganizerProfile'
import RaceForm from './pages/admin/RaceForm'
import RaceRegistrations from './pages/admin/RaceRegistrations'

export default function App() {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/corridas/:id" element={<RaceDetails />} />
          <Route path="/login" element={<Login />} />
          <Route path="/cadastro" element={<Register />} />
          <Route path="/quem-somos" element={<AboutUs />} />

          <Route element={<PrivateRoute role="runner" />}>
            <Route path="/minhas-inscricoes" element={<MyRegistrations />} />
          </Route>

          <Route element={<PrivateRoute role="organizer" />}>
            <Route path="/admin/corridas" element={<AdminRaces />} />
            <Route path="/admin/corridas/nova" element={<RaceForm />} />
            <Route path="/admin/corridas/:id/editar" element={<RaceForm />} />
            <Route path="/admin/corridas/:id/inscritos" element={<RaceRegistrations />} />
            <Route path="/admin/perfil" element={<OrganizerProfile />} />
          </Route>

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
      <Footer />
    </div>
  )
}
