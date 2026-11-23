const styles = {
  error: 'border-red-200 bg-red-50 text-red-700',
  success: 'border-ink bg-lime text-ink',
}

export default function Alert({ type = 'error', children }) {
  if (!children) {
    return null
  }

  return <div className={`rounded-xl border px-4 py-3 text-sm font-medium ${styles[type]}`}>{children}</div>
}
