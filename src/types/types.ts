export type JewelryType = "silver" | "gold"
export type BillType = "white" | "green"
export type PaymentMethod = "cash" | "card" | "upi" | "bank_transfer"

export interface Customer {
  id: string
  name: string
  phone: string
  createdAt: string // ISO
}

export interface BillItem {
  name: string
  price: number
  type?: JewelryType
}

export interface Bill {
  id: string
  customerId: string
  type: JewelryType
  items: BillItem[]
  cgstPct: number
  sgstPct: number
  subtotal: number
  taxAmount: number
  total: number
  billType?: BillType
  paymentMethod?: PaymentMethod
  createdAt: string // ISO
}

export interface ExistingCustomerLookup {
  exists: boolean
  customer?: Customer
}
