import { calcLineTotal, formatCurrency, numberToWords } from '../../utils/calculations'
import { INVOICE_THEMES, CURRENCIES } from '../../constants'
import { getSettings } from '../../services/localStorage'

export default function InvoicePreview({ form, totals, company, currency, settings, printMode = false }) {
  const theme = INVOICE_THEMES.find((t) => t.id === (settings.theme || 'professional')) || INVOICE_THEMES[1]
  const sym = currency?.symbol || '₹'
  const ThemeComponent = THEME_MAP[theme.id] || ProfessionalTheme

  return (
    <div id="invoice-preview-print">
      <ThemeComponent form={form} totals={totals} company={company} sym={sym} theme={theme} />
    </div>
  )
}

// ── Shared sub-components ──────────────────────────────────────────────────

function ItemsTable({ items, sym, accentColor }) {
  return (
    <table className="w-full text-sm mb-0">
      <thead>
        <tr style={{ background: accentColor, color: '#fff' }}>
          <th className="text-left py-2.5 px-3 font-semibold rounded-tl">#</th>
          <th className="text-left py-2.5 px-3 font-semibold">Item</th>
          <th className="text-center py-2.5 px-3 font-semibold">Qty</th>
          <th className="text-right py-2.5 px-3 font-semibold">Rate</th>
          <th className="text-right py-2.5 px-3 font-semibold">Disc</th>
          <th className="text-right py-2.5 px-3 font-semibold">GST</th>
          <th className="text-right py-2.5 px-3 font-semibold rounded-tr">Total</th>
        </tr>
      </thead>
      <tbody>
        {items.map((item, i) => {
          const line = calcLineTotal(item)
          return (
            <tr key={item.id} className={i % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
              <td className="py-2.5 px-3 text-gray-500">{i + 1}</td>
              <td className="py-2.5 px-3">
                <div className="font-medium text-gray-800">{item.name || '—'}</div>
                {item.description && <div className="text-xs text-gray-400 mt-0.5">{item.description}</div>}
              </td>
              <td className="py-2.5 px-3 text-center text-gray-700">{item.quantity}</td>
              <td className="py-2.5 px-3 text-right text-gray-700">{formatCurrency(item.unitPrice, sym)}</td>
              <td className="py-2.5 px-3 text-right text-gray-500 text-xs">
                {line.discount > 0 ? `-${formatCurrency(line.discount, sym)}` : '—'}
              </td>
              <td className="py-2.5 px-3 text-right text-gray-500 text-xs">
                {item.gst}% ({formatCurrency(line.gstAmount, sym)})
              </td>
              <td className="py-2.5 px-3 text-right font-semibold text-gray-900">{formatCurrency(line.total, sym)}</td>
            </tr>
          )
        })}
      </tbody>
    </table>
  )
}

function TotalsBlock({ totals, sym, form, accentColor }) {
  return (
    <div className="ml-auto w-64 mt-4">
      <div className="space-y-1.5 text-sm">
        <TRow label="Subtotal" value={formatCurrency(totals.subtotal, sym)} />
        {totals.totalDiscount > 0 && <TRow label="Discount" value={`-${formatCurrency(totals.totalDiscount, sym)}`} red />}
        <TRow label="Taxable Amount" value={formatCurrency(totals.taxableSubtotal, sym)} />
        <TRow label="Total GST" value={formatCurrency(totals.totalGst, sym)} />
        {totals.shipping > 0 && <TRow label="Shipping" value={formatCurrency(totals.shipping, sym)} />}
        {totals.additional > 0 && <TRow label="Additional" value={formatCurrency(totals.additional, sym)} />}
        {form.roundOff && totals.roundOffAmt !== 0 && <TRow label="Round Off" value={`${totals.roundOffAmt > 0 ? '+' : ''}${formatCurrency(totals.roundOffAmt, sym)}`} />}
      </div>
      <div className="mt-2 p-3 rounded-lg text-sm font-bold flex justify-between text-white" style={{ background: accentColor }}>
        <span>Grand Total</span>
        <span>{formatCurrency(totals.grandTotal, sym)}</span>
      </div>
      <p className="text-xs text-gray-500 mt-2 italic">{numberToWords(totals.grandTotal)}</p>
    </div>
  )
}

function TRow({ label, value, red }) {
  return (
    <div className="flex justify-between">
      <span className="text-gray-500">{label}</span>
      <span className={`font-medium ${red ? 'text-red-600' : 'text-gray-800'}`}>{value}</span>
    </div>
  )
}

function BankBlock({ company }) {
  if (!company.bankName && !company.upiId) return null
  return (
    <div className="mt-4 p-3 bg-gray-50 rounded-lg text-xs">
      <p className="font-semibold text-gray-700 mb-1.5">Bank / Payment Details</p>
      <div className="grid grid-cols-2 gap-x-4 gap-y-0.5 text-gray-600">
        {company.bankName && <><span className="text-gray-400">Bank</span><span>{company.bankName}</span></>}
        {company.accountHolder && <><span className="text-gray-400">Account Name</span><span>{company.accountHolder}</span></>}
        {company.accountNumber && <><span className="text-gray-400">Account No.</span><span>{company.accountNumber}</span></>}
        {company.ifsc && <><span className="text-gray-400">IFSC</span><span>{company.ifsc}</span></>}
        {company.upiId && <><span className="text-gray-400">UPI</span><span>{company.upiId}</span></>}
      </div>
    </div>
  )
}

// ── Theme: Professional (Blue) ─────────────────────────────────────────────

function ProfessionalTheme({ form, totals, company, sym, theme }) {
  const accent = theme.color

  return (
    <div className="bg-white min-h-[1122px] font-sans text-gray-800" style={{ fontFamily: 'Inter, sans-serif' }}>
      {/* Header */}
      <div className="px-10 py-8" style={{ background: accent }}>
        <div className="flex justify-between items-start">
          <div>
            {company.logo && <img src={company.logo} alt="Logo" className="h-14 object-contain mb-3" />}
            <h1 className="text-3xl font-bold text-white">{company.name || 'Your Company'}</h1>
            {company.gst && <p className="text-blue-100 text-sm mt-0.5">GST: {company.gst}</p>}
          </div>
          <div className="text-right text-blue-100 text-sm space-y-0.5">
            {company.phone && <p>{company.phone}</p>}
            {company.email && <p>{company.email}</p>}
            {company.website && <p>{company.website}</p>}
            {company.address && <p>{company.address}</p>}
            {(company.city || company.state) && <p>{[company.city, company.state, company.pin].filter(Boolean).join(', ')}</p>}
          </div>
        </div>
      </div>

      {/* Invoice meta */}
      <div className="px-10 py-6 flex justify-between items-start border-b border-gray-100">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-1">INVOICE</h2>
          <p className="text-lg font-mono font-semibold" style={{ color: accent }}>{form.invoiceNumber}</p>
        </div>
        <div className="text-right text-sm space-y-1">
          <div className="grid grid-cols-2 gap-x-4 text-gray-600">
            <span className="text-gray-400 text-right">Date:</span><span className="font-medium">{form.invoiceDate}</span>
            {form.dueDate && <><span className="text-gray-400 text-right">Due:</span><span className="font-medium">{form.dueDate}</span></>}
            {form.paymentTerms && <><span className="text-gray-400 text-right">Terms:</span><span>{form.paymentTerms}</span></>}
            {form.poNumber && <><span className="text-gray-400 text-right">PO #:</span><span>{form.poNumber}</span></>}
          </div>
          <div className="mt-2">
            <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold text-white`} style={{ background: accent }}>
              {form.status}
            </span>
          </div>
        </div>
      </div>

      {/* Billing */}
      <div className="px-10 py-5 grid grid-cols-2 gap-6">
        <div>
          <p className="text-xs uppercase font-semibold text-gray-400 tracking-widest mb-2">Bill To</p>
          <p className="font-bold text-gray-900">{form.customerName || '—'}</p>
          {form.customerCompany && <p className="text-gray-600">{form.customerCompany}</p>}
          {form.customerGst && <p className="text-gray-500 text-sm">GST: {form.customerGst}</p>}
          {form.billingAddress && <p className="text-gray-500 text-sm mt-1">{form.billingAddress}</p>}
          {(form.customerCity || form.customerState) && <p className="text-gray-500 text-sm">{[form.customerCity, form.customerState, form.customerPin].filter(Boolean).join(', ')}</p>}
          {form.customerPhone && <p className="text-gray-500 text-sm">{form.customerPhone}</p>}
          {form.customerEmail && <p className="text-gray-500 text-sm">{form.customerEmail}</p>}
        </div>
        {form.shippingAddress && (
          <div>
            <p className="text-xs uppercase font-semibold text-gray-400 tracking-widest mb-2">Ship To</p>
            <p className="text-gray-600 text-sm">{form.shippingAddress}</p>
          </div>
        )}
      </div>

      {/* Items */}
      <div className="px-10">
        <div className="overflow-hidden rounded-xl border border-gray-200">
          <ItemsTable items={form.items} sym={sym} accentColor={accent} />
        </div>
        <TotalsBlock totals={totals} sym={sym} form={form} accentColor={accent} />
      </div>

      {/* Footer */}
      <div className="px-10 mt-6 grid grid-cols-2 gap-6">
        <div>
          <BankBlock company={company} />
          {form.notes && (
            <div className="mt-4">
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-widest mb-1">Notes</p>
              <p className="text-xs text-gray-600">{form.notes}</p>
            </div>
          )}
          {form.terms && (
            <div className="mt-3">
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-widest mb-1">Terms & Conditions</p>
              <p className="text-xs text-gray-500">{form.terms}</p>
            </div>
          )}
        </div>
        <div className="text-right">
          {company.signature && (
            <div className="mt-4">
              <img src={company.signature} alt="Signature" className="h-16 object-contain ml-auto" />
              <p className="text-xs text-gray-400 mt-1 border-t border-gray-200 pt-1 inline-block">Authorised Signature</p>
            </div>
          )}
        </div>
      </div>

      <div className="px-10 py-6 mt-6 text-center text-xs text-gray-400 border-t border-gray-100">
        Thank you for your business!
      </div>
    </div>
  )
}

// ── Theme: Minimal ─────────────────────────────────────────────────────────

function MinimalTheme({ form, totals, company, sym, theme }) {
  const accent = theme.color

  return (
    <div className="bg-white min-h-[1122px] font-sans p-12">
      <div className="flex justify-between items-start mb-10">
        <div>
          {company.logo && <img src={company.logo} alt="Logo" className="h-12 object-contain mb-4" />}
          <h1 className="text-xl font-bold text-gray-900">{company.name || 'Your Company'}</h1>
          <div className="text-sm text-gray-400 mt-1 space-y-0.5">
            {company.address && <p>{company.address}</p>}
            {(company.city || company.state) && <p>{[company.city, company.state].filter(Boolean).join(', ')}</p>}
            {company.phone && <p>{company.phone}</p>}
            {company.email && <p>{company.email}</p>}
          </div>
        </div>
        <div className="text-right">
          <h2 className="text-4xl font-light text-gray-200 uppercase tracking-widest">Invoice</h2>
          <p className="text-base font-bold mt-1" style={{ color: accent }}>{form.invoiceNumber}</p>
          <div className="text-sm text-gray-400 mt-2 space-y-0.5">
            <p>Date: <span className="text-gray-700">{form.invoiceDate}</span></p>
            {form.dueDate && <p>Due: <span className="text-gray-700">{form.dueDate}</span></p>}
          </div>
        </div>
      </div>

      <div className="border-t border-gray-200 pt-8 mb-8 grid grid-cols-2 gap-8">
        <div>
          <p className="text-xs uppercase tracking-widest text-gray-300 mb-2">Billed To</p>
          <p className="font-semibold text-gray-900">{form.customerName || '—'}</p>
          {form.customerCompany && <p className="text-gray-500 text-sm">{form.customerCompany}</p>}
          {form.billingAddress && <p className="text-gray-400 text-sm mt-1">{form.billingAddress}</p>}
          {form.customerEmail && <p className="text-gray-400 text-sm">{form.customerEmail}</p>}
        </div>
        <div>
          <p className="text-xs uppercase tracking-widest text-gray-300 mb-2">Status</p>
          <span className="inline-block px-3 py-1 rounded text-xs font-semibold border" style={{ color: accent, borderColor: accent }}>
            {form.status}
          </span>
        </div>
      </div>

      <div className="overflow-hidden rounded border border-gray-100">
        <ItemsTable items={form.items} sym={sym} accentColor={accent} />
      </div>
      <TotalsBlock totals={totals} sym={sym} form={form} accentColor={accent} />

      <div className="mt-8 grid grid-cols-2 gap-6 border-t border-gray-100 pt-6">
        <div className="space-y-4">
          <BankBlock company={company} />
          {form.notes && <div><p className="text-xs text-gray-300 uppercase tracking-widest mb-1">Notes</p><p className="text-xs text-gray-500">{form.notes}</p></div>}
          {form.terms && <div><p className="text-xs text-gray-300 uppercase tracking-widest mb-1">Terms</p><p className="text-xs text-gray-400">{form.terms}</p></div>}
        </div>
        {company.signature && (
          <div className="text-right">
            <img src={company.signature} alt="Signature" className="h-14 object-contain ml-auto mb-1" />
            <p className="text-xs text-gray-300">Authorised Signature</p>
          </div>
        )}
      </div>
    </div>
  )
}

// ── Theme: Corporate Blue ──────────────────────────────────────────────────

function CorporateTheme({ form, totals, company, sym, theme }) {
  const accent = theme.color

  return (
    <div className="bg-white min-h-[1122px] font-sans">
      <div className="flex" style={{ background: accent, minHeight: 120 }}>
        <div className="px-8 py-6 flex-1 flex items-center gap-6">
          {company.logo && <img src={company.logo} alt="Logo" className="h-16 object-contain" />}
          <div>
            <h1 className="text-2xl font-black text-white uppercase tracking-wider">{company.name || 'Company Name'}</h1>
            {company.gst && <p className="text-blue-200 text-xs mt-0.5">GSTIN: {company.gst}</p>}
          </div>
        </div>
        <div className="px-8 py-6 text-right text-blue-100 text-sm space-y-0.5 min-w-max">
          {company.phone && <p>{company.phone}</p>}
          {company.email && <p>{company.email}</p>}
          {company.address && <p>{company.address}</p>}
        </div>
      </div>

      <div className="flex justify-between px-8 py-4 bg-blue-50 border-b border-blue-100">
        <div>
          <span className="text-xs text-blue-400 uppercase tracking-widest">Invoice Number</span>
          <p className="font-bold text-blue-900 text-lg">{form.invoiceNumber}</p>
        </div>
        <div><span className="text-xs text-blue-400 uppercase">Date</span><p className="font-semibold text-blue-800">{form.invoiceDate}</p></div>
        {form.dueDate && <div><span className="text-xs text-blue-400 uppercase">Due Date</span><p className="font-semibold text-blue-800">{form.dueDate}</p></div>}
        <div>
          <span className="text-xs text-blue-400 uppercase">Status</span>
          <p><span className="inline-block px-2 py-0.5 rounded bg-blue-700 text-white text-xs font-bold">{form.status}</span></p>
        </div>
      </div>

      <div className="px-8 py-5 grid grid-cols-2 gap-6 border-b border-gray-100">
        <div>
          <p className="text-xs font-bold text-blue-600 uppercase tracking-widest mb-2">Bill To</p>
          <p className="font-bold text-gray-900">{form.customerName || '—'}</p>
          {form.customerCompany && <p className="text-gray-600 text-sm">{form.customerCompany}</p>}
          {form.billingAddress && <p className="text-gray-500 text-sm mt-1">{form.billingAddress}</p>}
          {form.customerGst && <p className="text-gray-500 text-sm">GST: {form.customerGst}</p>}
          {form.customerPhone && <p className="text-gray-500 text-sm">{form.customerPhone}</p>}
        </div>
        {form.shippingAddress && (
          <div>
            <p className="text-xs font-bold text-blue-600 uppercase tracking-widest mb-2">Ship To</p>
            <p className="text-gray-600 text-sm">{form.shippingAddress}</p>
          </div>
        )}
      </div>

      <div className="px-8 py-5">
        <div className="overflow-hidden rounded-lg border border-gray-200">
          <ItemsTable items={form.items} sym={sym} accentColor={accent} />
        </div>
        <TotalsBlock totals={totals} sym={sym} form={form} accentColor={accent} />
      </div>

      <div className="px-8 pb-8 grid grid-cols-2 gap-6 mt-4">
        <div>
          <BankBlock company={company} />
          {form.notes && <div className="mt-4"><p className="text-xs font-bold text-blue-600 uppercase tracking-widest mb-1">Notes</p><p className="text-xs text-gray-600">{form.notes}</p></div>}
          {form.terms && <div className="mt-3"><p className="text-xs font-bold text-blue-600 uppercase tracking-widest mb-1">Terms</p><p className="text-xs text-gray-500">{form.terms}</p></div>}
        </div>
        {company.signature && (
          <div className="text-right mt-4">
            <img src={company.signature} alt="Signature" className="h-16 object-contain ml-auto" />
            <p className="text-xs text-gray-400 mt-1">Authorised Signatory</p>
          </div>
        )}
      </div>
    </div>
  )
}

// ── Theme: Yellow Business ─────────────────────────────────────────────────

function YellowTheme({ form, totals, company, sym, theme }) {
  const accent = theme.color

  return (
    <div className="bg-white min-h-[1122px] font-sans">
      <div className="flex justify-between items-stretch">
        <div className="px-8 py-8 flex-1">
          {company.logo && <img src={company.logo} alt="Logo" className="h-14 object-contain mb-3" />}
          <h1 className="text-2xl font-black text-gray-900">{company.name || 'Your Company'}</h1>
          {company.gst && <p className="text-gray-500 text-sm">GST: {company.gst}</p>}
          <div className="text-sm text-gray-400 mt-2 space-y-0.5">
            {company.address && <p>{company.address}</p>}
            {company.phone && <p>{company.phone}</p>}
            {company.email && <p>{company.email}</p>}
          </div>
        </div>
        <div className="px-8 py-8 text-right min-w-[200px]" style={{ background: accent }}>
          <p className="text-4xl font-black text-white uppercase">Invoice</p>
          <p className="text-white font-bold text-lg mt-1">{form.invoiceNumber}</p>
          <div className="text-yellow-100 text-sm mt-3 space-y-0.5">
            <p>Date: {form.invoiceDate}</p>
            {form.dueDate && <p>Due: {form.dueDate}</p>}
            <p className="mt-2 inline-block bg-white px-2 py-0.5 rounded text-xs font-bold" style={{ color: accent }}>{form.status}</p>
          </div>
        </div>
      </div>

      <div className="px-8 py-5 grid grid-cols-2 gap-6" style={{ borderTop: `4px solid ${accent}` }}>
        <div>
          <p className="text-xs font-bold uppercase tracking-widest mb-2" style={{ color: accent }}>Billed To</p>
          <p className="font-bold text-gray-900">{form.customerName || '—'}</p>
          {form.customerCompany && <p className="text-gray-600">{form.customerCompany}</p>}
          {form.billingAddress && <p className="text-gray-500 text-sm mt-1">{form.billingAddress}</p>}
          {form.customerGst && <p className="text-gray-500 text-sm">GST: {form.customerGst}</p>}
        </div>
        {form.paymentTerms && <div><p className="text-xs font-bold uppercase tracking-widest mb-2" style={{ color: accent }}>Payment Terms</p><p className="text-gray-700">{form.paymentTerms}</p></div>}
      </div>

      <div className="px-8 pb-5">
        <div className="overflow-hidden rounded-lg border border-gray-200">
          <ItemsTable items={form.items} sym={sym} accentColor={accent} />
        </div>
        <TotalsBlock totals={totals} sym={sym} form={form} accentColor={accent} />
      </div>

      <div className="px-8 pb-8 grid grid-cols-2 gap-6 mt-2">
        <div>
          <BankBlock company={company} />
          {form.notes && <div className="mt-4"><p className="text-xs font-bold uppercase tracking-widest mb-1" style={{ color: accent }}>Notes</p><p className="text-xs text-gray-600">{form.notes}</p></div>}
          {form.terms && <div className="mt-3"><p className="text-xs font-bold uppercase tracking-widest mb-1" style={{ color: accent }}>Terms</p><p className="text-xs text-gray-500">{form.terms}</p></div>}
        </div>
        {company.signature && (
          <div className="text-right mt-4">
            <img src={company.signature} alt="Signature" className="h-16 object-contain ml-auto" />
            <p className="text-xs text-gray-400 mt-1">Authorised Signature</p>
          </div>
        )}
      </div>

      <div className="h-3 mt-4" style={{ background: accent }} />
    </div>
  )
}

// ── Theme: Modern Green ────────────────────────────────────────────────────

function ModernTheme({ form, totals, company, sym, theme }) {
  const accent = theme.color

  return (
    <div className="bg-white min-h-[1122px] font-sans">
      <div className="px-10 pt-10 pb-6 flex justify-between items-start">
        <div className="flex items-center gap-4">
          {company.logo
            ? <img src={company.logo} alt="Logo" className="h-14 object-contain" />
            : <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-white font-black text-2xl" style={{ background: accent }}>{(company.name || 'C')[0]}</div>
          }
          <div>
            <h1 className="text-xl font-bold text-gray-900">{company.name || 'Your Company'}</h1>
            {company.gst && <p className="text-gray-400 text-xs">GST: {company.gst}</p>}
          </div>
        </div>
        <div className="text-right">
          <div className="inline-block px-5 py-2 rounded-xl text-white font-black text-xl uppercase tracking-wider" style={{ background: accent }}>Invoice</div>
          <p className="font-bold text-gray-700 mt-2">{form.invoiceNumber}</p>
          <p className="text-gray-400 text-sm">{form.invoiceDate}</p>
        </div>
      </div>

      <div className="mx-10 h-px bg-gray-100 mb-6" />

      <div className="px-10 pb-5 grid grid-cols-2 gap-8">
        <div className="bg-gray-50 rounded-2xl p-4">
          <p className="text-xs font-semibold uppercase tracking-widest mb-2" style={{ color: accent }}>From</p>
          <div className="text-sm text-gray-500 space-y-0.5">
            {company.phone && <p>{company.phone}</p>}
            {company.email && <p>{company.email}</p>}
            {company.address && <p>{company.address}</p>}
          </div>
        </div>
        <div className="bg-gray-50 rounded-2xl p-4">
          <p className="text-xs font-semibold uppercase tracking-widest mb-2" style={{ color: accent }}>To</p>
          <p className="font-semibold text-gray-800">{form.customerName || '—'}</p>
          {form.customerCompany && <p className="text-gray-500 text-sm">{form.customerCompany}</p>}
          {form.billingAddress && <p className="text-gray-400 text-sm mt-1">{form.billingAddress}</p>}
          {form.customerEmail && <p className="text-gray-400 text-sm">{form.customerEmail}</p>}
        </div>
      </div>

      <div className="px-10 pb-5">
        <div className="overflow-hidden rounded-2xl border border-gray-100">
          <ItemsTable items={form.items} sym={sym} accentColor={accent} />
        </div>
        <TotalsBlock totals={totals} sym={sym} form={form} accentColor={accent} />
      </div>

      <div className="px-10 pb-8 grid grid-cols-2 gap-6">
        <div>
          <BankBlock company={company} />
          {form.notes && <div className="mt-4"><p className="text-xs font-semibold uppercase tracking-widest mb-1" style={{ color: accent }}>Notes</p><p className="text-xs text-gray-600">{form.notes}</p></div>}
          {form.terms && <div className="mt-3"><p className="text-xs font-semibold uppercase tracking-widest mb-1" style={{ color: accent }}>Terms</p><p className="text-xs text-gray-500">{form.terms}</p></div>}
        </div>
        {company.signature && (
          <div className="text-right">
            <img src={company.signature} alt="Signature" className="h-16 object-contain ml-auto mt-4" />
            <p className="text-xs text-gray-400 mt-1">Authorised Signature</p>
          </div>
        )}
      </div>
    </div>
  )
}

// ── Theme: Elegant Purple ──────────────────────────────────────────────────

function ElegantTheme({ form, totals, company, sym, theme }) {
  const accent = theme.color

  return (
    <div className="bg-white min-h-[1122px] font-sans">
      <div className="flex">
        <div className="w-48 min-h-screen flex-shrink-0 py-10 px-6 flex flex-col" style={{ background: accent }}>
          {company.logo && <img src={company.logo} alt="Logo" className="h-10 object-contain mb-6 brightness-0 invert" />}
          <div className="text-purple-200 text-xs space-y-4 mt-2">
            {company.phone && <div><p className="text-purple-400 uppercase text-xs tracking-widest mb-0.5">Phone</p><p>{company.phone}</p></div>}
            {company.email && <div><p className="text-purple-400 uppercase text-xs tracking-widest mb-0.5">Email</p><p className="break-all">{company.email}</p></div>}
            {company.website && <div><p className="text-purple-400 uppercase text-xs tracking-widest mb-0.5">Web</p><p>{company.website}</p></div>}
            {company.address && <div><p className="text-purple-400 uppercase text-xs tracking-widest mb-0.5">Address</p><p>{company.address}</p>{(company.city || company.state) && <p>{[company.city, company.state].filter(Boolean).join(', ')}</p>}</div>}
            {company.bankName && (
              <div className="pt-4 border-t border-purple-700">
                <p className="text-purple-400 uppercase text-xs tracking-widest mb-1">Bank</p>
                <p>{company.bankName}</p>
                {company.accountNumber && <p className="font-mono">{company.accountNumber}</p>}
                {company.ifsc && <p>{company.ifsc}</p>}
                {company.upiId && <p>{company.upiId}</p>}
              </div>
            )}
          </div>
        </div>

        <div className="flex-1 py-10 px-8">
          <div className="flex justify-between items-start mb-8">
            <div>
              <h1 className="text-3xl font-black text-gray-900 uppercase tracking-widest">Invoice</h1>
              <p className="font-bold text-lg mt-0.5" style={{ color: accent }}>{form.invoiceNumber}</p>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-500">Date: <span className="text-gray-800 font-semibold">{form.invoiceDate}</span></p>
              {form.dueDate && <p className="text-sm text-gray-500">Due: <span className="text-gray-800 font-semibold">{form.dueDate}</span></p>}
              <span className="inline-block mt-2 px-3 py-1 rounded-full text-xs font-bold text-white" style={{ background: accent }}>{form.status}</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-6 mb-6 pb-6 border-b border-gray-100">
            <div>
              <p className="text-xs font-bold uppercase tracking-widest mb-2" style={{ color: accent }}>From</p>
              <p className="font-bold text-gray-900">{company.name || '—'}</p>
              {company.gst && <p className="text-gray-400 text-sm">GST: {company.gst}</p>}
            </div>
            <div>
              <p className="text-xs font-bold uppercase tracking-widest mb-2" style={{ color: accent }}>To</p>
              <p className="font-bold text-gray-900">{form.customerName || '—'}</p>
              {form.customerCompany && <p className="text-gray-600 text-sm">{form.customerCompany}</p>}
              {form.customerGst && <p className="text-gray-400 text-sm">GST: {form.customerGst}</p>}
              {form.billingAddress && <p className="text-gray-400 text-sm mt-1">{form.billingAddress}</p>}
            </div>
          </div>

          <div className="overflow-hidden rounded-xl border border-gray-100">
            <ItemsTable items={form.items} sym={sym} accentColor={accent} />
          </div>
          <TotalsBlock totals={totals} sym={sym} form={form} accentColor={accent} />

          <div className="mt-6 grid grid-cols-2 gap-4">
            <div>
              {form.notes && <div className="mb-3"><p className="text-xs font-bold uppercase tracking-widest mb-1" style={{ color: accent }}>Notes</p><p className="text-xs text-gray-500">{form.notes}</p></div>}
              {form.terms && <div><p className="text-xs font-bold uppercase tracking-widest mb-1" style={{ color: accent }}>Terms</p><p className="text-xs text-gray-500">{form.terms}</p></div>}
            </div>
            {company.signature && (
              <div className="text-right">
                <img src={company.signature} alt="Signature" className="h-14 object-contain ml-auto" />
                <p className="text-xs text-gray-400 mt-1">Authorised Signature</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

// ── Theme: Studio Blue (image 1 — blue corporate with footer icons) ────────

function StudioTheme({ form, totals, company, sym }) {
  const accent = '#1a73c8'

  return (
    <div className="bg-white min-h-[1122px] font-sans" style={{ fontFamily: 'Inter, sans-serif' }}>
      {/* Top blue accent line */}
      <div className="h-1.5" style={{ background: accent }} />

      {/* Header */}
      <div className="px-10 pt-7 pb-4 flex justify-between items-start">
        <div className="flex items-center gap-3">
          {company.logo
            ? <img src={company.logo} alt="Logo" className="h-14 object-contain" />
            : (
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 rounded-full border-4 flex items-center justify-center font-black text-lg" style={{ borderColor: accent, color: accent }}>
                  {(company.name || 'S')[0]}
                </div>
              </div>
            )
          }
          <div>
            <p className="font-black text-gray-900 text-base uppercase tracking-wide leading-none">{company.name || 'YOUR COMPANY'}</p>
            {company.website && <p className="text-xs text-gray-400 mt-0.5">{company.website.replace(/^https?:\/\//, '')}</p>}
          </div>
        </div>
        <div className="text-right">
          <h1 className="text-4xl font-black uppercase tracking-wider" style={{ color: accent }}>INVOICE</h1>
          {company.website && <p className="text-xs text-gray-400 uppercase tracking-widest mt-1">{company.website.replace(/^https?:\/\//, '')}</p>}
        </div>
      </div>

      {/* Blue divider line */}
      <div className="mx-10 h-0.5" style={{ background: accent }} />

      {/* Customer + Invoice meta */}
      <div className="px-10 pt-5 pb-4 flex justify-between items-start">
        <div>
          <p className="text-xs text-gray-400 mb-1">Invoice to :</p>
          <p className="text-xl font-black text-gray-900">{form.customerName || '—'}</p>
          {form.customerPhone && <p className="text-sm text-gray-500 mt-1">{form.customerPhone}</p>}
          {form.customerEmail && <p className="text-sm text-gray-500">{form.customerEmail}</p>}
          {form.billingAddress && <p className="text-sm text-gray-500">{form.billingAddress}</p>}
          {(form.customerCity || form.customerState) && (
            <p className="text-sm text-gray-500">{[form.customerCity, form.customerState].filter(Boolean).join(', ')}</p>
          )}
        </div>
        <div className="text-right">
          <p className="text-sm font-bold text-gray-800">Invoice no : <span style={{ color: accent }}>{form.invoiceNumber}</span></p>
          <p className="text-sm text-gray-500 mt-1">{form.invoiceDate}</p>
          {form.dueDate && <p className="text-xs text-gray-400 mt-0.5">Due: {form.dueDate}</p>}
        </div>
      </div>

      {/* Items table */}
      <div className="px-10 pb-2">
        <table className="w-full text-sm border-collapse">
          <thead>
            <tr style={{ background: accent }}>
              <th className="text-center py-2.5 px-3 text-white font-bold text-xs uppercase w-10">NO</th>
              <th className="text-left py-2.5 px-3 text-white font-bold text-xs uppercase">DESCRIPTION</th>
              <th className="text-center py-2.5 px-3 text-white font-bold text-xs uppercase w-16">QTY</th>
              <th className="text-right py-2.5 px-3 text-white font-bold text-xs uppercase w-24">PRICE</th>
              <th className="text-right py-2.5 px-3 text-white font-bold text-xs uppercase w-24">TOTAL</th>
            </tr>
          </thead>
          <tbody>
            {form.items.map((item, i) => {
              const line = calcLineTotal(item)
              const isBlue = i % 2 === 1
              return (
                <tr key={item.id} style={{ background: isBlue ? '#dbeafe' : '#ffffff' }}>
                  <td className="py-2.5 px-3 text-center text-gray-600 text-xs">{i + 1}</td>
                  <td className="py-2.5 px-3 text-gray-800 font-medium">{item.name || '—'}</td>
                  <td className="py-2.5 px-3 text-center text-gray-700">{item.quantity}</td>
                  <td className="py-2.5 px-3 text-right text-gray-700">{formatCurrency(item.unitPrice, sym)}</td>
                  <td className="py-2.5 px-3 text-right font-semibold text-gray-900">{formatCurrency(line.gross, sym)}</td>
                </tr>
              )
            })}
          </tbody>
        </table>

        {/* Sub total + Tax rows (right-aligned) */}
        <div className="flex justify-end mt-1">
          <table className="text-sm" style={{ minWidth: 220 }}>
            <tbody>
              <tr>
                <td className="py-1.5 pr-6 text-right text-gray-500">Sub Total :</td>
                <td className="py-1.5 text-right font-semibold text-gray-800 w-24">{formatCurrency(totals.subtotal, sym)}</td>
              </tr>
              {totals.totalDiscount > 0 && (
                <tr>
                  <td className="py-1.5 pr-6 text-right text-gray-500">Discount :</td>
                  <td className="py-1.5 text-right text-red-500 font-semibold w-24">-{formatCurrency(totals.totalDiscount, sym)}</td>
                </tr>
              )}
              {totals.totalGst > 0 && (
                <tr>
                  <td className="py-1.5 pr-6 text-right text-gray-500">Tax :</td>
                  <td className="py-1.5 text-right font-semibold text-gray-800 w-24">{formatCurrency(totals.totalGst, sym)}</td>
                </tr>
              )}
              {totals.shipping > 0 && (
                <tr>
                  <td className="py-1.5 pr-6 text-right text-gray-500">Shipping :</td>
                  <td className="py-1.5 text-right font-semibold text-gray-800 w-24">{formatCurrency(totals.shipping, sym)}</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Payment Method + Grand Total row */}
      <div className="px-10 mt-2 flex justify-between items-stretch gap-0">
        <div className="py-2.5 px-4 font-bold text-white text-sm uppercase tracking-wide" style={{ background: accent }}>
          PAYMENT METHOD :
        </div>
        <div className="flex-1" />
        <div className="flex items-center gap-0">
          <div className="py-2.5 px-5 font-bold text-white text-sm uppercase tracking-wide" style={{ background: accent }}>
            GRAND TOTAL :
          </div>
          <div className="py-2.5 px-5 font-bold text-white text-sm" style={{ background: accent }}>
            {formatCurrency(totals.grandTotal, sym)}
          </div>
        </div>
      </div>

      {/* Bank details */}
      {(company.bankName || company.accountNumber) && (
        <div className="px-10 pt-3 text-sm text-gray-600 space-y-0.5">
          {company.bankName && <p>Bank Name : {company.bankName}</p>}
          {company.accountNumber && <p>Account Number : {company.accountNumber}</p>}
          {company.ifsc && <p>IFSC : {company.ifsc}</p>}
          {company.upiId && <p>UPI : {company.upiId}</p>}
        </div>
      )}

      {/* Notes */}
      {form.notes && (
        <div className="px-10 pt-4">
          <div className="h-px bg-gray-200 mb-3" />
          <p className="font-bold text-gray-800 text-sm">{form.notes}</p>
        </div>
      )}

      {/* Terms */}
      {form.terms && (
        <div className="px-10 pt-3">
          <p className="font-bold text-gray-700 text-sm mb-1">Term and Conditions :</p>
          <p className="text-xs text-gray-500 leading-relaxed">{form.terms}</p>
        </div>
      )}

      {/* Signature */}
      {company.signature && (
        <div className="px-10 pt-4 flex justify-end">
          <div className="text-center">
            <img src={company.signature} alt="Signature" className="h-14 object-contain mx-auto" />
            <p className="font-bold text-gray-800 text-sm mt-1">{company.accountHolder || company.name}</p>
            <p className="text-xs text-gray-500">Administrator</p>
          </div>
        </div>
      )}

      {/* Footer */}
      <div className="mx-10 mt-6 h-0.5" style={{ background: accent }} />
      <div className="px-10 py-4 flex justify-center gap-10 text-xs text-gray-400">
        {company.phone && (
          <span className="flex items-center gap-1.5">
            <span className="w-5 h-5 rounded-full border border-gray-300 flex items-center justify-center text-xs">☎</span>
            {company.phone}
          </span>
        )}
        {company.email && (
          <span className="flex items-center gap-1.5">
            <span className="w-5 h-5 rounded-full border border-gray-300 flex items-center justify-center text-xs">✉</span>
            {company.email}
          </span>
        )}
        {company.address && (
          <span className="flex items-center gap-1.5">
            <span className="w-5 h-5 rounded-full border border-gray-300 flex items-center justify-center text-xs">⊙</span>
            {company.address}
          </span>
        )}
      </div>

      {/* Bottom blue accent line */}
      <div className="h-1.5" style={{ background: accent }} />
    </div>
  )
}

// ── Theme: Bold Yellow (image 2 — yellow bar, dark table header) ───────────

function BoldYellowTheme({ form, totals, company, sym }) {
  const yellow = '#f5c200'
  const darkHeader = '#2d3748'

  return (
    <div className="bg-white min-h-[1122px] font-sans" style={{ fontFamily: 'Inter, sans-serif' }}>
      {/* Yellow top bar */}
      <div className="h-4" style={{ background: yellow }} />

      {/* Header */}
      <div className="px-10 pt-6 pb-4 flex justify-between items-start">
        <div className="flex items-center gap-3">
          {company.logo
            ? <img src={company.logo} alt="Logo" className="h-14 object-contain" />
            : (
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 border-2 border-gray-800 flex items-center justify-center transform rotate-45">
                  <span className="transform -rotate-45 font-black text-sm text-gray-800">{(company.name || 'B')[0]}</span>
                </div>
                <div>
                  <p className="font-black text-gray-900 text-base uppercase leading-none">{company.name || 'Brand Name'}</p>
                  <p className="text-xs text-gray-400 uppercase tracking-widest">Tagline space here</p>
                </div>
              </div>
            )
          }
        </div>
        <div className="flex items-start gap-3">
          <h1 className="text-5xl font-black text-gray-800 uppercase tracking-widest">INVOICE</h1>
          <div className="w-6 h-12 mt-1" style={{ background: yellow }} />
        </div>
      </div>

      {/* Yellow divider bar */}
      <div className="mx-0 h-3" style={{ background: yellow }} />

      {/* Customer + Invoice meta */}
      <div className="px-10 pt-6 pb-4 flex justify-between items-start">
        <div>
          <p className="text-xs font-semibold text-gray-500 mb-1">Invoice to:</p>
          <p className="text-lg font-black text-gray-900">{form.customerName || '—'}</p>
          {form.billingAddress && <p className="text-sm text-gray-500 mt-1 leading-relaxed">{form.billingAddress}</p>}
          {(form.customerCity || form.customerState) && (
            <p className="text-sm text-gray-500">{[form.customerCity, form.customerState, form.customerPin].filter(Boolean).join(', ')}</p>
          )}
        </div>
        <div className="text-right text-sm space-y-1.5">
          <div className="flex justify-end gap-6">
            <span className="text-gray-500 font-semibold">Invoice#</span>
            <span className="font-bold text-gray-800 w-24 text-right">{form.invoiceNumber}</span>
          </div>
          <div className="flex justify-end gap-6">
            <span className="text-gray-500 font-semibold">Date</span>
            <span className="font-bold text-gray-800 w-24 text-right">{form.invoiceDate}</span>
          </div>
          {form.dueDate && (
            <div className="flex justify-end gap-6">
              <span className="text-gray-500 font-semibold">Due Date</span>
              <span className="font-bold text-gray-800 w-24 text-right">{form.dueDate}</span>
            </div>
          )}
        </div>
      </div>

      {/* Items table */}
      <div className="px-10 pb-4">
        <table className="w-full text-sm border-collapse">
          <thead>
            <tr style={{ background: darkHeader }}>
              <th className="text-left py-3 px-4 text-white font-semibold text-xs w-10">SL.</th>
              <th className="text-left py-3 px-4 text-white font-semibold text-xs">Item Description</th>
              <th className="text-right py-3 px-4 text-white font-semibold text-xs w-28">Price</th>
              <th className="text-center py-3 px-4 text-white font-semibold text-xs w-16">Qty.</th>
              <th className="text-right py-3 px-4 text-white font-semibold text-xs w-28">Total</th>
            </tr>
          </thead>
          <tbody>
            {form.items.map((item, i) => {
              const line = calcLineTotal(item)
              return (
                <tr key={item.id} className="border-b border-gray-100">
                  <td className="py-3.5 px-4 text-gray-500 text-xs">{i + 1}</td>
                  <td className="py-3.5 px-4">
                    <p className="text-gray-800 font-medium">{item.name || '—'}</p>
                    {item.description && <p className="text-xs text-gray-400 mt-0.5">{item.description}</p>}
                  </td>
                  <td className="py-3.5 px-4 text-right text-gray-700">{formatCurrency(item.unitPrice, sym)}</td>
                  <td className="py-3.5 px-4 text-center text-gray-700">{item.quantity}</td>
                  <td className="py-3.5 px-4 text-right font-semibold text-gray-900">{formatCurrency(line.gross, sym)}</td>
                </tr>
              )
            })}
            {/* Empty spacer rows if fewer than 4 items */}
            {form.items.length < 4 && Array.from({ length: 4 - form.items.length }).map((_, i) => (
              <tr key={`empty-${i}`} className="border-b border-gray-100">
                <td className="py-3.5 px-4">&nbsp;</td>
                <td className="py-3.5 px-4"></td>
                <td className="py-3.5 px-4"></td>
                <td className="py-3.5 px-4"></td>
                <td className="py-3.5 px-4"></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Bottom section: notes/terms/bank left, totals right */}
      <div className="px-10 pb-8 flex justify-between items-start gap-8">
        {/* Left */}
        <div className="flex-1 text-sm space-y-4">
          {form.notes && (
            <div>
              <p className="font-bold text-gray-800">{form.notes}</p>
            </div>
          )}
          {form.terms && (
            <div>
              <p className="font-bold text-gray-700 mb-1">Terms &amp; Conditions</p>
              <p className="text-xs text-gray-500 leading-relaxed">{form.terms}</p>
            </div>
          )}
          {(company.bankName || company.accountNumber || company.upiId) && (
            <div>
              <p className="font-bold text-gray-700 mb-1">Payment Info:</p>
              <div className="text-xs text-gray-500 space-y-0.5">
                {company.accountNumber && <p>Account #: {company.accountNumber}</p>}
                {company.accountHolder && <p>A/C Name: {company.accountHolder}</p>}
                {company.bankName && <p>Bank Details: {company.bankName}{company.ifsc ? ` / ${company.ifsc}` : ''}</p>}
                {company.upiId && <p>UPI: {company.upiId}</p>}
              </div>
            </div>
          )}
        </div>

        {/* Right: totals */}
        <div className="w-56 text-sm space-y-2">
          <div className="flex justify-between">
            <span className="text-gray-500">Sub Total:</span>
            <span className="font-semibold text-gray-800">{formatCurrency(totals.subtotal, sym)}</span>
          </div>
          {totals.totalDiscount > 0 && (
            <div className="flex justify-between">
              <span className="text-gray-500">Discount:</span>
              <span className="font-semibold text-red-500">-{formatCurrency(totals.totalDiscount, sym)}</span>
            </div>
          )}
          <div className="flex justify-between">
            <span className="text-gray-500">Tax:</span>
            <span className="font-semibold text-gray-800">
              {totals.totalGst > 0 ? formatCurrency(totals.totalGst, sym) : '0.00%'}
            </span>
          </div>
          {totals.shipping > 0 && (
            <div className="flex justify-between">
              <span className="text-gray-500">Shipping:</span>
              <span className="font-semibold text-gray-800">{formatCurrency(totals.shipping, sym)}</span>
            </div>
          )}
          <div className="flex justify-between items-center font-bold text-white px-4 py-2.5 mt-1" style={{ background: yellow }}>
            <span className="text-gray-800 text-base">Total:</span>
            <span className="text-gray-800 text-base">{formatCurrency(totals.grandTotal, sym)}</span>
          </div>
        </div>
      </div>

      {/* Signature */}
      {company.signature && (
        <div className="px-10 flex justify-end mb-4">
          <div className="text-center">
            <img src={company.signature} alt="Signature" className="h-14 object-contain mx-auto" />
            <div className="w-40 h-px bg-gray-300 mt-1 mb-1" />
            <p className="text-xs text-gray-500">Authorised Sign</p>
          </div>
        </div>
      )}
      {!company.signature && (
        <div className="px-10 flex justify-end mb-4">
          <div className="text-center">
            <div className="w-40 h-px bg-gray-300 mb-1" />
            <p className="text-xs text-gray-500">Authorised Sign</p>
          </div>
        </div>
      )}

      {/* Bottom yellow bar + footer */}
      <div className="h-1.5" style={{ background: yellow }} />
      <div className="px-10 py-3 flex justify-center gap-4 text-xs text-gray-400">
        <span>{company.phone || 'Phone #'}</span>
        <span>|</span>
        <span>{company.address || 'Address'}</span>
        <span>|</span>
        <span>{company.website || 'Website'}</span>
      </div>
      <div className="h-1.5" style={{ background: yellow }} />
    </div>
  )
}

const THEME_MAP = {
  minimal: MinimalTheme,
  professional: ProfessionalTheme,
  corporate: CorporateTheme,
  yellow: YellowTheme,
  modern: ModernTheme,
  elegant: ElegantTheme,
  studio: StudioTheme,
  boldyellow: BoldYellowTheme,
}
