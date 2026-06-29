import { Zap, Shield, Wifi, Download, Palette, FileText, Settings, Database } from 'lucide-react'

const FEATURES = [
  { icon: Shield, label: 'Fully Private', desc: 'No data leaves your browser. Everything stored locally.' },
  { icon: Wifi, label: '100% Offline', desc: 'Works without internet after first load.' },
  { icon: Palette, label: '6 Themes', desc: 'Professional invoice templates to match your brand.' },
  { icon: FileText, label: 'GST Support', desc: 'Per-item custom GST rates including 0%, 5%, 12%, 18%, 28%.' },
  { icon: Download, label: 'PDF Export', desc: 'High-quality A4 PDF download with proper margins.' },
  { icon: Database, label: 'LocalStorage', desc: 'Unlimited invoices saved securely in your browser.' },
  { icon: Settings, label: 'Customizable', desc: 'Company info, logo, signature, bank details, and more.' },
  { icon: Zap, label: 'Instant Preview', desc: 'Live invoice preview updates as you type.' },
]

export default function About() {
  return (
    <div className="p-4 lg:p-8 max-w-4xl mx-auto">
      {/* Hero */}
      <div className="bg-gradient-to-br from-blue-600 to-blue-700 rounded-2xl p-8 mb-8 text-white">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center">
            <Zap size={24} className="text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold">InvoiceFlow</h1>
            <p className="text-blue-200 text-sm">v1.0 — Free & Open Source</p>
          </div>
        </div>
        <p className="text-blue-100 leading-relaxed max-w-2xl">
          A modern, professional invoice generator built for freelancers, agencies, shops, and small businesses.
          Create beautiful invoices in seconds — no backend, no accounts, no cloud. Your data stays on your device.
        </p>
      </div>

      {/* Features grid */}
      <h2 className="text-lg font-bold text-gray-900 mb-4">Features</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
        {FEATURES.map(({ icon: Icon, label, desc }) => (
          <div key={label} className="bg-white rounded-xl border border-gray-200 p-4 flex gap-3">
            <div className="w-9 h-9 rounded-lg bg-blue-50 flex items-center justify-center flex-shrink-0">
              <Icon size={18} className="text-blue-600" />
            </div>
            <div>
              <p className="font-semibold text-gray-800 text-sm">{label}</p>
              <p className="text-gray-400 text-xs mt-0.5">{desc}</p>
            </div>
          </div>
        ))}
      </div>

      {/* How to use */}
      <h2 className="text-lg font-bold text-gray-900 mb-4">Quick Start Guide</h2>
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden mb-8">
        {[
          ['1', 'Go to Settings', 'Enter your company name, logo, bank details, and signature.'],
          ['2', 'Create a New Invoice', 'Click "+ New Invoice" and fill in customer details.'],
          ['3', 'Add Items', 'Add line items with individual GST rates and discounts.'],
          ['4', 'Preview & Save', 'See the live preview, then save or download as PDF.'],
          ['5', 'Manage Invoices', 'View, edit, duplicate, or delete from Saved Invoices.'],
        ].map(([num, title, desc]) => (
          <div key={num} className="flex gap-4 px-5 py-4 border-b border-gray-50 last:border-0">
            <div className="w-7 h-7 rounded-full bg-blue-600 text-white text-xs font-bold flex items-center justify-center flex-shrink-0 mt-0.5">
              {num}
            </div>
            <div>
              <p className="font-semibold text-gray-800 text-sm">{title}</p>
              <p className="text-gray-500 text-xs mt-0.5">{desc}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Tech */}
      <h2 className="text-lg font-bold text-gray-900 mb-4">Built With</h2>
      <div className="flex flex-wrap gap-2 mb-8">
        {['React 18', 'Vite', 'Tailwind CSS', 'React Hook Form', 'React Router', 'jsPDF', 'html2canvas', 'Lucide Icons'].map((t) => (
          <span key={t} className="px-3 py-1.5 bg-gray-100 rounded-lg text-sm text-gray-600 font-medium">{t}</span>
        ))}
      </div>

      <div className="text-center text-sm text-gray-400 py-4">
        All data is stored in your browser's LocalStorage only. Nothing is ever sent to any server.
      </div>
    </div>
  )
}
