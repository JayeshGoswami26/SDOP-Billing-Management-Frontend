"use client"
import type { BillItem, BillType, JewelryType } from "../../types/types"
import CustomDropdown from "../ui/dropdown/CustomDropdown"

interface ItemsEditorProps {
  title: string
  items: BillItem[]
  onItemsChange: (items: BillItem[]) => void
  cgstPct: number
  sgstPct: number
  onCgstChange: (v: number) => void
  onSgstChange: (v: number) => void
  subtotal: number
  taxAmount: number
  total: number
  billType: BillType
}

export function ItemsEditor({
  title,
  items,
  onItemsChange,
  cgstPct,
  sgstPct,
  onCgstChange,
  onSgstChange,
  subtotal,
  taxAmount,
  total,
  billType,
}: ItemsEditorProps) {
  const updateItem = (index: number, patch: Partial<BillItem>) => {
    const next = items.map((it, i) => (i === index ? { ...it, ...patch } : it))
    onItemsChange(next)
  }

  const addRow = () => onItemsChange([...items, { name: "", price: 0, type: "silver" }])
  const removeRow = (index: number) => onItemsChange(items.filter((_, i) => i !== index))

  return (
    <div className="flex flex-col gap-4">
      <div>
        <h3 className="text-lg font-semibold">{title}</h3>
        <p className="text-sm text-muted-foreground">Add one or more products to the bill.</p>
      </div>

      <div className="overflow-x-auto rounded-lg border border-border">
        <table className="w-full min-w-[560px] border-collapse">
          <thead className="bg-muted/50 text-left text-sm">
            <tr>
              <th className="px-3 py-2 font-medium">#</th>
              <th className="px-3 py-2 font-medium">Product Name</th>
              <th className="px-3 py-2 font-medium">Type</th>
              <th className="px-3 py-2 font-medium">Price</th>
              <th className="px-3 py-2 font-medium"></th>
            </tr>
          </thead>
          <tbody>
            {items.map((item, idx) => (
              <tr key={idx} className="border-t border-border">
                <td className="px-3 py-2 text-sm">{idx + 1}</td>
                <td className="px-3 py-2">
                  <input
                    type="text"
                    placeholder="e.g. Necklace"
                    className="w-full rounded-md border border-input bg-background px-3 py-2 outline-none ring-0 focus:border-primary"
                    value={item.name}
                    onChange={(e) => updateItem(idx, { name: e.target.value })}
                  />
                </td>
                <td className="px-3 py-2 min-w-[140px]">
                  <CustomDropdown
                    options={[
                      { value: "silver", label: "Silver" },
                      { value: "gold", label: "Gold" },
                    ]}
                    value={(item.type as JewelryType) || "silver"}
                    onChange={(v) => updateItem(idx, { type: (v as JewelryType) })}
                    placeholder="Select type"
                    className="w-full"
                  />
                </td>
                <td className="px-3 py-2">
                  <input
                    type="number"
                    min={0}
                    step="0.01"
                    placeholder="0.00"
                    className="w-full rounded-md border border-input bg-background px-3 py-2 outline-none ring-0 focus:border-primary"
                    value={Number.isNaN(item.price) ? "" : item.price}
                    onChange={(e) => updateItem(idx, { price: Number(e.target.value) || 0 })}
                  />
                </td>
                <td className="px-3 py-2">
                  <button
                    type="button"
                    onClick={() => removeRow(idx)}
                    className="inline-flex items-center justify-center rounded-md border border-input bg-background px-3 py-2 text-sm hover:bg-muted"
                  >
                    Remove
                  </button>
                </td>
              </tr>
            ))}
            {items.length === 0 && (
              <tr className="border-t border-border">
                <td colSpan={4} className="px-3 py-8 text-center text-sm text-muted-foreground">
                  No products yet. Use the button below to add your first item.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="flex items-center justify-between">
        <button
          type="button"
          onClick={addRow}
          className="inline-flex items-center justify-center rounded-md bg-secondary px-4 py-2 text-sm font-medium text-secondary-foreground hover:opacity-90"
        >
          + Add Item
        </button>

        {billType === "white" ? (
          <div className="grid w-full max-w-md grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium">CGST %</label>
              <input
                type="number"
                min={0}
                step="0.01"
                className="mt-2 w-full rounded-md border border-input bg-background px-3 py-2 outline-none ring-0 focus:border-primary"
                value={Number.isNaN(cgstPct) ? "" : cgstPct}
                onChange={(e) => onCgstChange(Number(e.target.value) || 0)}
              />
            </div>
            <div>
              <label className="block text-sm font-medium">SGST %</label>
              <input
                type="number"
                min={0}
                step="0.01"
                className="mt-2 w-full rounded-md border border-input bg-background px-3 py-2 outline-none ring-0 focus:border-primary"
                value={Number.isNaN(sgstPct) ? "" : sgstPct}
                onChange={(e) => onSgstChange(Number(e.target.value) || 0)}
              />
            </div>
          </div>
        ) : (
          <div className="text-sm text-muted-foreground">Green bill selected: taxes not applicable</div>
        )}
      </div>

      <div className="grid gap-2 rounded-lg border border-border bg-card p-4 md:grid-cols-3">
        <Stat label="Subtotal" value={subtotal} />
        <Stat label="Tax" value={taxAmount} />
        <Stat label="Total" value={total} emphasize />
      </div>
    </div>
  )
}

function Stat({ label, value, emphasize = false }: { label: string; value: number; emphasize?: boolean }) {
  return (
    <div className="flex items-center justify-between rounded-md bg-muted/40 px-3 py-2">
      <span className="text-sm text-muted-foreground">{label}</span>
      <span className={`font-semibold ${emphasize ? "text-primary" : ""}`}>{formatINR(value)}</span>
    </div>
  )
}

export function formatINR(amount: number) {
  if (!Number.isFinite(amount)) return "₹0.00"
  return new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR" }).format(amount)
}
