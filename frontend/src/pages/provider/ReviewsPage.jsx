import { useState } from 'react'
import { Star, MessageSquare } from 'lucide-react'
import Sidebar from '../../components/common/Sidebar'
import Loader from '../../components/common/Loader'
import { useFetch } from '../../hooks/useFetch'
import providerService from '../../services/providerService'
import { formatDate } from '../../utils/validators'
import toast from 'react-hot-toast'
import clsx from 'clsx'

export default function ReviewsPage() {
  const { data: profile } = useFetch(providerService.getMyProfile)
  const [respondingId, setRespondingId] = useState(null)
  const [response, setResponse]         = useState('')

  const profileId = profile?.profileId
  const { data, loading } = useFetch(
    () => profileId ? providerService.getReviews(profileId, { page: 0, size: 20 }) : Promise.resolve(null),
    [profileId]
  )

  const reviews = data?.content || []

  const handleRespond = async () => {
    if (!response.trim()) return
    try {
      await providerService.respondToReview(respondingId, response)
      toast.success('Response posted')
      setRespondingId(null); setResponse('')
    } catch (e) { toast.error('Failed to post response') }
  }

  return (
    <div className="flex min-h-screen bg-slate-50">
      <Sidebar />
      <main className="flex-1 overflow-auto">
        <div className="page-wrapper">
          <div className="mb-8">
            <h1 className="page-title">Reviews</h1>
            <p className="page-subtitle">
              Overall rating: <span className="font-semibold text-navy-800">{profile?.rating?.toFixed(1) || '—'}</span>
              {' '}({profile?.totalReviews || 0} reviews)
            </p>
          </div>

          {loading ? <Loader /> : reviews.length === 0 ? (
            <div className="text-center py-20 text-slate-400">
              <Star size={48} className="mx-auto mb-4 opacity-30" />
              <p className="text-sm">No reviews yet. Complete bookings to receive reviews.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {reviews.map(r => (
                <div key={r.id} className="card p-5">
                  <div className="flex items-start justify-between gap-4 mb-3">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-navy-100 flex items-center justify-center font-700 text-navy-700 text-sm">
                        {r.reviewer?.firstName?.[0]}{r.reviewer?.lastName?.[0]}
                      </div>
                      <div>
                        <p className="font-medium text-navy-800 text-sm">{r.reviewer?.firstName} {r.reviewer?.lastName}</p>
                        <p className="text-xs text-slate-400">{formatDate(r.createdAt)}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-0.5">
                      {[1,2,3,4,5].map(n => (
                        <Star key={n} size={14} className={clsx(n <= r.rating ? 'text-gold-500 fill-gold-500' : 'text-slate-200')} />
                      ))}
                    </div>
                  </div>

                  {r.title && <p className="font-semibold text-navy-800 text-sm mb-1">{r.title}</p>}
                  {r.comment && <p className="text-sm text-slate-600 leading-relaxed">{r.comment}</p>}

                  {r.response ? (
                    <div className="mt-4 p-3 bg-navy-50 rounded-xl border-l-4 border-navy-600">
                      <p className="text-xs font-semibold text-navy-700 mb-1">Your Response</p>
                      <p className="text-sm text-slate-700">{r.response}</p>
                    </div>
                  ) : (
                    <button onClick={() => { setRespondingId(r.id); setResponse('') }}
                      className="mt-3 btn btn-secondary btn-sm">
                      <MessageSquare size={13} /> Respond
                    </button>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </main>

      {respondingId && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6 animate-in">
            <h2 className="font-display text-xl font-700 text-navy-900 mb-4">Respond to Review</h2>
            <textarea rows={4} className="form-input resize-none" value={response}
              onChange={e => setResponse(e.target.value)} placeholder="Write a professional response…" />
            <div className="flex gap-3 mt-5">
              <button onClick={() => setRespondingId(null)} className="btn btn-secondary flex-1">Cancel</button>
              <button onClick={handleRespond} className="btn-primary flex-1">Post Response</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
