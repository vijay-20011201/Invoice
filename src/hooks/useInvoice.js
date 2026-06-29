import { useState, useCallback, useEffect } from 'react'
import { getCompany, getSettings, formatInvoiceNumber, getNextInvoiceNumber, bumpInvoiceNumber, saveInvoice, getDraft, saveDraft } from '../services/localStorage'
import { DEFAULT_ITEM, CURRENCIES } from '../constants'
import { calcInvoiceTotals } from '../utils/calculations'

const today = () => new Date().toISOString().slice(0, 10)
const dueDate = (days = 30) => {
  const d = new Date()
  d.setDate(d.getDate() + days)
  return d.toISOString().slice(0, 10)
}

const newItem = () => ({ ...DEFAULT_ITEM, id: Date.now() + Math.random() })

export default function useInvoice(existingInvoice = null) {
  const company = getCompany()
  const settings = getSettings()
  const currency = CURRENCIES.find((c) => c.code === settings.currency) || CURRENCIES[0]

  const initForm = () => {
    if (existingInvoice) return existingInvoice
    const draft = getDraft()
    if (draft) return draft
    return {
      id: Date.now().toString(),
      invoiceNumber: formatInvoiceNumber(getNextInvoiceNumber(), settings.invoicePrefix),
      invoiceDate: today(),
      dueDate: dueDate(30),
      paymentTerms: 'Net 30',
      poNumber: '',
      referenceNumber: '',
      currency: settings.currency,
      status: 'Draft',
      customerName: '',
      customerCompany: '',
      customerGst: '',
      customerPhone: '',
      customerEmail: '',
      billingAddress: '',
      shippingAddress: '',
      customerCity: '',
      customerState: '',
      customerCountry: '',
      customerPin: '',
      items: [newItem()],
      shippingCharge: 0,
      additionalCharge: 0,
      roundOff: false,
      notes: settings.defaultNotes || '',
      terms: settings.defaultTerms || '',
    }
  }

  const [form, setForm] = useState(initForm)
  const [totals, setTotals] = useState(() => calcInvoiceTotals(initForm().items, 0, 0, false))

  const update = useCallback((patch) => {
    setForm((prev) => {
      const next = typeof patch === 'function' ? patch(prev) : { ...prev, ...patch }
      setTotals(calcInvoiceTotals(next.items, next.shippingCharge, next.additionalCharge, next.roundOff))
      saveDraft(next)
      return next
    })
  }, [])

  const updateItem = useCallback((id, patch) => {
    update((prev) => ({
      ...prev,
      items: prev.items.map((item) => item.id === id ? { ...item, ...patch } : item),
    }))
  }, [update])

  const addItem = useCallback(() => {
    update((prev) => ({ ...prev, items: [...prev.items, newItem()] }))
  }, [update])

  const removeItem = useCallback((id) => {
    update((prev) => ({ ...prev, items: prev.items.filter((i) => i.id !== id) }))
  }, [update])

  const duplicateItem = useCallback((id) => {
    update((prev) => {
      const idx = prev.items.findIndex((i) => i.id === id)
      if (idx < 0) return prev
      const copy = { ...prev.items[idx], id: Date.now() + Math.random() }
      const items = [...prev.items]
      items.splice(idx + 1, 0, copy)
      return { ...prev, items }
    })
  }, [update])

  const saveToStorage = useCallback((statusOverride) => {
    const toSave = {
      ...form,
      status: statusOverride || form.status,
      grandTotal: totals.grandTotal,
      customerName: form.customerName,
      createdAt: form.createdAt || Date.now(),
      updatedAt: Date.now(),
    }
    if (!existingInvoice) bumpInvoiceNumber()
    saveInvoice(toSave)
    return toSave
  }, [form, totals, existingInvoice])

  return { form, update, updateItem, addItem, removeItem, duplicateItem, saveToStorage, totals, company, settings, currency }
}
