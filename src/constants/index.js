export const CURRENCIES = [
  { code: 'INR', symbol: '₹', name: 'Indian Rupee' },
  { code: 'USD', symbol: '$', name: 'US Dollar' },
  { code: 'EUR', symbol: '€', name: 'Euro' },
  { code: 'GBP', symbol: '£', name: 'British Pound' },
  { code: 'AED', symbol: 'د.إ', name: 'UAE Dirham' },
  { code: 'SGD', symbol: 'S$', name: 'Singapore Dollar' },
  { code: 'AUD', symbol: 'A$', name: 'Australian Dollar' },
  { code: 'CAD', symbol: 'C$', name: 'Canadian Dollar' },
  { code: 'JPY', symbol: '¥', name: 'Japanese Yen' },
]

export const INVOICE_STATUSES = ['Draft', 'Unpaid', 'Paid', 'Cancelled']

export const PAYMENT_TERMS = [
  'Due on Receipt',
  'Net 7',
  'Net 15',
  'Net 30',
  'Net 45',
  'Net 60',
  'Custom',
]

export const DISCOUNT_TYPES = ['Percentage', 'Flat']

export const GST_PRESETS = [0, 3, 5, 12, 18, 28]

export const PAPER_SIZES = ['A4', 'Letter', 'Legal']

export const INVOICE_THEMES = [
  { id: 'minimal', name: 'Minimal', color: '#1f2937' },
  { id: 'professional', name: 'Professional', color: '#2563eb' },
  { id: 'corporate', name: 'Corporate Blue', color: '#1e40af' },
  { id: 'yellow', name: 'Yellow Business', color: '#d97706' },
  { id: 'modern', name: 'Modern Green', color: '#059669' },
  { id: 'elegant', name: 'Elegant Purple', color: '#7c3aed' },
  { id: 'studio', name: 'Studio Blue', color: '#1a73c8' },
  { id: 'boldyellow', name: 'Bold Yellow', color: '#f5c200' },
]

export const DEFAULT_COMPANY = {
  name: '',
  gst: '',
  phone: '',
  email: '',
  website: '',
  address: '',
  city: '',
  state: '',
  country: 'India',
  pin: '',
  bankName: '',
  accountNumber: '',
  ifsc: '',
  accountHolder: '',
  upiId: '',
  logo: '',
  signature: '',
}

export const DEFAULT_SETTINGS = {
  currency: 'INR',
  invoicePrefix: 'INV',
  paperSize: 'A4',
  defaultNotes: 'Thank you for your business!',
  defaultTerms: 'Payment is due within 30 days of invoice date.',
  theme: 'professional',
  lastInvoiceNumber: 0,
}

export const DEFAULT_ITEM = {
  id: Date.now(),
  name: '',
  description: '',
  quantity: 1,
  unitPrice: 0,
  discountType: 'Percentage',
  discountValue: 0,
  gst: 18,
}

export const LS_KEYS = {
  COMPANY: 'invoice_company',
  SETTINGS: 'invoice_settings',
  INVOICES: 'invoice_saved',
  DRAFT: 'invoice_draft',
}
