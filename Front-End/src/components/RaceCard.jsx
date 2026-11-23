import { Link } from 'react-router-dom'
import { formatDate, formatDateTime, formatKm } from '../utils/format'

export default function RaceCard({ race }) {
  return (
    <Link to={`/corridas/${race.id}`} className="race-card flex flex-col rounded-2xl border border-black/10 bg-white p-6">
      <div className="mb-4 flex items-start justify-between gap-3">
        <span className="rounded-full bg-ink px-3 py-1 text-sm font-black text-lime">{formatKm(race.distance_km)}</span>
        {!race.registration_open ? (
          <span className="rounded-full bg-black/5 px-3 py-1 text-xs font-semibold text-black/50">Inscrições encerradas</span>
        ) : (
          race.available_spots <= 5 && (
            <span className="rounded-full border border-ink px-3 py-1 text-xs font-bold">
              {race.available_spots === 0 ? 'Esgotada' : race.available_spots === 1 ? 'Última vaga' : `Últimas ${race.available_spots} vagas`}
            </span>
          )
        )}
      </div>

      <h2 className="text-xl font-black leading-tight tracking-tight">{race.name}</h2>
      <p className="mt-2 line-clamp-2 text-sm text-black/60">{race.description}</p>

      <dl className="mt-6 grid gap-3 border-t border-black/10 pt-4 text-sm">
        <div>
          <dt className="text-xs font-semibold uppercase tracking-wide text-black/40">Local</dt>
          <dd className="font-medium">
            {race.city}/{race.state} · {race.start_location}
          </dd>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <dt className="text-xs font-semibold uppercase tracking-wide text-black/40">Data da corrida</dt>
            <dd className="font-medium">{formatDateTime(race.starts_at)}</dd>
          </div>
          <div>
            <dt className="text-xs font-semibold uppercase tracking-wide text-black/40">Inscrições até</dt>
            <dd className="font-medium">{formatDate(race.registration_deadline)}</dd>
          </div>
        </div>
      </dl>
    </Link>
  )
}
