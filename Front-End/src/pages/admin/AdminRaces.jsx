import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import api from '../../api'
import Alert from '../../components/Alert'
import Button from '../../components/Button'
import Loading from '../../components/Loading'
import PageHeader from '../../components/PageHeader'
import StatusBadge from '../../components/StatusBadge'
import { errorMessage, formatDate, formatDateTime, formatKm, formatMoney } from '../../utils/format'

export default function AdminRaces() {
  const [races, setRaces] = useState([])
  const [loading, setLoading] = useState(true)
  const [confirming, setConfirming] = useState(null)
  const [error, setError] = useState('')

  useEffect(() => {
    api
      .get('/admin/races')
      .then(({ data }) => setRaces(data.data))
      .catch((err) => setError(errorMessage(err)))
      .finally(() => setLoading(false))
  }, [])

  async function handleDelete(race) {
    setError('')

    try {
      await api.delete(`/admin/races/${race.id}`)
      setRaces(races.filter((item) => item.id !== race.id))
    } catch (err) {
      setError(errorMessage(err))
    } finally {
      setConfirming(null)
    }
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-12">
      <PageHeader title="Minhas corridas" subtitle="Gerencie as corridas e acompanhe os inscritos.">
        <Link to="/admin/corridas/nova" className="cta-glow rounded-full bg-lime px-5 py-2.5 text-sm font-bold">
          + Nova corrida
        </Link>
      </PageHeader>

      <div className="mb-4">
        <Alert>{error}</Alert>
      </div>

      {loading ? (
        <Loading />
      ) : races.length === 0 ? (
        <p className="rounded-2xl border border-dashed border-black/20 p-12 text-center text-black/60">
          Nenhuma corrida cadastrada.
        </p>
      ) : (
        <div className="overflow-x-auto rounded-2xl border border-black/10">
          <table className="w-full min-w-[900px] text-left text-sm">
            <thead className="bg-ink text-xs uppercase tracking-wide text-white/60">
              <tr>
                <th className="px-5 py-4">Corrida</th>
                <th className="px-5 py-4">Data</th>
                <th className="px-5 py-4">Inscrições até</th>
                <th className="px-5 py-4">Valor</th>
                <th className="px-5 py-4">Inscritos</th>
                <th className="px-5 py-4">Status</th>
                <th className="px-5 py-4 text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-black/10">
              {races.map((race) => (
                <tr key={race.id} className="transition hover:bg-lime/10">
                  <td className="px-5 py-4">
                    <p className="font-bold">{race.name}</p>
                    <p className="text-xs text-black/50">
                      {formatKm(race.distance_km)} · {race.city}/{race.state}
                    </p>
                  </td>
                  <td className="px-5 py-4">{formatDateTime(race.starts_at)}</td>
                  <td className="px-5 py-4">{formatDate(race.registration_deadline)}</td>
                  <td className="px-5 py-4">{formatMoney(race.price)}</td>
                  <td className="px-5 py-4 font-semibold">
                    {race.registered_count}/{race.max_participants}
                  </td>
                  <td className="px-5 py-4">
                    <StatusBadge status={race.status} />
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex justify-end gap-2">
                      {confirming === race.id ? (
                        <>
                          <Button variant="danger" className="px-3 py-1.5 text-xs" onClick={() => handleDelete(race)}>
                            Confirmar exclusão
                          </Button>
                          <Button variant="outline" className="px-3 py-1.5 text-xs" onClick={() => setConfirming(null)}>
                            Voltar
                          </Button>
                        </>
                      ) : (
                        <>
                          <Link
                            to={`/admin/corridas/${race.id}/inscritos`}
                            className="rounded-full bg-ink px-3 py-1.5 text-xs font-bold text-white hover:bg-black/80"
                          >
                            Inscritos
                          </Link>
                          <Link
                            to={`/admin/corridas/${race.id}/editar`}
                            className="rounded-full border border-black/20 px-3 py-1.5 text-xs font-bold hover:border-ink"
                          >
                            Editar
                          </Link>
                          <Button variant="danger" className="px-3 py-1.5 text-xs" onClick={() => setConfirming(race.id)}>
                            Excluir
                          </Button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
