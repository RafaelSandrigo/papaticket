const variants = {
  primary: 'cta-glow bg-lime text-ink hover:bg-lime-dark',
  dark: 'bg-ink text-white hover:bg-black/80',
  outline: 'border border-black/20 text-ink hover:border-ink',
  danger: 'border border-red-200 text-red-600 hover:bg-red-50',
}

export default function Button({ variant = 'primary', className = '', ...props }) {
  return (
    <button
      className={`inline-flex items-center justify-center rounded-full px-5 py-2.5 text-sm font-bold transition disabled:cursor-not-allowed disabled:opacity-40 ${variants[variant]} ${className}`}
      {...props}
    />
  )
}
