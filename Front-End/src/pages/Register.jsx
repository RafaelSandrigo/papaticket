import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import Alert from '../components/Alert'
import Button from '../components/Button'
import Field, { Select } from '../components/Field'
import { useAuth } from '../contexts/AuthContext'
import { errorMessage, fieldErrors, genders, today } from '../utils/format'
import { AuthLayout } from './Login'

const initialForm = {
  name: '',
  email: '',
  password: '',
  password_confirmation: '',
  cpf: '',
  birth_date: '',
  gender: '',
  phone: '',
  emergency_contact_name: '',
  emergency_contact_phone: '',
}

function Section({ title, children }) {
  return (
    <fieldset className="grid gap-4 sm:grid-cols-2">
      <legend className="mb-4 flex items-center gap-2 text-sm font-black uppercase tracking-wide">
        <span className="h-2 w-2 rounded-full bg-lime" />
        {title}
      </legend>
      {children}
    </fieldset>
  )
}

export default function Register() {
  const { register } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [form, setForm] = useState(initialForm)
  const [errors, setErrors] = useState({})
  const [error, setError] = useState('')
  const [sending, setSending] = useState(false)

  function handleChange(event) {
    setForm({ ...form, [event.target.name]: event.target.value })
  }

  async function handleSubmit(event) {
    event.preventDefault()
    setSending(true)
    setErrors({})
    setError('')

    try {
      await register(form)
      navigate(location.state?.from ?? '/', { replace: true })
    } catch (err) {
      setErrors(fieldErrors(err))
      setError(errorMessage(err))
      setSending(false)
    }
  }

  const input = (name) => ({ name, value: form[name], onChange: handleChange, error: errors[name], required: true })

  return (
    <AuthLayout wide title="Cadastro de corredor" subtitle="Preencha seus dados para se inscrever nas corridas.">
      <form onSubmit={handleSubmit} className="space-y-8">
        <Alert>{error}</Alert>

        <Section title="Acesso">
          <Field label="Nome completo" className="sm:col-span-2" {...input('name')} />
          <Field label="E-mail" type="email" className="sm:col-span-2" {...input('email')} />
          <Field label="Senha" type="password" minLength={8} {...input('password')} />
          <Field label="Confirme a senha" type="password" minLength={8} {...input('password_confirmation')} />
        </Section>

        <Section title="Dados pessoais">
          <Field label="CPF" placeholder="000.000.000-00" maxLength={14} {...input('cpf')} />
          <Field label="Data de nascimento" type="date" max={today()} {...input('birth_date')} />
          <Select label="Sexo" options={genders} placeholder="Selecione" {...input('gender')} />
          <Field label="Telefone" type="tel" placeholder="(11) 99999-9999" {...input('phone')} />
        </Section>

        <Section title="Contato de emergência">
          <Field label="Nome" {...input('emergency_contact_name')} />
          <Field label="Telefone" type="tel" {...input('emergency_contact_phone')} />
        </Section>

        <Button type="submit" disabled={sending} className="w-full py-3">
          {sending ? 'Cadastrando...' : 'Criar conta'}
        </Button>
        <p className="text-center text-sm text-black/60">
          Já tem conta?{' '}
          <Link to="/login" state={location.state} className="font-bold text-ink underline decoration-lime decoration-2 underline-offset-4">
            Entrar
          </Link>
        </p>
      </form>
    </AuthLayout>
  )
}
