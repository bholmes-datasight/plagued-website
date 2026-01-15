import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { analyticsAPI, ordersAPI } from '../lib/api'
import { formatPrice, formatRelativeTime } from '../lib/formatters'
import { Loader, Package, TrendingUp, AlertTriangle, ShoppingCart, DollarSign, TrendingDown, Percent } from 'lucide-react'
import StatusBadge from '../components/StatusBadge'

export default function Dashboard() {
  const [stats, setStats] = useState(null)
  const [recentOrders, setRecentOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const navigate = useNavigate()

  useEffect(() => {
    fetchDashboardData()
  }, [])

  const fetchDashboardData = async () => {
    try {
      setLoading(true)
      setError(null)

      const [statsData, ordersData] = await Promise.all([
        analyticsAPI.dashboardStats(),
        ordersAPI.list({ limit: 5 })
      ])

      setStats(statsData)
      setRecentOrders(ordersData.data || [])
    } catch (err) {
      console.error('Error fetching dashboard data:', err)
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

  return (
    <div>
      <h1 className="text-3xl font-display uppercase tracking-wider text-plague-green mb-6">
        Dashboard
      </h1>

      {/* Overall P&L Hero Card */}
      <div className={`card p-6 mb-6 border-2 ${stats?.has_broken_even ? 'border-plague-green bg-plague-green/10' : 'border-plague-red bg-plague-red/10'}`}>
        <div className="flex items-center justify-between">
          <div>
            <div className="text-plague-mist/60 text-xs uppercase tracking-wider mb-2">
              Overall P&L (Inc. Inventory Investment)
            </div>
            <div className={`text-4xl font-display ${stats?.has_broken_even ? 'text-plague-green' : 'text-plague-red-bright'}`}>
              {formatPrice(stats?.overall_pl || 0)}
            </div>
            <div className="text-plague-mist/60 text-sm mt-2">
              {stats?.has_broken_even ? (
                <span className="text-plague-green">✓ Broken even - Making profit!</span>
              ) : (
                <span className="text-plague-red-bright">
                  Need {formatPrice(Math.abs(stats?.overall_pl || 0))} more revenue to break even
                </span>
              )}
            </div>
          </div>
          <div className="text-right">
            <div className="text-plague-mist/60 text-xs mb-2">Total Costs (Inc. Inventory)</div>
            <div className="text-2xl text-plague-mist">
              {formatPrice(stats?.total_costs_including_inventory || 0)}
            </div>
            <div className="text-plague-mist/60 text-xs mt-1">
              COGS + Shipping + Inventory on hand
            </div>
          </div>
        </div>
      </div>

      {/* Revenue Section */}
      <div className="mb-6">
        <h2 className="text-sm font-display uppercase tracking-wider text-plague-mist/60 mb-3">Revenue</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="card p-4">
            <div className="flex items-center justify-between mb-2">
              <div className="text-plague-mist/60 text-xs uppercase tracking-wider">Product Sales</div>
              <TrendingUp className="w-4 h-4 text-plague-green" />
            </div>
            <div className="text-2xl font-normal text-plague-green">
              {formatPrice(stats?.product_revenue || 0)}
            </div>
            <div className="text-plague-mist/40 text-xs mt-1">Excl. shipping</div>
          </div>

          <div className="card p-4">
            <div className="flex items-center justify-between mb-2">
              <div className="text-plague-mist/60 text-xs uppercase tracking-wider">Shipping Collected</div>
              <TrendingUp className="w-4 h-4 text-plague-green" />
            </div>
            <div className="text-2xl font-normal text-plague-green">
              {formatPrice(stats?.shipping_collected || 0)}
            </div>
            <div className="text-plague-mist/40 text-xs mt-1">From customers</div>
          </div>

          <div className="card p-4">
            <div className="flex items-center justify-between mb-2">
              <div className="text-plague-mist/60 text-xs uppercase tracking-wider">Total Revenue</div>
              <TrendingUp className="w-4 h-4 text-plague-green" />
            </div>
            <div className="text-2xl font-normal text-plague-green">
              {formatPrice(stats?.total_revenue || 0)}
            </div>
            <div className="text-plague-mist/40 text-xs mt-1">All time</div>
          </div>
        </div>
      </div>

      {/* Costs Section */}
      <div className="mb-6">
        <h2 className="text-sm font-display uppercase tracking-wider text-plague-mist/60 mb-3">Costs</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="card p-4">
            <div className="flex items-center justify-between mb-2">
              <div className="text-plague-mist/60 text-xs uppercase tracking-wider">COGS</div>
              <TrendingDown className="w-4 h-4 text-plague-red" />
            </div>
            <div className="text-2xl font-normal text-plague-red">
              {formatPrice(stats?.cogs || 0)}
            </div>
            <div className="text-plague-mist/40 text-xs mt-1">Products sold</div>
          </div>

          <div className="card p-4">
            <div className="flex items-center justify-between mb-2">
              <div className="text-plague-mist/60 text-xs uppercase tracking-wider">Shipping Costs</div>
              <TrendingDown className="w-4 h-4 text-plague-red" />
            </div>
            <div className="text-2xl font-normal text-plague-red">
              {formatPrice(stats?.shipping_costs || 0)}
            </div>
            <div className="text-plague-mist/40 text-xs mt-1">Paid to courier</div>
          </div>

          <div className="card p-4">
            <div className="flex items-center justify-between mb-2">
              <div className="text-plague-mist/60 text-xs uppercase tracking-wider">Inventory Value</div>
              <Package className="w-4 h-4 text-plague-mist" />
            </div>
            <div className="text-2xl font-normal text-plague-bone">
              {formatPrice(stats?.inventory_value || 0)}
            </div>
            <div className="text-plague-mist/40 text-xs mt-1">Stock on hand</div>
          </div>
        </div>
      </div>

      {/* Profit Section */}
      <div className="mb-6">
        <h2 className="text-sm font-display uppercase tracking-wider text-plague-mist/60 mb-3">Profit</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="card p-4">
            <div className="flex items-center justify-between mb-2">
              <div className="text-plague-mist/60 text-xs uppercase tracking-wider">Gross Profit</div>
              <DollarSign className="w-4 h-4 text-plague-green" />
            </div>
            <div className="text-2xl font-normal text-plague-green">
              {formatPrice(stats?.gross_profit || 0)}
            </div>
            <div className="text-plague-mist/40 text-xs mt-1">
              {stats?.gross_margin?.toFixed(1) || 0}% margin (excl. shipping)
            </div>
          </div>

          <div className="card p-4">
            <div className="flex items-center justify-between mb-2">
              <div className="text-plague-mist/60 text-xs uppercase tracking-wider">Net Profit</div>
              <DollarSign className="w-4 h-4 text-plague-green" />
            </div>
            <div className="text-2xl font-normal text-plague-green">
              {formatPrice(stats?.net_profit || 0)}
            </div>
            <div className="text-plague-mist/40 text-xs mt-1">
              {stats?.net_margin?.toFixed(1) || 0}% margin (after all costs)
            </div>
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="card p-4">
          <div className="flex items-center justify-between mb-2">
            <div className="text-plague-mist/60 text-xs uppercase tracking-wider">This Month</div>
            <TrendingUp className="w-4 h-4 text-plague-green" />
          </div>
          <div className="text-2xl font-normal text-plague-green">
            {formatPrice(stats?.monthly_revenue || 0)}
          </div>
          <div className="text-plague-mist/40 text-xs mt-1">{stats?.monthly_orders || 0} orders</div>
        </div>

        <div className="card p-4">
          <div className="flex items-center justify-between mb-2">
            <div className="text-plague-mist/60 text-xs uppercase tracking-wider">Total Orders</div>
            <ShoppingCart className="w-4 h-4 text-plague-green" />
          </div>
          <div className="text-2xl font-normal text-plague-bone">
            {stats?.total_orders || 0}
          </div>
          <div className="text-plague-mist/40 text-xs mt-1">All time</div>
        </div>

        <div className="card p-4">
          <div className="flex items-center justify-between mb-2">
            <div className="text-plague-mist/60 text-xs uppercase tracking-wider">Avg Order Value</div>
            <Percent className="w-4 h-4 text-plague-mist" />
          </div>
          <div className="text-2xl font-normal text-plague-bone">
            {formatPrice(stats?.average_order_value || 0)}
          </div>
          <div className="text-plague-mist/40 text-xs mt-1">Per order</div>
        </div>

        <div className="card p-4">
          <div className="flex items-center justify-between mb-2">
            <div className="text-plague-mist/60 text-xs uppercase tracking-wider">Low Stock</div>
            <AlertTriangle className="w-4 h-4 text-plague-red-bright" />
          </div>
          <div className="text-2xl font-normal text-plague-red-bright">
            {stats?.low_stock_count || 0}
          </div>
          <div className="text-plague-mist/40 text-xs mt-1">Variants &lt; 5 units</div>
        </div>
      </div>

      {/* Order Status Summary */}
      <div className="card p-4 mb-6">
        <h2 className="font-display uppercase tracking-wider text-plague-green mb-4">
          Orders by Status
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          <div className="text-center">
            <div className="text-2xl font-normal text-status-paid">
              {stats?.order_stats?.paid || 0}
            </div>
            <div className="text-plague-mist/60 text-xs uppercase mt-1">Paid</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-normal text-status-shipped">
              {stats?.order_stats?.shipped || 0}
            </div>
            <div className="text-plague-mist/60 text-xs uppercase mt-1">Shipped</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-normal text-status-delivered">
              {stats?.order_stats?.delivered || 0}
            </div>
            <div className="text-plague-mist/60 text-xs uppercase mt-1">Delivered</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-normal text-status-cancelled">
              {stats?.order_stats?.cancelled || 0}
            </div>
            <div className="text-plague-mist/60 text-xs uppercase mt-1">Cancelled</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-normal text-status-refunded">
              {stats?.order_stats?.refunded || 0}
            </div>
            <div className="text-plague-mist/60 text-xs uppercase mt-1">Refunded</div>
          </div>
        </div>
      </div>

      {/* Recent Orders */}
      <div className="card overflow-hidden">
        <div className="p-4 border-b border-plague-lighter flex items-center justify-between">
          <h2 className="font-display uppercase tracking-wider text-plague-green">
            Recent Orders
          </h2>
          <button
            onClick={() => navigate('/orders')}
            className="text-plague-green hover:text-plague-green-dark text-sm uppercase tracking-wider"
          >
            View All
          </button>
        </div>

        {recentOrders.length === 0 ? (
          <div className="p-8 text-center text-plague-mist/60">
            <Package className="w-12 h-12 mx-auto mb-2 opacity-50" />
            No orders yet
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-plague-lighter/50 border-b border-plague-lighter">
                <tr>
                  <th className="text-left p-3 font-display uppercase tracking-wider text-xs text-plague-mist">
                    Order #
                  </th>
                  <th className="text-left p-3 font-display uppercase tracking-wider text-xs text-plague-mist">
                    Customer
                  </th>
                  <th className="text-left p-3 font-display uppercase tracking-wider text-xs text-plague-mist">
                    Total
                  </th>
                  <th className="text-left p-3 font-display uppercase tracking-wider text-xs text-plague-mist">
                    Status
                  </th>
                  <th className="text-left p-3 font-display uppercase tracking-wider text-xs text-plague-mist">
                    Time
                  </th>
                </tr>
              </thead>
              <tbody>
                {recentOrders.map((order) => (
                  <tr key={order.id} className="border-t border-plague-lighter/30 hover:bg-plague-lighter/20">
                    <td className="p-3">
                      <button
                        onClick={() => navigate('/orders')}
                        className="text-plague-green hover:underline font-mono text-sm"
                      >
                        {order.order_number}
                      </button>
                    </td>
                    <td className="p-3">
                      <div className="text-plague-bone text-sm">{order.customers?.name || 'Guest'}</div>
                      <div className="text-plague-mist/60 text-xs">{order.customers?.email}</div>
                    </td>
                    <td className="p-3 text-plague-green font-bold">
                      {formatPrice(order.total_amount)}
                    </td>
                    <td className="p-3">
                      <StatusBadge status={order.status} />
                    </td>
                    <td className="p-3 text-plague-mist text-sm">
                      {formatRelativeTime(order.created_at)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
