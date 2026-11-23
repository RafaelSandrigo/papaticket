const inputClass =
  'w-full rounded-xl border border-black/15 bg-white px-4 py-2.5 text-sm outline-none transition focus:border-ink focus:ring-4 focus:ring-lime/40'

export default function Field({ label, error, as = 'input', children, className = '', ...props }) {
  const Component = as

  return (
    <label className={`flex flex-col gap-1.5 ${className}`}>
      <span className="text-xs font-semibold uppercase tracking-wide text-black/60">{label}</span>
      {children ?? <Component className={inputClass} {...props} />}
      {error && <span className="text-xs font-medium text-red-600">{error}</span>}
    </label>
  )
}

export function Select({ label, error, options, placeholder, className = '', ...props }) {
  return (
    <Field label={label} error={error} className={className}>
      <select className={inputClass} {...props}>
        {placeholder && <option value="">{placeholder}</option>}
        {Object.entries(options).map(([value, text]) => (
          <option key={value} value={value}>
            {text}
          </option>
        ))}
      </select>
    </Field>
  )
}
