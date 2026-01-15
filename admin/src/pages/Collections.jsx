import { useState, useEffect } from 'react'
import { collectionsAPI, productsAPI } from '../lib/api'
import { Loader, Plus, X, Package, Trash2, Zap, ZapOff, Eye, Edit2, AlertTriangle } from 'lucide-react'
import { formatPrice } from '../lib/formatters'

export default function Collections() {
  const [collections, setCollections] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  // Create collection modal
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [creating, setCreating] = useState(false)
  const [createForm, setCreateForm] = useState({ name: '', description: '' })

  // View/Edit collection modal
  const [selectedCollection, setSelectedCollection] = useState(null)
  const [collectionDetails, setCollectionDetails] = useState(null)
  const [loadingDetails, setLoadingDetails] = useState(false)

  // Add products modal
  const [showAddProducts, setShowAddProducts] = useState(false)
  const [allProducts, setAllProducts] = useState([])
  const [selectedProducts, setSelectedProducts] = useState([])
  const [loadingProducts, setLoadingProducts] = useState(false)
  const [addingProducts, setAddingProducts] = useState(false)

  // Delete confirmation
  const [collectionToDelete, setCollectionToDelete] = useState(null)
  const [deleting, setDeleting] = useState(false)

  // Drop/Undrop
  const [dropping, setDropping] = useState(false)

  useEffect(() => {
    fetchCollections()
  }, [])

  const fetchCollections = async () => {
    try {
      setLoading(true)
      setError(null)
      const data = await collectionsAPI.list()
      setCollections(data)
    } catch (err) {
      console.error('Error fetching collections:', err)
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleCreateCollection = async (e) => {
    e.preventDefault()
    try {
      setCreating(true)
      await collectionsAPI.create(createForm)
      await fetchCollections()
      setCreateForm({ name: '', description: '' })
      setShowCreateModal(false)
    } catch (err) {
      console.error('Error creating collection:', err)
      alert(`Failed to create collection: ${err.message}`)
    } finally {
      setCreating(false)
    }
  }

  const openCollectionDetails = async (collection) => {
    try {
      setSelectedCollection(collection)
      setLoadingDetails(true)
      const details = await collectionsAPI.get(collection.id)
      setCollectionDetails(details)
    } catch (err) {
      console.error('Error fetching collection details:', err)
      alert(`Failed to load collection: ${err.message}`)
    } finally {
      setLoadingDetails(false)
    }
  }

  const closeCollectionDetails = () => {
    setSelectedCollection(null)
    setCollectionDetails(null)
  }

  const openAddProductsModal = async () => {
    try {
      setShowAddProducts(true)
      setLoadingProducts(true)
      const products = await productsAPI.list()
      // Filter out products already in the collection
      const existingProductIds = new Set(collectionDetails.products.map(p => p.id))
      const availableProducts = products.filter(p => !existingProductIds.has(p.id))
      setAllProducts(availableProducts)
    } catch (err) {
      console.error('Error fetching products:', err)
      alert(`Failed to load products: ${err.message}`)
    } finally {
      setLoadingProducts(false)
    }
  }

  const closeAddProductsModal = () => {
    setShowAddProducts(false)
    setSelectedProducts([])
    setAllProducts([])
  }

  const toggleProductSelection = (productId) => {
    setSelectedProducts(prev =>
      prev.includes(productId)
        ? prev.filter(id => id !== productId)
        : [...prev, productId]
    )
  }

  const handleAddProducts = async () => {
    if (selectedProducts.length === 0) return

    try {
      setAddingProducts(true)
      await collectionsAPI.addProducts(selectedCollection.id, selectedProducts)
      // Refresh collection details
      const details = await collectionsAPI.get(selectedCollection.id)
      setCollectionDetails(details)
      await fetchCollections()
      closeAddProductsModal()
    } catch (err) {
      console.error('Error adding products:', err)
      alert(`Failed to add products: ${err.message}`)
    } finally {
      setAddingProducts(false)
    }
  }

  const handleRemoveProduct = async (productId) => {
    if (!confirm('Remove this product from the collection?')) return

    try {
      await collectionsAPI.removeProduct(selectedCollection.id, productId)
      // Refresh collection details
      const details = await collectionsAPI.get(selectedCollection.id)
      setCollectionDetails(details)
      await fetchCollections()
    } catch (err) {
      console.error('Error removing product:', err)
      alert(`Failed to remove product: ${err.message}`)
    }
  }

  const handleDropCollection = async () => {
    try {
      setDropping(true)
      await collectionsAPI.drop(selectedCollection.id)
      // Refresh both lists
      await fetchCollections()
      const details = await collectionsAPI.get(selectedCollection.id)
      setCollectionDetails(details)
    } catch (err) {
      console.error('Error dropping collection:', err)
      alert(`Failed to drop collection: ${err.message}`)
    } finally {
      setDropping(false)
    }
  }

  const handleUndropCollection = async () => {
    try {
      setDropping(true)
      await collectionsAPI.undrop(selectedCollection.id)
      // Refresh both lists
      await fetchCollections()
      const details = await collectionsAPI.get(selectedCollection.id)
      setCollectionDetails(details)
    } catch (err) {
      console.error('Error undropping collection:', err)
      alert(`Failed to undrop collection: ${err.message}`)
    } finally {
      setDropping(false)
    }
  }

  const openDeleteModal = (collection, e) => {
    e.stopPropagation()
    setCollectionToDelete(collection)
  }

  const closeDeleteModal = () => {
    setCollectionToDelete(null)
  }

  const handleDeleteCollection = async () => {
    if (!collectionToDelete) return

    try {
      setDeleting(true)
      await collectionsAPI.delete(collectionToDelete.id)
      await fetchCollections()
      closeDeleteModal()
    } catch (err) {
      console.error('Error deleting collection:', err)
      alert(`Failed to delete collection: ${err.message}`)
    } finally {
      setDeleting(false)
    }
  }

  if (loading && collections.length === 0) {
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
          Collections
        </h1>
        <button
          onClick={() => setShowCreateModal(true)}
          className="btn-primary flex items-center gap-2 px-4 py-2"
        >
          <Plus className="w-4 h-4" />
          New Collection
        </button>
      </div>

      {error && (
        <div className="card p-4 mb-6 bg-plague-red/20 border-plague-red text-plague-red-bright">
          {error}
        </div>
      )}

      {/* Collections List */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {collections.length === 0 ? (
          <div className="col-span-full card p-8 text-center text-plague-mist/60">
            <Package className="w-12 h-12 mx-auto mb-2 opacity-50" />
            No collections yet. Create your first collection to start grouping products for drops.
          </div>
        ) : (
          collections.map((collection) => (
            <div
              key={collection.id}
              className="card p-6 hover:border-plague-green/50 transition-colors cursor-pointer group relative"
              onClick={() => openCollectionDetails(collection)}
            >
              {/* Delete button */}
              <button
                onClick={(e) => openDeleteModal(collection, e)}
                className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity p-2 hover:bg-plague-red/20 rounded"
              >
                <Trash2 className="w-4 h-4 text-plague-red-bright" />
              </button>

              <div className="flex items-start justify-between mb-4">
                <div className="flex-1 pr-8">
                  <h3 className="font-display text-lg uppercase tracking-wider text-plague-bone mb-1">
                    {collection.name}
                  </h3>
                  {collection.description && (
                    <p className="text-plague-mist/60 text-sm line-clamp-2">
                      {collection.description}
                    </p>
                  )}
                </div>
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-plague-lighter/30">
                <div className="text-plague-mist/60 text-sm">
                  {collection.product_count} product{collection.product_count !== 1 ? 's' : ''}
                </div>
                {collection.is_dropped ? (
                  <div className="flex items-center gap-1 text-plague-green text-xs uppercase">
                    <Zap className="w-3 h-3" />
                    Dropped
                  </div>
                ) : (
                  <div className="text-plague-mist/40 text-xs uppercase">
                    Not Dropped
                  </div>
                )}
              </div>
            </div>
          ))
        )}
      </div>

      {/* Create Collection Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-plague-black/80 flex items-center justify-center p-4 z-50">
          <div className="card p-6 max-w-md w-full">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-display uppercase tracking-wider text-plague-green">
                New Collection
              </h2>
              <button
                onClick={() => setShowCreateModal(false)}
                className="text-plague-mist hover:text-plague-red-bright"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <form onSubmit={handleCreateCollection} className="space-y-4">
              <div>
                <label className="text-plague-mist/60 text-xs uppercase tracking-wider block mb-2">
                  Name <span className="text-plague-red-bright">*</span>
                </label>
                <input
                  type="text"
                  value={createForm.name}
                  onChange={(e) => setCreateForm({ ...createForm, name: e.target.value })}
                  required
                  className="input-field w-full"
                  placeholder="e.g., Summer 2026 Drop"
                />
              </div>

              <div>
                <label className="text-plague-mist/60 text-xs uppercase tracking-wider block mb-2">
                  Description (Optional)
                </label>
                <textarea
                  value={createForm.description}
                  onChange={(e) => setCreateForm({ ...createForm, description: e.target.value })}
                  rows="3"
                  className="input-field w-full resize-none"
                  placeholder="Describe this collection..."
                />
              </div>

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
                  disabled={creating}
                  className="btn-primary flex-1 flex items-center justify-center gap-2"
                >
                  {creating && <Loader className="w-4 h-4 animate-spin" />}
                  Create
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Collection Details Modal */}
      {selectedCollection && (
        <div className="fixed inset-0 bg-plague-black/80 flex items-center justify-center p-4 z-50 overflow-y-auto">
          <div className="card p-6 max-w-4xl w-full my-8">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-2xl font-display uppercase tracking-wider text-plague-green mb-1">
                  {selectedCollection.name}
                </h2>
                {selectedCollection.description && (
                  <p className="text-plague-mist/60 text-sm">
                    {selectedCollection.description}
                  </p>
                )}
              </div>
              <button
                onClick={closeCollectionDetails}
                className="text-plague-mist hover:text-plague-red-bright"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {loadingDetails ? (
              <div className="flex items-center justify-center py-12">
                <Loader className="w-8 h-8 text-plague-green animate-spin" />
              </div>
            ) : collectionDetails && (
              <>
                {/* Drop/Undrop Button */}
                <div className="mb-6 flex gap-3">
                  {collectionDetails.is_dropped ? (
                    <button
                      onClick={handleUndropCollection}
                      disabled={dropping || collectionDetails.products.length === 0}
                      className="flex-1 px-6 py-4 bg-plague-mist/20 hover:bg-plague-mist/30 text-plague-bone font-display uppercase tracking-wider text-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3 group"
                    >
                      {dropping ? (
                        <>
                          <Loader className="w-5 h-5 animate-spin" />
                          Undropping...
                        </>
                      ) : (
                        <>
                          <ZapOff className="w-5 h-5" />
                          Undrop Collection
                        </>
                      )}
                    </button>
                  ) : (
                    <button
                      onClick={handleDropCollection}
                      disabled={dropping || collectionDetails.products.length === 0}
                      className="flex-1 px-6 py-4 bg-plague-green hover:bg-plague-green-dark text-plague-black font-display uppercase tracking-wider text-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3 group relative overflow-hidden"
                    >
                      {/* Cool glow effect */}
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-1000" />
                      {dropping ? (
                        <>
                          <Loader className="w-5 h-5 animate-spin" />
                          Dropping...
                        </>
                      ) : (
                        <>
                          <Zap className="w-5 h-5 group-hover:animate-pulse" />
                          Drop Collection
                        </>
                      )}
                    </button>
                  )}
                </div>

                {collectionDetails.is_dropped && collectionDetails.dropped_at && (
                  <div className="mb-4 p-3 bg-plague-green/10 border border-plague-green/30 rounded text-plague-green text-sm">
                    <strong>Dropped</strong> on {new Date(collectionDetails.dropped_at).toLocaleString()}
                  </div>
                )}

                {/* Products List */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="font-display uppercase tracking-wider text-plague-bone">
                      Products ({collectionDetails.products.length})
                    </h3>
                    <button
                      onClick={openAddProductsModal}
                      className="btn-secondary flex items-center gap-2 px-3 py-2 text-sm"
                    >
                      <Plus className="w-4 h-4" />
                      Add Products
                    </button>
                  </div>

                  {collectionDetails.products.length === 0 ? (
                    <div className="card p-8 text-center text-plague-mist/60">
                      <Package className="w-12 h-12 mx-auto mb-2 opacity-50" />
                      No products in this collection yet. Add some products to get started.
                    </div>
                  ) : (
                    <div className="grid gap-3">
                      {collectionDetails.products.map((product) => (
                        <div
                          key={product.id}
                          className="card p-4 flex items-center gap-4"
                        >
                          {product.image_url && (
                            <img
                              src={product.image_url}
                              alt={product.name}
                              className="w-16 h-16 object-contain bg-plague-lighter/30"
                            />
                          )}
                          <div className="flex-1">
                            <h4 className="font-display uppercase text-plague-bone">
                              {product.name}
                            </h4>
                            <p className="text-plague-mist/60 text-sm">
                              {product.product_type} • {product.colour}
                            </p>
                          </div>
                          <div className="text-plague-green font-display">
                            {formatPrice(product.base_price)}
                          </div>
                          {product.is_active ? (
                            <div className="text-plague-green text-xs uppercase px-2 py-1 bg-plague-green/10 border border-plague-green/30 rounded">
                              Active
                            </div>
                          ) : (
                            <div className="text-plague-mist/60 text-xs uppercase px-2 py-1 bg-plague-lighter/30 rounded">
                              Inactive
                            </div>
                          )}
                          <button
                            onClick={() => handleRemoveProduct(product.id)}
                            className="p-2 hover:bg-plague-red/20 rounded transition-colors"
                          >
                            <X className="w-4 h-4 text-plague-red-bright" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {/* Add Products Modal */}
      {showAddProducts && (
        <div className="fixed inset-0 bg-plague-black/80 flex items-center justify-center p-4 z-[60]">
          <div className="card p-6 max-w-2xl w-full max-h-[80vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-display uppercase tracking-wider text-plague-green">
                Add Products
              </h2>
              <button
                onClick={closeAddProductsModal}
                className="text-plague-mist hover:text-plague-red-bright"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {loadingProducts ? (
              <div className="flex items-center justify-center py-12">
                <Loader className="w-8 h-8 text-plague-green animate-spin" />
              </div>
            ) : allProducts.length === 0 ? (
              <div className="text-center py-12 text-plague-mist/60">
                All products have been added to this collection.
              </div>
            ) : (
              <>
                <div className="space-y-2 mb-6">
                  {allProducts.map((product) => (
                    <label
                      key={product.id}
                      className={`card p-4 flex items-center gap-4 cursor-pointer transition-colors ${
                        selectedProducts.includes(product.id)
                          ? 'border-plague-green bg-plague-green/10'
                          : 'hover:border-plague-lighter'
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={selectedProducts.includes(product.id)}
                        onChange={() => toggleProductSelection(product.id)}
                        className="w-4 h-4 rounded border-plague-lighter bg-plague-dark text-plague-green focus:ring-plague-green focus:ring-offset-plague-dark"
                      />
                      {product.image_url && (
                        <img
                          src={product.image_url}
                          alt={product.name}
                          className="w-12 h-12 object-contain bg-plague-lighter/30"
                        />
                      )}
                      <div className="flex-1">
                        <h4 className="font-display uppercase text-plague-bone text-sm">
                          {product.name}
                        </h4>
                        <p className="text-plague-mist/60 text-xs">
                          {product.product_type} • {product.colour}
                        </p>
                      </div>
                      <div className="text-plague-green font-display text-sm">
                        {formatPrice(product.base_price)}
                      </div>
                    </label>
                  ))}
                </div>

                <div className="flex gap-3 pt-4 border-t border-plague-lighter">
                  <button
                    type="button"
                    onClick={closeAddProductsModal}
                    disabled={addingProducts}
                    className="btn-secondary flex-1"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleAddProducts}
                    disabled={addingProducts || selectedProducts.length === 0}
                    className="btn-primary flex-1 flex items-center justify-center gap-2"
                  >
                    {addingProducts && <Loader className="w-4 h-4 animate-spin" />}
                    Add {selectedProducts.length > 0 && `(${selectedProducts.length})`}
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {collectionToDelete && (
        <div className="fixed inset-0 bg-plague-black/80 flex items-center justify-center p-4 z-50">
          <div className="card p-6 max-w-md w-full border-plague-red">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-display uppercase tracking-wider text-plague-red-bright">
                Delete Collection
              </h2>
              <button
                onClick={closeDeleteModal}
                className="text-plague-mist hover:text-plague-red-bright"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="space-y-4">
              <div className="flex items-start gap-3 p-4 bg-plague-red/20 border border-plague-red-bright rounded">
                <AlertTriangle className="w-6 h-6 text-plague-red-bright flex-shrink-0 mt-0.5" />
                <div className="text-plague-bone text-sm">
                  <p className="font-bold mb-1">This action cannot be undone.</p>
                  <p>The products will NOT be deleted, only removed from this collection.</p>
                </div>
              </div>

              <div className="p-4 bg-plague-lighter/30 rounded">
                <div className="text-plague-bone font-display uppercase mb-2">
                  {collectionToDelete.name}
                </div>
                <div className="text-plague-mist/60 text-sm">
                  {collectionToDelete.product_count} product{collectionToDelete.product_count !== 1 ? 's' : ''}
                </div>
              </div>

              <div className="text-plague-mist/60 text-sm">
                Are you sure you want to delete this collection?
              </div>

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
                  onClick={handleDeleteCollection}
                  disabled={deleting}
                  className="flex-1 px-4 py-2 bg-plague-red hover:bg-plague-red-bright text-plague-bone font-display uppercase tracking-wider transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {deleting && <Loader className="w-4 h-4 animate-spin" />}
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
