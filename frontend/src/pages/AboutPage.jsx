import Navbar from '../components/common/Navbar'
import Footer from '../components/common/Footer'
import { Globe, Target, Heart, Zap } from 'lucide-react'

const VALUES = [
  { icon: Target, title: 'Transparency',  desc: 'We show real data — rankings, fees, acceptance rates — so students can decide confidently.' },
  { icon: Heart,  title: 'Student First', desc: 'Every feature is designed with the student experience in mind, not platform revenue.' },
  { icon: Zap,    title: 'Simplicity',    desc: 'Complex processes broken into simple steps. No jargon, no overwhelm.' },
]

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <div className="text-center mb-20">
          <h1 className="font-display text-5xl font-700 text-navy-900 mb-6">About Overseas Portal</h1>
          <p className="text-xl text-slate-500 max-w-3xl mx-auto leading-relaxed">
            We built Overseas Portal because studying abroad is one of the most transformative decisions a person can make — and it shouldn't be complicated.
          </p>
        </div>
        <div className="grid md:grid-cols-3 gap-8 mb-20">
          {VALUES.map(v => (
            <div key={v.title} className="card p-8 text-center">
              <div className="w-14 h-14 bg-navy-950 rounded-2xl flex items-center justify-center mx-auto mb-5">
                <v.icon size={24} className="text-gold-400" />
              </div>
              <h3 className="font-display text-xl font-700 text-navy-900 mb-3">{v.title}</h3>
              <p className="text-slate-500 leading-relaxed text-sm">{v.desc}</p>
            </div>
          ))}
        </div>
        <div className="bg-navy-950 rounded-3xl p-12 text-center">
          <h2 className="font-display text-3xl font-700 text-white mb-4">Our Mission</h2>
          <p className="text-navy-300 text-lg leading-relaxed max-w-2xl mx-auto">
            To make quality international education accessible to every student, regardless of their background, by connecting them with the right universities, services, and community.
          </p>
        </div>
      </div>
      <Footer />
    </div>
  )
}
