import { LS_KEYS, DEFAULT_COMPANY, DEFAULT_SETTINGS } from '../constants'

export const storage = {
  get: (key, fallback = null) => {
    try {
      const item = localStorage.getItem(key)
      return item ? JSON.parse(item) : fallback
    } catch {
      return fallback
    }
  },
  set: (key, value) => {
    try {
      localStorage.setItem(key, JSON.stringify(value))
    } catch (e) {
      console.error('LocalStorage write failed:', e)
    }
  },
  remove: (key) => localStorage.removeItem(key),
}

export const getCompany = () => storage.get(LS_KEYS.COMPANY, DEFAULT_COMPANY)
export const saveCompany = (data) => storage.set(LS_KEYS.COMPANY, data)

export const getSettings = () => storage.get(LS_KEYS.SETTINGS, DEFAULT_SETTINGS)
export const saveSettings = (data) => storage.set(LS_KEYS.SETTINGS, data)

export const getInvoices = () => storage.get(LS_KEYS.INVOICES, [])
export const saveInvoices = (invoices) => storage.set(LS_KEYS.INVOICES, invoices)

export const saveInvoice = (invoice) => {
  const invoices = getInvoices()
  const idx = invoices.findIndex((inv) => inv.id === invoice.id)
  if (idx >= 0) {
    invoices[idx] = invoice
  } else {
    invoices.unshift(invoice)
  }
  saveInvoices(invoices)
  return invoice
}

export const deleteInvoice = (id) => {
  const invoices = getInvoices().filter((inv) => inv.id !== id)
  saveInvoices(invoices)
}

export const getNextInvoiceNumber = () => {
  const settings = getSettings()
  const next = (settings.lastInvoiceNumber || 0) + 1
  return next
}

export const bumpInvoiceNumber = () => {
  const settings = getSettings()
  settings.lastInvoiceNumber = (settings.lastInvoiceNumber || 0) + 1
  saveSettings(settings)
  return settings.lastInvoiceNumber
}

export const formatInvoiceNumber = (num, prefix = 'INV') => {
  return `${prefix}-${String(num).padStart(4, '0')}`
}

export const getDraft = () => storage.get(LS_KEYS.DRAFT, null)
export const saveDraft = (data) => storage.set(LS_KEYS.DRAFT, data)
export const clearDraft = () => storage.remove(LS_KEYS.DRAFT)
