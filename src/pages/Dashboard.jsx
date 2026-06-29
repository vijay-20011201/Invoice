import { useNavigate } from 'react-router-dom'
import { FilePlus, FileText, LayoutTemplate, Settings, Info, TrendingUp, DollarSign, Clock, CheckCircle } from 'lucide-react'
import { getInvoices, getSettings } from '../services/localStorage'
import { CURRENCIES } from '../constants'
import { formatCurrency } from '../utils/calculations'
import { useMemo } from 'react'

const CARDS = [
  { to: '/invoice/new', icon: FilePlus, label: 'New Invoice', desc: 'Create a fresh invoice', color: 'bg-blue-600', light: 'bg-blue-50 text-blue-700' },
  { to: '/invoices', icon: FileText, label: 'Saved Invoices', desc: 'View & manage invoices', color: 'bg-emerald-600', light: 'bg-emerald-50 text-emerald-700' },
  { to: '/templates', icon: LayoutTemplate, label: 'Templates', desc: 'Choose invoice styles', color: 'bg-violet-600', light: 'bg-violet-50 text-violet-700' },
  { to: '/settings', icon: Settings, label: 'Settings', desc: 'Configure your company', color: 'bg-amber-500', light: 'bg-amber-50 text-amber-700' },
  { to: '/about', icon: Info, label: 'About', desc: 'App info & guide', color: 'bg-gray-600', light: 'bg-gray-100 text-gray-700' },
]

export default function Dashboard() {
  const navigate = useNavigate()
  const invoices = getInvoices()
  const settings = getSettings()
  const currency = CURRENCIES.find((c) => c.code === settings.currency) || CURRENCIES[0]

  const stats = useMemo(() => {
    const total = invoices.length
    const paid = invoices.filter((i) => i.status === 'Paid').length
    const unpaid = invoices.filter((i) => i.status === 'Unpaid').length
    const totalAmount = invoices.reduce((sum, i) => sum + (i.grandTotal || 0), 0)
    return { total, paid, unpaid, totalAmount }
  }, [invoices])

  return (
    <div className="p-4 lg:p-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900">Welcome back!</h2>
        <p className="text-gray-500 mt-1">Manage your invoices and business documents.</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard icon={FileText} label="Total Invoices" value={stats.total} iconClass="text-blue-600 bg-blue-50" />
        <StatCard icon={DollarSign} label="Total Revenue" value={formatCurrency(stats.totalAmount, currency.symbol)} iconClass="text-emerald-600 bg-emerald-50" />
        <StatCard icon={CheckCircle} label="Paid" value={stats.paid} iconClass="text-green-600 bg-green-50" />
        <StatCard icon={Clock} label="Unpaid" value={stats.unpaid} iconClass="text-amber-600 bg-amber-50" />
      </div>

      {/* Quick Actions */}
      <h3 className="text-base font-semibold text-gray-700 mb-4">Quick Actions</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4 mb-8">
        {CARDS.map(({ to, icon: Icon, label, desc, color, light }) => (
          <button
            key={to}
            onClick={() => navigate(to)}
            className="group bg-white rounded-xl border border-gray-200 p-5 text-left hover:shadow-md hover:border-gray-300 transition-all duration-150"
          >
            <div className={`w-11 h-11 rounded-xl ${color} flex items-center justify-center mb-3 group-hover:scale-105 transition-transform`}>
              <Icon size={22} className="text-white" />
            </div>
            <p className="font-semibold text-gray-800 text-sm">{label}</p>
            <p className="text-gray-400 text-xs mt-0.5">{desc}</p>
          </button>
        ))}
      </div>

      {/* Recent Invoices */}
      {invoices.length > 0 && (
        <div>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-base font-semibold text-gray-700">Recent Invoices</h3>
            <button onClick={() => navigate('/invoices')} className="text-sm text-blue-600 hover:underline">View all</button>
          </div>
          <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50">
                  <th className="text-left px-4 py-3 font-medium text-gray-500">Invoice #</th>
                  <th className="text-left px-4 py-3 font-medium text-gray-500">Customer</th>
                  <th className="text-left px-4 py-3 font-medium text-gray-500 hidden sm:table-cell">Date</th>
                  <th className="text-right px-4 py-3 font-medium text-gray-500">Amount</th>
                  <th className="text-center px-4 py-3 font-medium text-gray-500">Status</th>
                </tr>
              </thead>
              <tbody>
                {invoices.slice(0, 5).map((inv) => (
                  <tr
                    key={inv.id}
                    onClick={() => navigate(`/invoice/edit/${inv.id}`)}
                    className="border-b border-gray-50 hover:bg-gray-50 cursor-pointer transition-colors last:border-0"
                  >
                    <td className="px-4 py-3 font-mono text-blue-700 font-medium">{inv.invoiceNumber}</td>
                    <td className="px-4 py-3 text-gray-700">{inv.customerName || '—'}</td>
                    <td className="px-4 py-3 text-gray-500 hidden sm:table-cell">{inv.invoiceDate}</td>
                    <td className="px-4 py-3 text-right font-semibold text-gray-800">
                      {formatCurrency(inv.grandTotal || 0, currency.symbol)}
                    </td>
                    <td className="px-4 py-3 text-center">
                      <StatusBadge status={inv.status} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}

function StatCard({ icon: Icon, label, value, iconClass }) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-4">
      <div className={`w-9 h-9 rounded-lg ${iconClass} flex items-center justify-center mb-3`}>
        <Icon size={18} />
      </div>
      <p className="text-2xl font-bold text-gray-900">{value}</p>
      <p className="text-xs text-gray-400 mt-0.5">{label}</p>
    </div>
  )
}

export function StatusBadge({ status }) {
  const map = {
    Draft: 'bg-gray-100 text-gray-600',
    Unpaid: 'bg-amber-100 text-amber-700',
    Paid: 'bg-green-100 text-green-700',
    Cancelled: 'bg-red-100 text-red-600',
  }
  return (
    <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium ${map[status] || 'bg-gray-100 text-gray-600'}`}>
      {status}
    </span>
  )
}
