import { useBilling } from "../context/BillingContext";

export default function SidebarWidget() {
  const { data, setData, addItem, removeItem, updateItem } = useBilling();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setData((prev) => ({ ...prev, [name]: value }));
  };

  const addNewItem = () => {
    addItem({ description: "Gold Ring", quantity: 1, pricePerUnit: 15000, gstPercent: 3, weightGram: 5 });
  };

  return (
    <div className="mx-auto my-10 border-t border-gray-300 pt-10 w-full max-w-60 dark:border-white/10 dark:bg-transparent">
      <div className="bg-gradient-to-r from-themeGradientColorFrom to-themeGradientColorTo text-white px-4 py-2 rounded-t-xl dark:bg-gradient-to-r dark:bg-indigo-700">
        <span className="text-sm font-semibold tracking-wide">Billing</span>
      </div>

      <div className="min-h-56 px-3 py-3 rounded-b-xl bg-themeBackgroundColor dark:bg-gray-500/40 dark:backdrop-blur-md dark:ring-1 dark:ring-white/10 dark:text-white space-y-3">
        <input name="buyerName" value={data.buyerName} onChange={handleChange} placeholder="Buyer name" className="w-full px-3 py-2 rounded bg-white/80 dark:bg-white/10 outline-none" />
        <input name="buyerPhone" value={data.buyerPhone} onChange={handleChange} placeholder="Phone" className="w-full px-3 py-2 rounded bg-white/80 dark:bg-white/10 outline-none" />
        <textarea name="buyerAddress" value={data.buyerAddress} onChange={handleChange} placeholder="Address" className="w-full px-3 py-2 rounded bg-white/80 dark:bg-white/10 outline-none" />

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm font-semibold">Items</span>
            <button onClick={addNewItem} className="text-xs px-2 py-1 rounded bg-indigo-600 text-white">Add</button>
          </div>
          <div className="space-y-2 max-h-48 overflow-auto pr-1">
            {data.items.map((it) => (
              <div key={it.id} className="p-2 rounded bg-white/80 dark:bg-white/10">
                <input
                  value={it.description}
                  onChange={(e) => updateItem(it.id, { description: e.target.value })}
                  className="w-full mb-2 px-2 py-1 rounded bg-white dark:bg-white/10 outline-none"
                />
                <div className="grid grid-cols-4 gap-2">
                  {/* <input type="number" value={it.quantity} onChange={(e) => updateItem(it.id, { quantity: Number(e.target.value) })} className="px-2 py-1 rounded bg-white dark:bg-white/10 outline-none" placeholder="Qty" /> */}
                  <input type="number" value={it.pricePerUnit} onChange={(e) => updateItem(it.id, { pricePerUnit: Number(e.target.value) })} className="px-2 py-1 rounded bg-white dark:bg-white/10 outline-none" placeholder="Price" />
                  <input type="number" value={it.gstPercent} onChange={(e) => updateItem(it.id, { gstPercent: Number(e.target.value) })} className="px-2 py-1 rounded bg-white dark:bg-white/10 outline-none" placeholder="GST%" />
                  <button onClick={() => removeItem(it.id)} className="px-2 py-1 rounded bg-red-500 text-white">Remove</button>
                </div>
              </div>
            ))}
          </div>
        </div>

        <textarea name="notes" value={data.notes} onChange={handleChange} placeholder="Notes" className="w-full px-3 py-2 rounded bg-white/80 dark:bg-white/10 outline-none" />
      </div>
    </div>
  );
}
