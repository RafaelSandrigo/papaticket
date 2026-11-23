import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import api from '../../api'
import Alert from '../../components/Alert'
import Loading from '../../components/Loading'
import PageHeader from '../../components/PageHeader'
import StatusBadge from '../../components/StatusBadge'
import { errorMessage, formatCpf, formatDate, formatDateTime, genders } from '../../utils/format'

export default function RaceRegistrations() {
  const { id } = useParams()
  const [race, setRace] = useState(null)
  const [registrations, setRegistrations] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    api
      .get(`/admin/races/${id}/registrations`)
      .then(({ data }) => {
        setRace(data.race)
        setRegistrations(data.data)
      })
      .catch((err) => setError(errorMessage(err)))
      .finally(() => setLoading(false))
  }, [id])

  if (loading) {
    return <Loading />
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-12">
      <Link to="/admin/corridas" className="block w-fit text-sm font-semibold text-black/50 hover:text-ink">
        ← Voltar
      </Link>
      <div className="mt-4">
        <PageHeader
          title={race ? `Inscritos · ${race.name}` : 'Inscritos'}
          subtitle={race && `${formatDateTime(race.starts_at)} · ${race.city}/${race.state}`}
        >
          {race && (
            <div className="rounded-2xl bg-ink px-5 py-3 text-white">
              <span className="text-2xl font-black text-lime">{race.registered_count}</span>
              <span className="text-sm text-white/60"> / {race.max_participants} vagas</span>
            </div>
          )}
        </PageHeader>
      </div>

      <Alert>{error}</Alert>

      {registrations.length === 0 ? (
        <p className="rounded-2xl border border-dashed border-black/20 p-12 text-center text-black/60">
          Nenhum inscrito nesta corrida.
        </p>
      ) : (
        <div className="overflow-x-auto rounded-2xl border border-black/10">
          <table className="w-full min-w-[1000px] text-left text-sm">
            <thead className="bg-ink text-xs uppercase tracking-wide text-white/60">
              <tr>
                <th className="px-5 py-4">Corredor</th>
                <th className="px-5 py-4">CPF</th>
                <th className="px-5 py-4">Sexo</th>
                <th className="px-5 py-4">Idade</th>
                <th className="px-5 py-4">Telefone</th>
                <th className="px-5 py-4">Emergência</th>
                <th className="px-5 py-4">Camiseta</th>
                <th className="px-5 py-4">Inscrição</th>
                <th className="px-5 py-4">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-black/10 [&_td]:whitespace-nowrap">
              {registrations.map(({ id: registrationId, runner, shirt_size, registered_at, status }) => {
                const profile = runner.runner_profile

                return (
                  <tr key={registrationId} className="transition hover:bg-lime/10">
                    <td className="px-5 py-4">
                      <p className="font-bold">{runner.name}</p>
                      <p className="text-xs text-black/50">{runner.email}</p>
                    </td>
                    <td className="px-5 py-4">{formatCpf(profile?.cpf)}</td>
                    <td className="px-5 py-4">{genders[profile?.gender]}</td>
                    <td className="px-5 py-4">{profile?.age} anos</td>
                    <td className="px-5 py-4">{profile?.phone}</td>
                    <td className="px-5 py-4">
                      <p>{profile?.emergency_contact_name}</p>
                      <p className="text-xs text-black/50">{profile?.emergency_contact_phone}</p>
                    </td>
                    <td className="px-5 py-4 font-bold">{shirt_size}</td>
                    <td className="px-5 py-4">{formatDate(registered_at)}</td>
                    <td className="px-5 py-4">
                      <StatusBadge status={status} />
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
