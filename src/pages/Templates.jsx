import { useState } from 'react'
import { CheckCircle } from 'lucide-react'
import { INVOICE_THEMES } from '../constants'
import { getSettings, saveSettings, getCompany } from '../services/localStorage'
import InvoicePreview from '../components/invoice/InvoicePreview'

const DEMO_FORM = {
  invoiceNumber: 'INV-0001',
  invoiceDate: '2026-06-27',
  dueDate: '2026-07-27',
  paymentTerms: 'Net 30',
  status: 'Unpaid',
  customerName: 'Acme Corp',
  customerCompany: 'Acme Technologies Pvt. Ltd.',
  billingAddress: '42 MG Road, Bangalore - 560001',
  customerEmail: 'billing@acme.com',
  customerPhone: '+91 98765 43210',
  items: [
    { id: 1, name: 'Web Design', description: 'UI/UX and frontend development', quantity: 1, unitPrice: 25000, discountType: 'Percentage', discountValue: 5, gst: 18 },
    { id: 2, name: 'SEO Setup', description: 'On-page optimization', quantity: 3, unitPrice: 5000, discountType: 'Flat', discountValue: 500, gst: 12 },
  ],
  shippingCharge: 0,
  additionalCharge: 0,
  roundOff: true,
  notes: 'Thank you for your business!',
  terms: 'Payment due within 30 days of invoice date.',
}

const DEMO_TOTALS = {
  subtotal: 40000,
  totalDiscount: 1750,
  taxableSubtotal: 38250,
  totalGst: 5655,
  shipping: 0,
  additional: 0,
  roundOffAmt: -0.05,
  grandTotal: 43904.95,
}

export default function Templates() {
  const [settings, setSettings] = useState(getSettings)
  const [saved, setSaved] = useState(false)
  const company = getCompany()
  const currency = { symbol: '₹', code: 'INR' }

  const selectTheme = (id) => {
    const updated = { ...settings, theme: id }
    saveSettings(updated)
    setSettings(updated)
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  return (
    <div className="p-4 lg:p-8 max-w-7xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Invoice Templates</h2>
          <p className="text-gray-500 text-sm mt-1">Choose a style for your invoices. Data stays the same.</p>
        </div>
        {saved && <span className="text-sm text-emerald-600 font-medium bg-emerald-50 px-3 py-1.5 rounded-lg">✓ Theme applied</span>}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Theme picker */}
        <div className="lg:col-span-3 space-y-2">
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-3">Templates</p>
          {INVOICE_THEMES.map((theme) => (
            <button
              key={theme.id}
              onClick={() => selectTheme(theme.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl border-2 text-left transition-all ${settings.theme === theme.id ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-gray-300 bg-white'}`}
            >
              <div className="w-6 h-6 rounded-md flex-shrink-0" style={{ background: theme.color }} />
              <span className="font-medium text-gray-800 text-sm">{theme.name}</span>
              {settings.theme === theme.id && <CheckCircle size={16} className="text-blue-500 ml-auto" />}
            </button>
          ))}
        </div>

        {/* Preview */}
        <div className="lg:col-span-9">
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-3">Preview</p>
          <div className="rounded-xl overflow-hidden shadow-xl border border-gray-200 origin-top" style={{ transform: 'scale(0.75)', transformOrigin: 'top left', width: '133.33%' }}>
            <InvoicePreview
              form={DEMO_FORM}
              totals={DEMO_TOTALS}
              company={company}
              currency={currency}
              settings={settings}
            />
          </div>
        </div>
      </div>
    </div>
  )
}
