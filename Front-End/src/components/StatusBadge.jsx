const badges = {
  confirmed: ['Confirmada', 'bg-lime text-ink'],
  cancelled: ['Cancelada', 'bg-black/5 text-black/50 line-through'],
  active: ['Ativa', 'bg-lime text-ink'],
  inactive: ['Inativa', 'bg-black/10 text-black/60'],
}

export default function StatusBadge({ status }) {
  const [label, style] = badges[status] ?? [status, 'bg-black/10']

  return <span className={`inline-block rounded-full px-3 py-1 text-xs font-bold ${style}`}>{label}</span>
}
