import { useEffect, useState } from 'react'
import api from '../../api'
import Alert from '../../components/Alert'
import Button from '../../components/Button'
import Field from '../../components/Field'
import Loading from '../../components/Loading'
import PageHeader from '../../components/PageHeader'
import { errorMessage, fieldErrors } from '../../utils/format'

export default function OrganizerProfile() {
  const [form, setForm] = useState({ organization_name: '', document: '', phone: '' })
  const [errors, setErrors] = useState({})
  const [message, setMessage] = useState({ type: 'error', text: '' })
  const [loading, setLoading] = useState(true)
  const [sending, setSending] = useState(false)

  useEffect(() => {
    api
      .get('/admin/profile')
      .then(({ data }) =>
        setForm({
          organization_name: data.data.organization_name ?? '',
          document: data.data.document ?? '',
          phone: data.data.phone ?? '',
        }),
      )
      .finally(() => setLoading(false))
  }, [])

  function handleChange(event) {
    setForm({ ...form, [event.target.name]: event.target.value })
  }

  async function handleSubmit(event) {
    event.preventDefault()
    setSending(true)
    setErrors({})
    setMessage({ type: 'error', text: '' })

    try {
      await api.put('/admin/profile', form)
      setMessage({ type: 'success', text: 'Dados da organização atualizados.' })
    } catch (err) {
      setErrors(fieldErrors(err))
      setMessage({ type: 'error', text: errorMessage(err) })
    } finally {
      setSending(false)
    }
  }

  const input = (name) => ({ name, value: form[name], onChange: handleChange, error: errors[name], required: true })

  if (loading) {
    return <Loading />
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-12">
      <PageHeader title="Organização" subtitle="Dados exibidos nas páginas das corridas." />

      <form onSubmit={handleSubmit} className="grid gap-5 rounded-3xl border border-black/10 p-6 sm:grid-cols-2">
        <div className="sm:col-span-2">
          <Alert type={message.type}>{message.text}</Alert>
        </div>
        <Field label="Nome da organização" className="sm:col-span-2" {...input('organization_name')} />
        <Field label="CNPJ / CPF" {...input('document')} />
        <Field label="Telefone" type="tel" {...input('phone')} />
        <div className="flex justify-end sm:col-span-2">
          <Button type="submit" disabled={sending}>
            {sending ? 'Salvando...' : 'Salvar'}
          </Button>
        </div>
      </form>
    </div>
  )
}
