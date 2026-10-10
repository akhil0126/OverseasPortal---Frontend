import { useState } from 'react'
import { Plus, Briefcase } from 'lucide-react'
import Sidebar from '../../components/common/Sidebar'
import ServiceCard from '../../components/provider/ServiceCard'
import Loader from '../../components/common/Loader'
import { useFetch } from '../../hooks/useFetch'
import providerService from '../../services/providerService'
import bookingService from '../../services/bookingService'
import toast from 'react-hot-toast'

const EMPTY_FORM = { title: '', description: '', price: '', priceCurrency: 'USD', priceType: 'FIXED', durationDays: '', categoryId: '', features: '' }

export default function MyServicesPage() {
  const [showModal, setShowModal] = useState(false)
  const [editing,   setEditing]   = useState(null)
  const [form,      setForm]      = useState(EMPTY_FORM)
  const [saving,    setSaving]    = useState(false)

  const { data: listings, loading, error, refetch } = useFetch(providerService.getMyListings)
  const { data: catData } = useFetch(bookingService.getCategories)
  const categories = catData || []
  const visibleListings = listings || []

  const openCreate = () => { setEditing(null); setForm(EMPTY_FORM); setShowModal(true) }
  const openEdit   = (s)  => {
    setEditing(s)
    setForm({ ...s, categoryId: s.category?.id || '', features: s.features?.join(', ') || '' })
    setShowModal(true)
  }

  const handleSave = async () => {
    if (!form.title.trim() || !form.price) { toast.error('Title and price are required'); return }
    setSaving(true)
    try {
      const payload = {
        ...form,
        price:      parseFloat(form.price),
        durationDays: form.durationDays ? parseInt(form.durationDays) : null,
        category:   { id: parseInt(form.categoryId) },
        features:   form.features ? form.features.split(',').map(f => f.trim()).filter(Boolean) : [],
      }
      if (editing) {
        await providerService.updateListing(editing.id, payload)
        toast.success('Service updated')
      } else {
        await providerService.createListing(payload)
        toast.success('Service created')
      }
      refetch(); setShowModal(false)
    } catch (e) {
      toast.error(e?.response?.data?.message || 'Failed to save')
    } finally { setSaving(false) }
  }

  const handleDelete = async (id) => {
    if (!confirm('Permanently delete this service listing? This cannot be undone.')) return
    try { await providerService.deleteListing(id); toast.success('Removed'); refetch() }
    catch (e) { toast.error(e?.response?.data?.message || 'Failed to remove') }
  }

  const handleToggle = async (id, active) => {
    try {
      await providerService.updateListing(id, { active })
      await refetch()
      toast.success(active ? 'Service activated' : 'Service deactivated')
    }
    catch (e) { toast.error(e?.response?.data?.message || 'Failed to update') }
  }

  const F = (key) => (e) => setForm(f => ({ ...f, [key]: e.target.value }))

  return (
    <div className="flex min-h-screen bg-slate-50">
      <Sidebar />
      <main className="flex-1 overflow-auto">
        <div className="page-wrapper">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="page-title">My Services</h1>
              <p className="page-subtitle">Manage your service listings</p>
            </div>
            <button onClick={openCreate} className="btn-primary"><Plus size={16} /> Add Service</button>
          </div>

          {loading ? <Loader /> : error ? (
            <div className="text-center py-20 text-slate-400">
              <Briefcase size={48} className="mx-auto mb-4 opacity-30" />
              <p className="text-sm mb-2 text-red-500">Error loading services: {error}</p>
              <button onClick={refetch} className="btn-primary mt-4">Retry</button>
            </div>
          ) : (
            <>
              {visibleListings.length === 0 ? (
                <div className="text-center py-20 text-slate-400">
                  <Briefcase size={48} className="mx-auto mb-4 opacity-30" />
                  <p className="text-sm mb-4">No services listed yet</p>
                  <button onClick={openCreate} className="btn-primary">Create your first listing</button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
                  {visibleListings.map(s => (
                    <ServiceCard key={s.id} service={s}
                      onEdit={openEdit} onDelete={handleDelete} onToggle={handleToggle} />
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </main>

      {showModal && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg p-6 animate-in max-h-[90vh] overflow-y-auto">
            <h2 className="font-display text-xl font-700 text-navy-900 mb-5">
              {editing ? 'Edit Service' : 'Create Service'}
            </h2>
            <div className="space-y-4">
              <div>
                <label className="form-label">Title *</label>
                <input className="form-input" value={form.title} onChange={F('title')} placeholder="e.g. Visa Application Assistance" />
              </div>
              <div>
                <label className="form-label">Category</label>
                <select className="form-input" value={form.categoryId} onChange={F('categoryId')}>
                  <option value="">Select category</option>
                  {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
              </div>
              <div>
                <label className="form-label">Description</label>
                <textarea rows={3} className="form-input resize-none" value={form.description} onChange={F('description')} placeholder="What's included…" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="form-label">Price *</label>
                  <input type="number" className="form-input" value={form.price} onChange={F('price')} placeholder="0.00" />
                </div>
                <div>
                  <label className="form-label">Currency</label>
                  <select className="form-input" value={form.priceCurrency} onChange={F('priceCurrency')}>
                    {['USD','EUR','GBP','AUD','CAD','INR'].map(c => <option key={c}>{c}</option>)}
                  </select>
                </div>
              </div>
              <div>
                <label className="form-label">Features (comma separated)</label>
                <input className="form-input" value={form.features} onChange={F('features')} placeholder="Visa guidance, Document review, …" />
              </div>
              <div>
                <label className="form-label">Duration (days)</label>
                <input type="number" className="form-input" value={form.durationDays} onChange={F('durationDays')} placeholder="e.g. 14" />
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <button onClick={() => setShowModal(false)} className="btn btn-secondary flex-1">Cancel</button>
              <button onClick={handleSave} disabled={saving} className="btn-primary flex-1">
                {saving ? 'Saving…' : editing ? 'Update' : 'Create'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
