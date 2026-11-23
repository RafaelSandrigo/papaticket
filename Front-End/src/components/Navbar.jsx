import { Link, NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'

function MenuLink({ to, children }) {
  return (
    <NavLink
      to={to}
      end
      className={({ isActive }) =>
        `text-sm font-medium transition-colors ${isActive ? 'text-lime' : 'text-white/70 hover:text-white'}`
      }
    >
      {children}
    </NavLink>
  )
}

export default function Navbar() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  async function handleLogout() {
    await logout()
    navigate('/')
  }

  return (
    <header className="glass sticky top-0 z-50 border-b border-white/10">
      <nav className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-4 px-4 py-4">
        <Link to="/" className="text-xl font-black tracking-tight text-white">
          PAPA<span className="text-lime">TICKET</span>
        </Link>

        <div className="flex flex-wrap items-center gap-5">
          <MenuLink to="/">Corridas</MenuLink>
          {user?.role === 'runner' && <MenuLink to="/minhas-inscricoes">Minhas inscrições</MenuLink>}
          {user?.role === 'organizer' && (
            <>
              <MenuLink to="/admin/corridas">Minhas corridas</MenuLink>
              <MenuLink to="/admin/perfil">Organização</MenuLink>
            </>
          )}
          <MenuLink to="/quem-somos">Quem Somos</MenuLink>
        </div>

        <div className="flex items-center gap-3">
          {user ? (
            <>
              <span className="hidden text-sm text-white/60 sm:inline">Olá, {user.name.split(' ')[0]}</span>
              <button
                onClick={handleLogout}
                className="rounded-full border border-white/25 px-4 py-2 text-sm font-semibold text-white transition hover:border-white"
              >
                Sair
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="text-sm font-semibold text-white/80 hover:text-white">
                Entrar
              </Link>
              <Link to="/cadastro" className="cta-glow rounded-full bg-lime px-4 py-2 text-sm font-bold text-ink">
                Cadastre-se
              </Link>
            </>
          )}
        </div>
      </nav>
    </header>
  )
}
