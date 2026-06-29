import { formatCurrency } from '../../utils/calculations'
import FormCard from './FormCard'

export default function SummarySection({ form, update, totals, currency }) {
  const sym = currency.symbol

  return (
    <FormCard title="Summary & Charges">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
        <div>
          <label className="field-label">Shipping Charges</label>
          <input
            type="number" min="0" step="0.01" className="input"
            value={form.shippingCharge || ''}
            placeholder="0.00"
            onChange={(e) => update({ shippingCharge: parseFloat(e.target.value) || 0 })}
          />
        </div>
        <div>
          <label className="field-label">Additional Charges</label>
          <input
            type="number" min="0" step="0.01" className="input"
            value={form.additionalCharge || ''}
            placeholder="0.00"
            onChange={(e) => update({ additionalCharge: parseFloat(e.target.value) || 0 })}
          />
        </div>
      </div>

      <div className="flex items-center gap-2 mb-4">
        <input
          type="checkbox" id="roundOff" className="w-4 h-4 accent-blue-600"
          checked={form.roundOff}
          onChange={(e) => update({ roundOff: e.target.checked })}
        />
        <label htmlFor="roundOff" className="text-sm text-gray-600">Enable Round Off</label>
      </div>

      {/* Totals */}
      <div className="bg-gray-50 rounded-xl p-4 space-y-2 text-sm">
        <Row label="Subtotal" value={formatCurrency(totals.subtotal, sym)} />
        {totals.totalDiscount > 0 && <Row label="Discount" value={`-${formatCurrency(totals.totalDiscount, sym)}`} className="text-red-600" />}
        <Row label="Taxable Amount" value={formatCurrency(totals.taxableSubtotal, sym)} />
        <Row label="Total GST" value={formatCurrency(totals.totalGst, sym)} className="text-blue-600" />
        {totals.shipping > 0 && <Row label="Shipping" value={formatCurrency(totals.shipping, sym)} />}
        {totals.additional > 0 && <Row label="Additional" value={formatCurrency(totals.additional, sym)} />}
        {form.roundOff && totals.roundOffAmt !== 0 && (
          <Row label="Round Off" value={`${totals.roundOffAmt > 0 ? '+' : ''}${formatCurrency(totals.roundOffAmt, sym)}`} />
        )}
        <div className="border-t border-gray-300 pt-2 mt-1">
          <Row label="Grand Total" value={formatCurrency(totals.grandTotal, sym)} bold />
        </div>
      </div>
    </FormCard>
  )
}

function Row({ label, value, className = '', bold }) {
  return (
    <div className="flex justify-between items-center">
      <span className={`text-gray-500 ${bold ? 'font-semibold text-gray-800' : ''}`}>{label}</span>
      <span className={`font-medium ${bold ? 'text-lg font-bold text-gray-900' : ''} ${className}`}>{value}</span>
    </div>
  )
}
