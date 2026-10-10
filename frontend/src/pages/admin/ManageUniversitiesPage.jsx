import { useState } from 'react'
import { Search, Plus, Edit2, Trash2, Building2 } from 'lucide-react'
import Sidebar from '../../components/common/Sidebar'
import Loader from '../../components/common/Loader'
import { useFetch } from '../../hooks/useFetch'
import adminService from '../../services/adminService'
import { COUNTRIES } from '../../utils/constants'
import { formatCurrency } from '../../utils/validators'
import toast from 'react-hot-toast'

const EMPTY = {
  name:'', country:'', city:'', website:'', description:'',
  worldRanking:'', qsRanking:'', tuitionFeeMin:'', tuitionFeeMax:'',
  feeCurrency:'USD', minimumIelts:'', applicationFee:'',
  scholarshipAvailable: false, active: true,
}

export default function ManageUniversitiesPage() {
  const [page,      setPage]      = useState(0)
  const [keyword,   setKeyword]   = useState('')
  const [country,   setCountry]   = useState('')
  const [showModal, setShowModal] = useState(false)
  const [editing,   setEditing]   = useState(null)
  const [form,      setForm]      = useState(EMPTY)
  const [saving,    setSaving]    = useState(false)

  const { data, loading, refetch } = useFetch(
    () => adminService.getUniversities({ keyword: keyword||undefined, country: country||undefined, page, size: 15 }),
    [keyword, country, page]
  )

  const universities = data?.content || []
  const totalPages   = data?.totalPages || 0

  const openCreate = () => { setEditing(null); setForm(EMPTY); setShowModal(true) }
  const openEdit   = (u) => { setEditing(u); setForm({ ...EMPTY, ...u }); setShowModal(true) }

  const handleSave = async () => {
    if (!form.name || !form.country) { toast.error('Name and country are required'); return }
    setSaving(true)
    try {
      const payload = {
        ...form,
        worldRanking:   form.worldRanking   ? +form.worldRanking   : null,
        qsRanking:      form.qsRanking      ? +form.qsRanking      : null,
        tuitionFeeMin:  form.tuitionFeeMin  ? +form.tuitionFeeMin  : null,
        tuitionFeeMax:  form.tuitionFeeMax  ? +form.tuitionFeeMax  : null,
        minimumIelts:   form.minimumIelts   ? +form.minimumIelts   : null,
        applicationFee: form.applicationFee ? +form.applicationFee : null,
      }
      if (editing) {
        await adminService.updateUniversity(editing.id, payload)
        toast.success('University updated')
      } else {
        await adminService.createUniversity(payload)
        toast.success('University created')
      }
      refetch(); setShowModal(false)
    } catch (e) { toast.error(e?.response?.data?.message || 'Save failed') }
    finally { setSaving(false) }
  }

  const handleDelete = async (id) => {
    if (!confirm('Remove this university?')) return
    try { await adminService.deleteUniversity(id); toast.success('Removed'); refetch() }
    catch { toast.error('Failed to remove') }
  }

  const F = (key) => (e) => setForm(f => ({ ...f, [key]: e.target.type === 'checkbox' ? e.target.checked : e.target.value }))

  return (
    <div className="flex min-h-screen bg-slate-50">
      <Sidebar />
      <main className="flex-1 overflow-auto">
        <div className="page-wrapper">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="page-title">Manage Universities</h1>
              <p className="page-subtitle">Add, edit and manage the university database</p>
            </div>
            <button onClick={openCreate} className="btn-primary"><Plus size={15} /> Add University</button>
          </div>

          <div className="card p-4 mb-5 flex flex-wrap gap-3">
            <div className="relative flex-1 min-w-48">
              <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input className="form-input pl-10" placeholder="Search universities…"
                value={keyword} onChange={e => { setKeyword(e.target.value); setPage(0) }} />
            </div>
            <select className="form-input w-44" value={country}
              onChange={e => { setCountry(e.target.value); setPage(0) }}>
              <option value="">All Countries</option>
              {COUNTRIES.map(c => <option key={c}>{c}</option>)}
            </select>
          </div>

          {loading ? <Loader /> : (
            <>
              <div className="table-wrapper mb-6">
                <table className="data-table">
                  <thead><tr>
                    <th>University</th><th>Country</th><th>Ranking</th>
                    <th>Tuition</th><th>Scholarship</th><th>Status</th><th>Actions</th>
                  </tr></thead>
                  <tbody>
                    {universities.length === 0 && (
                      <tr><td colSpan={7} className="text-center py-12 text-slate-400">
                        <Building2 size={32} className="mx-auto mb-2 opacity-30" />No universities found
                      </td></tr>
                    )}
                    {universities.map(u => (
                      <tr key={u.id}>
                        <td>
                          <p className="font-medium text-navy-800">{u.name}</p>
                          {u.city && <p className="text-xs text-slate-400">{u.city}</p>}
                        </td>
                        <td className="text-slate-600">{u.country}</td>
                        <td className="text-slate-600">{u.worldRanking ? `#${u.worldRanking}` : u.qsRanking ? `QS #${u.qsRanking}` : '—'}</td>
                        <td className="text-slate-600 text-xs">
                          {u.tuitionFeeMin
                            ? `${formatCurrency(u.tuitionFeeMin, u.feeCurrency)}+`
                            : '—'}
                        </td>
                        <td>{u.scholarshipAvailable
                          ? <span className="badge badge-green">Yes</span>
                          : <span className="badge badge-gray">No</span>}
                        </td>
                        <td>{u.active
                          ? <span className="badge badge-green">Active</span>
                          : <span className="badge badge-red">Inactive</span>}
                        </td>
                        <td>
                          <div className="flex items-center gap-1.5">
                            <button onClick={() => openEdit(u)}
                              className="btn btn-secondary btn-sm !px-2 !py-1"><Edit2 size={13} /></button>
                            <button onClick={() => handleDelete(u.id)}
                              className="btn btn-secondary btn-sm !px-2 !py-1 !text-red-600 !border-red-200 hover:!bg-red-50">
                              <Trash2 size={13} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {totalPages > 1 && (
                <div className="flex items-center justify-center gap-2">
                  <button onClick={() => setPage(p => Math.max(0,p-1))} disabled={page===0} className="btn btn-secondary btn-sm">Previous</button>
                  <span className="text-sm text-slate-600 px-3">Page {page+1} of {totalPages}</span>
                  <button onClick={() => setPage(p => Math.min(totalPages-1,p+1))} disabled={page>=totalPages-1} className="btn btn-secondary btn-sm">Next</button>
                </div>
              )}
            </>
          )}
        </div>
      </main>

      {showModal && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl p-6 animate-in max-h-[90vh] overflow-y-auto">
            <h2 className="font-display text-xl font-700 text-navy-900 mb-5">
              {editing ? 'Edit University' : 'Add University'}
            </h2>
            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2">
                <label className="form-label">University Name *</label>
                <input className="form-input" value={form.name} onChange={F('name')} placeholder="e.g. University of Melbourne" />
              </div>
              <div>
                <label className="form-label">Country *</label>
                <select className="form-input" value={form.country} onChange={F('country')}>
                  <option value="">Select country</option>
                  {COUNTRIES.map(c => <option key={c}>{c}</option>)}
                </select>
              </div>
              <div>
                <label className="form-label">City</label>
                <input className="form-input" value={form.city} onChange={F('city')} />
              </div>
              <div>
                <label className="form-label">Website</label>
                <input className="form-input" value={form.website} onChange={F('website')} placeholder="https://…" />
              </div>
              <div>
                <label className="form-label">World Ranking</label>
                <input type="number" className="form-input" value={form.worldRanking} onChange={F('worldRanking')} />
              </div>
              <div>
                <label className="form-label">Tuition Fee Min (USD)</label>
                <input type="number" className="form-input" value={form.tuitionFeeMin} onChange={F('tuitionFeeMin')} />
              </div>
              <div>
                <label className="form-label">Tuition Fee Max (USD)</label>
                <input type="number" className="form-input" value={form.tuitionFeeMax} onChange={F('tuitionFeeMax')} />
              </div>
              <div>
                <label className="form-label">Min IELTS Score</label>
                <input type="number" step="0.5" className="form-input" value={form.minimumIelts} onChange={F('minimumIelts')} />
              </div>
              <div>
                <label className="form-label">Application Fee (USD)</label>
                <input type="number" className="form-input" value={form.applicationFee} onChange={F('applicationFee')} />
              </div>
              <div className="col-span-2">
                <label className="form-label">Description</label>
                <textarea rows={3} className="form-input resize-none" value={form.description} onChange={F('description')} />
              </div>
              <div className="col-span-2 flex items-center gap-6">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" className="w-4 h-4 rounded" checked={form.scholarshipAvailable} onChange={F('scholarshipAvailable')} />
                  <span className="text-sm text-slate-700">Scholarship Available</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" className="w-4 h-4 rounded" checked={form.active} onChange={F('active')} />
                  <span className="text-sm text-slate-700">Active</span>
                </label>
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
