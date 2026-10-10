import { useState, useEffect } from 'react'
import { Search, Filter, Globe } from 'lucide-react'
import DashboardLayout from '../../components/common/DashboardLayout'
import UniversityCard from '../../components/student/UniversityCard'
import Loader from '../../components/common/Loader'
import universityService from '../../services/universityService'
import bookingService from '../../services/bookingService'
import { COUNTRIES, DEGREE_LEVELS } from '../../utils/constants'
import toast from 'react-hot-toast'

export default function UniversitiesPage() {
  const [universities, setUniversities] = useState([])
  const [loading, setLoading]           = useState(false)
  const [filters, setFilters]           = useState({ country: '', keyword: '', page: 0 })
  const [totalPages, setTotalPages]     = useState(0)
  const [applying, setApplying]         = useState(null)

  const search = async (f = filters) => {
    setLoading(true)
    try {
      const res = await universityService.search({ country: f.country || undefined, keyword: f.keyword || undefined, page: f.page, size: 12 })
      setUniversities(res.content || [])
      setTotalPages(res.totalPages || 0)
    } catch { toast.error('Failed to load universities') }
    finally { setLoading(false) }
  }

  useEffect(() => { search() }, [filters.page])

  const handleApply = async (university) => {
    setApplying(university.id)
    try {
      await bookingService.createApplication({ universityId: university.id })
      toast.success(`Application draft created for ${university.name}!`)
    } catch (e) { toast.error(e?.response?.data?.message || 'Could not create application') }
    finally { setApplying(null) }
  }

  return (
    <DashboardLayout>
      <div className="page-wrapper">
        <h1 className="page-title">Browse Universities</h1>
        <p className="page-subtitle mb-8">Explore {universities.length > 0 ? 'top' : ''} universities worldwide</p>

        {/* Search & Filters */}
        <div className="card p-5 mb-8 flex flex-wrap gap-3 items-end">
          <div className="flex-1 min-w-[200px]">
            <label className="form-label">Search</label>
            <div className="relative">
              <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input className="form-input pl-10" placeholder="University name…"
                value={filters.keyword}
                onChange={e => setFilters(f => ({ ...f, keyword: e.target.value }))} />
            </div>
          </div>
          <div className="w-48">
            <label className="form-label">Country</label>
            <select className="form-input" value={filters.country}
              onChange={e => setFilters(f => ({ ...f, country: e.target.value }))}>
              <option value="">All Countries</option>
              {COUNTRIES.map(c => <option key={c}>{c}</option>)}
            </select>
          </div>
          <button className="btn-primary" onClick={() => search()}>
            <Filter size={14} /> Search
          </button>
        </div>

        {loading ? <Loader /> : (
          <>
            {universities.length === 0 ? (
              <div className="text-center py-20">
                <Globe size={40} className="mx-auto text-slate-300 mb-3" />
                <p className="text-slate-500">No universities found. Try adjusting your filters.</p>
              </div>
            ) : (
              <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-6">
                {universities.map(u => (
                  <UniversityCard key={u.id} university={u} onApply={handleApply} />
                ))}
              </div>
            )}
            {totalPages > 1 && (
              <div className="flex justify-center gap-2 mt-10">
                {Array.from({ length: totalPages }, (_, i) => (
                  <button key={i} onClick={() => setFilters(f => ({ ...f, page: i }))}
                    className={`w-9 h-9 rounded-lg text-sm font-medium transition-colors ${
                      filters.page === i ? 'bg-navy-700 text-white' : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
                    }`}>{i + 1}</button>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </DashboardLayout>
  )
}
