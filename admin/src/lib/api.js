/**
 * Admin API client with authentication
 */
import { supabase } from './supabase'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || ''

/**
 * Make authenticated API request
 */
async function apiRequest(endpoint, options = {}) {
  // Get access token from Supabase session
  const { data: { session } } = await supabase.auth.getSession()

  if (!session?.access_token) {
    throw new Error('Not authenticated')
  }

  const url = `${API_BASE_URL}${endpoint}`

  const response = await fetch(url, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${session.access_token}`,
      ...options.headers,
    },
  })

  if (!response.ok) {
    const error = await response.json().catch(() => ({ detail: 'Request failed' }))
    throw new Error(error.detail || `HTTP ${response.status}`)
  }

  return response.json()
}

// Orders API
export const ordersAPI = {
  list: (params = {}) => {
    const query = new URLSearchParams(params).toString()
    return apiRequest(`/api/admin/orders${query ? `?${query}` : ''}`)
  },

  get: (orderId) => apiRequest(`/api/admin/orders/${orderId}`),

  updateStatus: (orderId, status) =>
    apiRequest(`/api/admin/orders/${orderId}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status }),
    }),
}

// Products API
export const productsAPI = {
  list: () => apiRequest('/api/admin/products'),

  create: (productData) =>
    apiRequest('/api/admin/products', {
      method: 'POST',
      body: JSON.stringify(productData),
    }),

  delete: (productId) =>
    apiRequest(`/api/admin/products/${productId}`, {
      method: 'DELETE',
    }),

  uploadImage: async (file) => {
    // Get access token from Supabase session
    const { data: { session } } = await supabase.auth.getSession()

    if (!session?.access_token) {
      throw new Error('Not authenticated')
    }

    const formData = new FormData()
    formData.append('file', file)

    const url = `${API_BASE_URL}/api/admin/products/upload-image`

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${session.access_token}`,
      },
      body: formData,
    })

    if (!response.ok) {
      const error = await response.json().catch(() => ({ detail: 'Upload failed' }))
      throw new Error(error.detail || `HTTP ${response.status}`)
    }

    return response.json()
  },

  updateStock: (variantId, stockQuantity, reason = 'manual_adjustment', notes = '') =>
    apiRequest(`/api/admin/products/variants/${variantId}/stock`, {
      method: 'PATCH',
      body: JSON.stringify({ stock_quantity: stockQuantity, reason, notes }),
    }),
}

// Customers API
export const customersAPI = {
  list: (params = {}) => {
    const query = new URLSearchParams(params).toString()
    return apiRequest(`/api/admin/customers${query ? `?${query}` : ''}`)
  },

  get: (customerId) => apiRequest(`/api/admin/customers/${customerId}`),
}

// Analytics API
export const analyticsAPI = {
  overview: () => apiRequest('/api/admin/analytics/overview'),
  dashboardStats: () => apiRequest('/api/admin/dashboard/stats'),
  sizeDistribution: () => apiRequest('/api/admin/analytics/size-distribution'),
}

// Collections API
export const collectionsAPI = {
  list: () => apiRequest('/api/admin/collections'),

  get: (collectionId) => apiRequest(`/api/admin/collections/${collectionId}`),

  create: (data) =>
    apiRequest('/api/admin/collections', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  update: (collectionId, data) =>
    apiRequest(`/api/admin/collections/${collectionId}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    }),

  delete: (collectionId) =>
    apiRequest(`/api/admin/collections/${collectionId}`, {
      method: 'DELETE',
    }),

  addProducts: (collectionId, productIds) =>
    apiRequest(`/api/admin/collections/${collectionId}/products`, {
      method: 'POST',
      body: JSON.stringify({ product_ids: productIds }),
    }),

  removeProduct: (collectionId, productId) =>
    apiRequest(`/api/admin/collections/${collectionId}/products/${productId}`, {
      method: 'DELETE',
    }),

  drop: (collectionId) =>
    apiRequest(`/api/admin/collections/${collectionId}/drop`, {
      method: 'POST',
    }),

  undrop: (collectionId) =>
    apiRequest(`/api/admin/collections/${collectionId}/undrop`, {
      method: 'POST',
    }),
}
