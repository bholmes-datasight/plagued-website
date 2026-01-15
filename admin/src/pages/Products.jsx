import { useState, useEffect } from 'react'
import { productsAPI } from '../lib/api'
import { Loader, Package, AlertTriangle, ChevronDown, ChevronRight, X, Plus, Upload, Trash2 } from 'lucide-react'
import { formatPrice } from '../lib/formatters'

// Product configuration
const PRODUCT_TYPES = [
  'T-Shirt',
  'Longsleeve',
  'Hoodie',
  'Sweatshirt',
  'Cap',
  'Beanie'
]

const COLOURS = [
  'Black',
  'White',
  'Grey',
  'Red',
  'Blue',
  'Green',
  'Yellow',
  'Orange',
  'Purple',
  'Pink',
  'Brown',
  'Navy',
  'Camo',
  'Tie Dye'
]

// Size configurations by product type
const SIZE_CONFIGS = {
  'Cap': [{ size_name: 'One Size', stock_quantity: 0, price_adjustment: 0 }],
  'Beanie': [{ size_name: 'One Size', stock_quantity: 0, price_adjustment: 0 }],
  'default': [
    { size_name: 'S', stock_quantity: 0, price_adjustment: 0 },
    { size_name: 'M', stock_quantity: 0, price_adjustment: 0 },
    { size_name: 'L', stock_quantity: 0, price_adjustment: 0 },
    { size_name: 'XL', stock_quantity: 0, price_adjustment: 0 },
  ]
}

