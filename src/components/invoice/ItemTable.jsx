import { Plus, Trash2, Copy } from 'lucide-react'
import { DISCOUNT_TYPES } from '../../constants'
import { calcLineTotal, formatCurrency } from '../../utils/calculations'
import FormCard from './FormCard'

export default function ItemTable({ items, updateItem, addItem, removeItem, duplicateItem, currency }) {
  return (
    <FormCard title="Items">
      <div className="space-y-3">
        {items.map((item, idx) => (
          <ItemRow
            key={item.id}
            item={item}
            index={idx}
            onUpdate={(patch) => updateItem(item.id, patch)}
            onRemove={() => removeItem(item.id)}
            onDuplicate={() => duplicateItem(item.id)}
            currency={currency}
            canRemove={items.length > 1}
          />
        ))}
      </div>
      <button
        onClick={addItem}
        className="mt-3 flex items-center gap-2 text-sm text-blue-600 hover:text-blue-800 font-medium px-1 py-1"
      >
        <Plus size={16} /> Add Item
      </button>
    </FormCard>
  )
}

function ItemRow({ item, index, onUpdate, onRemove, onDuplicate, currency, canRemove }) {
  const line = calcLineTotal(item)
  const num = (key, val) => parseFloat(val) || 0

  return (
    <div className="bg-gray-50 border border-gray-200 rounded-xl p-3 space-y-2">
      <div className="flex items-start justify-between gap-2">
        <span className="text-xs font-medium text-gray-400 mt-1">#{index + 1}</span>
        <div className="flex-1 grid grid-cols-1 gap-2">
          <input
            className="input text-sm"
            placeholder="Item name *"
            value={item.name}
            onChange={(e) => onUpdate({ name: e.target.value })}
          />
          <input
            className="input text-sm text-gray-500"
            placeholder="Description (optional)"
            value={item.description}
            onChange={(e) => onUpdate({ description: e.target.value })}
          />
        </div>
        <div className="flex gap-1">
          <button onClick={onDuplicate} className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors" title="Duplicate">
            <Copy size={14} />
          </button>
          {canRemove && (
            <button onClick={onRemove} className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors" title="Remove">
              <Trash2 size={14} />
            </button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
        <div>
          <label className="field-label">Qty</label>
          <input
            type="number" min="0" step="0.01" className="input text-sm"
            value={item.quantity}
            onChange={(e) => onUpdate({ quantity: num('quantity', e.target.value) })}
          />
        </div>
        <div>
          <label className="field-label">Unit Price</label>
          <input
            type="number" min="0" step="0.01" className="input text-sm"
            value={item.unitPrice}
            onChange={(e) => onUpdate({ unitPrice: num('unitPrice', e.target.value) })}
          />
        </div>
        <div>
          <label className="field-label">Discount</label>
          <div className="flex gap-1">
            <select
              className="input text-xs w-20 px-1"
              value={item.discountType}
              onChange={(e) => onUpdate({ discountType: e.target.value })}
            >
              {DISCOUNT_TYPES.map((d) => <option key={d}>{d}</option>)}
            </select>
            <input
              type="number" min="0" step="0.01" className="input text-sm flex-1"
              value={item.discountValue}
              onChange={(e) => onUpdate({ discountValue: num('discountValue', e.target.value) })}
            />
          </div>
        </div>
        <div>
          <label className="field-label">GST %</label>
          <input
            type="number" min="0" max="100" step="0.01" className="input text-sm"
            value={item.gst}
            onChange={(e) => onUpdate({ gst: num('gst', e.target.value) })}
          />
        </div>
      </div>

      <div className="flex items-center justify-between text-xs text-gray-500 pt-1 border-t border-gray-200">
        <div className="flex gap-3">
          <span>Taxable: {formatCurrency(line.taxable, currency.symbol)}</span>
          <span>GST ({item.gst}%): {formatCurrency(line.gstAmount, currency.symbol)}</span>
          {line.discount > 0 && <span>Disc: -{formatCurrency(line.discount, currency.symbol)}</span>}
        </div>
        <span className="font-semibold text-gray-800 text-sm">
          {formatCurrency(line.total, currency.symbol)}
        </span>
      </div>
    </div>
  )
}
