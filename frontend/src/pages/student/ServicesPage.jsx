import { useState, useEffect } from 'react'
import { Search, Star, DollarSign, Briefcase } from 'lucide-react'
import DashboardLayout from '../../components/common/DashboardLayout'
import Loader from '../../components/common/Loader'
import bookingService from '../../services/bookingService'
import { formatCurrency } from '../../utils/validators'
import toast from 'react-hot-toast'
import clsx from 'clsx'

function ServiceListingCard({ service, onBook }) {
  const { id, title, description, price, priceCurrency, category, rating, totalReviews, provider, features } = service
  return (
    <div className="card-hover flex flex-col">
      <div className="p-5 flex-1">
        <div className="flex items-start justify-between gap-2 mb-3">
          <div>
            {category?.name && <span className="badge badge-blue text-xs mb-2 block w-fit">{category.name}</span>}
            <h3 className="font-semibold text-navy-900 leading-snug">{title}</h3>
            {provider?.companyName && <p className="text-xs text-slate-500 mt-0.5">{provider.companyName}</p>}
          </div>
          <div className="text-right flex-shrink-0">
            <p className="font-700 text-navy-800">{formatCurrency(price, priceCurrency)}</p>
            {rating > 0 && (
              <p className="text-xs text-slate-500 flex items-center gap-0.5 justify-end">
                <Star size={10} className="text-gold-500 fill-gold-500" /> {rating.toFixed(1)}
                <span className="text-slate-400">({totalReviews})</span>
              </p>
            )}
          </div>
        </div>
        {description && <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">{description}</p>}
        {features?.length > 0 && (
          <ul className="flex flex-wrap gap-1.5 mt-3">
            {features.slice(0,3).map((f,i) => (
              <li key={i} className="text-xs bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full">{f}</li>
            ))}
          </ul>
        )}
      </div>
      <div className="px-5 pb-5">
        <button onClick={() => onBook(service)} className="btn-primary w-full">Book Now</button>
      </div>
    </div>
  )
}

export default function ServicesPage() {
  const [services, setServices]     = useState([])
  const [categories, setCategories] = useState([])
  const [loading, setLoading]       = useState(true)
  const [catFilter, setCatFilter]   = useState('')
  const [keyword, setKeyword]       = useState('')

  useEffect(() => {
    Promise.all([
      bookingService.getCategories(),
      bookingService.searchServices({ size: 50 }),
    ]).then(([cats, svcs]) => {
      setCategories(cats || [])
      setServices(svcs.content || [])
    }).finally(() => setLoading(false))
  }, [])

  const handleBook = async (service) => {
    try {
      await bookingService.create({ serviceId: service.id })
      toast.success(`Booking request sent for "${service.title}"`)
    } catch (e) { toast.error(e?.response?.data?.message || 'Booking failed') }
  }

  const filtered = services.filter(s =>
    (!catFilter || s.category?.id === Number(catFilter)) &&
    (!keyword   || s.title.toLowerCase().includes(keyword.toLowerCase()))
  )

  return (
    <DashboardLayout>
      <div className="page-wrapper">
        <h1 className="page-title mb-2">Services</h1>
        <p className="page-subtitle mb-8">Book trusted services to support your overseas journey</p>

        {/* Filters */}
        <div className="card p-5 mb-8 flex flex-wrap gap-3">
          <div className="relative flex-1 min-w-[180px]">
            <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input className="form-input pl-10" placeholder="Search services…"
              value={keyword} onChange={e => setKeyword(e.target.value)} />
          </div>
          <div className="flex flex-wrap gap-2">
            <button onClick={() => setCatFilter('')}
              className={clsx('btn btn-sm', !catFilter ? 'btn-primary' : 'btn-secondary')}>All</button>
            {categories.map(cat => (
              <button key={cat.id} onClick={() => setCatFilter(cat.id)}
                className={clsx('btn btn-sm', catFilter == cat.id ? 'btn-primary' : 'btn-secondary')}>
                {cat.name}
              </button>
            ))}
          </div>
        </div>

        {loading ? <Loader /> : filtered.length === 0 ? (
          <div className="text-center py-20">
            <Briefcase size={40} className="mx-auto text-slate-300 mb-3" />
            <p className="text-slate-500">No services found.</p>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-5">
            {filtered.map(s => <ServiceListingCard key={s.id} service={s} onBook={handleBook} />)}
          </div>
        )}
      </div>
    </DashboardLayout>
  )
}
