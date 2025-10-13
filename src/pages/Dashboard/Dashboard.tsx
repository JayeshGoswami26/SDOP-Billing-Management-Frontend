"use client"

import { useMemo } from "react"
import { useNavigate } from "react-router-dom"
import { useDispatch } from "react-redux"
import { useApi } from "../../hooks/useApi"
import { clearUser } from "../../store/authSlice"
import { clearAuth } from "../../utils/auth"

type Bill = {
  _id: string
  billNumber: string
  createdAt: string
  customer: {
    _id: string
    name: string
    phoneNumber: string
  }
  jewelryType: 'gold' | 'silver'
  billType: 'green' | 'white'
  products: Array<{
    _id: string
    productName: string
    price: number
    quantity: number
    weight: string
    subtotal: number
  }>
  subtotal: number
  cgstRate: number
  sgstRate: number
  cgstAmount: number
  sgstAmount: number
  totalGstAmount: number
  totalAmount: number
  paymentStatus: "paid" | "pending" | "partial"
  paymentMethod: 'cash' | 'card' | 'upi' | 'bank_transfer'
  isActive: boolean
  updatedAt: string
  __v: number
}

type DashboardData = {
  success: boolean
  message: string
  data: {
    bills: Bill[]
    pagination: {
      currentPage: number
      totalPages: number
      totalBills: number
      hasNext: boolean
      hasPrev: boolean
    }
  }
}

