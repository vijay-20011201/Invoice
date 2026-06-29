import FormCard from './FormCard'

export default function NotesSection({ form, update }) {
  return (
    <FormCard title="Notes & Terms">
      <div className="space-y-3">
        <div>
          <label className="field-label">Notes</label>
          <textarea
            className="input"
            rows={3}
            placeholder="Thank you for your business!"
            value={form.notes}
            onChange={(e) => update({ notes: e.target.value })}
          />
        </div>
        <div>
          <label className="field-label">Terms & Conditions</label>
          <textarea
            className="input"
            rows={3}
            placeholder="Payment due within 30 days..."
            value={form.terms}
            onChange={(e) => update({ terms: e.target.value })}
          />
        </div>
      </div>
    </FormCard>
  )
}
