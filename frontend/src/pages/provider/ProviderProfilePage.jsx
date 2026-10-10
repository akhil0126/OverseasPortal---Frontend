import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import Sidebar from '../../components/common/Sidebar'
import Loader from '../../components/common/Loader'
import { useFetch } from '../../hooks/useFetch'
import providerService from '../../services/providerService'
import { PROVIDER_TYPES, COUNTRIES } from '../../utils/constants'
import toast from 'react-hot-toast'

export default function ProviderProfilePage() {
  const { data: profile, loading, refetch } = useFetch(providerService.getMyProfile)
  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm()

  useEffect(() => { if (profile) reset(profile) }, [profile])

  const onSubmit = async (data) => {
    try {
      await providerService.updateMyProfile(data)
      toast.success('Profile updated successfully')
      refetch()
    } catch (e) { toast.error(e?.response?.data?.message || 'Update failed') }
  }

  if (loading) return <div className="flex min-h-screen bg-slate-50"><Sidebar /><main className="flex-1"><Loader /></main></div>

  return (
    <div className="flex min-h-screen bg-slate-50">
      <Sidebar />
      <main className="flex-1 overflow-auto">
        <div className="page-wrapper max-w-3xl">
          <div className="mb-8">
            <h1 className="page-title">Company Profile</h1>
            <p className="page-subtitle">How clients see your business</p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Personal info */}
            <div className="card p-6">
              <h2 className="section-title">Personal Information</h2>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="form-label">First Name</label>
                  <input className="form-input" {...register('firstName', { required: true })} />
                </div>
                <div>
                  <label className="form-label">Last Name</label>
                  <input className="form-input" {...register('lastName', { required: true })} />
                </div>
                <div>
                  <label className="form-label">Phone</label>
                  <input className="form-input" {...register('phone')} />
                </div>
              </div>
            </div>

            {/* Company info */}
            <div className="card p-6">
              <h2 className="section-title">Company Details</h2>
              <div className="space-y-4">
                <div>
                  <label className="form-label">Company Name *</label>
                  <input className="form-input" {...register('companyName', { required: 'Company name is required' })} />
                  {errors.companyName && <p className="form-error">{errors.companyName.message}</p>}
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="form-label">Provider Type</label>
                    <select className="form-input" {...register('providerType')}>
                      {PROVIDER_TYPES.map(t => <option key={t} value={t}>{t.replace(/_/g,' ')}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="form-label">Years of Experience</label>
                    <input type="number" className="form-input" {...register('yearsOfExperience')} />
                  </div>
                </div>
                <div>
                  <label className="form-label">Registration Number</label>
                  <input className="form-input" {...register('companyRegistrationNumber')} placeholder="Optional" />
                </div>
                <div>
                  <label className="form-label">Website</label>
                  <input className="form-input" {...register('website')} placeholder="https://…" />
                </div>
                <div>
                  <label className="form-label">Description</label>
                  <textarea rows={4} className="form-input resize-none" {...register('description')}
                    placeholder="Tell students about your services and expertise…" />
                </div>
              </div>
            </div>

            {/* Location */}
            <div className="card p-6">
              <h2 className="section-title">Location</h2>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="form-label">Country</label>
                  <select className="form-input" {...register('country')}>
                    <option value="">Select country</option>
                    {COUNTRIES.map(c => <option key={c}>{c}</option>)}
                  </select>
                </div>
                <div>
                  <label className="form-label">City</label>
                  <input className="form-input" {...register('city')} />
                </div>
                <div className="col-span-2">
                  <label className="form-label">Full Address</label>
                  <input className="form-input" {...register('address')} />
                </div>
              </div>
            </div>

            <div className="flex justify-end">
              <button type="submit" disabled={isSubmitting} className="btn-primary btn-lg px-10">
                {isSubmitting ? 'Saving…' : 'Save Profile'}
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  )
}