export default function Dashboard() {
  const navigate = useNavigate()
  const dispatch = useDispatch()

  const handleLogout = () => {
    dispatch(clearUser())
    clearAuth()
    navigate("/login")
  }

  const { data: billsData, loading, error, refetch } = useApi<DashboardData>("bills", "GET", {
    params: { page: 1, limit: 10 }
  })

  
  const recentBills: Bill[] = useMemo(() => billsData?.data?.bills || [], [billsData])

  const kpis = useMemo(() => {
    const totalSales = recentBills.reduce((sum, bill) => sum + bill.totalAmount, 0)
    const totalBills = billsData?.data?.pagination?.totalBills || recentBills.length
    const avgOrder = totalBills ? Math.round(totalSales / totalBills) : 0
    
    const paidBills = recentBills.filter(bill => bill.paymentStatus === 'paid')
    const pendingBills = recentBills.filter(bill => bill.paymentStatus === 'pending')
    const partialBills = recentBills.filter(bill => bill.paymentStatus === 'partial')
    
    const goldBills = recentBills.filter(bill => bill.jewelryType === 'gold')
    const silverBills = recentBills.filter(bill => bill.jewelryType === 'silver')
    
    const whiteBills = recentBills.filter(bill => bill.billType === 'white')
    const greenBills = recentBills.filter(bill => bill.billType === 'green')
    
    const totalGst = recentBills.reduce((sum, bill) => sum + bill.totalGstAmount, 0)
    
    return { 
      totalSales, 
      totalBills, 
      avgOrder, 
      paidBills: paidBills.length,
      pendingBills: pendingBills.length,
      partialBills: partialBills.length,
      goldBills: goldBills.length,
      silverBills: silverBills.length,
      whiteBills: whiteBills.length,
      greenBills: greenBills.length,
      totalGst
    }
  }, [billsData, recentBills])

  const salesSeries = useMemo(() => {
    const last7Days = Array.from({ length: 7 }, (_, i) => {
      const date = new Date()
      date.setDate(date.getDate() - i)
      return date.toISOString().split('T')[0]
    })

    return last7Days.map(date => {
      const dayBills = recentBills.filter(bill => 
        bill.createdAt.split('T')[0] === date
      )
      return {
        date,
        count: dayBills.length,
        revenue: dayBills.reduce((sum, bill) => sum + bill.totalAmount, 0)
      }
    }).reverse()
  }, [recentBills])

  const maxRevenue = Math.max(...salesSeries.map(d => d.revenue), 1)
  const chartHeight = 200

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-8">
      {/* Header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight text-pretty">Dashboard</h1>
          <p className="text-sm text-muted-foreground">Quick overview of your jewelry sales and recent invoices</p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={handleLogout}
            className="inline-flex items-center gap-2 rounded-md border border-gray-300 bg-white px-4 py-2 text-gray-700 shadow-sm ring-1 ring-inset ring-gray-300/10 hover:bg-gray-50 hover:shadow transition"
            aria-label="Logout"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" className="shrink-0" aria-hidden="true">
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <span className="font-medium">Logout</span>
          </button>
          <button
            onClick={() => navigate("/billing")}
            className="inline-flex items-center gap-2 rounded-md bg-indigo-600 px-4 py-2 text-white shadow-sm ring-1 ring-inset ring-indigo-600/10 hover:bg-indigo-700 hover:shadow transition"
            aria-label="Add new bill"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" className="shrink-0" aria-hidden="true">
              <path d="M12 5v14M5 12h14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
            <span className="font-medium">Add New Bill</span>
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-xl border border-border bg-gradient-to-br from-green-50 to-green-100 p-6 shadow-sm hover:shadow-md transition dark:from-green-900/20 dark:to-green-800/20">
          <div className="flex items-start justify-between">
            <div>
              <div className="text-sm font-medium text-green-700 dark:text-green-300">Total Revenue</div>
              <div className="mt-1 text-2xl font-bold text-green-900 dark:text-green-100">
                {loading ? '—' : `₹${kpis.totalSales.toLocaleString()}`}
              </div>
            </div>
            <div className="rounded-lg bg-green-500 p-3 text-white">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                <path d="M12 2L2 7L12 12L22 7L12 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M2 17L12 22L22 17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M2 12L12 17L22 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-border bg-gradient-to-br from-blue-50 to-blue-100 p-6 shadow-sm hover:shadow-md transition dark:from-blue-900/20 dark:to-blue-800/20">
          <div className="flex items-start justify-between">
            <div>
              <div className="text-sm font-medium text-blue-700 dark:text-blue-300">Total Bills</div>
              <div className="mt-1 text-2xl font-bold text-blue-900 dark:text-blue-100">
                {loading ? '—' : kpis.totalBills}
              </div>
            </div>
            <div className="rounded-lg bg-blue-500 p-3 text-white">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                <path d="M9 12L11 14L15 10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z" stroke="currentColor" strokeWidth="2"/>
              </svg>
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-border bg-gradient-to-br from-purple-50 to-purple-100 p-6 shadow-sm hover:shadow-md transition dark:from-purple-900/20 dark:to-purple-800/20">
          <div className="flex items-start justify-between">
            <div>
              <div className="text-sm font-medium text-purple-700 dark:text-purple-300">Avg Order Value</div>
              <div className="mt-1 text-2xl font-bold text-purple-900 dark:text-purple-100">
                {loading ? '—' : `₹${kpis.avgOrder.toLocaleString()}`}
              </div>
            </div>
            <div className="rounded-lg bg-purple-500 p-3 text-white">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                <path d="M12 2V22M17 5H9.5C8.11929 5 7 6.11929 7 7.5S8.11929 10 9.5 10H14.5C15.8807 10 17 11.1193 17 12.5S15.8807 15 14.5 15H7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-border bg-gradient-to-br from-orange-50 to-orange-100 p-6 shadow-sm hover:shadow-md transition dark:from-orange-900/20 dark:to-orange-800/20">
          <div className="flex items-start justify-between">
            <div>
              <div className="text-sm font-medium text-orange-700 dark:text-orange-300">Total GST</div>
              <div className="mt-1 text-2xl font-bold text-orange-900 dark:text-orange-100">
                {loading ? '—' : `₹${kpis.totalGst.toLocaleString()}`}
              </div>
            </div>
            <div className="rounded-lg bg-orange-500 p-3 text-white">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                <path d="M3 3H21L19 21H5L3 3Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M8 12H16" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                <path d="M8 8H16" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                <path d="M8 16H16" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* Chart + Quick Stats */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Revenue Chart */}
        <div className="rounded-xl border border-border bg-card p-6 shadow-sm hover:shadow-md transition lg:col-span-2">
          <div className="mb-6 flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold">7-Day Revenue Trend</h3>
              <p className="text-sm text-muted-foreground">Daily revenue and bill count</p>
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <div className="h-3 w-3 rounded-full bg-blue-500"></div>
              <span>Revenue</span>
            </div>
          </div>
          
          <div className="h-64">
            <svg viewBox={`0 0 600 ${chartHeight}`} className="w-full h-full" preserveAspectRatio="none">
              {/* Grid lines */}
              {Array.from({ length: 5 }).map((_, i) => {
                const y = (i / 4) * (chartHeight - 20) + 10
                return (
                  <line
                    key={i}
                    x1={0}
                    x2={600}
                    y1={y}
                    y2={y}
                    className="stroke-gray-200 dark:stroke-white/10"
                    strokeWidth={1}
                  />
                )
              })}
              
              {/* Revenue bars */}
              {salesSeries.map((day, i) => {
                const barWidth = 600 / salesSeries.length - 8
                const x = i * (600 / salesSeries.length) + 4
                const height = (day.revenue / maxRevenue) * (chartHeight - 40)
                const y = chartHeight - height - 10
                
                return (
                  <g key={day.date}>
                    <rect
                      x={x}
                      y={y}
                      width={barWidth}
                      height={height}
                      rx={4}
                      className="fill-blue-500/80 hover:fill-blue-600 transition"
                    />
                    <text
                      x={x + barWidth / 2}
                      y={chartHeight - 5}
                      textAnchor="middle"
                      className="text-xs fill-gray-500 dark:fill-gray-400"
                    >
                      {new Date(day.date).toLocaleDateString('en-IN', { weekday: 'short' })}
                    </text>
                    <text
                      x={x + barWidth / 2}
                      y={y - 5}
                      textAnchor="middle"
                      className="text-xs fill-gray-700 dark:fill-gray-300 font-medium"
                    >
                      ₹{day.revenue.toLocaleString()}
                    </text>
                  </g>
                )
              })}
            </svg>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="space-y-4">
          <div className="rounded-xl border border-border bg-card p-6 shadow-sm hover:shadow-md transition">
            <h3 className="text-lg font-semibold mb-4">Payment Status</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="h-3 w-3 rounded-full bg-green-500"></div>
                  <span className="text-sm">Paid</span>
                </div>
                <span className="font-semibold">{kpis.paidBills}</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="h-3 w-3 rounded-full bg-yellow-500"></div>
                  <span className="text-sm">Pending</span>
                </div>
                <span className="font-semibold">{kpis.pendingBills}</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="h-3 w-3 rounded-full bg-blue-500"></div>
                  <span className="text-sm">Partial</span>
                </div>
                <span className="font-semibold">{kpis.partialBills}</span>
              </div>
            </div>
          </div>

          <div className="rounded-xl border border-border bg-card p-6 shadow-sm hover:shadow-md transition">
            <h3 className="text-lg font-semibold mb-4">Jewelry Types</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="h-3 w-3 rounded-full bg-yellow-400"></div>
                  <span className="text-sm">Gold</span>
                </div>
                <span className="font-semibold">{kpis.goldBills}</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="h-3 w-3 rounded-full bg-gray-400"></div>
                  <span className="text-sm">Silver</span>
                </div>
                <span className="font-semibold">{kpis.silverBills}</span>
              </div>
            </div>
          </div>

          <div className="rounded-xl border border-border bg-card p-6 shadow-sm hover:shadow-md transition">
            <h3 className="text-lg font-semibold mb-4">Bill Types</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="h-3 w-3 rounded-full bg-white border-2 border-gray-400"></div>
                  <span className="text-sm">White (GST)</span>
                </div>
                <span className="font-semibold">{kpis.whiteBills}</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="h-3 w-3 rounded-full bg-green-500"></div>
                  <span className="text-sm">Green (No GST)</span>
                </div>
                <span className="font-semibold">{kpis.greenBills}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Bills */}
      <div className="rounded-xl border border-border bg-card p-6 shadow-sm hover:shadow-md transition">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold">Recent Bills</h3>
            <p className="text-sm text-muted-foreground">Latest transactions and invoices</p>
          </div>
          <button 
            onClick={() => navigate("/billing")} 
            className="inline-flex items-center gap-2 rounded-md bg-indigo-600 px-4 py-2 text-sm text-white shadow-sm hover:bg-indigo-700 transition"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
              <path d="M12 5v14M5 12h14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
            Create Bill
          </button>
        </div>
        
        <div className="relative overflow-x-auto">
          <table className="min-w-full border-separate border-spacing-y-2">
            <thead className="sticky top-0 z-10">
              <tr className="text-left text-sm text-muted-foreground">
                <th className="px-4 py-3 bg-background font-medium">Bill No.</th>
                <th className="px-4 py-3 bg-background font-medium">Date</th>
                <th className="px-4 py-3 bg-background font-medium">Customer</th>
                <th className="px-4 py-3 bg-background font-medium">Jewelry</th>
                <th className="px-4 py-3 bg-background font-medium">Type</th>
                <th className="px-4 py-3 bg-background font-medium">Amount</th>
                <th className="px-4 py-3 bg-background font-medium">Payment</th>
                <th className="px-4 py-3 bg-background font-medium">Status</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={8} className="px-4 py-12 text-center text-muted-foreground">
                    <div className="flex items-center justify-center gap-2">
                      <div className="h-4 w-4 animate-spin rounded-full border-2 border-indigo-600 border-t-transparent"></div>
                      Loading bills...
                    </div>
                  </td>
                </tr>
              ) : error ? (
                <tr>
                  <td colSpan={8} className="px-4 py-12 text-center text-red-600">
                    <div className="flex flex-col items-center gap-2">
                      <svg width="48" height="48" viewBox="0 0 24 24" fill="none" className="text-red-400">
                        <path d="M12 9V13M12 17H12.01M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                      <p className="font-medium">Error loading bills</p>
                      <p className="text-sm text-red-500">{error}</p>
                      <button 
                        onClick={() => refetch()} 
                        className="mt-2 rounded-md bg-red-600 px-4 py-2 text-sm text-white hover:bg-red-700 transition"
                      >
                        Try Again
                      </button>
                    </div>
                  </td>
                </tr>
              ) : recentBills.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-4 py-12 text-center text-muted-foreground">
                    <div className="flex flex-col items-center gap-2">
                      <svg width="48" height="48" viewBox="0 0 24 24" fill="none" className="text-gray-400">
                        <path d="M9 12L11 14L15 10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        <path d="M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z" stroke="currentColor" strokeWidth="2"/>
                      </svg>
                      <p>No bills found</p>
                      <button 
                        onClick={() => navigate("/billing")} 
                        className="text-indigo-600 hover:underline font-medium"
                      >
                        Create your first bill
                      </button>
                    </div>
                  </td>
                </tr>
              ) : (
                recentBills.map((bill) => (
                  <tr
                    key={bill._id}
                    className="rounded-lg bg-white/60 text-sm transition hover:bg-white/80 dark:bg-white/5 dark:hover:bg-white/10"
                  >
                    <td className="px-4 py-3 font-medium text-indigo-600">{bill.billNumber}</td>
                    <td className="px-4 py-3">{new Date(bill.createdAt).toLocaleDateString('en-IN')}</td>
                    <td className="px-4 py-3">
                      <div>
                        <div className="font-medium">{bill.customer.name}</div>
                        <div className="text-xs text-muted-foreground">{bill.customer.phoneNumber}</div>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`rounded-full px-2 py-1 text-xs font-medium ${
                        bill.jewelryType === 'gold' 
                          ? 'bg-yellow-100 text-yellow-800 ring-1 ring-yellow-600/10' 
                          : 'bg-gray-100 text-gray-800 ring-1 ring-gray-600/10'
                      }`}>
                        {bill.jewelryType === 'gold' ? 'Gold' : 'Silver'}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`rounded-full px-2 py-1 text-xs font-medium ${
                        bill.billType === 'white' 
                          ? 'bg-blue-100 text-blue-800 ring-1 ring-blue-600/10' 
                          : 'bg-green-100 text-green-800 ring-1 ring-green-600/10'
                      }`}>
                        {bill.billType === 'white' ? 'White' : 'Green'}
                      </span>
                    </td>
                    <td className="px-4 py-3 font-semibold">₹{bill.totalAmount.toLocaleString()}</td>
                    <td className="px-4 py-3">
                      <span className="capitalize text-xs text-muted-foreground">{bill.paymentMethod}</span>
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={
                          bill.paymentStatus === "paid"
                            ? "rounded-full bg-green-100 px-2 py-1 text-xs font-medium text-green-700 ring-1 ring-green-600/10 dark:bg-green-500/10 dark:text-green-400"
                            : bill.paymentStatus === "pending"
                              ? "rounded-full bg-yellow-100 px-2 py-1 text-xs font-medium text-yellow-800 ring-1 ring-yellow-700/10 dark:bg-yellow-500/10 dark:text-yellow-400"
                              : "rounded-full bg-blue-100 px-2 py-1 text-xs font-medium text-blue-800 ring-1 ring-blue-700/10 dark:bg-blue-500/10 dark:text-blue-400"
                        }
                      >
                        {bill.paymentStatus}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
