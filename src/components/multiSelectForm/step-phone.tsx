"use client"

import { useState } from "react"

interface StepPhoneProps {
  initialPhone?: string
  onNext: (phone: string) => void
}

export default function StepPhone({ initialPhone = "", onNext }: StepPhoneProps) {
  const [phone, setPhone] = useState(initialPhone)
  const [touched, setTouched] = useState(false)

  const phoneValid = /^\d{10}$/.test(phone.trim())

  return (
    <div className="flex flex-col gap-4">
      <div>
        <h2 className="text-xl font-semibold">Customer Phone</h2>
        <p className="text-sm text-muted-foreground">Enter the customer&apos;s 10-digit phone number to continue.</p>
      </div>

      <div className="rounded-lg border border-border bg-card p-4">
        <label htmlFor="phone" className="block text-sm font-medium">
          Phone Number
        </label>
        <input
          id="phone"
          type="tel"
          inputMode="numeric"
          pattern="\d{10}"
          placeholder="e.g. 9876543210"
          className="mt-2 w-full rounded-md border border-input bg-background px-3 py-2 outline-none ring-0 focus:border-primary focus:outline-none"
          value={phone}
          onChange={(e) => setPhone(e.target.value.replace(/[^\d]/g, "").slice(0, 10))}
          onBlur={() => setTouched(true)}
          aria-invalid={touched && !phoneValid}
          aria-describedby="phone-help"
        />
        <p id="phone-help" className="mt-1 text-xs text-muted-foreground">
          Must be exactly 10 digits.
        </p>
        {touched && !phoneValid && (
          <p className="mt-1 text-sm text-destructive">Please enter a valid 10-digit phone number.</p>
        )}
      </div>

      <div className="flex items-center justify-end gap-2">
        <button
          type="button"
          className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow-sm hover:opacity-90 disabled:opacity-50"
          onClick={() => onNext(phone.trim())}
          disabled={!phoneValid}
        >
          Next
        </button>
      </div>
    </div>
  )
}
