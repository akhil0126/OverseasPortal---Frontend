import { Link } from 'react-router-dom'
import { Globe, Twitter, Linkedin, Instagram, Mail, Phone, MapPin } from 'lucide-react'

const LINKS = {
  Students:  [{ l: 'Find Universities', h: '/student/universities' }, { l: 'Browse Services', h: '/student/services' }, { l: 'My Applications', h: '/student/applications' }, { l: 'Subscriptions', h: '/student/subscription' }],
  Providers: [{ l: 'Join as Provider', h: '/register' }, { l: 'List Services', h: '/provider/services' }, { l: 'View Appointments', h: '/provider/appointments' }],
  Company:   [{ l: 'About Us', h: '/about' }, { l: 'Contact', h: '/contact' }, { l: 'Privacy Policy', h: '#' }, { l: 'Terms of Service', h: '#' }],
}

export default function Footer() {
  return (
    <footer className="bg-navy-950 text-navy-300 border-t border-navy-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">

          {/* Brand */}
          <div className="lg:col-span-2">
            <Link to="/" className="flex items-center gap-2.5 mb-4">
              <div className="w-8 h-8 bg-gold-500 rounded-lg flex items-center justify-center">
                <Globe size={18} className="text-navy-900" />
              </div>
              <span className="font-display text-xl font-700 text-white">
                Overseas<span className="text-gold-400">Portal</span>
              </span>
            </Link>
            <p className="text-sm leading-relaxed text-navy-400 max-w-xs">
              Connecting ambitious students with the world's best universities and trusted service providers since 2024.
            </p>
            <div className="flex gap-3 mt-6">
              {[Twitter, Linkedin, Instagram].map((Icon, i) => (
                <a key={i} href="#"
                  className="w-9 h-9 rounded-full bg-navy-800 hover:bg-gold-500 flex items-center justify-center transition-colors group">
                  <Icon size={15} className="text-navy-400 group-hover:text-navy-900" />
                </a>
              ))}
            </div>
          </div>

          {/* Links */}
          {Object.entries(LINKS).map(([title, items]) => (
            <div key={title}>
              <h4 className="text-white font-semibold text-sm mb-4">{title}</h4>
              <ul className="space-y-2.5">
                {items.map(item => (
                  <li key={item.l}>
                    <Link to={item.h}
                      className="text-sm text-navy-400 hover:text-gold-400 transition-colors">
                      {item.l}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div className="mt-14 pt-8 border-t border-navy-800 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-xs text-navy-500">
            © {new Date().getFullYear()} OverseasPortal. All rights reserved.
          </p>
          <div className="flex items-center gap-5 text-xs text-navy-500">
            <a href="mailto:support@overseasportal.com" className="flex items-center gap-1.5 hover:text-gold-400 transition-colors">
              <Mail size={12} /> support@overseasportal.com
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}
