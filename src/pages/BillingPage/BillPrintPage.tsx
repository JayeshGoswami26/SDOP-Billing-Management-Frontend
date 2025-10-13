// import React from 'react'

// function BillPrintPage() {
//   return (
//     <>
//      <div className="mx-auto max-w-4xl print:max-w-full p-6">
//         {/* Shell */}
//         <div className="rounded-2xl bg-white shadow-xl ring-1 ring-gray-200 print:shadow-none print:ring-0 overflow-hidden">
//           {/* Accent bar */}
//           <div className="h-1 w-full bg-sky-600" />

//           {/* Header */}
//           <div className="p-6 md:p-8">
//             <div className="flex flex-col gap-6 md:flex-row md:items-start md:justify-between">
//               {/* Logo */}
//               <div className="flex items-center gap-4">
//                 <div className="flex size-16 items-center justify-center rounded-full border-2 border-sky-600 text-sky-700 font-semibold">
//                   Logo
//                 </div>
//                 <div className="hidden md:block h-16 w-px bg-gray-200" />
//               </div>

//               {/* Store info */}
//               <div className="flex-1 text-center md:text-left">
//                 <h1 className="text-2xl font-semibold tracking-tight text-gray-900">SDOP Jasmatia Jewellers</h1>
//                 <p className="text-sm text-gray-600">Jasmatia Bhawan, Olympic Road, JDP</p>
//               </div>

//               {/* Meta: Date / S. No */}
//               <div className="grid grid-cols-1 gap-3 w-full md:w-60">
//                 <label className="text-xs font-medium text-gray-600">Date</label>
//                 <div className="h-10 rounded-md border border-gray-200 bg-slate-50 px-3 text-sm text-gray-800 flex items-center justify-between">
//                   <span className="text-gray-500">dd/mm/yyyy</span>
//                 </div>

//                 <label className="mt-2 text-xs font-medium text-gray-600">S. No</label>
//                 <div className="h-10 rounded-md border border-gray-200 bg-slate-50 px-3 text-sm text-gray-800 flex items-center justify-between">
//                   <span className="text-gray-500">0001</span>
//                 </div>
//               </div>
//             </div>

//             {/* Customer info */}
//             <div className="mt-8 grid grid-cols-1 gap-4 md:grid-cols-2">
//               <div className="space-y-1">
//                 <div className="text-xs font-medium text-gray-600">Name</div>
//                 <div className="h-10 rounded-md border border-gray-200 bg-white px-3 text-sm text-gray-900 flex items-center">
//                   <span className="text-gray-500">Enter customer name</span>
//                 </div>
//               </div>
//               <div className="space-y-1">
//                 <div className="text-xs font-medium text-gray-600">Number</div>
//                 <div className="h-10 rounded-md border border-gray-200 bg-white px-3 text-sm text-gray-900 flex items-center">
//                   <span className="text-gray-500">+91-0000000000</span>
//                 </div>
//               </div>
//             </div>
//           </div>

