import { useState, useEffect } from 'react'
import { customersAPI } from '../lib/api'
import { formatPrice, formatDate } from '../lib/formatters'
import { Loader, Users, Search, ChevronLeft, ChevronRight, X } from 'lucide-react'
import StatusBadge from '../components/StatusBadge'

export default function Customers() {
  const [customers, setCustomers] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [page, setPage] = useState(1)
  const [totalCount, setTotalCount] = useState(0)
  const [search, setSearch] = useState('')
  const [selectedCustomer, setSelectedCustomer] = useState(null)

  const limit = 50

  useEffect(() => {
    fetchCustomers()
  }, [page])

  const fetchCustomers = async () => {
    try {
      setLoading(true)
      setError(null)
      const params = {
        page,
        limit,
        ...(search && { search }),
      }
      const result = await customersAPI.list(params)
      setCustomers(result.data)
      setTotalCount(result.count)
    } catch (err) {
      console.error('Error fetching customers:', err)
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleSearch = (e) => {
    e.preventDefault()
    setPage(1)
    fetchCustomers()
  }

  const viewCustomerDetails = async (customerId) => {
    try {
      const customer = await customersAPI.get(customerId)
      setSelectedCustomer(customer)
    } catch (err) {
      console.error('Error fetching customer details:', err)
      alert(`Failed to load customer: ${err.message}`)
    }
  }

  const totalPages = Math.ceil(totalCount / limit)

  if (loading && customers.length === 0) {
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
          Customers
        </h1>
        <div className="text-plague-mist">
          {totalCount} total customer{totalCount !== 1 ? 's' : ''}
        </div>
      </div>

      {/* Search */}
      <div className="card p-4 mb-6">
        <form onSubmit={handleSearch} className="flex gap-2">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by email or name..."
            className="flex-1 input-field"
          />
          <button type="submit" className="btn-primary px-4">
            <Search className="w-4 h-4" />
          </button>
        </form>
      </div>

      {/* Error */}
      {error && (
        <div className="card p-4 mb-6 bg-plague-red/20 border-plague-red text-plague-red-bright">
          {error}
        </div>
      )}

      {/* Customers Table */}
      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-plague-lighter border-b border-plague-lighter">
              <tr>
                <th className="text-left p-4 font-display uppercase tracking-wider text-xs text-plague-mist">
                  Email
                </th>
                <th className="text-left p-4 font-display uppercase tracking-wider text-xs text-plague-mist">
                  Name
                </th>
                <th className="text-left p-4 font-display uppercase tracking-wider text-xs text-plague-mist">
                  Orders
                </th>
                <th className="text-left p-4 font-display uppercase tracking-wider text-xs text-plague-mist">
                  Total Spent
                </th>
                <th className="text-left p-4 font-display uppercase tracking-wider text-xs text-plague-mist">
                  Last Order
                </th>
                <th className="text-left p-4 font-display uppercase tracking-wider text-xs text-plague-mist">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {customers.length === 0 ? (
                <tr>
                  <td colSpan="6" className="p-8 text-center text-plague-mist/60">
                    <Users className="w-12 h-12 mx-auto mb-2 opacity-50" />
                    No customers found
                  </td>
                </tr>
              ) : (
                customers.map((customer) => (
                  <tr key={customer.id} className="table-row">
                    <td className="p-4">
                      <button
                        onClick={() => viewCustomerDetails(customer.id)}
                        className="text-plague-green hover:underline font-mono text-sm"
                      >
                        {customer.email}
                      </button>
                    </td>
                    <td className="p-4 text-plague-bone text-sm">
                      {customer.name || 'N/A'}
                    </td>
                    <td className="p-4 text-plague-mist text-sm">
                      {customer.order_count || 0}
                    </td>
                    <td className="p-4 text-plague-green font-bold">
                      {formatPrice(customer.total_spent || 0)}
                    </td>
                    <td className="p-4 text-plague-mist text-sm">
                      {customer.last_order_date ? formatDate(customer.last_order_date) : 'Never'}
                    </td>
                    <td className="p-4">
                      <button
                        onClick={() => viewCustomerDetails(customer.id)}
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

      {/* Customer Details Modal */}
      {selectedCustomer && (
        <div className="fixed inset-0 bg-plague-black/80 flex items-center justify-center p-4 z-50">
          <div className="card p-6 max-w-3xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-display uppercase tracking-wider text-plague-green">
                Customer Details
              </h2>
              <button
                onClick={() => setSelectedCustomer(null)}
                className="text-plague-mist hover:text-plague-red-bright"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Customer Info */}
            <div className="space-y-6">
              {/* Basic Info */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-plague-mist/60 text-xs uppercase tracking-wider block mb-2">
                    Email
                  </label>
                  <div className="text-plague-bone">{selectedCustomer.email}</div>
                </div>
                <div>
                  <label className="text-plague-mist/60 text-xs uppercase tracking-wider block mb-2">
                    Name
                  </label>
                  <div className="text-plague-bone">{selectedCustomer.name || 'N/A'}</div>
                </div>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-4">
                <div className="card p-3 bg-plague-lighter/30">
                  <div className="text-plague-mist/60 text-xs uppercase tracking-wider mb-1">
                    Total Orders
                  </div>
                  <div className="text-2xl font-display text-plague-green">
                    {selectedCustomer.order_count || 0}
                  </div>
                </div>
                <div className="card p-3 bg-plague-lighter/30">
                  <div className="text-plague-mist/60 text-xs uppercase tracking-wider mb-1">
                    Total Spent
                  </div>
                  <div className="text-2xl font-display text-plague-green">
                    {formatPrice(selectedCustomer.total_spent || 0)}
                  </div>
                </div>
                <div className="card p-3 bg-plague-lighter/30">
                  <div className="text-plague-mist/60 text-xs uppercase tracking-wider mb-1">
                    Avg Order
                  </div>
                  <div className="text-2xl font-display text-plague-green">
                    {formatPrice(
                      selectedCustomer.order_count > 0
                        ? (selectedCustomer.total_spent || 0) / selectedCustomer.order_count
                        : 0
                    )}
                  </div>
                </div>
              </div>

              {/* Order History */}
              <div>
                <label className="text-plague-mist/60 text-xs uppercase tracking-wider block mb-3">
                  Order History
                </label>
                {selectedCustomer.orders && selectedCustomer.orders.length > 0 ? (
                  <div className="space-y-2">
                    {selectedCustomer.orders.map((order) => (
                      <div
                        key={order.id}
                        className="flex justify-between items-center p-3 bg-plague-lighter/50 hover:bg-plague-lighter/70"
                      >
                        <div className="flex-1">
                          <div className="text-plague-bone font-mono text-sm">
                            {order.order_number}
                          </div>
                          <div className="text-plague-mist/60 text-xs">
                            {formatDate(order.created_at)}
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <StatusBadge status={order.status} />
                          <div className="text-plague-green font-bold">
                            {formatPrice(order.total_amount)}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-plague-mist/60 text-sm text-center p-6 bg-plague-lighter/30">
                    No orders yet
                  </div>
                )}
              </div>

              {/* Shipping Addresses */}
              {selectedCustomer.addresses && selectedCustomer.addresses.length > 0 && (
                <div>
                  <label className="text-plague-mist/60 text-xs uppercase tracking-wider block mb-3">
                    Shipping Addresses Used
                  </label>
                  <div className="space-y-2">
                    {selectedCustomer.addresses.map((address, idx) => (
                      <div key={idx} className="p-3 bg-plague-lighter/50 text-plague-bone text-sm">
                        {address.name}<br />
                        {address.line1}<br />
                        {address.line2 && <>{address.line2}<br /></>}
                        {address.city}, {address.postal_code}<br />
                        {address.country}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
