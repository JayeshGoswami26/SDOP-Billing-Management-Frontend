"use client"

import { useMemo, useState } from "react"
import StepPhone from "./step-phone"
import StepDetails from "./step-details"
import StepItemsSilver from "./step-items-silver"
import StepItemsGold from "./step-items-gold"
import StepReview from "./step-review"
import type { BillItem, JewelryType, BillType, PaymentMethod } from "../../types/types"
import { saveBill, upsertCustomer } from "../../store/storage"

type Step = "phone" | "details" | "silver" | "gold" | "review"

export default function MultiStepForm() {
  // Wizard state
  const [step, setStep] = useState<Step>("phone")

  // Shared state
  const [phone, setPhone] = useState("")
  const [name, setName] = useState("")
  const [type, setType] = useState<JewelryType>("silver")
  const [billType, setBillType] = useState<BillType>("white")
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("cash")

  const [items, setItems] = useState<BillItem[]>([])
  const [cgstPct, setCgstPct] = useState<number>(0)
  const [sgstPct, setSgstPct] = useState<number>(0)
  const [subtotal, setSubtotal] = useState<number>(0)
  const [taxAmount, setTaxAmount] = useState<number>(0)
  const [total, setTotal] = useState<number>(0)

  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState<string | null>(null)

  const steps = useMemo(
    () => [
      { key: "phone", label: "Phone" },
      { key: "details", label: "Details" },
      { key: "silver", label: "Silver Items" },
      { key: "gold", label: "Gold Items" },
      { key: "review", label: "Review" },
    ],
    [],
  )

  const currentIndex = steps.findIndex((s) => s.key === step)

  async function handleSaveAndPrint() {
    setSaving(true)
    setMessage(null)
    try {
      const customer = await upsertCustomer(name, phone)
      const bill = await saveBill({
        customerId: customer.id,
        type,
        items,
        cgstPct,
        sgstPct,
        subtotal,
        taxAmount,
        total,
        // billType and paymentMethod can be wired to backend later
        billType,
        paymentMethod,
      })
      // Trigger print
      await new Promise((r) => setTimeout(r, 50))
      window.print()
      setMessage(`Saved bill #${bill.id.slice(0, 8)} successfully.`)
      // Optionally reset state here
      // resetForm()
    } catch (e) {
      setMessage("Failed to save. Please try again.")
    } finally {
      setSaving(false)
    }
  }

  function resetForm() {
    setStep("phone")
    setPhone("")
    setName("")
    setType("silver")
    setBillType("white")
    setPaymentMethod("cash")
    setItems([])
    setCgstPct(0)
    setSgstPct(0)
    setSubtotal(0)
    setTaxAmount(0)
    setTotal(0)
    setSaving(false)
    setMessage(null)
  }

  return (
    <div>
      {/* Progress */}
      <ol className="mb-6 flex items-center justify-between gap-2 text-xs">
        {steps.map((s, idx) => {
          const active = idx === currentIndex
          const done = idx < currentIndex
          return (
            <li key={s.key} className="flex flex-1 items-center gap-2">
              <div
                className={`flex h-7 w-7 items-center justify-center rounded-full border ${
                  done
                    ? "bg-primary text-primary-foreground border-primary"
                    : active
                      ? "border-primary"
                      : "border-border"
                }`}
                aria-current={active ? "step" : undefined}
              >
                {idx + 1}
              </div>
              <span className={`hidden text-foreground md:inline ${active ? "font-semibold" : ""}`}>{s.label}</span>
              {idx < steps.length - 1 && <div className="mx-2 hidden h-px flex-1 bg-border md:block" />}
            </li>
          )
        })}
      </ol>

      {/* Messages */}
      {message && <div className="mb-4 rounded-md border border-border bg-muted/40 p-3 text-sm">{message}</div>}

      {/* Steps */}
      {step === "phone" && (
        <StepPhone
          initialPhone={phone}
          onNext={(nextPhone) => {
            setPhone(nextPhone)
            setStep("details")
          }}
        />
      )}

      {step === "details" && (
        <StepDetails
          phone={phone}
          billType={billType}
          onBack={() => setStep("phone")}
          onNext={({ name, billType }) => {
            setName(name)
            setBillType(billType)
            setItems([])
            setCgstPct(0)
            setSgstPct(0)
            setSubtotal(0)
            setTaxAmount(0)
            setTotal(0)
            setStep("silver")
          }}
        />
      )}

      {step === "silver" && (
        <StepItemsSilver
          onBack={() => setStep("details")}
          billType={billType}
          onNext={({ items, cgstPct, sgstPct, subtotal, taxAmount, total }) => {
            setItems(items)
            setCgstPct(cgstPct)
            setSgstPct(sgstPct)
            setSubtotal(subtotal)
            setTaxAmount(taxAmount)
            setTotal(total)
            setStep("review")
          }}
        />
      )}

      {step === "gold" && (
        <StepItemsGold
          onBack={() => setStep("details")}
          billType={billType}
          onNext={({ items, cgstPct, sgstPct, subtotal, taxAmount, total }) => {
            setItems(items)
            setCgstPct(cgstPct)
            setSgstPct(sgstPct)
            setSubtotal(subtotal)
            setTaxAmount(taxAmount)
            setTotal(total)
            setStep("review")
          }}
        />
      )}

      {step === "review" && (
        <StepReview
          phone={phone}
          name={name}
          type={type}
          billType={billType}
          items={items}
          cgstPct={cgstPct}
          sgstPct={sgstPct}
          subtotal={subtotal}
          taxAmount={taxAmount}
          total={total}
          saving={saving}
          paymentMethod={paymentMethod}
          onPaymentMethodChange={setPaymentMethod}
          onBack={() => setStep(type === "silver" ? "silver" : "gold")}
          onSaveAndPrint={handleSaveAndPrint}
        />
      )}

      {/* Footer actions */}
      <div className="mt-6 flex items-center justify-between">
        <button
          type="button"
          onClick={resetForm}
          className="inline-flex items-center justify-center rounded-md border border-input bg-background px-3 py-2 text-xs hover:bg-muted"
        >
          Reset
        </button>
        <span className="text-xs text-muted-foreground">Print hides the form and shows a clean receipt.</span>
      </div>
    </div>
  )
}
