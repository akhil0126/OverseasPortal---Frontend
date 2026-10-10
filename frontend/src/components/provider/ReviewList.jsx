import { Star, MessageSquare } from 'lucide-react'
import { formatDate } from '../../utils/validators'
import { useState } from 'react'
import toast from 'react-hot-toast'
import providerService from '../../services/providerService'

function StarRow({ rating, size = 14 }) {
  return (
    <div className="flex gap-0.5">
      {[1,2,3,4,5].map(n => (
        <Star key={n} size={size}
          className={n <= rating ? 'text-gold-500 fill-gold-500' : 'text-slate-200 fill-slate-200'} />
      ))}
    </div>
  )
}

function ReviewItem({ review, onRespond }) {
  const [showForm, setShowForm] = useState(false)
  const [response, setResponse] = useState('')
  const [saving, setSaving] = useState(false)

  const submit = async () => {
    if (!response.trim()) return
    setSaving(true)
    try {
      await providerService.respondToReview(review.id, response)
      toast.success('Response posted')
      setShowForm(false)
      onRespond?.()
    } catch { toast.error('Failed to post response') }
    finally { setSaving(false) }
  }

  return (
    <div className="border border-slate-100 rounded-2xl p-5 space-y-3">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-navy-100 flex items-center justify-center font-700 text-navy-700 text-sm">
            {review.reviewerName?.[0] || 'U'}
          </div>
          <div>
            <p className="font-semibold text-navy-800 text-sm">{review.reviewerName || 'Anonymous'}</p>
            <p className="text-xs text-slate-400">{formatDate(review.createdAt)}</p>
          </div>
        </div>
        <StarRow rating={review.rating} />
      </div>

      {review.title && <p className="font-semibold text-navy-800 text-sm">"{review.title}"</p>}
      {review.comment && <p className="text-sm text-slate-600 leading-relaxed">{review.comment}</p>}

      {review.response ? (
        <div className="bg-navy-50 rounded-xl p-3.5 border-l-3 border-navy-600">
          <p className="text-xs font-semibold text-navy-700 mb-1 flex items-center gap-1.5">
            <MessageSquare size={11} /> Your Response
          </p>
          <p className="text-xs text-slate-600">{review.response}</p>
        </div>
      ) : (
        <div>
          {showForm ? (
            <div className="space-y-2">
              <textarea className="form-input !rounded-xl text-sm" rows={3}
                placeholder="Write a professional response…"
                value={response} onChange={e => setResponse(e.target.value)} />
              <div className="flex gap-2">
                <button onClick={submit} disabled={saving} className="btn-primary btn-sm">
                  {saving ? 'Posting…' : 'Post Response'}
                </button>
                <button onClick={() => setShowForm(false)} className="btn btn-secondary btn-sm">Cancel</button>
              </div>
            </div>
          ) : (
            <button onClick={() => setShowForm(true)}
              className="text-xs text-navy-600 hover:text-navy-800 font-medium flex items-center gap-1.5">
              <MessageSquare size={12} /> Reply to this review
            </button>
          )}
        </div>
      )}
    </div>
  )
}

export default function ReviewList({ reviews = [], onRefresh, loading }) {
  if (loading) return <div className="text-center py-10 text-slate-400 text-sm">Loading reviews…</div>
  if (!reviews.length) return (
    <div className="text-center py-16">
      <Star size={36} className="mx-auto text-slate-300 mb-3" />
      <p className="text-slate-500 font-medium">No reviews yet</p>
      <p className="text-slate-400 text-sm mt-1">Reviews appear after bookings are completed.</p>
    </div>
  )

  const avg = (reviews.reduce((s, r) => s + r.rating, 0) / reviews.length).toFixed(1)

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4 p-5 bg-navy-50 rounded-2xl">
        <div className="text-center">
          <p className="font-display text-4xl font-700 text-navy-900">{avg}</p>
          <StarRow rating={Math.round(avg)} size={16} />
          <p className="text-xs text-slate-500 mt-1">{reviews.length} reviews</p>
        </div>
        <div className="flex-1 space-y-1.5">
          {[5,4,3,2,1].map(n => {
            const count = reviews.filter(r => r.rating === n).length
            const pct = reviews.length ? (count / reviews.length) * 100 : 0
            return (
              <div key={n} className="flex items-center gap-2 text-xs">
                <span className="w-3 text-slate-500">{n}</span>
                <Star size={11} className="text-gold-500 fill-gold-500" />
                <div className="flex-1 h-2 bg-slate-200 rounded-full overflow-hidden">
                  <div className="h-full bg-gold-400 rounded-full" style={{ width: `${pct}%` }} />
                </div>
                <span className="w-5 text-slate-400">{count}</span>
              </div>
            )
          })}
        </div>
      </div>
      {reviews.map(r => <ReviewItem key={r.id} review={r} onRespond={onRefresh} />)}
    </div>
  )
}
