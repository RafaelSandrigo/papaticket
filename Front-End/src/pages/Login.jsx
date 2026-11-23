import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import Alert from '../components/Alert'
import Button from '../components/Button'
import Field from '../components/Field'
import { useAuth } from '../contexts/AuthContext'
import { errorMessage } from '../utils/format'

export function AuthLayout({ title, subtitle, children, wide = false }) {
  return (
    <div className="hero min-h-[calc(100vh-150px)] px-4 py-16">
      <div className={`mx-auto rounded-3xl bg-white p-8 shadow-2xl ${wide ? 'max-w-3xl' : 'max-w-md'}`}>
        <h1 className="text-3xl font-black tracking-tight">{title}</h1>
        <p className="mt-1 text-sm text-black/60">{subtitle}</p>
        <div className="mt-8">{children}</div>
      </div>
    </div>
  )
}

export default function Login() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [form, setForm] = useState({ email: '', password: '' })
  const [error, setError] = useState('')
  const [sending, setSending] = useState(false)

  async function handleSubmit(event) {
    event.preventDefault()
    setSending(true)
    setError('')

    try {
      const user = await login(form.email, form.password)
      const fallback = user.role === 'organizer' ? '/admin/corridas' : '/'
      navigate(location.state?.from ?? fallback, { replace: true })
    } catch (err) {
      setError(errorMessage(err))
      setSending(false)
    }
  }

  function handleChange(event) {
    setForm({ ...form, [event.target.name]: event.target.value })
  }

  return (
    <AuthLayout title="Entrar" subtitle="Acesse sua conta para se inscrever nas corridas.">
      <form onSubmit={handleSubmit} className="space-y-5">
        <Alert>{error}</Alert>
        <Field label="E-mail" type="email" name="email" value={form.email} onChange={handleChange} required />
        <Field label="Senha" type="password" name="password" value={form.password} onChange={handleChange} required />
        <Button type="submit" disabled={sending} className="w-full py-3">
          {sending ? 'Entrando...' : 'Entrar'}
        </Button>
        <p className="text-center text-sm text-black/60">
          Ainda não tem conta?{' '}
          <Link to="/cadastro" state={location.state} className="font-bold text-ink underline decoration-lime decoration-2 underline-offset-4">
            Cadastre-se
          </Link>
        </p>
      </form>
    </AuthLayout>
  )
}