//           {/* Items table */}
//           <div className="px-6 md:px-8 pb-6">
//             <div className="overflow-hidden rounded-xl border border-gray-200">
//               <table className="w-full text-sm">
//                 <thead className="bg-slate-50 text-gray-600">
//                   <tr className="divide-x divide-gray-200">
//                     <th className="w-14 px-3 py-3 text-center uppercase tracking-wide text-xs font-medium">S.No</th>
//                     <th className="px-3 py-3 text-left uppercase tracking-wide text-xs font-medium">
//                       Product / Particulars
//                     </th>
//                     <th className="w-28 px-3 py-3 text-center uppercase tracking-wide text-xs font-medium">Weight</th>
//                     <th className="w-28 px-3 py-3 text-center uppercase tracking-wide text-xs font-medium">Rate</th>
//                     <th className="w-32 px-3 py-3 text-right uppercase tracking-wide text-xs font-medium">Amount</th>
//                   </tr>
//                 </thead>
//                 <tbody className="divide-y divide-gray-100">
//                   {Array.from({ length: 2 }).map((_, i) => (
//                     <tr key={i} className="divide-x divide-gray-100">
//                       <td className="px-3 py-3 text-center text-gray-700">{i + 1}</td>
//                       <td className="px-3 py-3">
//                         <div className="h-10 rounded-md border border-transparent bg-white px-3 text-sm text-gray-900 flex items-center hover:border-gray-200 focus-within:border-sky-500 focus-within:ring-2 focus-within:ring-sky-200">
//                           <span className="text-gray-500">Describe product</span>
//                         </div>
//                       </td>
//                       <td className="px-3 py-3">
//                         <div className="h-10 rounded-md border border-transparent bg-white px-3 text-sm text-gray-900 flex items-center justify-center hover:border-gray-200 focus-within:border-sky-500 focus-within:ring-2 focus-within:ring-sky-200">
//                           <span className="text-gray-500">0.00 g</span>
//                         </div>
//                       </td>
//                       <td className="px-3 py-3">
//                         <div className="h-10 rounded-md border border-transparent bg-white px-3 text-sm text-gray-900 flex items-center justify-center hover:border-gray-200 focus-within:border-sky-500 focus-within:ring-2 focus-within:ring-sky-200">
//                           <span className="text-gray-500">0.00</span>
//                         </div>
//                       </td>
//                       <td className="px-3 py-3">
//                         <div className="h-10 rounded-md border border-transparent bg-white px-3 text-sm text-gray-900 flex items-center justify-end hover:border-gray-200 focus-within:border-sky-500 focus-within:ring-2 focus-within:ring-sky-200">
//                           <span className="text-gray-500">0.00</span>
//                         </div>
//                       </td>
//                     </tr>
//                   ))}
//                 </tbody>
//                 <tfoot className="bg-white">
//                   <tr className="divide-x divide-gray-200">
//                     {/* Left: Rs in word + Cash/Credit */}
//                     <td className="px-3 py-4" colSpan={3}>
//                       <div className="space-y-4">
//                         <div>
//                           <div className="text-xs font-medium text-gray-600">Rs in word</div>
//                           <div className="mt-1 h-10 rounded-md border border-gray-200 bg-white px-3 text-sm text-gray-900 flex items-center">
//                             <span className="text-gray-500">Rupees zero only</span>
//                           </div>
//                         </div>

//                         <div>
//                           <div className="text-xs font-medium text-gray-600">Payment</div>
//                           <div className="mt-2 flex items-center gap-4">
//                             <label className="inline-flex items-center gap-2">
//                               <span className="size-4 rounded-sm border border-gray-300 bg-white" />
//                               <span className="text-sm text-gray-700">Cash</span>
//                             </label>
//                             <label className="inline-flex items-center gap-2">
//                               <span className="size-4 rounded-sm border border-gray-300 bg-white" />
//                               <span className="text-sm text-gray-700">Credit</span>
//                             </label>
//                           </div>
//                         </div>
//                       </div>
//                     </td>

//                     {/* Right: Totals */}
//                     <td className="px-3 py-4" colSpan={2}>
//                       <div className="rounded-lg border border-gray-200 bg-slate-50 p-4">
//                         <div className="flex items-center justify-between py-1">
//                           <span className="text-sm text-gray-700">Total</span>
//                           <div className="h-9 w-40 rounded-md border border-gray-200 bg-white px-3 text-right text-sm text-gray-900 flex items-center justify-end">
//                             <span className="text-gray-500">0.00</span>
//                           </div>
//                         </div>
//                         <div className="flex items-center justify-between py-1">
//                           <span className="text-sm text-gray-700">CGST</span>
//                           <div className="h-9 w-40 rounded-md border border-gray-200 bg-white px-3 text-right text-sm text-gray-900 flex items-center justify-end">
//                             <span className="text-gray-500">0.00</span>
//                           </div>
//                         </div>
//                         <div className="flex items-center justify-between py-1">
//                           <span className="text-sm text-gray-700">SGST</span>
//                           <div className="h-9 w-40 rounded-md border border-gray-200 bg-white px-3 text-right text-sm text-gray-900 flex items-center justify-end">
//                             <span className="text-gray-500">0.00</span>
//                           </div>
//                         </div>

//                         <div className="mt-3 border-t border-gray-200 pt-3">
//                           <div className="flex items-center justify-between">
//                             <span className="text-base font-semibold text-gray-900">G. Total</span>
//                             <div className="h-10 w-48 rounded-md border-2 border-sky-600 bg-white px-3 text-right text-base text-gray-900 flex items-center justify-end">
//                               <span className="text-gray-900">0.00</span>
//                             </div>
//                           </div>
//                         </div>
//                       </div>
//                     </td>
//                   </tr>
//                 </tfoot>
//               </table>
//             </div>

