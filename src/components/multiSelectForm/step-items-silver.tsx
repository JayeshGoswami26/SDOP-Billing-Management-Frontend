"use client"

import { useMemo, useState } from "react"
import type { BillItem, BillType } from "../../types/types"
import { ItemsEditor } from "./items-editor-shared"

interface StepItemsSilverProps {
  onBack: () => void
  onNext: (data: {
    items: BillItem[]
    cgstPct: number
    sgstPct: number
    subtotal: number
    taxAmount: number
    total: number
  }) => void
  billType: BillType
}

export default function StepItemsSilver({ onBack, onNext, billType }: StepItemsSilverProps) {
  const [items, setItems] = useState<BillItem[]>([])
  // Default GST can be set differently later for silver
  const [cgstPct, setCgstPct] = useState<number>(1.5)
  const [sgstPct, setSgstPct] = useState<number>(1.5)

  const subtotal = useMemo(() => items.reduce((acc, it) => acc + (Number(it.price) || 0), 0), [items])
  const taxAmount = useMemo(() => (billType === "white" ? subtotal * ((cgstPct + sgstPct) / 100) : 0), [subtotal, cgstPct, sgstPct, billType])
  const total = useMemo(() => subtotal + taxAmount, [subtotal, taxAmount])

  const canProceed = items.length > 0 && subtotal > 0

  return (
    <div className="flex flex-col gap-6">
      <ItemsEditor
        title="Silver Products"
        items={items}
        onItemsChange={setItems}
        cgstPct={cgstPct}
        sgstPct={sgstPct}
        onCgstChange={setCgstPct}
        onSgstChange={setSgstPct}
        subtotal={subtotal}
        taxAmount={taxAmount}
        total={total}
        billType={billType}
      />

      <div className="flex items-center justify-between">
        <button
          type="button"
          onClick={onBack}
          className="inline-flex items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium hover:bg-muted"
        >
          Back
        </button>
        <button
          type="button"
          onClick={() => onNext({ items, cgstPct, sgstPct, subtotal, taxAmount, total })}
          className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow-sm hover:opacity-90 disabled:opacity-50"
          disabled={!canProceed}
        >
          Next
        </button>
      </div>
    </div>
  )
}
