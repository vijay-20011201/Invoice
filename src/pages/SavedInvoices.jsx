import { useState, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { Search, Edit2, Copy, Trash2, Download, ChevronUp, ChevronDown, FileText } from 'lucide-react'
import { getInvoices, saveInvoice, deleteInvoice, getSettings, getCompany } from '../services/localStorage'
import { CURRENCIES } from '../constants'
import { formatCurrency, calcInvoiceTotals } from '../utils/calculations'
import { generatePDF } from '../utils/pdfGenerator'
import { StatusBadge } from './Dashboard'
import InvoicePreview from '../components/invoice/InvoicePreview'

export default function SavedInvoices() {
  const navigate = useNavigate()
  const [invoices, setInvoices] = useState(getInvoices)
  const [search, setSearch] = useState('')
  const [sortKey, setSortKey] = useState('updatedAt')
  const [sortDir, setSortDir] = useState('desc')
  const [deleting, setDeleting] = useState(null)
  const [pdfInvoice, setPdfInvoice] = useState(null)
  const [downloading, setDownloading] = useState(null)

  const settings = getSettings()
  const company = getCompany()
  const currency = CURRENCIES.find((c) => c.code === settings.currency) || CURRENCIES[0]

  const refresh = () => setInvoices(getInvoices())

  const sorted = useMemo(() => {
    let list = invoices.filter((inv) => {
      const q = search.toLowerCase()
      return (
        inv.invoiceNumber?.toLowerCase().includes(q) ||
        inv.customerName?.toLowerCase().includes(q) ||
        inv.status?.toLowerCase().includes(q)
      )
    })
    list = [...list].sort((a, b) => {
      const av = a[sortKey] ?? 0
      const bv = b[sortKey] ?? 0
      if (av < bv) return sortDir === 'asc' ? -1 : 1
      if (av > bv) return sortDir === 'asc' ? 1 : -1
      return 0
    })
    return list
  }, [invoices, search, sortKey, sortDir])

  const toggleSort = (key) => {
    if (sortKey === key) setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'))
    else { setSortKey(key); setSortDir('desc') }
  }

  const handleDuplicate = (inv) => {
    const copy = {
      ...inv,
      id: Date.now().toString(),
      invoiceNumber: inv.invoiceNumber + '-COPY',
      status: 'Draft',
      createdAt: Date.now(),
      updatedAt: Date.now(),
    }
    saveInvoice(copy)
    refresh()
  }

  const handleDelete = (id) => {
    deleteInvoice(id)
    setDeleting(null)
    refresh()
  }

  const handleDownloadPDF = async (inv) => {
    setDownloading(inv.id)
    setPdfInvoice(inv)
    setTimeout(async () => {
      const totals = calcInvoiceTotals(inv.items, inv.shippingCharge, inv.additionalCharge, inv.roundOff)
      await generatePDF('saved-invoice-pdf', `${inv.invoiceNumber}.pdf`)
      setPdfInvoice(null)
      setDownloading(null)
    }, 300)
  }

  const SortIcon = ({ k }) => {
    if (sortKey !== k) return <ChevronUp size={12} className="text-gray-300" />
    return sortDir === 'asc' ? <ChevronUp size={12} className="text-blue-500" /> : <ChevronDown size={12} className="text-blue-500" />
  }

  const Th = ({ label, k }) => (
    <th
      onClick={() => toggleSort(k)}
      className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide cursor-pointer hover:text-gray-700 select-none"
    >
      <span className="flex items-center gap-1">{label} <SortIcon k={k} /></span>
    </th>
  )

  return (
    <div className="p-4 lg:p-8 max-w-7xl mx-auto">
      <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Saved Invoices</h2>
          <p className="text-gray-400 text-sm mt-0.5">{invoices.length} invoice{invoices.length !== 1 ? 's' : ''} stored locally</p>
        </div>
        <button onClick={() => navigate('/invoice/new')} className="btn-primary text-sm">+ New Invoice</button>
      </div>

      {/* Search */}
      <div className="relative mb-4">
        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
        <input
          className="input pl-9 w-full sm:w-80"
          placeholder="Search by number, customer, status…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {sorted.length === 0 ? (
        <div className="bg-white rounded-xl border border-gray-200 p-16 text-center">
          <FileText size={40} className="text-gray-200 mx-auto mb-3" />
          <p className="text-gray-400">{search ? 'No invoices match your search.' : 'No invoices yet. Create your first one!'}</p>
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <Th label="Invoice #" k="invoiceNumber" />
                  <Th label="Customer" k="customerName" />
                  <Th label="Date" k="invoiceDate" />
                  <Th label="Due Date" k="dueDate" />
                  <Th label="Amount" k="grandTotal" />
                  <Th label="Status" k="status" />
                  <th className="px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody>
                {sorted.map((inv) => (
                  <tr key={inv.id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors last:border-0">
                    <td className="px-4 py-3 font-mono text-blue-700 font-semibold">{inv.invoiceNumber}</td>
                    <td className="px-4 py-3 text-gray-700">{inv.customerName || '—'}</td>
                    <td className="px-4 py-3 text-gray-500">{inv.invoiceDate || '—'}</td>
                    <td className="px-4 py-3 text-gray-500">{inv.dueDate || '—'}</td>
                    <td className="px-4 py-3 font-semibold text-gray-800">
                      {formatCurrency(inv.grandTotal || 0, currency.symbol)}
                    </td>
                    <td className="px-4 py-3"><StatusBadge status={inv.status} /></td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1">
                        <ActionBtn title="Edit" onClick={() => navigate(`/invoice/edit/${inv.id}`)}>
                          <Edit2 size={14} />
                        </ActionBtn>
                        <ActionBtn title="Duplicate" onClick={() => handleDuplicate(inv)}>
                          <Copy size={14} />
                        </ActionBtn>
                        <ActionBtn title="Download PDF" onClick={() => handleDownloadPDF(inv)} loading={downloading === inv.id}>
                          <Download size={14} />
                        </ActionBtn>
                        <ActionBtn title="Delete" danger onClick={() => setDeleting(inv.id)}>
                          <Trash2 size={14} />
                        </ActionBtn>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Delete confirm */}
      {deleting && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 max-w-sm w-full shadow-2xl">
            <h3 className="font-bold text-gray-900 text-lg mb-2">Delete Invoice?</h3>
            <p className="text-gray-500 text-sm mb-5">This action cannot be undone.</p>
            <div className="flex gap-3 justify-end">
              <button onClick={() => setDeleting(null)} className="btn-ghost text-sm">Cancel</button>
              <button onClick={() => handleDelete(deleting)} className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-sm font-medium rounded-lg transition-colors">
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Hidden PDF render area */}
      {pdfInvoice && (
        <div className="fixed -top-[9999px] -left-[9999px] w-[794px]" aria-hidden="true">
          <div id="saved-invoice-pdf">
            <InvoicePreview
              form={pdfInvoice}
              totals={calcInvoiceTotals(pdfInvoice.items, pdfInvoice.shippingCharge, pdfInvoice.additionalCharge, pdfInvoice.roundOff)}
              company={company}
              currency={currency}
              settings={settings}
            />
          </div>
        </div>
      )}
    </div>
  )
}

function ActionBtn({ children, title, onClick, danger, loading }) {
  return (
    <button
      title={title}
      onClick={onClick}
      disabled={loading}
      className={`p-1.5 rounded-lg transition-colors ${danger ? 'text-gray-400 hover:text-red-600 hover:bg-red-50' : 'text-gray-400 hover:text-blue-600 hover:bg-blue-50'} ${loading ? 'opacity-50 cursor-wait' : ''}`}
    >
      {children}
    </button>
  )
}
