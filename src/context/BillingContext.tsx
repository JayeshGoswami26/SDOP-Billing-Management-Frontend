import { createContext, useContext, useMemo, useState } from "react";

export type BillingItem = {
  id: string;
  description: string;
  weightGram?: number;
  quantity: number;
  pricePerUnit: number;
  gstPercent: number;
};

export type BillingData = {
  buyerName: string;
  buyerPhone: string;
  buyerAddress: string;
  items: BillingItem[];
  invoiceNumber: string;
  invoiceDate: string;
  notes: string;
};

type BillingContextType = {
  data: BillingData;
  setData: (updater: (prev: BillingData) => BillingData) => void;
  addItem: (item: Omit<BillingItem, "id">) => void;
  removeItem: (id: string) => void;
  updateItem: (id: string, partial: Partial<BillingItem>) => void;
  clear: () => void;
};

const BillingContext = createContext<BillingContextType | undefined>(undefined);

function generateInvoiceNumber() {
  const d = new Date();
  const y = String(d.getFullYear()).slice(-2);
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  const r = Math.floor(Math.random() * 900) + 100;
  return `INV-${y}${m}${day}-${r}`;
}

const initialData: BillingData = {
  buyerName: "",
  buyerPhone: "",
  buyerAddress: "",
  items: [
    {
      id: crypto.randomUUID(),
      description: "22K Gold Necklace",
      weightGram: 18,
      quantity: 1,
      pricePerUnit: 75000,
      gstPercent: 3,
    },
  ],
  invoiceNumber: generateInvoiceNumber(),
  invoiceDate: new Date().toISOString(),
  notes: "",
};

export function BillingProvider({ children }: { children: React.ReactNode }) {
  const [data, setDataState] = useState<BillingData>(initialData);

  const setData = (updater: (prev: BillingData) => BillingData) => {
    setDataState((prev) => updater(prev));
  };

  const addItem = (item: Omit<BillingItem, "id">) => {
    setDataState((prev) => ({
      ...prev,
      items: [...prev.items, { ...item, id: crypto.randomUUID() }],
    }));
  };

  const removeItem = (id: string) => {
    setDataState((prev) => ({
      ...prev,
      items: prev.items.filter((it) => it.id !== id),
    }));
  };

  const updateItem = (id: string, partial: Partial<BillingItem>) => {
    setDataState((prev) => ({
      ...prev,
      items: prev.items.map((it) => (it.id === id ? { ...it, ...partial } : it)),
    }));
  };

  const clear = () => {
    setDataState({
      buyerName: "",
      buyerPhone: "",
      buyerAddress: "",
      items: [],
      invoiceNumber: generateInvoiceNumber(),
      invoiceDate: new Date().toISOString(),
      notes: "",
    });
  };

  const value = useMemo(
    () => ({ data, setData, addItem, removeItem, updateItem, clear }),
    [data]
  );

  return <BillingContext.Provider value={value}>{children}</BillingContext.Provider>;
}

export function useBilling() {
  const ctx = useContext(BillingContext);
  if (!ctx) throw new Error("useBilling must be used within BillingProvider");
  return ctx;
}