//             {/* Footer note (optional) */}
//             <div className="mt-6 flex items-center justify-between text-xs text-gray-500">
//               <span>Thank you for your business!</span>
//               <span>www.example.com</span>
//             </div>
//           </div>
//         </div>
//       </div>
//     </>
//   )
// }

// export default BillPrintPage


import React, { useEffect, useRef } from 'react'

interface BillData {
  customerId: string
  customerName: string
  customerPhone: string
  billType: 'green' | 'white'
  products: Array<{
    productName: string
    productType: 'silver' | 'gold'
    rate: number
    price: number
    quantity: number
    weight: string
    amount: number
  }>
  cgstRate: number
  sgstRate: number
  paymentMethod: 'cash' | 'card' | 'upi' | 'bank_transfer'
}

interface Totals {
  subtotal: number
  cgstAmount: number
  sgstAmount: number
  totalAmount: number
}

interface BillPrintPageProps {
  billData ?: BillData
  totals ?: Totals
  billNumber ?: string
}

function BillPrintPage({ billData, totals, billNumber }: BillPrintPageProps) {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 2
    }).format(amount)
  }

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-IN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    })
  }

  const numberToWords = (num: number): string => {
    const ones = ['', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine']
    const tens = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety']
    const teens = ['Ten', 'Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen', 'Seventeen', 'Eighteen', 'Nineteen']
    
    if (num === 0) return 'Zero'
    
    const convertHundreds = (n: number): string => {
      let result = ''
      
      if (n > 99) {
        result += ones[Math.floor(n / 100)] + ' Hundred '
        n %= 100
      }
      
      if (n > 19) {
        result += tens[Math.floor(n / 10)] + ' '
        n %= 10
      } else if (n > 9) {
        result += teens[n - 10] + ' '
        return result.trim()
      }
      
      if (n > 0) {
        result += ones[n] + ' '
      }
      
      return result.trim()
    }
    
    let result = ''
    const crore = Math.floor(num / 10000000)
    const lakh = Math.floor((num % 10000000) / 100000)
    const thousand = Math.floor((num % 100000) / 1000)
    const hundred = num % 1000
    
    if (crore > 0) result += convertHundreds(crore) + ' Crore '
    if (lakh > 0) result += convertHundreds(lakh) + ' Lakh '
    if (thousand > 0) result += convertHundreds(thousand) + ' Thousand '
    if (hundred > 0) result += convertHundreds(hundred) + ' '
    
    return result.trim() + ' Rupees Only'
  }

  const previousTitleRef = useRef<string>(document.title)

  useEffect(() => {
    const prev = previousTitleRef.current
    const safe = (s: string) =>
      s
        .toLowerCase()
        .replace(/[^a-z0-9\s-_]/gi, "")
        .trim()
        .replace(/\s+/g, "-")

    const now = new Date()
    const yyyy = now.getFullYear()
    const mm = String(now.getMonth() + 1).padStart(2, '0')
    const dd = String(now.getDate()).padStart(2, '0')
    const hh = String(now.getHours()).padStart(2, '0')
    const min = String(now.getMinutes()).padStart(2, '0')
    const ss = String(now.getSeconds()).padStart(2, '0')
    const timestamp = `${yyyy}${mm}${dd}_${hh}${min}${ss}`

    const namePart = safe(billData?.customerName || 'customer')
    const billPart = safe(billNumber || 'bill')
    const title = `bill-${billPart}-${namePart}-${timestamp}`

    document.title = title
    return () => {
      document.title = prev
    }
  // run once on mount for consistent filename during this print session
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <>
    <div className="container mx-auto max-w-4xl bg-white text-gray-900 p-6 border border-gray-900 shadow-sm print:shadow-none print:border-0">
      {/* Header */}
      <header className="flex items-start gap-4">
        {/* Logo placeholder */}
        {/* <div className="flex items-center justify-center w-16 h-16 border border-gray-900 rounded-full text-[10px] uppercase tracking-wide">
          Logo
        </div> */}

        <img className='w-[100px] h-[100px]' src="../../../public/images/logo/Logo5.png" alt="logo" />

        {/* Store info */}
        <div className="flex-1">
          <h1 className="text-center text-xl font-semibold leading-tight">SDOP Jasmatiya Jewellers</h1>
          <p className="text-center text-sm">Jasmatiya Bhawan, Olympic Road, Jodhpur</p>
          <p className="text-center text-sm">9413124501, 9829029784, 7300089784</p>
        </div>

        {/* Date / Bill Number */}
        <div className="w-48 text-sm">
          <div className="flex items-baseline gap-2">
            <span className="whitespace-nowrap">Date:</span>
            <span className="font-medium">{formatDate(new Date())}</span>
          </div>
          <div className="flex items-baseline gap-2 mt-2">
            <span className="whitespace-nowrap">Bill No:</span>
            <span className="font-medium">{billNumber}</span>
          </div>
        </div>
      </header>

      {/* Name / Number */}
      <section className="mt-4">
        <div className="grid grid-cols-2 gap-6">
          <div className="flex items-baseline gap-2">
            <span className="font-medium">Name:</span>
            <span className="font-medium">{billData?.customerName}</span>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="font-medium">Number:</span>
            <span className="font-medium">{billData?.customerPhone}</span>
          </div>
        </div>
      </section>

      {/* Items Table */}
      <section className="mt-4">
        <table className="w-full border border-gray-900 border-collapse text-sm">
          <thead className="bg-gray-100">
            <tr>
              <th className="border border-gray-900 p-2 text-center w-14">Sno</th>
              <th className="border border-gray-900 p-2 text-left">Particulars</th>
              <th className="border border-gray-900 p-2 text-center w-28">Weight</th>
              <th className="border border-gray-900 p-2 text-center w-28">Type</th>
              <th className="border border-gray-900 p-2 text-center w-28">Rate</th>
              <th className="border border-gray-900 p-2 text-center w-32">Amount</th>
            </tr>
          </thead>
          <tbody>
            {billData?.products.map((product, i) => (
              <tr key={i} className="h-10 align-top">
                <td className="border border-gray-900 p-2 text-center">{i + 1}</td>
                <td className="border border-gray-900 p-2">{product.productName}</td>
                <td className="border border-gray-900 p-2 text-center">{product.weight || "0.0grm"}</td>
                <td className="border border-gray-900 p-2 text-center">{product.productType}</td>
                <td className="border border-gray-900 p-2 text-center">{formatCurrency(product.rate)}</td>
                <td className="border border-gray-900 p-2 text-right">{formatCurrency(product.amount)}</td>
              </tr>
            ))}
          </tbody>

          {/* Footer / Totals */}
          <tfoot>
            <tr>
              {/* Rs in words + Cash/Credit (left, spans 3 columns) */}
              <td className="border border-gray-900 p-3 align-top" colSpan={3}>
                <div className="space-y-4">
                  <div className="flex items-baseline gap-3">
                    <span className="font-medium whitespace-nowrap">Rs in words:</span>
                    <span className="font-medium text-xs">{numberToWords(totals?.totalAmount || 0)}</span>
                  </div>
                  <div className="flex items-baseline gap-3">
                    <span className="font-medium whitespace-nowrap">Payment:</span>
                    <span className="font-medium capitalize">{billData?.paymentMethod}</span>
                  </div>
                </div>
              </td>

              {/* Totals panel (right, spans 2 columns) */}
              <td className="border border-gray-900 p-3 align-top" colSpan={2}>
                <div className="space-y-2">
                  {billData?.billType === 'white' && (
                    <>
                      <div className="flex items-center justify-between gap-4">
                        <span>Subtotal</span>
                        <span>{formatCurrency(totals?.subtotal || 0)}</span>
                      </div>
                      <div className="flex items-center justify-between gap-4">
                        <span>CGST ({billData.cgstRate}%)</span>
                        <span>{formatCurrency(totals?.cgstAmount || 0)}</span>
                      </div>
                      <div className="flex items-center justify-between gap-4">
                        <span>SGST ({billData.sgstRate}%)</span>
                        <span>{formatCurrency(totals?.sgstAmount || 0)}</span>
                      </div>
                    </>
                  )}

                  <div className="mt-2 pt-2 border-t border-gray-900 flex items-center justify-between gap-4">
                    <span className="font-semibold">G. Total</span>
                    <span className="font-semibold">{formatCurrency(totals?.totalAmount || 0)}</span>
                  </div>
                </div>
              </td>
            </tr>
          </tfoot>
        </table>
      </section>
    </div>
  </>
  )
}

export default BillPrintPage