export function formatDate(value) {
  if (!value) {
    return ''
  }

  const [year, month, day] = value.slice(0, 10).split('-')

  return `${day}/${month}/${year}`
}

export function formatDateTime(value) {
  if (!value) {
    return ''
  }

  return `${formatDate(value)} às ${value.slice(11, 16)}`
}

export function formatMoney(value) {
  return Number(value).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
}

export function formatKm(value) {
  return `${Number(value).toLocaleString('pt-BR', { maximumFractionDigits: 2 })} km`
}

export function formatCpf(value) {
  return value?.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4') ?? ''
}

export function today() {
  const now = new Date()
  const month = String(now.getMonth() + 1).padStart(2, '0')
  const day = String(now.getDate()).padStart(2, '0')

  return `${now.getFullYear()}-${month}-${day}`
}

export function errorMessage(error, fallback = 'Algo deu errado. Tente novamente.') {
  return error.response?.data?.message ?? fallback
}

export function fieldErrors(error) {
  const errors = error.response?.data?.errors ?? {}

  return Object.fromEntries(Object.entries(errors).map(([field, messages]) => [field, messages[0]]))
}

export const shirtSizes = ['PP', 'P', 'M', 'G', 'GG', 'XG']

export const genders = { M: 'Masculino', F: 'Feminino' }

export const states = ['AC', 'AL', 'AP', 'AM', 'BA', 'CE', 'DF', 'ES', 'GO', 'MA', 'MT', 'MS', 'MG', 'PA', 'PB', 'PR', 'PE', 'PI', 'RJ', 'RN', 'RS', 'RO', 'RR', 'SC', 'SP', 'SE', 'TO']
