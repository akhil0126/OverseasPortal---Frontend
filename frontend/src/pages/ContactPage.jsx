import { useForm } from 'react-hook-form'
import { Mail } from 'lucide-react'
import Navbar from '../components/common/Navbar'
import Footer from '../components/common/Footer'

export default function ContactPage() {
  const { register, handleSubmit, formState: { errors } } = useForm()

  const onSubmit = (data) => {
    const subject = encodeURIComponent(data.subject)
    const body = encodeURIComponent(
      `From: ${data.firstName} ${data.lastName}\nEmail: ${data.email}\n\n${data.message}`
    )
    window.location.href = `mailto:support@overseasportal.com?subject=${subject}&body=${body}`
  }

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <div className="text-center mb-16">
          <h1 className="font-display text-5xl font-700 text-navy-900 mb-4">Get In Touch</h1>
          <p className="text-slate-500 text-lg max-w-xl mx-auto">Have questions? We'd love to hear from you.</p>
        </div>
        <div className="grid lg:grid-cols-2 gap-12">
          {/* Info */}
          <div>
            <h2 className="font-display text-2xl font-700 text-navy-900 mb-8">Contact Information</h2>
            <a href="mailto:support@overseasportal.com" className="inline-flex items-center gap-3 text-navy-800 font-medium hover:text-navy-600">
              <Mail size={18} className="text-navy-700" />
              support@overseasportal.com
            </a>
          </div>

          {/* Form */}
          <div className="card p-8">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="form-label">First Name</label>
                  <input className={`form-input ${errors.firstName ? 'form-input-error' : ''}`}
                    {...register('firstName', { required: 'Required' })} />
                  {errors.firstName && <p className="form-error">{errors.firstName.message}</p>}
                </div>
                <div>
                  <label className="form-label">Last Name</label>
                  <input className={`form-input ${errors.lastName ? 'form-input-error' : ''}`}
                    {...register('lastName', { required: 'Required' })} />
                </div>
              </div>
              <div>
                <label className="form-label">Email</label>
                <input type="email" className={`form-input ${errors.email ? 'form-input-error' : ''}`}
                  {...register('email', { required: 'Required' })} />
                {errors.email && <p className="form-error">{errors.email.message}</p>}
              </div>
              <div>
                <label className="form-label">Subject</label>
                <input className="form-input" {...register('subject', { required: true })} />
              </div>
              <div>
                <label className="form-label">Message</label>
                <textarea rows={5} className={`form-input resize-none ${errors.message ? 'form-input-error' : ''}`}
                  {...register('message', { required: 'Message is required' })} />
                {errors.message && <p className="form-error">{errors.message.message}</p>}
              </div>
              <p className="text-xs text-slate-500">
                This opens your email app. Your message is sent only after you send it there.
              </p>
              <button type="submit" className="btn-primary w-full">
                <Mail size={15} /> Open Email App
              </button>
            </form>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  )
}
