import { useState, useEffect, useCallback } from 'react'
import DashboardLayout from '../../components/common/DashboardLayout'
import ApplicationCard from '../../components/student/ApplicationCard'
import Loader from '../../components/common/Loader'
import bookingService from '../../services/bookingService'
import toast from 'react-hot-toast'
import { FileText, Plus } from 'lucide-react'
import { Link } from 'react-router-dom'

export default function ApplicationsPage() {
  const [apps, setApps]     = useState([])
  const [loading, setLoading] = useState(true)

  const load = useCallback(() => {
    setLoading(true)
    bookingService.getMyApplications({ size: 50 })
      .then(r => setApps(r.content || []))
      .catch(() => toast.error('Failed to load applications'))
      .finally(() => setLoading(false))
  }, [])

  useEffect(() => { load() }, [load])

  const handleSubmit = async (id) => {
    try {
      await bookingService.submitApplication(id)
      toast.success('Application submitted!')
      load()
    } catch (e) { toast.error(e?.response?.data?.message || 'Submit failed') }
  }

  const handleWithdraw = async (id) => {
    if (!confirm('Withdraw this application?')) return
    try {
      await bookingService.withdrawApplication(id)
      toast.success('Application withdrawn')
      load()
    } catch (e) { toast.error('Withdraw failed') }
  }

  return (
    <DashboardLayout>
      <div className="page-wrapper">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="page-title">My Applications</h1>
            <p className="page-subtitle">{apps.length} application{apps.length !== 1 ? 's' : ''} total</p>
          </div>
          <Link to="/student/universities" className="btn-primary">
            <Plus size={15} /> New Application
          </Link>
        </div>

        {loading ? <Loader /> : apps.length === 0 ? (
          <div className="text-center py-20">
            <FileText size={40} className="mx-auto text-slate-300 mb-3" />
            <p className="text-slate-500 font-medium">No applications yet</p>
            <Link to="/student/universities" className="btn-primary btn-sm mt-4 inline-flex">
              Browse Universities
            </Link>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-5">
            {apps.map(app => (
              <ApplicationCard key={app.id} application={app}
                onSubmit={handleSubmit} onWithdraw={handleWithdraw} />
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  )
}
