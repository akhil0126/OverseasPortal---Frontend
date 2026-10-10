import { Link } from 'react-router-dom'
import { GraduationCap, Shield, Star, ArrowRight } from 'lucide-react'
import Navbar from '../components/common/Navbar'
import Footer from '../components/common/Footer'

const FEATURES = [
  { icon: GraduationCap, title: 'Find Your University', desc: 'Browse ranked universities worldwide, compare programs, fees, and scholarships in one place.' },
  { icon: Shield,        title: 'Trusted Providers',    desc: 'Connect with verified visa agents, accommodation providers, and more—all background checked.' },
  { icon: Star,          title: 'Student Reviews',      desc: "Real reviews from students who've gone before you. Know what to expect before you commit." },
]

const STEPS = [
  { n: '01', title: 'Create your profile',    desc: 'Set up your academic background, target country, and goals.' },
  { n: '02', title: 'Explore universities',   desc: 'Filter by ranking, fees, location and program to find your ideal match.' },
  { n: '03', title: 'Apply with confidence',  desc: 'Submit applications and track every status update in real time.' },
  { n: '04', title: 'Book support services',  desc: 'Get visa help, accommodation, insurance and more from verified providers.' },
]

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      {/* Hero */}
      <section className="relative bg-navy-950 overflow-hidden">
        <div className="absolute inset-0 opacity-20"
          style={{ backgroundImage: 'radial-gradient(ellipse 80% 60% at 50% -10%, #f5bc22, transparent)' }} />
        <div className="absolute inset-0"
          style={{ backgroundImage: 'radial-gradient(circle at 80% 80%, rgba(34,211,238,0.08) 0%, transparent 50%)' }} />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-28 md:py-36">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 bg-gold-500/10 border border-gold-500/20 rounded-full px-4 py-1.5 mb-8">
              <span className="w-1.5 h-1.5 bg-gold-400 rounded-full animate-pulse-slow" />
              <span className="text-gold-300 text-sm font-medium">Your overseas study journey starts here</span>
            </div>
            <h1 className="font-display text-5xl md:text-6xl lg:text-7xl font-800 text-white leading-[1.08] mb-6 text-balance">
              Your Journey<br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-gold-400 to-gold-200">
                Starts Here
              </span>
            </h1>
            <p className="text-navy-300 text-lg md:text-xl leading-relaxed mb-10 max-w-2xl">
              Discover top universities, connect with verified service providers, and manage your entire overseas study journey — all in one place.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link to="/register" className="btn-gold btn-lg group">
                Get Started Free
                <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link to="/student/universities" className="btn btn-lg bg-white/10 text-white border border-white/20 hover:bg-white/20">
                Browse Universities
              </Link>
            </div>
          </div>
        </div>

      </section>

      {/* Features */}
      <section className="py-24 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="font-display text-4xl font-700 text-navy-900 mb-4">Everything you need to study abroad</h2>
            <p className="text-slate-500 text-lg max-w-2xl mx-auto">From application to arrival, we support every step of your overseas education journey.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {FEATURES.map(f => (
              <div key={f.title} className="card p-8 hover:shadow-card-hover transition-shadow group">
                <div className="w-14 h-14 bg-navy-950 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-navy-800 transition-colors">
                  <f.icon size={24} className="text-gold-400" />
                </div>
                <h3 className="font-display text-xl font-700 text-navy-900 mb-3">{f.title}</h3>
                <p className="text-slate-500 leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="font-display text-4xl font-700 text-navy-900 mb-4">How it works</h2>
            <p className="text-slate-500 text-lg">Get from curious to enrolled in four simple steps.</p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {STEPS.map((step, i) => (
              <div key={step.n} className="relative">
                {i < STEPS.length - 1 && (
                  <div className="hidden lg:block absolute top-7 left-[calc(100%-12px)] w-full h-px bg-slate-200 z-0" />
                )}
                <div className="relative z-10">
                  <div className="w-14 h-14 rounded-2xl bg-navy-950 text-gold-400 font-display text-xl font-700 flex items-center justify-center mb-5">
                    {step.n}
                  </div>
                  <h3 className="font-display text-lg font-700 text-navy-900 mb-2">{step.title}</h3>
                  <p className="text-slate-500 text-sm leading-relaxed">{step.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 bg-navy-950">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <h2 className="font-display text-4xl font-700 text-white mb-6">
            Ready to begin your<br /><span className="text-gold-400">overseas journey?</span>
          </h2>
          <p className="text-navy-300 text-lg mb-10">
            Join thousands of students who've already found their dream university through Overseas Portal.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link to="/register" className="btn-gold btn-lg">Create Free Account</Link>
            <Link to="/about" className="btn btn-lg bg-white/10 text-white border border-white/20 hover:bg-white/20">Learn More</Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
