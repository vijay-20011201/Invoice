import FormCard from './FormCard'

export default function CustomerSection({ form, update }) {
  const f = (key) => ({
    value: form[key] || '',
    onChange: (e) => update({ [key]: e.target.value }),
  })

  return (
    <FormCard title="Customer Information">
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="field-label">Customer Name *</label>
          <input className="input" {...f('customerName')} placeholder="John Doe" />
        </div>
        <div>
          <label className="field-label">Company Name</label>
          <input className="input" {...f('customerCompany')} placeholder="Acme Corp" />
        </div>
        <div>
          <label className="field-label">GST Number</label>
          <input className="input" {...f('customerGst')} placeholder="22AAAAA0000A1Z5" />
        </div>
        <div>
          <label className="field-label">Phone</label>
          <input className="input" {...f('customerPhone')} placeholder="+91 98765 43210" />
        </div>
        <div className="col-span-2">
          <label className="field-label">Email</label>
          <input type="email" className="input" {...f('customerEmail')} placeholder="customer@email.com" />
        </div>
        <div className="col-span-2">
          <label className="field-label">Billing Address</label>
          <textarea className="input" rows={2} {...f('billingAddress')} placeholder="Street, Area, City" />
        </div>
        <div className="col-span-2">
          <label className="field-label">Shipping Address</label>
          <textarea className="input" rows={2} {...f('shippingAddress')} placeholder="Same as billing or different" />
        </div>
        <div>
          <label className="field-label">City</label>
          <input className="input" {...f('customerCity')} placeholder="Mumbai" />
        </div>
        <div>
          <label className="field-label">State</label>
          <input className="input" {...f('customerState')} placeholder="Maharashtra" />
        </div>
        <div>
          <label className="field-label">Country</label>
          <input className="input" {...f('customerCountry')} placeholder="India" />
        </div>
        <div>
          <label className="field-label">PIN Code</label>
          <input className="input" {...f('customerPin')} placeholder="400001" />
        </div>
      </div>
    </FormCard>
  )
}
