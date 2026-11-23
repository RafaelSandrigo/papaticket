import { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import api from '../../api'
import Alert from '../../components/Alert'
import Button from '../../components/Button'
import Field, { Select } from '../../components/Field'
import Loading from '../../components/Loading'
import PageHeader from '../../components/PageHeader'
import { errorMessage, fieldErrors, states } from '../../utils/format'

const initialForm = {
  name: '',
  description: '',
  distance_km: '',
  city: '',
  state: '',
  start_location: '',
  starts_at: '',
  registration_deadline: '',
  max_participants: '',
  price: '',
  status: 'active',
}

const fields = Object.keys(initialForm)

export default function RaceForm() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [form, setForm] = useState(initialForm)
  const [errors, setErrors] = useState({})
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(Boolean(id))
  const [sending, setSending] = useState(false)

  useEffect(() => {
    if (!id) {
      return
    }

    api
      .get(`/admin/races/${id}`)
      .then(({ data }) => setForm(Object.fromEntries(fields.map((field) => [field, data.data[field]]))))
      .catch((err) => setError(errorMessage(err, 'Corrida não encontrada.')))
      .finally(() => setLoading(false))
  }, [id])

  function handleChange(event) {
    setForm({ ...form, [event.target.name]: event.target.value })
  }

  async function handleSubmit(event) {
    event.preventDefault()
    setSending(true)
    setErrors({})
    setError('')

    try {
      if (id) {
        await api.put(`/admin/races/${id}`, form)
      } else {
        await api.post('/admin/races', form)
      }

      navigate('/admin/corridas')
    } catch (err) {
      setErrors(fieldErrors(err))
      setError(errorMessage(err))
      setSending(false)
    }
  }

  const input = (name) => ({ name, value: form[name], onChange: handleChange, error: errors[name], required: true })

  if (loading) {
    return <Loading />
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-12">
      <Link to="/admin/corridas" className="block w-fit text-sm font-semibold text-black/50 hover:text-ink">
        ← Voltar
      </Link>
      <div className="mt-4">
        <PageHeader title={id ? 'Editar corrida' : 'Nova corrida'} />
      </div>

      <form onSubmit={handleSubmit} className="grid gap-5 rounded-3xl border border-black/10 p-6 sm:grid-cols-2">
        <div className="sm:col-span-2">
          <Alert>{error}</Alert>
        </div>
        <Field label="Nome" className="sm:col-span-2" {...input('name')} />
        <Field label="Descrição" as="textarea" rows={4} className="sm:col-span-2" {...input('description')} />
        <Field label="Distância (km)" type="number" step="0.01" min="0.1" {...input('distance_km')} />
        <Select
          label="Status"
          options={{ active: 'Ativa', inactive: 'Inativa' }}
          {...input('status')}
        />
        <Field label="Cidade" {...input('city')} />
        <Select
          label="Estado"
          options={Object.fromEntries(states.map((uf) => [uf, uf]))}
          placeholder="Selecione"
          {...input('state')}
        />
        <Field label="Local de largada" className="sm:col-span-2" {...input('start_location')} />
        <Field label="Data e horário da corrida" type="datetime-local" {...input('starts_at')} />
        <Field label="Data limite de inscrição" type="date" {...input('registration_deadline')} />
        <Field label="Limite de vagas" type="number" min="1" {...input('max_participants')} />
        <Field label="Valor da inscrição (R$)" type="number" step="0.01" min="0" {...input('price')} />

        <div className="flex justify-end gap-3 sm:col-span-2">
          <Link to="/admin/corridas" className="rounded-full border border-black/20 px-5 py-2.5 text-sm font-bold hover:border-ink">
            Cancelar
          </Link>
          <Button type="submit" disabled={sending}>
            {sending ? 'Salvando...' : 'Salvar corrida'}
          </Button>
        </div>
      </form>
    </div>
  )
}
