import { useLocation, useNavigate } from 'react-router-dom'
import { Menu, Plus } from 'lucide-react'

const TITLES = {
  '/': 'Dashboard',
  '/invoice/new': 'New Invoice',
  '/invoices': 'Saved Invoices',
  '/templates': 'Templates',
  '/settings': 'Settings',
  '/about': 'About',
}

export default function Topbar({ onMenuClick }) {
  const { pathname } = useLocation()
  const navigate = useNavigate()
  const title = TITLES[pathname] || (pathname.startsWith('/invoice/edit') ? 'Edit Invoice' : 'InvoiceFlow')

  return (
    <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-4 lg:px-6 no-print">
      <div className="flex items-center gap-3">
        <button
          onClick={onMenuClick}
          className="lg:hidden p-2 rounded-lg text-gray-500 hover:bg-gray-100"
        >
          <Menu size={20} />
        </button>
        <h1 className="text-lg font-semibold text-gray-800">{title}</h1>
      </div>
      <button
        onClick={() => navigate('/invoice/new')}
        className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-colors"
      >
        <Plus size={16} />
        <span className="hidden sm:inline">New Invoice</span>
      </button>
    </header>
  )
}
