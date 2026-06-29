import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Layout from './components/Layout'
import Dashboard from './pages/Dashboard'
import InvoiceEditor from './pages/InvoiceEditor'
import SavedInvoices from './pages/SavedInvoices'
import Templates from './pages/Templates'
import Settings from './pages/Settings'
import About from './pages/About'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Dashboard />} />
          <Route path="invoice/new" element={<InvoiceEditor />} />
          <Route path="invoice/edit/:id" element={<InvoiceEditor />} />
          <Route path="invoices" element={<SavedInvoices />} />
          <Route path="templates" element={<Templates />} />
          <Route path="settings" element={<Settings />} />
          <Route path="about" element={<About />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}
