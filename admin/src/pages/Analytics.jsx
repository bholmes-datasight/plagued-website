import { useState, useEffect } from 'react'
import { analyticsAPI } from '../lib/api'
import { formatPrice } from '../lib/formatters'
import { Loader, TrendingUp, Package, ShoppingCart, Users } from 'lucide-react'
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts'

export default function Analytics() {
  const [analytics, setAnalytics] = useState(null)
  const [sizeDistribution, setSizeDistribution] = useState(null)
  const [selectedProductType, setSelectedProductType] = useState('all')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    fetchAnalytics()
  }, [])

  const fetchAnalytics = async () => {
    try {
      setLoading(true)
      setError(null)
      const [analyticsData, sizeData] = await Promise.all([
        analyticsAPI.overview(),
        analyticsAPI.sizeDistribution()
      ])
      setAnalytics(analyticsData)
      setSizeDistribution(sizeData)
    } catch (err) {
      console.error('Error fetching analytics:', err)
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader className="w-8 h-8 text-plague-green animate-spin" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="card p-4 bg-plague-red/20 border-plague-red text-plague-red-bright">
        {error}
      </div>
    )
  }

  // Prepare chart data
  const revenueChartData = analytics?.revenue_by_day || []
  const topProductsData = analytics?.top_products?.slice(0, 10) || []

  // Pie chart data for order status
  const statusData = [
    { name: 'Pending', value: analytics?.order_stats?.pending || 0, color: '#f59e0b' },
    { name: 'Processing', value: analytics?.order_stats?.processing || 0, color: '#3b82f6' },
    { name: 'Shipped', value: analytics?.order_stats?.shipped || 0, color: '#8b5cf6' },
    { name: 'Delivered', value: analytics?.order_stats?.delivered || 0, color: '#10b981' },
    { name: 'Cancelled', value: analytics?.order_stats?.cancelled || 0, color: '#ef4444' },
  ].filter(item => item.value > 0)

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="card p-3 border border-plague-green/30">
          <p className="text-plague-bone text-sm font-mono mb-1">{label}</p>
          <p className="text-plague-green font-bold">{formatPrice(payload[0].value)}</p>
        </div>
      )
    }
    return null
  }

  const CustomBarTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <div className="card p-3 border border-plague-green/30">
          <p className="text-plague-bone text-sm mb-1">{payload[0].payload.product_name}</p>
          <p className="text-plague-green font-bold">{payload[0].value} sold</p>
        </div>
      )
    }
    return null
  }

  return (
    <div>
      <h1 className="text-3xl font-display uppercase tracking-wider text-plague-green mb-6">
        Analytics
      </h1>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="card p-4">
          <div className="flex items-center justify-between mb-2">
            <div className="text-plague-mist/60 text-xs uppercase tracking-wider">
              Total Revenue
            </div>
            <TrendingUp className="w-4 h-4 text-plague-green" />
          </div>
          <div className="text-2xl font-display text-plague-green">
            {formatPrice(analytics?.total_revenue || 0)}
          </div>
        </div>

        <div className="card p-4">
          <div className="flex items-center justify-between mb-2">
            <div className="text-plague-mist/60 text-xs uppercase tracking-wider">
              Total Orders
            </div>
            <ShoppingCart className="w-4 h-4 text-plague-green" />
          </div>
          <div className="text-2xl font-display text-plague-bone">
            {analytics?.total_orders || 0}
          </div>
        </div>

        <div className="card p-4">
          <div className="flex items-center justify-between mb-2">
            <div className="text-plague-mist/60 text-xs uppercase tracking-wider">
              Avg Order Value
            </div>
            <Package className="w-4 h-4 text-plague-green" />
          </div>
          <div className="text-2xl font-display text-plague-green">
            {formatPrice(
              analytics?.total_orders > 0
                ? (analytics?.total_revenue || 0) / analytics.total_orders
                : 0
            )}
          </div>
        </div>

        <div className="card p-4">
          <div className="flex items-center justify-between mb-2">
            <div className="text-plague-mist/60 text-xs uppercase tracking-wider">
              Total Customers
            </div>
            <Users className="w-4 h-4 text-plague-green" />
          </div>
          <div className="text-2xl font-display text-plague-bone">
            {analytics?.total_customers || 0}
          </div>
        </div>
      </div>

      {/* Revenue Chart */}
      <div className="card p-6 mb-6">
        <h2 className="font-display uppercase tracking-wider text-plague-green mb-4">
          Revenue (Last 30 Days)
        </h2>
        {revenueChartData.length > 0 ? (
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={revenueChartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1a1a1a" />
              <XAxis
                dataKey="date"
                stroke="#666"
                style={{ fontSize: '12px', fontFamily: 'monospace' }}
              />
              <YAxis
                stroke="#666"
                style={{ fontSize: '12px', fontFamily: 'monospace' }}
                tickFormatter={(value) => `£${(value / 100).toFixed(0)}`}
              />
              <Tooltip content={<CustomTooltip />} />
              <Line
                type="monotone"
                dataKey="revenue"
                stroke="#00ff00"
                strokeWidth={2}
                dot={{ fill: '#00ff00', r: 3 }}
                activeDot={{ r: 5 }}
              />
            </LineChart>
          </ResponsiveContainer>
        ) : (
          <div className="text-plague-mist/60 text-sm text-center py-12">
            No revenue data available
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Products */}
        <div className="card p-6">
          <h2 className="font-display uppercase tracking-wider text-plague-green mb-4">
            Top Products
          </h2>
          {topProductsData.length > 0 ? (
            <ResponsiveContainer width="100%" height={400}>
              <BarChart data={topProductsData} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="#1a1a1a" />
                <XAxis
                  type="number"
                  stroke="#666"
                  style={{ fontSize: '12px', fontFamily: 'monospace' }}
                />
                <YAxis
                  type="category"
                  dataKey="product_name"
                  stroke="#666"
                  width={150}
                  style={{ fontSize: '11px', fontFamily: 'monospace' }}
                />
                <Tooltip content={<CustomBarTooltip />} />
                <Bar dataKey="total_quantity" fill="#00ff00" />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="text-plague-mist/60 text-sm text-center py-12">
              No product data available
            </div>
          )}
        </div>

        {/* Order Status Distribution */}
        <div className="card p-6">
          <h2 className="font-display uppercase tracking-wider text-plague-green mb-4">
            Orders by Status
          </h2>
          {statusData.length > 0 ? (
            <>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={statusData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  >
                    {statusData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>

              {/* Legend */}
              <div className="mt-4 space-y-2">
                {statusData.map((item) => (
                  <div key={item.name} className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2">
                      <div
                        className="w-3 h-3 rounded-sm"
                        style={{ backgroundColor: item.color }}
                      />
                      <span className="text-plague-bone">{item.name}</span>
                    </div>
                    <span className="text-plague-green font-mono">{item.value}</span>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <div className="text-plague-mist/60 text-sm text-center py-12">
              No order data available
            </div>
          )}
        </div>
      </div>

      {/* Size Distribution by Product Type */}
      {sizeDistribution && Object.keys(sizeDistribution).length > 0 && (
        <div className="mt-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-2xl font-display uppercase tracking-wider text-plague-green mb-2">
                Size Distribution by Product Type
              </h2>
              <div className="text-plague-mist/60 text-sm">
                Historical sales data to guide future inventory orders
              </div>
            </div>

            {/* Product Type Filter */}
            <div className="w-64">
              <label className="text-plague-mist/60 text-xs uppercase tracking-wider block mb-2">
                Filter by Type
              </label>
              <select
                value={selectedProductType}
                onChange={(e) => setSelectedProductType(e.target.value)}
                className="input-field w-full"
              >
                <option value="all">All Product Types</option>
                {Object.keys(sizeDistribution).sort().map(type => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {Object.entries(sizeDistribution)
              .filter(([productType]) => selectedProductType === 'all' || productType === selectedProductType)
              .map(([productType, data]) => {
              // Prepare data for bar chart
              const chartData = Object.entries(data.sizes || {})
                .map(([size, count]) => ({
                  size,
                  count,
                  percentage: data.percentages[size]
                }))
                .sort((a, b) => {
                  // Sort by standard size order
                  const sizeOrder = ['XS', 'S', 'M', 'L', 'XL', 'XXL', '2XL', '3XL']
                  return sizeOrder.indexOf(a.size) - sizeOrder.indexOf(b.size)
                })

              return (
                <div key={productType} className="card p-6">
                  <h3 className="font-display uppercase tracking-wider text-plague-bone mb-2">
                    {productType}
                  </h3>
                  <div className="text-plague-mist/60 text-xs mb-4">
                    {data.total} total units sold
                  </div>

                  {/* Bar chart */}
                  <ResponsiveContainer width="100%" height={200}>
                    <BarChart data={chartData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#1a1a1a" />
                      <XAxis
                        dataKey="size"
                        stroke="#666"
                        style={{ fontSize: '12px', fontFamily: 'monospace' }}
                      />
                      <YAxis
                        stroke="#666"
                        style={{ fontSize: '12px', fontFamily: 'monospace' }}
                      />
                      <Tooltip
                        content={({ active, payload }) => {
                          if (active && payload && payload.length) {
                            return (
                              <div className="card p-3 border border-plague-green/30">
                                <p className="text-plague-bone text-sm mb-1">
                                  Size {payload[0].payload.size}
                                </p>
                                <p className="text-plague-green font-bold">
                                  {payload[0].payload.count} units ({payload[0].payload.percentage}%)
                                </p>
                              </div>
                            )
                          }
                          return null
                        }}
                      />
                      <Bar dataKey="count" fill="#00ff00" />
                    </BarChart>
                  </ResponsiveContainer>

                  {/* Size breakdown table */}
                  <div className="mt-4 space-y-2">
                    {chartData.map((item) => (
                      <div key={item.size} className="flex items-center justify-between text-sm">
                        <div className="flex items-center gap-3">
                          <span className="text-plague-bone font-mono w-8">{item.size}</span>
                          <div className="flex-1 bg-plague-lighter h-2 rounded-full overflow-hidden w-32">
                            <div
                              className="bg-plague-green h-full"
                              style={{ width: `${item.percentage}%` }}
                            />
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className="text-plague-green font-mono">{item.count}</span>
                          <span className="text-plague-mist/60 text-xs w-12 text-right">
                            {item.percentage}%
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}
