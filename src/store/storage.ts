import type { Bill, Customer, ExistingCustomerLookup, JewelryType, BillType, PaymentMethod, BillItem } from "../types/types"

const CUSTOMERS_KEY = "jb_customers"
const BILLS_KEY = "jb_bills"

function safeParse<T>(json: string | null, fallback: T): T {
  if (!json) return fallback
  try {
    return JSON.parse(json) as T
  } catch {
    return fallback
  }
}

function getId() {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID()
  }
  return "id-" + Math.random().toString(36).slice(2, 10)
}

function readCustomers(): Customer[] {
  if (typeof window === "undefined") return []
  return safeParse<Customer[]>(localStorage.getItem(CUSTOMERS_KEY), [])
}

function writeCustomers(list: Customer[]) {
  if (typeof window === "undefined") return
  localStorage.setItem(CUSTOMERS_KEY, JSON.stringify(list))
}

function readBills(): Bill[] {
  if (typeof window === "undefined") return []
  return safeParse<Bill[]>(localStorage.getItem(BILLS_KEY), [])
}

function writeBills(list: Bill[]) {
  if (typeof window === "undefined") return
  localStorage.setItem(BILLS_KEY, JSON.stringify(list))
}

export async function findCustomerByPhone(phone: string): Promise<ExistingCustomerLookup> {
  const norm = phone.trim()
  const customers = readCustomers()
  const found = customers.find((c) => c.phone === norm)
  if (found) return { exists: true, customer: found }
  return { exists: false }
}

export async function upsertCustomer(name: string, phone: string): Promise<Customer> {
  const customers = readCustomers()
  const normPhone = phone.trim()
  const existing = customers.find((c) => c.phone === normPhone)
  if (existing) {
    if (existing.name !== name.trim()) {
      existing.name = name.trim()
      writeCustomers(customers)
    }
    return existing
  }
  const newCustomer: Customer = {
    id: getId(),
    name: name.trim(),
    phone: normPhone,
    createdAt: new Date().toISOString(),
  }
  customers.push(newCustomer)
  writeCustomers(customers)
  return newCustomer
}

export async function saveBill(payload: {
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
}): Promise<Bill> {
  const bills = readBills()
  const bill: Bill = {
    id: getId(),
    createdAt: new Date().toISOString(),
    ...payload,
  }
  bills.push(bill)
  writeBills(bills)
  return bill
}

export async function listBills(): Promise<Bill[]> {
  return readBills()
}
