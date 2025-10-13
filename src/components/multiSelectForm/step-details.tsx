"use client"

import { useEffect, useState } from "react"
import type { BillType } from "../../types/types"
import { findCustomerByPhone } from "../../store/storage"
import CustomDropdown from "../ui/dropdown/CustomDropdown"

interface StepDetailsProps {
  phone: string
  onBack: () => void
  billType: BillType
  onNext: (data: { name: string; billType: BillType; customerExists: boolean }) => void
}

export default function StepDetails({ phone, onBack, billType: initialBillType, onNext }: StepDetailsProps) {
  const [loading, setLoading] = useState(true)
  const [customerExists, setCustomerExists] = useState(false)
  const [name, setName] = useState("")
  const [billType, setBillType] = useState<BillType>(initialBillType)

  useEffect(() => {
    let mounted = true
    ;(async () => {
      setLoading(true)
      const result = await findCustomerByPhone(phone)
      if (!mounted) return
      if (result.exists && result.customer) {
        setCustomerExists(true)
        setName(result.customer.name)
      } else {
        setCustomerExists(false)
        setName("")
      }
      setLoading(false)
    })()
    return () => {
      mounted = false
    }
  }, [phone])

  const canProceed = !loading && name.trim().length > 1

  return (
    <div className="flex flex-col gap-4">
      <div>
        <h2 className="text-xl font-semibold">Customer Details</h2>
        <p className="text-sm text-muted-foreground">
          {loading ? "Loading customer..." : customerExists ? "Existing customer found." : "New customer."}
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="rounded-lg border border-border bg-card p-4">
          <label htmlFor="name" className="block text-sm font-medium">
            Customer Name
          </label>
          <input
            id="name"
            type="text"
            placeholder="Enter full name"
            className="mt-2 w-full rounded-md border border-input bg-background px-3 py-2 outline-none ring-0 focus:border-primary"
            value={name}
            onChange={(e) => setName(e.target.value)}
            disabled={loading}
          />
          {customerExists && <p className="mt-1 text-xs text-muted-foreground">Auto-filled from existing records.</p>}
        </div>

        <div className="rounded-lg border border-border bg-card p-4">
          <label className="block text-sm font-medium">Bill Type</label>
          <div className="mt-2">
            <CustomDropdown
              options={[
                { value: "white", label: "White Bill (With GST)" },
                { value: "green", label: "Green Bill (No GST)" },
              ]}
              value={billType}
              onChange={(v) => setBillType(v as BillType)}
              placeholder="Select bill type"
              className="w-full"
            />
          </div>
          <p className="mt-1 text-xs text-muted-foreground">White bills include GST. Green bills are total-only.</p>
        </div>
      </div>

      <div className="mt-2 flex items-center justify-between">
        <button
          type="button"
          onClick={onBack}
          className="inline-flex items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium hover:bg-muted"
        >
          Back
        </button>
        <button
          type="button"
          onClick={() => onNext({ name: name.trim(), billType, customerExists })}
          className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow-sm hover:opacity-90 disabled:opacity-50"
          disabled={!canProceed}
        >
          Next
        </button>
      </div>
    </div>
  )
}
