import { useState, useEffect } from 'react'
import { ordersAPI } from '../lib/api'
import { formatPrice, formatDate, capitalize } from '../lib/formatters'
import { Loader, Search, ChevronLeft, ChevronRight, Package, X } from 'lucide-react'
import StatusBadge from '../components/StatusBadge'

export default function Orders() {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [page, setPage] = useState(1)
  const [totalCount, setTotalCount] = useState(0)
  const [statusFilter, setStatusFilter] = useState('all')
  const [search, setSearch] = useState('')
  const [selectedOrder, setSelectedOrder] = useState(null)
  const [updatingStatus, setUpdatingStatus] = useState(false)

  const limit = 20

  useEffect(() => {
    fetchOrders()
  }, [page, statusFilter])

  const fetchOrders = async () => {
    try {
      setLoading(true)
      setError(null)
      const params = {
        page,
        limit,
        ...(statusFilter !== 'all' && { status: statusFilter }),
        ...(search && { search }),
      }
      const result = await ordersAPI.list(params)
      setOrders(result.data)
      setTotalCount(result.count)
    } catch (err) {
      console.error('Error fetching orders:', err)
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleSearch = (e) => {
    e.preventDefault()
    setPage(1)
    fetchOrders()
  }

  const handleStatusUpdate = async (orderId, newStatus) => {
    try {
      setUpdatingStatus(true)
      await ordersAPI.updateStatus(orderId, newStatus)
      // Refresh orders list
      await fetchOrders()
      // Update selected order if open
      if (selectedOrder?.id === orderId) {
        const updated = await ordersAPI.get(orderId)
        setSelectedOrder(updated)
      }
    } catch (err) {
      console.error('Error updating status:', err)
      alert(`Failed to update status: ${err.message}`)
    } finally {
      setUpdatingStatus(false)
    }
  }

  const totalPages = Math.ceil(totalCount / limit)

  if (loading && orders.length === 0) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader className="w-8 h-8 text-plague-green animate-spin" />
      </div>
    )
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-display uppercase tracking-wider text-plague-green">
          Orders
        </h1>
        <div className="text-plague-mist">
          {totalCount} total order{totalCount !== 1 ? 's' : ''}
        </div>
      </div>

      {/* Filters */}
      <div className="card p-4 mb-6">
        <div className="flex gap-4 flex-wrap">
          {/* Status Filter */}
          <div className="flex-1 min-w-[200px]">
            <label className="text-plague-mist/60 text-xs uppercase tracking-wider block mb-2">
              Status
            </label>
            <select
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value)
                setPage(1)
              }}
              className="w-full input-field"
            >
              <option value="all">All Orders</option>
              <option value="paid">Paid</option>
              <option value="shipped">Shipped</option>
              <option value="delivered">Delivered</option>
              <option value="cancelled">Cancelled</option>
              <option value="refunded">Refunded</option>
            </select>
          </div>

          {/* Search */}
          <div className="flex-1 min-w-[300px]">
            <label className="text-plague-mist/60 text-xs uppercase tracking-wider block mb-2">
              Search
            </label>
            <form onSubmit={handleSearch} className="flex gap-2">
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Order number or email..."
                className="flex-1 input-field"
              />
              <button type="submit" className="btn-primary px-4">
                <Search className="w-4 h-4" />
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Error */}
      {error && (
        <div className="card p-4 mb-6 bg-plague-red/20 border-plague-red text-plague-red-bright">
          {error}
        </div>
      )}

      {/* Orders Table */}
      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-plague-lighter border-b border-plague-lighter">
              <tr>
                <th className="text-left p-4 font-display uppercase tracking-wider text-xs text-plague-mist">
                  Order #
                </th>
                <th className="text-left p-4 font-display uppercase tracking-wider text-xs text-plague-mist">
                  Customer
                </th>
                <th className="text-left p-4 font-display uppercase tracking-wider text-xs text-plague-mist">
                  Date
                </th>
                <th className="text-left p-4 font-display uppercase tracking-wider text-xs text-plague-mist">
                  Total
                </th>
                <th className="text-left p-4 font-display uppercase tracking-wider text-xs text-plague-mist">
                  Status
                </th>
                <th className="text-left p-4 font-display uppercase tracking-wider text-xs text-plague-mist">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {orders.length === 0 ? (
                <tr>
                  <td colSpan="6" className="p-8 text-center text-plague-mist/60">
                    <Package className="w-12 h-12 mx-auto mb-2 opacity-50" />
                    No orders found
                  </td>
                </tr>
              ) : (
                orders.map((order) => (
                  <tr key={order.id} className="table-row">
                    <td className="p-4">
                      <button
                        onClick={() => ordersAPI.get(order.id).then(setSelectedOrder)}
                        className="text-plague-green hover:underline font-mono text-sm"
                      >
                        {order.order_number}
                      </button>
                    </td>
                    <td className="p-4">
                      <div className="text-plague-bone text-sm">{order.customers?.name || 'Guest'}</div>
                      <div className="text-plague-mist/60 text-xs">{order.customers?.email}</div>
                    </td>
                    <td className="p-4 text-plague-mist text-sm">
                      {formatDate(order.created_at)}
                    </td>
                    <td className="p-4 text-plague-green font-bold">
                      {formatPrice(order.total_amount)}
                    </td>
                    <td className="p-4">
                      <StatusBadge status={order.status} />
                    </td>
                    <td className="p-4">
                      <button
                        onClick={() => ordersAPI.get(order.id).then(setSelectedOrder)}
                        className="text-plague-green hover:text-plague-green-dark text-sm uppercase tracking-wider"
                      >
                        View
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="border-t border-plague-lighter p-4 flex items-center justify-between">
            <div className="text-plague-mist text-sm">
              Page {page} of {totalPages}
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                className="btn-secondary px-3 py-2 disabled:opacity-50"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                className="btn-secondary px-3 py-2 disabled:opacity-50"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Order Details Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 bg-plague-black/80 flex items-center justify-center p-4 z-50">
          <div className="card p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-display uppercase tracking-wider text-plague-green">
                {selectedOrder.order_number}
              </h2>
              <button
                onClick={() => setSelectedOrder(null)}
                className="text-plague-mist hover:text-plague-red-bright"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Order Info */}
            <div className="space-y-6">
              {/* Status */}
              <div>
                <label className="text-plague-mist/60 text-xs uppercase tracking-wider block mb-2">
                  Status
                </label>
                <div className="flex gap-3 items-center">
                  <select
                    value={selectedOrder.status}
                    onChange={(e) => handleStatusUpdate(selectedOrder.id, e.target.value)}
                    disabled={updatingStatus}
                    className="input-field"
                  >
                    <option value="paid">Paid</option>
                    <option value="shipped">Shipped</option>
                    <option value="delivered">Delivered</option>
                    <option value="cancelled">Cancelled</option>
                    <option value="refunded">Refunded</option>
                  </select>
                  {updatingStatus && <Loader className="w-4 h-4 text-plague-green animate-spin" />}
                </div>
              </div>

              {/* Customer */}
              <div>
                <label className="text-plague-mist/60 text-xs uppercase tracking-wider block mb-2">
                  Customer
                </label>
                <div className="text-plague-bone">{selectedOrder.customers?.name || 'Guest'}</div>
                <div className="text-plague-mist/60 text-sm">{selectedOrder.customers?.email}</div>
              </div>

              {/* Shipping Address */}
              <div>
                <label className="text-plague-mist/60 text-xs uppercase tracking-wider block mb-2">
                  Shipping Address
                </label>
                <div className="text-plague-bone text-sm">
                  {selectedOrder.addresses?.name}<br />
                  {selectedOrder.addresses?.line1}<br />
                  {selectedOrder.addresses?.line2 && <>{selectedOrder.addresses.line2}<br /></>}
                  {selectedOrder.addresses?.city}, {selectedOrder.addresses?.postal_code}<br />
                  {selectedOrder.addresses?.country}
                </div>
              </div>

              {/* Items */}
              <div>
                <label className="text-plague-mist/60 text-xs uppercase tracking-wider block mb-2">
                  Items
                </label>
                <div className="space-y-2">
                  {selectedOrder.order_items?.map((item, idx) => (
                    <div key={idx} className="flex justify-between items-center p-3 bg-plague-lighter/50">
                      <div>
                        <div className="text-plague-bone">{item.product_name}</div>
                        <div className="text-plague-mist/60 text-xs">
                          Size: {item.product_size} | Qty: {item.quantity}
                        </div>
                      </div>
                      <div className="text-plague-green font-bold">
                        {formatPrice(item.line_total)}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Total */}
              <div className="border-t border-plague-lighter pt-4">
                <div className="flex justify-between items-center">
                  <span className="text-plague-mist font-display uppercase tracking-wider">Total</span>
                  <span className="text-plague-green font-display text-2xl">
                    {formatPrice(selectedOrder.total_amount)}
                  </span>
                </div>
              </div>

              {/* Dates */}
              <div className="text-plague-mist/60 text-xs space-y-1">
                <div>Ordered: {formatDate(selectedOrder.created_at)}</div>
                {selectedOrder.shipped_at && <div>Shipped: {formatDate(selectedOrder.shipped_at)}</div>}
                {selectedOrder.delivered_at && <div>Delivered: {formatDate(selectedOrder.delivered_at)}</div>}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
