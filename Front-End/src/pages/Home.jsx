import { useEffect, useState } from 'react'
import api from '../api'
import Alert from '../components/Alert'
import Button from '../components/Button'
import Field from '../components/Field'
import Loading from '../components/Loading'
import RaceCard from '../components/RaceCard'
import papaleguas from '../assets/papaleguas.png'
import { errorMessage } from '../utils/format'

const emptyFilters = { name: '', date_from: '', date_to: '', km_min: '', km_max: '' }

export default function Home() {
  const [filters, setFilters] = useState(emptyFilters)
  const [races, setRaces] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  async function loadRaces(params) {
    try {
      const activeParams = Object.fromEntries(Object.entries(params).filter(([, value]) => value !== ''))
      const { data } = await api.get('/races', { params: activeParams })
      setRaces(data.data)
      setError('')
    } catch (err) {
      setError(errorMessage(err, 'Não foi possível carregar as corridas.'))
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadRaces(emptyFilters)
  }, [])

  function handleChange(event) {
    setFilters({ ...filters, [event.target.name]: event.target.value })
  }

  function handleSubmit(event) {
    event.preventDefault()
    setLoading(true)
    loadRaces(filters)
  }

  function handleClear() {
    setFilters(emptyFilters)
    setLoading(true)
    loadRaces(emptyFilters)
  }

  return (
    <>
      <section className="hero text-white">
        <div className="mx-auto grid max-w-6xl items-center gap-8 px-4 pb-28 pt-20 md:grid-cols-[1fr_auto]">
          <div>
            <span className="inline-block rounded-full border border-lime/40 bg-lime/10 px-4 py-1 text-xs font-bold uppercase tracking-widest text-lime">
              Corridas de rua
            </span>
            <h1 className="mt-6 max-w-3xl text-4xl font-black leading-[1.05] tracking-tight sm:text-6xl">
              Escolha sua próxima prova e <span className="text-lime">garanta sua vaga.</span>
            </h1>
            <p className="mt-5 max-w-xl text-white/60">
              Encontre corridas abertas, filtre por data e distância e faça sua inscrição em poucos cliques.
            </p>
          </div>
          <div className="-mb-10 hidden md:block">
            <img src={papaleguas} alt="Papa-Léguas segurando um celular com o PapaTicket" className="w-64 lg:w-72" />
          </div>
        </div>
      </section>

      <section className="relative z-10 mx-auto -mt-14 max-w-6xl px-4">
        <form
          onSubmit={handleSubmit}
          className="grid gap-4 rounded-2xl border border-black/10 bg-white p-5 shadow-xl shadow-black/5 md:grid-cols-6"
        >
          <Field
            label="Nome"
            name="name"
            value={filters.name}
            onChange={handleChange}
            placeholder="Buscar corrida"
            className="md:col-span-2"
          />
          <Field label="Data de" type="date" name="date_from" value={filters.date_from} onChange={handleChange} />
          <Field label="Data até" type="date" name="date_to" value={filters.date_to} onChange={handleChange} />
          <Field label="Km mín." type="number" min="0" step="0.1" name="km_min" value={filters.km_min} onChange={handleChange} />
          <Field label="Km máx." type="number" min="0" step="0.1" name="km_max" value={filters.km_max} onChange={handleChange} />
          <div className="flex justify-end gap-3 md:col-span-6">
            <Button type="button" variant="outline" onClick={handleClear}>
              Limpar
            </Button>
            <Button type="submit">Filtrar</Button>
          </div>
        </form>
      </section>

      <section className="mx-auto max-w-6xl px-4 pt-12">
        <Alert>{error}</Alert>
        {loading ? (
          <Loading />
        ) : races.length === 0 ? (
          <p className="py-16 text-center text-black/50">Nenhuma corrida encontrada.</p>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {races.map((race) => (
              <RaceCard key={race.id} race={race} />
            ))}
          </div>
        )}
      </section>
    </>
  )
}
