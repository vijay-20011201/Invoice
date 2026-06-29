import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { Save, Upload, X, Building2, CreditCard, Settings2, FileText } from 'lucide-react'
import { getCompany, saveCompany, getSettings, saveSettings } from '../services/localStorage'
import { DEFAULT_COMPANY, DEFAULT_SETTINGS, CURRENCIES, INVOICE_THEMES, PAPER_SIZES, PAYMENT_TERMS } from '../constants'
import { fileToBase64, resizeImage } from '../utils/imageUtils'

const TABS = [
  { id: 'company', label: 'Company Info', icon: Building2 },
  { id: 'bank', label: 'Bank & UPI', icon: CreditCard },
  { id: 'defaults', label: 'Defaults', icon: Settings2 },
  { id: 'appearance', label: 'Appearance', icon: FileText },
]

export default function Settings() {
  const [tab, setTab] = useState('company')
  const [saved, setSaved] = useState(false)

  const { register: regC, handleSubmit: hsC, setValue: svC, watch: watchC } = useForm({
    defaultValues: { ...DEFAULT_COMPANY, ...getCompany() },
  })
  const { register: regS, handleSubmit: hsS, setValue: svS, watch: watchS } = useForm({
    defaultValues: { ...DEFAULT_SETTINGS, ...getSettings() },
  })

  const logo = watchC('logo')
  const signature = watchC('signature')
  const theme = watchS('theme')

  const handleLogoUpload = async (e) => {
    const file = e.target.files[0]
    if (!file) return
    const b64 = await fileToBase64(file)
    const resized = await resizeImage(b64, 400, 160)
    svC('logo', resized)
  }

  const handleSigUpload = async (e) => {
    const file = e.target.files[0]
    if (!file) return
    const b64 = await fileToBase64(file)
    const resized = await resizeImage(b64, 300, 120)
    svC('signature', resized)
  }

  const onSaveCompany = (data) => {
    saveCompany(data)
    flash()
  }

  const onSaveSettings = (data) => {
    saveSettings(data)
    flash()
  }

  const flash = () => {
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  return (
    <div className="p-4 lg:p-8 max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Settings</h2>
          <p className="text-gray-500 text-sm mt-1">Configure your company and invoice preferences</p>
        </div>
        {saved && (
          <span className="text-sm text-emerald-600 font-medium bg-emerald-50 px-3 py-1.5 rounded-lg">
            ✓ Saved successfully
          </span>
        )}
      </div>

      {/* Tab bar */}
      <div className="flex gap-1 bg-gray-100 p-1 rounded-xl mb-6 overflow-x-auto">
        {TABS.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            onClick={() => setTab(id)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors flex-1 justify-center
              ${tab === id ? 'bg-white text-blue-700 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
          >
            <Icon size={15} />
            {label}
          </button>
        ))}
      </div>

      {/* Company Info */}
      {tab === 'company' && (
        <form onSubmit={hsC(onSaveCompany)} className="space-y-6">
          {/* Logo */}
          <Card title="Company Logo & Signature">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Company Logo</label>
                {logo ? (
                  <div className="relative inline-block">
                    <img src={logo} alt="Logo" className="h-20 object-contain border border-gray-200 rounded-lg p-2 bg-white" />
                    <button type="button" onClick={() => svC('logo', '')} className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs">
                      <X size={10} />
                    </button>
                  </div>
                ) : (
                  <label className="flex flex-col items-center justify-center w-full h-24 border-2 border-dashed border-gray-300 rounded-xl cursor-pointer hover:border-blue-400 hover:bg-blue-50 transition-colors">
                    <Upload size={20} className="text-gray-400 mb-1" />
                    <span className="text-xs text-gray-400">Upload logo (PNG/JPG)</span>
                    <input type="file" accept="image/*" className="hidden" onChange={handleLogoUpload} />
                  </label>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Signature</label>
                {signature ? (
                  <div className="relative inline-block">
                    <img src={signature} alt="Signature" className="h-20 object-contain border border-gray-200 rounded-lg p-2 bg-white" />
                    <button type="button" onClick={() => svC('signature', '')} className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs">
                      <X size={10} />
                    </button>
                  </div>
                ) : (
                  <label className="flex flex-col items-center justify-center w-full h-24 border-2 border-dashed border-gray-300 rounded-xl cursor-pointer hover:border-blue-400 hover:bg-blue-50 transition-colors">
                    <Upload size={20} className="text-gray-400 mb-1" />
                    <span className="text-xs text-gray-400">Upload signature</span>
                    <input type="file" accept="image/*" className="hidden" onChange={handleSigUpload} />
                  </label>
                )}
              </div>
            </div>
          </Card>

          {/* Business Info */}
          <Card title="Business Information">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Field label="Company Name *" required><input {...regC('name', { required: true })} className="input" placeholder="Your Business Name" /></Field>
              <Field label="GST Number"><input {...regC('gst')} className="input" placeholder="22AAAAA0000A1Z5" /></Field>
              <Field label="Phone"><input {...regC('phone')} className="input" placeholder="+91 98765 43210" /></Field>
              <Field label="Email"><input {...regC('email')} type="email" className="input" placeholder="hello@company.com" /></Field>
              <Field label="Website"><input {...regC('website')} className="input" placeholder="www.company.com" /></Field>
              <Field label="Address" full><textarea {...regC('address')} className="input" rows={2} placeholder="Street, Area" /></Field>
              <Field label="City"><input {...regC('city')} className="input" placeholder="Mumbai" /></Field>
              <Field label="State"><input {...regC('state')} className="input" placeholder="Maharashtra" /></Field>
              <Field label="Country"><input {...regC('country')} className="input" placeholder="India" /></Field>
              <Field label="PIN Code"><input {...regC('pin')} className="input" placeholder="400001" /></Field>
            </div>
          </Card>

          <button type="submit" className="btn-primary flex items-center gap-2">
            <Save size={16} /> Save Company Info
          </button>
        </form>
      )}

      {/* Bank & UPI */}
      {tab === 'bank' && (
        <form onSubmit={hsC(onSaveCompany)} className="space-y-6">
          <Card title="Bank Account Details">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Field label="Bank Name"><input {...regC('bankName')} className="input" placeholder="HDFC Bank" /></Field>
              <Field label="Account Number"><input {...regC('accountNumber')} className="input" placeholder="1234567890" /></Field>
              <Field label="IFSC Code"><input {...regC('ifsc')} className="input" placeholder="HDFC0001234" /></Field>
              <Field label="Account Holder"><input {...regC('accountHolder')} className="input" placeholder="John Doe" /></Field>
              <Field label="UPI ID" full><input {...regC('upiId')} className="input" placeholder="business@upi" /></Field>
            </div>
          </Card>
          <button type="submit" className="btn-primary flex items-center gap-2">
            <Save size={16} /> Save Bank Details
          </button>
        </form>
      )}

      {/* Defaults */}
      {tab === 'defaults' && (
        <form onSubmit={hsS(onSaveSettings)} className="space-y-6">
          <Card title="Invoice Defaults">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Field label="Default Currency">
                <select {...regS('currency')} className="input">
                  {CURRENCIES.map((c) => (
                    <option key={c.code} value={c.code}>{c.code} — {c.name}</option>
                  ))}
                </select>
              </Field>
              <Field label="Invoice Prefix">
                <input {...regS('invoicePrefix')} className="input" placeholder="INV" />
              </Field>
              <Field label="Paper Size">
                <select {...regS('paperSize')} className="input">
                  {PAPER_SIZES.map((s) => <option key={s}>{s}</option>)}
                </select>
              </Field>
              <Field label="Default Notes" full>
                <textarea {...regS('defaultNotes')} className="input" rows={3} placeholder="Thank you for your business!" />
              </Field>
              <Field label="Default Terms & Conditions" full>
                <textarea {...regS('defaultTerms')} className="input" rows={3} placeholder="Payment due within 30 days..." />
              </Field>
            </div>
          </Card>
          <button type="submit" className="btn-primary flex items-center gap-2">
            <Save size={16} /> Save Defaults
          </button>
        </form>
      )}

      {/* Appearance */}
      {tab === 'appearance' && (
        <form onSubmit={hsS(onSaveSettings)} className="space-y-6">
          <Card title="Invoice Theme">
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {INVOICE_THEMES.map((t) => (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => svS('theme', t.id)}
                  className={`p-4 rounded-xl border-2 text-left transition-all ${theme === t.id ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-gray-300'}`}
                >
                  <div className="w-8 h-8 rounded-lg mb-2" style={{ background: t.color }} />
                  <p className="text-sm font-medium text-gray-800">{t.name}</p>
                </button>
              ))}
            </div>
          </Card>
          <button type="submit" className="btn-primary flex items-center gap-2">
            <Save size={16} /> Save Appearance
          </button>
        </form>
      )}
    </div>
  )
}

function Card({ title, children }) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
      <div className="px-5 py-4 border-b border-gray-100">
        <h3 className="font-semibold text-gray-800">{title}</h3>
      </div>
      <div className="p-5">{children}</div>
    </div>
  )
}

function Field({ label, children, full, required }) {
  return (
    <div className={full ? 'sm:col-span-2' : ''}>
      <label className="block text-sm font-medium text-gray-700 mb-1.5">
        {label}{required && <span className="text-red-500 ml-0.5">*</span>}
      </label>
      {children}
    </div>
  )
}
