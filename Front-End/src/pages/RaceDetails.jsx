import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import api from '../api'
import Alert from '../components/Alert'
import Button from '../components/Button'
import { Select } from '../components/Field'
import Loading from '../components/Loading'
import { useAuth } from '../contexts/AuthContext'
import { errorMessage, formatDate, formatDateTime, formatKm, formatMoney, shirtSizes } from '../utils/format'

function Info({ label, children }) {
  return (
    <div className="rounded-2xl border border-black/10 p-4">
      <dt className="text-xs font-semibold uppercase tracking-wide text-black/40">{label}</dt>
      <dd className="mt-1 font-semibold">{children}</dd>
    </div>
  )
}

export default function RaceDetails() {
  const { id } = useParams()
  const { user } = useAuth()
  const [race, setRace] = useState(null)
  const [registered, setRegistered] = useState(false)
  const [shirtSize, setShirtSize] = useState('')
  const [loading, setLoading] = useState(true)
  const [sending, setSending] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  useEffect(() => {
    api
      .get(`/races/${id}`)
      .then(({ data }) => setRace(data.data))
      .catch((err) => setError(errorMessage(err, 'Corrida não encontrada.')))
      .finally(() => setLoading(false))
  }, [id])

  useEffect(() => {
    if (user?.role !== 'runner') {
      return
    }

    api.get('/registrations').then(({ data }) => {
      setRegistered(data.data.some((item) => item.race.id === Number(id) && item.status === 'confirmed'))
    })
  }, [id, user])

  async function handleRegister(event) {
    event.preventDefault()
    setSending(true)
    setError('')

    try {
      const { data } = await api.post('/registrations', { race_id: race.id, shirt_size: shirtSize })
      setRace((current) => ({ ...current, ...data.data.race }))
      setRegistered(true)
      setSuccess('Inscrição confirmada! Nos vemos na largada.')
    } catch (err) {
      setError(errorMessage(err))
    } finally {
      setSending(false)
    }
  }

  if (loading) {
    return <Loading />
  }

  if (!race) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-16">
        <Alert>{error}</Alert>
      </div>
    )
  }

  const canRegister = race.registration_open && race.available_spots > 0

  return (
    <div className="mx-auto grid max-w-6xl gap-8 px-4 py-12 lg:grid-cols-3">
      <section className="lg:col-span-2">
        <Link to="/" className="block w-fit text-sm font-semibold text-black/50 hover:text-ink">
          ← Voltar para corridas
        </Link>
        <span className="mt-6 inline-block rounded-full bg-ink px-4 py-1.5 text-sm font-black text-lime">
          {formatKm(race.distance_km)}
        </span>
        <h1 className="mt-4 text-4xl font-black tracking-tight">{race.name}</h1>
        {race.organizer && <p className="mt-2 text-sm text-black/50">Organização: {race.organizer}</p>}
        <p className="mt-6 whitespace-pre-line leading-relaxed text-black/70">{race.description}</p>

        <dl className="mt-8 grid gap-4 sm:grid-cols-2">
          <Info label="Data e horário">{formatDateTime(race.starts_at)}</Info>
          <Info label="Inscrições até">{formatDate(race.registration_deadline)}</Info>
          <Info label="Cidade">
            {race.city}/{race.state}
          </Info>
          <Info label="Local de largada">{race.start_location}</Info>
        </dl>
      </section>

      <aside className="h-fit rounded-3xl bg-ink p-6 text-white lg:sticky lg:top-24">
        <p className="text-xs font-semibold uppercase tracking-widest text-white/50">Valor da inscrição</p>
        <p className="mt-1 text-4xl font-black text-lime">{formatMoney(race.price)}</p>

        <div className="mt-6">
          <div className="flex justify-between text-sm">
            <span className="text-white/60">Vagas restantes</span>
            <span className="font-bold">
              {race.available_spots} de {race.max_participants}
            </span>
          </div>
          <div className="mt-2 h-2 overflow-hidden rounded-full bg-white/10">
            <div
              className="h-full rounded-full bg-lime"
              style={{ width: `${(race.registered_count / race.max_participants) * 100}%` }}
            />
          </div>
        </div>

        <div className="mt-6 space-y-4">
          {success && <Alert type="success">{success}</Alert>}
          {error && <Alert>{error}</Alert>}

          {registered ? (
            <Link
              to="/minhas-inscricoes"
              className="block rounded-full border border-lime py-3 text-center text-sm font-bold text-lime"
            >
              Você está inscrito · Ver inscrições
            </Link>
          ) : !canRegister ? (
            <p className="rounded-xl bg-white/10 p-4 text-center text-sm font-semibold text-white/70">
              {race.available_spots === 0 ? 'Vagas esgotadas.' : 'Inscrições encerradas.'}
            </p>
          ) : !user ? (
            <Link
              to="/login"
              state={{ from: `/corridas/${race.id}` }}
              className="cta-glow block rounded-full bg-lime py-3 text-center text-sm font-bold text-ink"
            >
              Entre para se inscrever
            </Link>
          ) : user.role === 'organizer' ? (
            <p className="rounded-xl bg-white/10 p-4 text-center text-sm text-white/70">
              Organizadores não podem se inscrever em corridas.
            </p>
          ) : (
            <form onSubmit={handleRegister} className="space-y-4 text-ink">
              <div className="[&_span]:text-white/60">
                <Select
                  label="Tamanho da camiseta"
                  value={shirtSize}
                  onChange={(event) => setShirtSize(event.target.value)}
                  options={Object.fromEntries(shirtSizes.map((size) => [size, size]))}
                  placeholder="Selecione"
                  required
                />
              </div>
              <Button type="submit" disabled={sending} className="w-full py-3">
                {sending ? 'Confirmando...' : 'Confirmar inscrição'}
              </Button>
              <p className="text-center text-xs text-white/40">Pagamento não é necessário nesta versão.</p>
            </form>
          )}
        </div>
      </aside>
    </div>
  )
}
