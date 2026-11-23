import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import api from '../api'
import Alert from '../components/Alert'
import Button from '../components/Button'
import Loading from '../components/Loading'
import PageHeader from '../components/PageHeader'
import StatusBadge from '../components/StatusBadge'
import { errorMessage, formatDate, formatDateTime, formatKm, today } from '../utils/format'

export default function MyRegistrations() {
  const [registrations, setRegistrations] = useState([])
  const [loading, setLoading] = useState(true)
  const [confirming, setConfirming] = useState(null)
  const [error, setError] = useState('')

  useEffect(() => {
    api
      .get('/registrations')
      .then(({ data }) => setRegistrations(data.data))
      .catch((err) => setError(errorMessage(err)))
      .finally(() => setLoading(false))
  }, [])

  async function handleCancel(registration) {
    setError('')

    try {
      const { data } = await api.delete(`/registrations/${registration.id}`)
      setRegistrations(registrations.map((item) => (item.id === registration.id ? data.data : item)))
    } catch (err) {
      setError(errorMessage(err))
    } finally {
      setConfirming(null)
    }
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-12">
      <PageHeader title="Minhas inscrições" subtitle="Acompanhe as corridas em que você está inscrito." />
      <Alert>{error}</Alert>

      {loading ? (
        <Loading />
      ) : registrations.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-black/20 p-12 text-center">
          <p className="text-black/60">Você ainda não se inscreveu em nenhuma corrida.</p>
          <Link to="/" className="cta-glow mt-4 inline-block rounded-full bg-lime px-5 py-2.5 text-sm font-bold">
            Ver corridas
          </Link>
        </div>
      ) : (
        <ul className="mt-4 space-y-4">
          {registrations.map((registration) => {
            const { race } = registration
            const canCancel = registration.status === 'confirmed' && race.registration_deadline >= today()

            return (
              <li
                key={registration.id}
                className={`flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-black/10 p-5 ${
                  registration.status === 'cancelled' ? 'opacity-60' : ''
                }`}
              >
                <div className="flex items-center gap-4">
                  <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-ink text-center text-xs font-black leading-tight text-lime">
                    {formatKm(race.distance_km)}
                  </span>
                  <div>
                    <Link to={`/corridas/${race.id}`} className="font-black hover:underline">
                      {race.name}
                    </Link>
                    <p className="text-sm text-black/60">
                      {formatDateTime(race.starts_at)} · {race.city}/{race.state}
                    </p>
                    <p className="text-xs text-black/40">
                      Camiseta {registration.shirt_size} · Inscrito em {formatDate(registration.registered_at)}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <StatusBadge status={registration.status} />
                  {canCancel &&
                    (confirming === registration.id ? (
                      <>
                        <Button variant="danger" onClick={() => handleCancel(registration)}>
                          Confirmar cancelamento
                        </Button>
                        <Button variant="outline" onClick={() => setConfirming(null)}>
                          Voltar
                        </Button>
                      </>
                    ) : (
                      <Button variant="outline" onClick={() => setConfirming(registration.id)}>
                        Cancelar
                      </Button>
                    ))}
                </div>
              </li>
            )
          })}
        </ul>
      )}
    </div>
  )
}
