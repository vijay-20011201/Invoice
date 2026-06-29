import { useState, useEffect, useRef } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { Save, Download, Printer, Eye, EyeOff, ChevronDown } from 'lucide-react'
import useInvoice from '../hooks/useInvoice'
import { getInvoices, clearDraft } from '../services/localStorage'
import { generatePDF } from '../utils/pdfGenerator'
import InvoiceForm from '../components/invoice/InvoiceForm'
import InvoicePreview from '../components/invoice/InvoicePreview'

export default function InvoiceEditor() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [showPreview, setShowPreview] = useState(true)
  const [saving, setSaving] = useState(false)
  const [downloading, setDownloading] = useState(false)
  const [errors, setErrors] = useState({})
  const [statusOpen, setStatusOpen] = useState(false)

  const existingInvoice = id ? getInvoices().find((i) => i.id === id) : null
  const { form, update, updateItem, addItem, removeItem, duplicateItem, saveToStorage, totals, company, settings, currency } = useInvoice(existingInvoice)

  const validate = () => {
    const e = {}
    if (!company.name) e.company = 'Company name is required. Please update Settings.'
    if (!form.customerName.trim()) e.customerName = 'Customer name is required.'
    if (!form.invoiceDate) e.invoiceDate = 'Invoice date is required.'
    if (form.items.length === 0) e.items = 'Add at least one item.'
    const hasInvalidItem = form.items.some((item) => !item.name.trim() || item.quantity <= 0 || item.unitPrice < 0)
    if (hasInvalidItem) e.items = 'All items must have a name, valid quantity, and price.'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const handleSave = async (statusOverride) => {
    if (!validate()) return
    setSaving(true)
    try {
      saveToStorage(statusOverride)
      clearDraft()
      navigate('/invoices')
    } finally {
      setSaving(false)
    }
  }

  const handlePrint = () => {
    window.print()
  }

  const handleDownloadPDF = async () => {
    if (!validate()) return
    setDownloading(true)
    try {
      await generatePDF('invoice-preview-print', `${form.invoiceNumber}.pdf`)
    } finally {
      setDownloading(false)
    }
  }

  const STATUSES = ['Draft', 'Unpaid', 'Paid', 'Cancelled']

  return (
    <div className="flex flex-col lg:flex-row h-full">
      {/* Form Panel */}
      <div className={`${showPreview ? 'lg:w-[52%]' : 'w-full'} flex flex-col h-full border-r border-gray-200 bg-white`}>
        {/* Toolbar */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100 bg-white sticky top-0 z-10 no-print">
          <div className="flex items-center gap-2 flex-wrap">
            {/* Status dropdown */}
            <div className="relative">
              <button
                onClick={() => setStatusOpen(!statusOpen)}
                className="flex items-center gap-1.5 px-3 py-1.5 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                <StatusDot status={form.status} />
                {form.status}
                <ChevronDown size={14} />
              </button>
              {statusOpen && (
                <div className="absolute top-full mt-1 left-0 bg-white border border-gray-200 rounded-lg shadow-lg z-20 py-1 min-w-[140px]">
                  {STATUSES.map((s) => (
                    <button key={s} onClick={() => { update({ status: s }); setStatusOpen(false) }}
                      className="w-full text-left px-3 py-2 text-sm hover:bg-gray-50 flex items-center gap-2">
                      <StatusDot status={s} /> {s}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button onClick={() => setShowPreview(!showPreview)} className="btn-ghost hidden lg:flex items-center gap-1.5 text-sm">
              {showPreview ? <EyeOff size={15} /> : <Eye size={15} />}
              {showPreview ? 'Hide' : 'Show'} Preview
            </button>
            <button onClick={handlePrint} className="btn-ghost flex items-center gap-1.5 text-sm">
              <Printer size={15} /> Print
            </button>
            <button onClick={handleDownloadPDF} disabled={downloading} className="btn-ghost flex items-center gap-1.5 text-sm">
              <Download size={15} /> {downloading ? 'Generating…' : 'PDF'}
            </button>
            <button onClick={() => handleSave()} disabled={saving} className="btn-primary flex items-center gap-1.5 text-sm">
              <Save size={15} /> {saving ? 'Saving…' : 'Save'}
            </button>
          </div>
        </div>

        {/* Errors */}
        {Object.keys(errors).length > 0 && (
          <div className="mx-4 mt-3 p-3 bg-red-50 border border-red-200 rounded-lg">
            {Object.values(errors).map((e, i) => (
              <p key={i} className="text-sm text-red-600">• {e}</p>
            ))}
          </div>
        )}

        {/* Form */}
        <div className="flex-1 overflow-y-auto">
          <InvoiceForm
            form={form}
            update={update}
            updateItem={updateItem}
            addItem={addItem}
            removeItem={removeItem}
            duplicateItem={duplicateItem}
            totals={totals}
            currency={currency}
            company={company}
            settings={settings}
          />
        </div>
      </div>

      {/* Preview Panel */}
      {showPreview && (
        <div className="hidden lg:flex flex-1 flex-col bg-gray-100 overflow-y-auto">
          <div className="p-4 border-b border-gray-200 bg-white flex items-center gap-2">
            <Eye size={16} className="text-gray-400" />
            <span className="text-sm font-medium text-gray-600">Live Preview</span>
          </div>
          <div className="p-6 flex justify-center">
            <div className="w-full max-w-[794px] shadow-xl rounded-lg overflow-hidden">
              <InvoicePreview form={form} totals={totals} company={company} currency={currency} settings={settings} />
            </div>
          </div>
        </div>
      )}

      {/* Mobile Preview Toggle */}
      <div className="lg:hidden fixed bottom-4 right-4 no-print">
        <button
          onClick={() => setShowPreview(!showPreview)}
          className="bg-blue-600 text-white rounded-full px-4 py-3 shadow-lg flex items-center gap-2 text-sm font-medium"
        >
          {showPreview ? <EyeOff size={16} /> : <Eye size={16} />}
          {showPreview ? 'Hide Preview' : 'Preview'}
        </button>
      </div>

      {/* Mobile Preview */}
      {showPreview && (
        <div className="lg:hidden bg-gray-100 p-4">
          <InvoicePreview form={form} totals={totals} company={company} currency={currency} settings={settings} />
        </div>
      )}

      {/* Print-only view */}
      <div className="print-only fixed inset-0 bg-white z-50">
        <InvoicePreview form={form} totals={totals} company={company} currency={currency} settings={settings} printMode />
      </div>
    </div>
  )
}

function StatusDot({ status }) {
  const c = { Draft: 'bg-gray-400', Unpaid: 'bg-amber-400', Paid: 'bg-green-500', Cancelled: 'bg-red-400' }
  return <span className={`w-2 h-2 rounded-full inline-block ${c[status] || 'bg-gray-400'}`} />
}
