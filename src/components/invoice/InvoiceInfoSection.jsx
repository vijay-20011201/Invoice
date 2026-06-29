import { CURRENCIES, INVOICE_STATUSES, PAYMENT_TERMS } from '../../constants'
import FormCard from './FormCard'

export default function InvoiceInfoSection({ form, update, settings }) {
  return (
    <FormCard title="Invoice Details">
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="field-label">Invoice Number</label>
          <input
            className="input"
            value={form.invoiceNumber}
            onChange={(e) => update({ invoiceNumber: e.target.value })}
          />
        </div>
        <div>
          <label className="field-label">Currency</label>
          <select className="input" value={form.currency} onChange={(e) => update({ currency: e.target.value })}>
            {CURRENCIES.map((c) => <option key={c.code} value={c.code}>{c.code}</option>)}
          </select>
        </div>
        <div>
          <label className="field-label">Invoice Date *</label>
          <input type="date" className="input" value={form.invoiceDate} onChange={(e) => update({ invoiceDate: e.target.value })} />
        </div>
        <div>
          <label className="field-label">Due Date</label>
          <input type="date" className="input" value={form.dueDate} onChange={(e) => update({ dueDate: e.target.value })} />
        </div>
        <div>
          <label className="field-label">Payment Terms</label>
          <select className="input" value={form.paymentTerms} onChange={(e) => update({ paymentTerms: e.target.value })}>
            {PAYMENT_TERMS.map((t) => <option key={t}>{t}</option>)}
          </select>
        </div>
        <div>
          <label className="field-label">Status</label>
          <select className="input" value={form.status} onChange={(e) => update({ status: e.target.value })}>
            {INVOICE_STATUSES.map((s) => <option key={s}>{s}</option>)}
          </select>
        </div>
        <div>
          <label className="field-label">PO Number</label>
          <input className="input" value={form.poNumber} onChange={(e) => update({ poNumber: e.target.value })} placeholder="Optional" />
        </div>
        <div>
          <label className="field-label">Reference Number</label>
          <input className="input" value={form.referenceNumber} onChange={(e) => update({ referenceNumber: e.target.value })} placeholder="Optional" />
        </div>
      </div>
    </FormCard>
  )
}