export default function Products() {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [expandedProducts, setExpandedProducts] = useState(new Set())
  const [selectedVariant, setSelectedVariant] = useState(null)
  const [stockForm, setStockForm] = useState({ quantity: '', reason: 'manual_adjustment', notes: '' })
  const [updating, setUpdating] = useState(false)

  // Delete product state
  const [productToDelete, setProductToDelete] = useState(null)
  const [deleting, setDeleting] = useState(false)
  const [deleteResult, setDeleteResult] = useState(null) // {action: 'deleted'|'deactivated', message: string}

  // Create product state
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [creating, setCreating] = useState(false)
  const [uploadingImage, setUploadingImage] = useState(false)
  const [createForm, setCreateForm] = useState({
    name: '',
    description: '',
    base_price: '',
    unit_cost: '',
    product_type: '',
    colour: '',
    image_url: '',
    is_active: false,
    sizes: [
      { size_name: 'S', stock_quantity: 0, price_adjustment: 0 },
      { size_name: 'M', stock_quantity: 0, price_adjustment: 0 },
      { size_name: 'L', stock_quantity: 0, price_adjustment: 0 },
      { size_name: 'XL', stock_quantity: 0, price_adjustment: 0 },
    ]
  })

  useEffect(() => {
    fetchProducts()
  }, [])

  const fetchProducts = async () => {
    try {
      setLoading(true)
      setError(null)
      const data = await productsAPI.list()
      setProducts(data)
    } catch (err) {
      console.error('Error fetching products:', err)
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const toggleProduct = (productId) => {
    const newExpanded = new Set(expandedProducts)
    if (newExpanded.has(productId)) {
      newExpanded.delete(productId)
    } else {
      newExpanded.add(productId)
    }
    setExpandedProducts(newExpanded)
  }

  const openStockModal = (product, variant) => {
    setSelectedVariant({ ...variant, productName: product.name })
    setStockForm({ quantity: variant.stock_quantity.toString(), reason: 'manual_adjustment', notes: '' })
  }

  const closeStockModal = () => {
    setSelectedVariant(null)
    setStockForm({ quantity: '', reason: 'manual_adjustment', notes: '' })
  }

  const handleStockUpdate = async (e) => {
    e.preventDefault()
    if (!selectedVariant) return

    try {
      setUpdating(true)
      await productsAPI.updateStock(
        selectedVariant.id,
        parseInt(stockForm.quantity, 10),
        stockForm.reason,
        stockForm.notes
      )
      await fetchProducts()
      closeStockModal()
    } catch (err) {
      console.error('Error updating stock:', err)
      alert(`Failed to update stock: ${err.message}`)
    } finally {
      setUpdating(false)
    }
  }

  const handleImageUpload = async (e) => {
    const file = e.target.files?.[0]
    if (!file) return

    try {
      setUploadingImage(true)
      const result = await productsAPI.uploadImage(file)
      setCreateForm({ ...createForm, image_url: result.image_url })
    } catch (err) {
      console.error('Error uploading image:', err)
      alert(`Failed to upload image: ${err.message}`)
    } finally {
      setUploadingImage(false)
    }
  }

  const handleProductTypeChange = (productType) => {
    // Get appropriate size configuration based on product type
    const sizes = SIZE_CONFIGS[productType] || SIZE_CONFIGS['default']
    setCreateForm({ ...createForm, product_type: productType, sizes })
  }

  const handleCreateProduct = async (e) => {
    e.preventDefault()

    try {
      setCreating(true)

      // Convert base_price and unit_cost from pounds to pence
      const base_price_pence = Math.round(parseFloat(createForm.base_price) * 100)
      const unit_cost_pence = Math.round(parseFloat(createForm.unit_cost || 0) * 100)

      const productData = {
        name: createForm.name,
        description: createForm.description,
        base_price: base_price_pence,
        unit_cost: unit_cost_pence,
        product_type: createForm.product_type,
        colour: createForm.colour,
        image_url: createForm.image_url,
        is_active: false,
        sizes: createForm.sizes.map(size => ({
          ...size,
          stock_quantity: parseInt(size.stock_quantity, 10) || 0,
          price_adjustment: parseInt(size.price_adjustment, 10) || 0,
        }))
      }

      await productsAPI.create(productData)
      await fetchProducts()

      // Reset form and close modal
      setCreateForm({
        name: '',
        description: '',
        base_price: '',
        unit_cost: '',
        product_type: '',
        colour: '',
        image_url: '',
        is_active: false,
        sizes: [
          { size_name: 'S', stock_quantity: 0, price_adjustment: 0 },
          { size_name: 'M', stock_quantity: 0, price_adjustment: 0 },
          { size_name: 'L', stock_quantity: 0, price_adjustment: 0 },
          { size_name: 'XL', stock_quantity: 0, price_adjustment: 0 },
        ]
      })
      setShowCreateModal(false)
    } catch (err) {
      console.error('Error creating product:', err)
      alert(`Failed to create product: ${err.message}`)
    } finally {
      setCreating(false)
    }
  }

  const updateSizeField = (index, field, value) => {
    const newSizes = [...createForm.sizes]
    newSizes[index] = { ...newSizes[index], [field]: value }
    setCreateForm({ ...createForm, sizes: newSizes })
  }

  const openDeleteModal = (product, e) => {
    e.stopPropagation() // Prevent product expansion
    setProductToDelete(product)
  }

  const closeDeleteModal = () => {
    setProductToDelete(null)
  }

  const handleDeleteProduct = async () => {
    if (!productToDelete) return

    try {
      setDeleting(true)
      const response = await productsAPI.delete(productToDelete.id)
      await fetchProducts()
      closeDeleteModal()

      // Show result modal with action and message
      setDeleteResult({
        action: response.action,
        message: response.message
      })
    } catch (err) {
      console.error('Error deleting product:', err)
      setDeleteResult({
        action: 'error',
        message: `Failed to delete product: ${err.message}`
      })
    } finally {
      setDeleting(false)
    }
  }

  const getLowStockCount = () => {
    let count = 0
    products.forEach(product => {
      product.product_variants?.forEach(variant => {
        if (variant.stock_quantity < 5) count++
      })
    })
    return count
  }

  if (loading && products.length === 0) {
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
          Products &amp; Stock
        </h1>
        <div className="flex items-center gap-4">
          {getLowStockCount() > 0 && (
            <div className="flex items-center gap-2 text-plague-red-bright">
              <AlertTriangle className="w-5 h-5" />
              <span className="text-sm font-display uppercase">
                {getLowStockCount()} low stock alert{getLowStockCount() !== 1 ? 's' : ''}
              </span>
            </div>
          )}
          <button
            onClick={() => setShowCreateModal(true)}
            className="btn-primary flex items-center gap-2 px-4 py-2"
          >
            <Plus className="w-4 h-4" />
            Create Product
          </button>
        </div>
      </div>

      {/* Error */}
      {error && (
        <div className="card p-4 mb-6 bg-plague-red/20 border-plague-red text-plague-red-bright">
          {error}
        </div>
      )}

      {/* Products List */}
      {products.length === 0 ? (
        <div className="card p-8 text-center text-plague-mist/60">
          <Package className="w-12 h-12 mx-auto mb-2 opacity-50" />
          No products found
        </div>
      ) : (
        <div className="space-y-8">
          {/* Active Products */}
          {products.filter(p => p.is_active).length > 0 && (
            <div>
              <h2 className="text-xl font-display uppercase tracking-wider text-plague-green mb-4 flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-plague-green animate-pulse"></div>
                Active Products ({products.filter(p => p.is_active).length})
              </h2>
              <div className="space-y-4">
                {products.filter(p => p.is_active).map((product) => (
            <div key={product.id} className="card overflow-hidden">
              {/* Product Header */}
              <div className="flex items-center">
                <button
                  onClick={() => toggleProduct(product.id)}
                  className="flex-1 p-4 flex items-center justify-between hover:bg-plague-lighter/30 transition-colors"
                >
                  <div className="flex items-center gap-4">
                    {expandedProducts.has(product.id) ? (
                      <ChevronDown className="w-5 h-5 text-plague-green" />
                    ) : (
                      <ChevronRight className="w-5 h-5 text-plague-mist" />
                    )}
                    <div className="text-left">
                      <h3 className="text-lg font-display uppercase text-plague-bone">
                        {product.name}
                      </h3>
                      <p className="text-sm text-plague-mist/60">
                        {product.product_variants?.length || 0} size{product.product_variants?.length !== 1 ? 's' : ''}
                      </p>
                    </div>
                  </div>
                  <div className="text-sm text-plague-mist">
                    Total Stock: {product.product_variants?.reduce((sum, v) => sum + v.stock_quantity, 0) || 0}
                  </div>
                </button>
                <button
                  onClick={(e) => openDeleteModal(product, e)}
                  className="p-4 text-plague-red-bright hover:bg-plague-red/20 transition-colors"
                  title="Delete product"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>

              {/* Variants Table (Expanded) */}
              {expandedProducts.has(product.id) && (
                <div className="border-t border-plague-lighter">
                  <table className="w-full">
                    <thead className="bg-plague-lighter/50">
                      <tr>
                        <th className="text-left p-3 font-display uppercase tracking-wider text-xs text-plague-mist">
                          Size
                        </th>
                        <th className="text-left p-3 font-display uppercase tracking-wider text-xs text-plague-mist">
                          SKU
                        </th>
                        <th className="text-left p-3 font-display uppercase tracking-wider text-xs text-plague-mist">
                          Stock
                        </th>
                        <th className="text-left p-3 font-display uppercase tracking-wider text-xs text-plague-mist">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {product.product_variants?.map((variant) => (
                        <tr key={variant.id} className="border-t border-plague-lighter/30">
                          <td className="p-3 text-plague-bone uppercase font-mono text-sm">
                            {variant.size}
                          </td>
                          <td className="p-3 text-plague-mist/60 font-mono text-xs">
                            {variant.sku}
                          </td>
                          <td className="p-3">
                            <div className="flex items-center gap-2">
                              <span className={`font-bold ${variant.stock_quantity < 5 ? 'text-plague-red-bright' : 'text-plague-green'}`}>
                                {variant.stock_quantity}
                              </span>
                              {variant.stock_quantity < 5 && (
                                <AlertTriangle className="w-4 h-4 text-plague-red-bright" />
                              )}
                            </div>
                          </td>
                          <td className="p-3">
                            <button
                              onClick={() => openStockModal(product, variant)}
                              className="text-plague-green hover:text-plague-green-dark text-sm uppercase tracking-wider"
                            >
                              Adjust Stock
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
                ))}
              </div>
            </div>
          )}

          {/* Inactive Products */}
          {products.filter(p => !p.is_active).length > 0 && (
            <div>
              <h2 className="text-xl font-display uppercase tracking-wider text-plague-mist/40 mb-4 flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-plague-mist/40"></div>
                Inactive Products ({products.filter(p => !p.is_active).length})
              </h2>
              <div className="space-y-4 opacity-60">
                {products.filter(p => !p.is_active).map((product) => (
            <div key={product.id} className="card overflow-hidden border-plague-mist/20">
              {/* Product Header */}
              <div className="flex items-center">
                <button
                  onClick={() => toggleProduct(product.id)}
                  className="flex-1 p-4 flex items-center justify-between hover:bg-plague-lighter/30 transition-colors"
                >
                  <div className="flex items-center gap-4">
                    {expandedProducts.has(product.id) ? (
                      <ChevronDown className="w-5 h-5 text-plague-green" />
                    ) : (
                      <ChevronRight className="w-5 h-5 text-plague-mist" />
                    )}
                    <div className="text-left">
                      <h3 className="text-lg font-display uppercase text-plague-bone">
                        {product.name}
                      </h3>
                      <p className="text-sm text-plague-mist/60">
                        {product.product_variants?.length || 0} size{product.product_variants?.length !== 1 ? 's' : ''}
                      </p>
                    </div>
                  </div>
                  <div className="text-sm text-plague-mist">
                    Total Stock: {product.product_variants?.reduce((sum, v) => sum + v.stock_quantity, 0) || 0}
                  </div>
                </button>
                <button
                  onClick={(e) => openDeleteModal(product, e)}
                  className="p-4 text-plague-red-bright hover:bg-plague-red/20 transition-colors"
                  title="Delete product"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>

              {/* Variants Table (Expanded) */}
              {expandedProducts.has(product.id) && (
                <div className="border-t border-plague-lighter">
                  <table className="w-full">
                    <thead className="bg-plague-lighter/50">
                      <tr>
                        <th className="text-left p-3 font-display uppercase tracking-wider text-xs text-plague-mist">
                          Size
                        </th>
                        <th className="text-left p-3 font-display uppercase tracking-wider text-xs text-plague-mist">
                          SKU
                        </th>
                        <th className="text-left p-3 font-display uppercase tracking-wider text-xs text-plague-mist">
                          Stock
                        </th>
                        <th className="text-left p-3 font-display uppercase tracking-wider text-xs text-plague-mist">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {product.product_variants?.map((variant) => (
                        <tr key={variant.id} className="border-t border-plague-lighter/30">
                          <td className="p-3 text-plague-bone uppercase font-mono text-sm">
                            {variant.size}
                          </td>
                          <td className="p-3 text-plague-mist/60 font-mono text-xs">
                            {variant.sku}
                          </td>
                          <td className="p-3">
                            <div className="flex items-center gap-2">
                              <span className={`font-bold ${variant.stock_quantity < 5 ? 'text-plague-red-bright' : 'text-plague-green'}`}>
                                {variant.stock_quantity}
                              </span>
                              {variant.stock_quantity < 5 && (
                                <AlertTriangle className="w-4 h-4 text-plague-red-bright" />
                              )}
                            </div>
                          </td>
                          <td className="p-3">
                            <button
                              onClick={() => openStockModal(product, variant)}
                              className="text-plague-green hover:text-plague-green-dark text-sm uppercase tracking-wider"
                            >
                              Adjust Stock
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Stock Adjustment Modal */}
      {selectedVariant && (
        <div className="fixed inset-0 bg-plague-black/80 flex items-center justify-center p-4 z-50">
          <div className="card p-6 max-w-md w-full">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-display uppercase tracking-wider text-plague-green">
                Adjust Stock
              </h2>
              <button
                onClick={closeStockModal}
                className="text-plague-mist hover:text-plague-red-bright"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <form onSubmit={handleStockUpdate} className="space-y-4">
              {/* Product Info */}
              <div>
                <div className="text-plague-bone font-display uppercase">
                  {selectedVariant.productName}
                </div>
                <div className="text-plague-mist/60 text-sm">
                  Size: {selectedVariant.size} | SKU: {selectedVariant.sku}
                </div>
              </div>

              {/* Current Stock */}
              <div>
                <label className="text-plague-mist/60 text-xs uppercase tracking-wider block mb-2">
                  Current Stock
                </label>
                <div className="text-plague-green font-bold text-2xl">
                  {selectedVariant.stock_quantity}
                </div>
              </div>

              {/* New Stock */}
              <div>
                <label className="text-plague-mist/60 text-xs uppercase tracking-wider block mb-2">
                  New Stock <span className="text-plague-red-bright">*</span>
                </label>
                <input
                  type="number"
                  min="0"
                  value={stockForm.quantity}
                  onChange={(e) => setStockForm({ ...stockForm, quantity: e.target.value })}
                  required
                  className="input-field w-full"
                  placeholder="Enter new stock quantity"
                />
              </div>

              {/* Reason */}
              <div>
                <label className="text-plague-mist/60 text-xs uppercase tracking-wider block mb-2">
                  Reason <span className="text-plague-red-bright">*</span>
                </label>
                <select
                  value={stockForm.reason}
                  onChange={(e) => setStockForm({ ...stockForm, reason: e.target.value })}
                  required
                  className="input-field w-full"
                >
                  <option value="manual_adjustment">Manual Adjustment</option>
                  <option value="restock">Restock</option>
                  <option value="correction">Inventory Correction</option>
                  <option value="damaged">Damaged Goods</option>
                  <option value="returned">Customer Return</option>
                  <option value="lost">Lost/Stolen</option>
                </select>
              </div>

              {/* Notes */}
              <div>
                <label className="text-plague-mist/60 text-xs uppercase tracking-wider block mb-2">
                  Notes (Optional)
                </label>
                <textarea
                  value={stockForm.notes}
                  onChange={(e) => setStockForm({ ...stockForm, notes: e.target.value })}
                  rows="3"
                  className="input-field w-full resize-none"
                  placeholder="Add any additional notes..."
                />
              </div>

              {/* Change Preview */}
              <div className="border border-plague-lighter p-3 bg-plague-lighter/20">
                <div className="text-plague-mist/60 text-xs uppercase tracking-wider mb-1">
                  Change Preview
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-plague-bone">
                    {selectedVariant.stock_quantity} → {stockForm.quantity || '?'}
                  </span>
                  <span className={`font-bold ${
                    parseInt(stockForm.quantity || 0) > selectedVariant.stock_quantity
                      ? 'text-plague-green'
                      : parseInt(stockForm.quantity || 0) < selectedVariant.stock_quantity
                      ? 'text-plague-red-bright'
                      : 'text-plague-mist'
                  }`}>
                    {stockForm.quantity && parseInt(stockForm.quantity) !== selectedVariant.stock_quantity
                      ? `${parseInt(stockForm.quantity) > selectedVariant.stock_quantity ? '+' : ''}${parseInt(stockForm.quantity) - selectedVariant.stock_quantity}`
                      : '0'}
                  </span>
                </div>
              </div>

              {/* Buttons */}
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={closeStockModal}
                  disabled={updating}
                  className="btn-secondary flex-1"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={updating || !stockForm.quantity}
                  className="btn-primary flex-1 flex items-center justify-center gap-2"
                >
                  {updating && <Loader className="w-4 h-4 animate-spin" />}
                  Update Stock
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Create Product Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-plague-black/80 flex items-center justify-center p-4 z-50 overflow-y-auto">
          <div className="card p-6 max-w-3xl w-full my-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-display uppercase tracking-wider text-plague-green">
                Create New Product
              </h2>
              <button
                onClick={() => setShowCreateModal(false)}
                className="text-plague-mist hover:text-plague-red-bright"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <form onSubmit={handleCreateProduct} className="space-y-6">
              {/* Product Name */}
              <div>
                <label className="text-plague-mist/60 text-xs uppercase tracking-wider block mb-2">
                  Product Name <span className="text-plague-red-bright">*</span>
                </label>
                <input
                  type="text"
                  value={createForm.name}
                  onChange={(e) => setCreateForm({ ...createForm, name: e.target.value })}
                  required
                  className="input-field w-full"
                  placeholder="e.g., Plagued T-Shirt"
                />
              </div>

              {/* Description */}
              <div>
                <label className="text-plague-mist/60 text-xs uppercase tracking-wider block mb-2">
                  Description <span className="text-plague-red-bright">*</span>
                </label>
                <textarea
                  value={createForm.description}
                  onChange={(e) => setCreateForm({ ...createForm, description: e.target.value })}
                  required
                  rows="3"
                  className="input-field w-full resize-none"
                  placeholder="Product description..."
                />
              </div>

              {/* Pricing */}
              <div className="grid grid-cols-2 gap-4">
                {/* Base Price */}
                <div>
                  <label className="text-plague-mist/60 text-xs uppercase tracking-wider block mb-2">
                    Base Price (£) <span className="text-plague-red-bright">*</span>
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    value={createForm.base_price}
                    onChange={(e) => setCreateForm({ ...createForm, base_price: e.target.value })}
                    required
                    className="input-field w-full"
                    placeholder="25.00"
                  />
                </div>

                {/* Unit Cost */}
                <div>
                  <label className="text-plague-mist/60 text-xs uppercase tracking-wider block mb-2">
                    Unit Cost (£)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    value={createForm.unit_cost}
                    onChange={(e) => setCreateForm({ ...createForm, unit_cost: e.target.value })}
                    className="input-field w-full"
                    placeholder="10.00"
                  />
                  <p className="text-plague-mist/40 text-xs mt-1">
                    Cost to produce (for profit tracking)
                  </p>
                </div>
              </div>

              {/* Product Type & Colour */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-plague-mist/60 text-xs uppercase tracking-wider block mb-2">
                    Product Type <span className="text-plague-red-bright">*</span>
                  </label>
                  <select
                    value={createForm.product_type}
                    onChange={(e) => handleProductTypeChange(e.target.value)}
                    required
                    className="input-field w-full"
                  >
                    <option value="">Select product type...</option>
                    {PRODUCT_TYPES.map(type => (
                      <option key={type} value={type}>{type}</option>
                    ))}
                  </select>
                  <p className="text-plague-mist/40 text-xs mt-1">
                    Sizes will update based on type
                  </p>
                </div>
                <div>
                  <label className="text-plague-mist/60 text-xs uppercase tracking-wider block mb-2">
                    Colour <span className="text-plague-red-bright">*</span>
                  </label>
                  <select
                    value={createForm.colour}
                    onChange={(e) => setCreateForm({ ...createForm, colour: e.target.value })}
                    required
                    className="input-field w-full"
                  >
                    <option value="">Select colour...</option>
                    {COLOURS.map(colour => (
                      <option key={colour} value={colour}>{colour}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Image Upload */}
              <div>
                <label className="text-plague-mist/60 text-xs uppercase tracking-wider block mb-2">
                  Product Image
                </label>
                <div className="flex items-center gap-4">
                  <label className="btn-secondary cursor-pointer flex items-center gap-2 px-4 py-2">
                    <Upload className="w-4 h-4" />
                    {uploadingImage ? 'Uploading...' : 'Upload Image'}
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      disabled={uploadingImage}
                      className="hidden"
                    />
                  </label>
                  {createForm.image_url && (
                    <div className="flex items-center gap-2">
                      <img
                        src={createForm.image_url}
                        alt="Preview"
                        className="w-16 h-16 object-cover border border-plague-green"
                      />
                      <span className="text-plague-green text-sm">Image uploaded</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Sizes */}
              <div>
                <label className="text-plague-mist/60 text-xs uppercase tracking-wider block mb-3">
                  Sizes & Stock <span className="text-plague-red-bright">*</span>
                </label>
                <div className="space-y-3">
                  {createForm.sizes.map((size, index) => (
                    <div key={index} className="grid grid-cols-3 gap-3 p-3 bg-plague-lighter/30">
                      <div>
                        <label className="text-plague-mist/60 text-xs block mb-1">Size</label>
                        <input
                          type="text"
                          value={size.size_name}
                          readOnly
                          className="input-field w-full bg-plague-lighter/50"
                        />
                      </div>
                      <div>
                        <label className="text-plague-mist/60 text-xs block mb-1">Initial Stock</label>
                        <input
                          type="number"
                          min="0"
                          value={size.stock_quantity}
                          onChange={(e) => updateSizeField(index, 'stock_quantity', e.target.value)}
                          className="input-field w-full"
                        />
                      </div>
                      <div>
                        <label className="text-plague-mist/60 text-xs block mb-1">Price Adj (£)</label>
                        <input
                          type="number"
                          step="0.01"
                          value={size.price_adjustment / 100}
                          onChange={(e) => updateSizeField(index, 'price_adjustment', Math.round(parseFloat(e.target.value || 0) * 100))}
                          className="input-field w-full"
                          placeholder="0.00"
                        />
                      </div>
                    </div>
                  ))}
                </div>
                <p className="text-plague-mist/40 text-xs mt-2">SKU will be auto-generated as: PLAGUED-{'{TYPE}'}-{'{COLOUR}'}-{'{SIZE}'}</p>
                <p className="text-plague-mist/40 text-xs mt-2">
                  Price adjustment is added to the base price for each size (e.g., +£2 for XL)
                </p>
              </div>

              {/* Buttons */}
              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  disabled={creating}
                  className="btn-secondary flex-1"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={creating || uploadingImage}
                  className="btn-primary flex-1 flex items-center justify-center gap-2"
                >
                  {creating && <Loader className="w-4 h-4 animate-spin" />}
                  Create Product
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Product Confirmation Modal */}
      {productToDelete && (
        <div className="fixed inset-0 bg-plague-black/80 flex items-center justify-center p-4 z-50">
          <div className="card p-6 max-w-md w-full border-plague-red">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-display uppercase tracking-wider text-plague-red-bright">
                Delete Product
              </h2>
              <button
                onClick={closeDeleteModal}
                className="text-plague-mist hover:text-plague-red-bright"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="space-y-4">
              {/* Warning */}
              <div className="flex items-start gap-3 p-4 bg-plague-red/20 border border-plague-red-bright rounded">
                <AlertTriangle className="w-6 h-6 text-plague-red-bright flex-shrink-0 mt-0.5" />
                <div className="text-plague-bone text-sm">
                  <p className="font-bold mb-1">This action cannot be undone.</p>
                  <p>This will permanently delete the product and all its variants.</p>
                </div>
              </div>

              {/* Product Info */}
              <div className="p-4 bg-plague-lighter/30 rounded">
                <div className="text-plague-bone font-display uppercase mb-2">
                  {productToDelete.name}
                </div>
                <div className="text-plague-mist/60 text-sm space-y-1">
                  <div>Type: {productToDelete.product_type}</div>
                  <div>Colour: {productToDelete.colour}</div>
                  <div>Variants: {productToDelete.product_variants?.length || 0}</div>
                  {productToDelete.is_active && (
                    <div className="text-plague-red-bright font-bold mt-2">
                      ⚠ This product is currently ACTIVE on the website
                    </div>
                  )}
                </div>
              </div>

              {/* Confirmation */}
              <div className="text-plague-mist/60 text-sm">
                Are you sure you want to delete this product?
              </div>

              {/* Buttons */}
              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={closeDeleteModal}
                  disabled={deleting}
                  className="btn-secondary flex-1"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleDeleteProduct}
                  disabled={deleting}
                  className="flex-1 px-4 py-2 bg-plague-red hover:bg-plague-red-bright text-plague-bone font-display uppercase tracking-wider transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {deleting && <Loader className="w-4 h-4 animate-spin" />}
                  Delete Product
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Delete Result Modal */}
      {deleteResult && (
        <div className="fixed inset-0 bg-plague-black/80 flex items-center justify-center p-4 z-50">
          <div className="card p-6 max-w-md w-full">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-display uppercase tracking-wider text-plague-green">
                {deleteResult.action === 'deleted' ? 'Product Deleted' :
                 deleteResult.action === 'deactivated' ? 'Product Deactivated' :
                 'Error'}
              </h2>
              <button
                onClick={() => setDeleteResult(null)}
                className="text-plague-mist hover:text-plague-red-bright"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className={`p-4 rounded border ${
              deleteResult.action === 'error'
                ? 'bg-plague-red/20 border-plague-red text-plague-red-bright'
                : deleteResult.action === 'deactivated'
                ? 'bg-plague-mist/10 border-plague-mist/30 text-plague-bone'
                : 'bg-plague-green/20 border-plague-green text-plague-green'
            }`}>
              <p className="text-sm">{deleteResult.message}</p>
            </div>

            <div className="mt-6">
              <button
                onClick={() => setDeleteResult(null)}
                className="btn-primary w-full"
              >
                OK
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
