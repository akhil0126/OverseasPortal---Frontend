import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import DashboardLayout from '../../components/common/DashboardLayout'
import Loader from '../../components/common/Loader'
import studentService from '../../services/studentService'
import { COUNTRIES, DEGREE_LEVELS, ENGLISH_TESTS } from '../../utils/constants'
import toast from 'react-hot-toast'
import { Save, Lock } from 'lucide-react'

export default function StudentProfilePage() {
  const [loading, setLoading]   = useState(true)
  const [saving, setSaving]     = useState(false)
  const [tab, setTab]           = useState('personal')
  const { register, handleSubmit, reset, formState: { errors } } = useForm()
  const { register: regPwd, handleSubmit: handlePwd, reset: resetPwd, formState: { errors: pwdErrors } } = useForm()

  useEffect(() => {
    studentService.getProfile().then(data => {
      reset(data)
      setLoading(false)
    }).catch(() => setLoading(false))
  }, [])

  const onSave = async (data) => {
    setSaving(true)
    try {
      await studentService.updateProfile(data)
      toast.success('Profile updated successfully')
    } catch (e) {
      toast.error(e?.response?.data?.message || 'Update failed')
    } finally { setSaving(false) }
  }

  const onChangePassword = async (data) => {
    if (data.newPassword !== data.confirmPassword) { toast.error('Passwords do not match'); return }
    try {
      await studentService.changePassword(data.currentPassword, data.newPassword)
      toast.success('Password changed')
      resetPwd()
    } catch (e) { toast.error('Failed to change password') }
  }

  if (loading) return <DashboardLayout><Loader /></DashboardLayout>

  const tabs = ['personal', 'academic', 'security']

  return (
    <DashboardLayout>
      <div className="page-wrapper max-w-3xl">
        <h1 className="page-title mb-2">My Profile</h1>
        <p className="page-subtitle mb-8">Manage your personal and academic information</p>

        {/* Tabs */}
        <div className="flex gap-1 bg-slate-100 rounded-xl p-1 mb-8 w-fit">
          {tabs.map(t => (
            <button key={t} onClick={() => setTab(t)}
              className={`px-5 py-2 rounded-lg text-sm font-medium capitalize transition-all ${
                tab === t ? 'bg-white text-navy-900 shadow-sm' : 'text-slate-500 hover:text-navy-700'
              }`}>
              {t}
            </button>
          ))}
        </div>

        <form onSubmit={handleSubmit(onSave)}>
          {tab === 'personal' && (
            <div className="card p-8 space-y-5">
              <h2 className="section-title">Personal Information</h2>
              <div className="grid grid-cols-2 gap-4">
                <div><label className="form-label">First Name</label>
                  <input className="form-input" {...register('firstName', { required: true })} /></div>
                <div><label className="form-label">Last Name</label>
                  <input className="form-input" {...register('lastName', { required: true })} /></div>
              </div>
              <div><label className="form-label">Phone</label>
                <input className="form-input" {...register('phone')} /></div>
              <div className="grid grid-cols-2 gap-4">
                <div><label className="form-label">Date of Birth</label>
                  <input type="date" className="form-input" {...register('dateOfBirth')} /></div>
                <div><label className="form-label">Nationality</label>
                  <select className="form-input" {...register('nationality')}>
                    <option value="">Select…</option>
                    {COUNTRIES.map(c => <option key={c}>{c}</option>)}
                  </select></div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div><label className="form-label">Passport Number</label>
                  <input className="form-input" {...register('passportNumber')} /></div>
                <div><label className="form-label">Passport Expiry</label>
                  <input type="date" className="form-input" {...register('passportExpiry')} /></div>
              </div>
              <div><label className="form-label">Current Country</label>
                <select className="form-input" {...register('currentCountry')}>
                  <option value="">Select…</option>
                  {COUNTRIES.map(c => <option key={c}>{c}</option>)}
                </select></div>
              <div><label className="form-label">Bio</label>
                <textarea rows={3} className="form-input resize-none" placeholder="Tell us about yourself…"
                  {...register('bio')} /></div>
              <div><label className="form-label">LinkedIn URL</label>
                <input className="form-input" placeholder="https://linkedin.com/in/…" {...register('linkedinUrl')} /></div>
              <button type="submit" disabled={saving} className="btn-primary">
                <Save size={15} /> {saving ? 'Saving…' : 'Save Changes'}
              </button>
            </div>
          )}

          {tab === 'academic' && (
            <div className="card p-8 space-y-5">
              <h2 className="section-title">Academic Information</h2>
              <div className="grid grid-cols-2 gap-4">
                <div><label className="form-label">Target Country</label>
                  <select className="form-input" {...register('targetCountry')}>
                    <option value="">Select…</option>
                    {COUNTRIES.map(c => <option key={c}>{c}</option>)}
                  </select></div>
                <div><label className="form-label">Target Degree</label>
                  <select className="form-input" {...register('targetDegree')}>
                    <option value="">Select…</option>
                    {DEGREE_LEVELS.map(d => <option key={d}>{d}</option>)}
                  </select></div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div><label className="form-label">Field of Study</label>
                  <input className="form-input" placeholder="Computer Science, Medicine…" {...register('fieldOfStudy')} /></div>
                <div><label className="form-label">Intended Start</label>
                  <input className="form-input" placeholder="Fall 2025" {...register('intendedStartDate')} /></div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div><label className="form-label">English Test</label>
                  <select className="form-input" {...register('englishTest')}>
                    <option value="">Select…</option>
                    {ENGLISH_TESTS.map(t => <option key={t}>{t}</option>)}
                  </select></div>
                <div><label className="form-label">Score</label>
                  <input type="number" step="0.5" className="form-input" {...register('englishScore')} /></div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div><label className="form-label">GPA (out of 4.0)</label>
                  <input type="number" step="0.01" min="0" max="4" className="form-input" {...register('gpa')} /></div>
                <div><label className="form-label">Work Experience (years)</label>
                  <input type="number" min="0" className="form-input" {...register('workExperienceYears')} /></div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div><label className="form-label">Budget Min (USD)</label>
                  <input type="number" className="form-input" {...register('budgetMin')} /></div>
                <div><label className="form-label">Budget Max (USD)</label>
                  <input type="number" className="form-input" {...register('budgetMax')} /></div>
              </div>
              <button type="submit" disabled={saving} className="btn-primary">
                <Save size={15} /> {saving ? 'Saving…' : 'Save Changes'}
              </button>
            </div>
          )}
        </form>

        {tab === 'security' && (
          <form onSubmit={handlePwd(onChangePassword)}>
            <div className="card p-8 space-y-5">
              <h2 className="section-title flex items-center gap-2"><Lock size={16} /> Change Password</h2>
              <div><label className="form-label">Current Password</label>
                <input type="password" className="form-input" {...regPwd('currentPassword', { required: true })} /></div>
              <div><label className="form-label">New Password</label>
                <input type="password" className="form-input" {...regPwd('newPassword', { required: true, minLength: { value: 8, message: 'Min 8 chars' } })} />
                {pwdErrors.newPassword && <p className="form-error">{pwdErrors.newPassword.message}</p>}</div>
              <div><label className="form-label">Confirm New Password</label>
                <input type="password" className="form-input" {...regPwd('confirmPassword', { required: true })} /></div>
              <button type="submit" className="btn-primary"><Lock size={15} /> Update Password</button>
            </div>
          </form>
        )}
      </div>
    </DashboardLayout>
  )
}
