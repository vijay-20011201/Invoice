import { NavLink, useLocation } from 'react-router-dom'
import {
  LayoutDashboard, FilePlus, FileText, LayoutTemplate,
  Settings, Info, X, Zap,
} from 'lucide-react'

const NAV = [
  { to: '/', icon: LayoutDashboard, label: 'Dashboard', end: true },
  { to: '/invoice/new', icon: FilePlus, label: 'New Invoice' },
  { to: '/invoices', icon: FileText, label: 'Saved Invoices' },
  { to: '/templates', icon: LayoutTemplate, label: 'Templates' },
  { to: '/settings', icon: Settings, label: 'Settings' },
  { to: '/about', icon: Info, label: 'About' },
]

export default function Sidebar({ open, onClose }) {
  return (
    <>
      {/* Overlay */}
      {open && (
        <div
          className="fixed inset-0 bg-black/40 z-30 lg:hidden"
          onClick={onClose}
        />
      )}
      {/* Sidebar */}
      <aside
        className={`
          fixed lg:static inset-y-0 left-0 z-40
          w-64 bg-white border-r border-gray-200 flex flex-col
          transform transition-transform duration-200 ease-in-out
          ${open ? 'translate-x-0' : '-translate-x-full'}
          lg:translate-x-0
        `}
      >
        {/* Logo */}
        <div className="flex items-center justify-between px-5 h-16 border-b border-gray-100">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center">
              <Zap size={16} className="text-white" />
            </div>
            <span className="text-lg font-bold text-gray-900 tracking-tight">InvoiceFlow</span>
          </div>
          <button
            onClick={onClose}
            className="lg:hidden p-1.5 rounded-md text-gray-400 hover:text-gray-600 hover:bg-gray-100"
          >
            <X size={18} />
          </button>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 py-4 space-y-0.5">
          {NAV.map(({ to, icon: Icon, label, end }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              onClick={onClose}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors
                ${isActive
                  ? 'bg-blue-50 text-blue-700'
                  : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                }`
              }
            >
              <Icon size={18} />
              {label}
            </NavLink>
          ))}
        </nav>

        {/* Footer */}
        <div className="px-4 py-4 border-t border-gray-100">
          <p className="text-xs text-gray-400">InvoiceFlow v1.0 &bull; Free &amp; Offline</p>
        </div>
      </aside>
    </>
  )
}
