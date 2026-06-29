import CustomerSection from './CustomerSection'
import InvoiceInfoSection from './InvoiceInfoSection'
import ItemTable from './ItemTable'
import SummarySection from './SummarySection'
import NotesSection from './NotesSection'

export default function InvoiceForm({ form, update, updateItem, addItem, removeItem, duplicateItem, totals, currency, company, settings }) {
  return (
    <div className="p-4 space-y-4 pb-24">
      <InvoiceInfoSection form={form} update={update} settings={settings} />
      <CustomerSection form={form} update={update} />
      <ItemTable
        items={form.items}
        updateItem={updateItem}
        addItem={addItem}
        removeItem={removeItem}
        duplicateItem={duplicateItem}
        currency={currency}
      />
      <SummarySection form={form} update={update} totals={totals} currency={currency} />
      <NotesSection form={form} update={update} />
    </div>
  )
}
