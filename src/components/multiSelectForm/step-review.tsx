"use client"

import { useMemo } from "react"
import type { BillItem, JewelryType, BillType, PaymentMethod } from "../../types/types"
import { formatINR } from "./items-editor-shared"
import CustomDropdown from "../ui/dropdown/CustomDropdown"

interface StepReviewProps {
  phone: string
  name: string
  type: JewelryType
  billType: BillType
  items: BillItem[]
  cgstPct: number
  sgstPct: number
  subtotal: number
  taxAmount: number
  total: number
  saving: boolean
  onBack: () => void
  onSaveAndPrint: () => Promise<void>
  paymentMethod: PaymentMethod
  onPaymentMethodChange: (m: PaymentMethod) => void
}

export default function StepReview({
  phone,
  name,
  type,
  items,
  billType,
  cgstPct,
  sgstPct,
  subtotal,
  taxAmount,
  total,
  saving,
  onBack,
  onSaveAndPrint,
  paymentMethod,
  onPaymentMethodChange,
}: StepReviewProps) {
  const taxSplit = useMemo(() => {
    if (billType === "green") return { cgst: 0, sgst: 0 }
    const totalPct = cgstPct + sgstPct
    const cgst = totalPct > 0 ? taxAmount * (cgstPct / totalPct) : 0
    const sgst = totalPct > 0 ? taxAmount * (sgstPct / totalPct) : 0
    return { cgst, sgst }
  }, [billType, cgstPct, sgstPct, taxAmount])

  return (
    <>
      <div className="print:hidden">
        <div className="flex flex-col gap-4">
          <div>
            <h2 className="text-xl font-semibold">Review & Confirm</h2>
            <p className="text-sm text-muted-foreground">Verify all details before saving and printing.</p>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="rounded-lg border border-border bg-card p-4">
              <h3 className="text-sm font-medium">Customer</h3>
              <div className="mt-2 text-sm">
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Name</span>
                  <span className="font-medium">{name}</span>
                </div>
                <div className="mt-1 flex items-center justify-between">
                  <span className="text-muted-foreground">Phone</span>
                  <span className="font-medium">{phone}</span>
                </div>
                <div className="mt-1 flex items-center justify-between">
                  <span className="text-muted-foreground">Type</span>
                  <span className="font-medium capitalize">{type}</span>
                </div>
              </div>
            </div>

            <div className="rounded-lg border border-border bg-card p-4">
              <h3 className="text-sm font-medium">Totals</h3>
              <div className="mt-2 space-y-1 text-sm">
                <Row label="Subtotal" value={formatINR(subtotal)} />
                {billType === "white" ? (
                  <>
                    <Row label={`CGST (${cgstPct}%)`} value={formatINR(taxSplit.cgst)} />
                    <Row label={`SGST (${sgstPct}%)`} value={formatINR(taxSplit.sgst)} />
                  </>
                ) : (
                  <div className="text-xs text-muted-foreground">Green bill: taxes not applicable</div>
                )}
                <div className="my-1 h-px w-full bg-border" />
                <Row label="Total" value={formatINR(total)} emphasize />
              </div>
            </div>
          </div>

          <div className="rounded-lg border border-border bg-card">
            <table className="w-full border-collapse">
              <thead className="bg-muted/50 text-left text-sm">
                <tr>
                  <th className="px-3 py-2 font-medium">#</th>
                  <th className="px-3 py-2 font-medium">Product</th>
                  <th className="px-3 py-2 font-medium">Price</th>
                </tr>
              </thead>
              <tbody>
                {items.map((it, i) => (
                  <tr key={i} className="border-t border-border text-sm">
                    <td className="px-3 py-2">{i + 1}</td>
                    <td className="px-3 py-2">{it.name || "-"}</td>
                    <td className="px-3 py-2">{formatINR(Number(it.price) || 0)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="flex items-center justify-between">
            <button
              type="button"
              onClick={onBack}
              className="inline-flex items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium hover:bg-muted"
            >
              Back
            </button>
            <div className="flex items-center gap-3">
              <div className="min-w-[180px]">
                <CustomDropdown
                  label="Payment Method"
                  options={[
                    { value: "cash", label: "Cash" },
                    { value: "card", label: "Card" },
                    { value: "upi", label: "UPI" },
                    { value: "bank_transfer", label: "Bank Transfer" },
                  ]}
                  value={paymentMethod}
                  onChange={(v) => onPaymentMethodChange(v as PaymentMethod)}
                  placeholder="Select method"
                  className="w-full"
                />
              </div>
              
              <button
                type="button"
                onClick={onSaveAndPrint}
                disabled={saving}
                className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow-sm hover:opacity-90 disabled:opacity-50"
              >
                {saving ? "Saving..." : "Save & Print"}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Printable receipt */}
      <div className="hidden print:block">
        <Receipt
          name={name}
          phone={phone}
          type={type}
          items={items}
          cgstPct={cgstPct}
          sgstPct={sgstPct}
          subtotal={subtotal}
          taxAmount={taxAmount}
          total={total}
        />
      </div>
    </>
  )
}

function Row({ label, value, emphasize = false }: { label: string; value: string; emphasize?: boolean }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-muted-foreground">{label}</span>
      <span className={`font-semibold ${emphasize ? "text-primary" : ""}`}>{value}</span>
    </div>
  )
}

function Receipt({
  name,
  phone,
  type,
  items,
  cgstPct,
  sgstPct,
  subtotal,
  taxAmount,
  total,
}: {
  name: string
  phone: string
  type: JewelryType
  items: BillItem[]
  cgstPct: number
  sgstPct: number
  subtotal: number
  taxAmount: number
  total: number
}) {
  const cgstAmt = taxAmount * (cgstPct / (cgstPct + sgstPct || 1))
  const sgstAmt = taxAmount * (sgstPct / (cgstPct + sgstPct || 1))

  return (
    <div className="p-6 text-foreground">
      <h1 className="text-center text-2xl font-bold">Jewelry Bill</h1>
      <p className="mt-1 text-center text-sm">Thank you for your purchase!</p>

      <div className="mt-4 grid grid-cols-2 gap-2 text-sm">
        <div>
          <div>
            <span className="text-muted-foreground">Customer:</span> <span className="font-medium">{name}</span>
          </div>
          <div>
            <span className="text-muted-foreground">Phone:</span> <span className="font-medium">{phone}</span>
          </div>
        </div>
        <div className="text-right">
          <div>
            <span className="text-muted-foreground">Type:</span> <span className="font-medium capitalize">{type}</span>
          </div>
          <div>
            <span className="text-muted-foreground">Date:</span>{" "}
            <span className="font-medium">{new Date().toLocaleString()}</span>
          </div>
        </div>
      </div>

      <table className="mt-4 w-full border-collapse text-sm">
        <thead>
          <tr>
            <th className="border border-border px-2 py-1 text-left">#</th>
            <th className="border border-border px-2 py-1 text-left">Product</th>
            <th className="border border-border px-2 py-1 text-right">Price</th>
          </tr>
        </thead>
        <tbody>
          {items.map((it, i) => (
            <tr key={i}>
              <td className="border border-border px-2 py-1">{i + 1}</td>
              <td className="border border-border px-2 py-1">{it.name || "-"}</td>
              <td className="border border-border px-2 py-1 text-right">{formatINR(Number(it.price) || 0)}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="mt-4 ml-auto w-full max-w-sm text-sm">
        <div className="flex items-center justify-between">
          <span>Subtotal</span>
          <span>{formatINR(subtotal)}</span>
        </div>
        <div className="flex items-center justify-between">
          <span>CGST ({cgstPct}%)</span>
          <span>{formatINR(cgstAmt)}</span>
        </div>
        <div className="flex items-center justify-between">
          <span>SGST ({sgstPct}%)</span>
          <span>{formatINR(sgstAmt)}</span>
        </div>
        <div className="my-2 h-px bg-border" />
        <div className="flex items-center justify-between font-semibold">
          <span>Total</span>
          <span>{formatINR(total)}</span>
        </div>
      </div>

      <p className="mt-6 text-center text-xs">Powered by Jewelry Billing Manager</p>
    </div>
  )
}
