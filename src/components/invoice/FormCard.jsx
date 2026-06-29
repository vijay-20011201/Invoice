export default function FormCard({ title, children }) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
      <div className="px-4 py-3 border-b border-gray-100 bg-gray-50">
        <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wide">{title}</h3>
      </div>
      <div className="p-4">{children}</div>
    </div>
  )
}
