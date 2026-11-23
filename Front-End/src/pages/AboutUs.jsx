import PageHeader from '../components/PageHeader'

export default function AboutUs() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-12">
      <PageHeader
        title="Quem Somos"
        subtitle="O PapaTicket é um sistema de inscrições para corridas de rua desenvolvido como trabalho acadêmico."
      />

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="race-card flex items-center gap-4 rounded-2xl border border-black/10 p-5">
          <span className="flex h-12 w-12 items-center justify-center rounded-full bg-ink text-lg font-black text-lime">1</span>
          <div>
            <p className="font-black">Rafael Sandrigo Rabal</p>
            <p className="text-sm text-black/60">RA 221387</p>
          </div>
        </div>

        <div className="race-card flex items-center gap-4 rounded-2xl border border-black/10 p-5">
          <span className="flex h-12 w-12 items-center justify-center rounded-full bg-ink text-lg font-black text-lime">2</span>
          <div>
            <p className="font-black">Kleber Luan Barbosa Leodoro</p>
            <p className="text-sm text-black/60">RA 222626</p>
          </div>
        </div>
      </div>
    </div>
  )
}
