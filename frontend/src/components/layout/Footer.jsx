import { Link } from 'react-router-dom'
import { FiGlobe, FiInstagram, FiFacebook, FiTwitter, FiYoutube, FiMail, FiPhone, FiMapPin } from 'react-icons/fi'

const footerLinks = {
  Explore: [
    { label: 'Destinations', path: '/destinations' },
    { label: 'Tour Packages', path: '/packages' },
    { label: 'AI Travel Planner', path: '/ai-planner' },
    { label: 'Honeymoon Specials', path: '/packages?category=honeymoon' },
    { label: 'Adventure Tours', path: '/packages?category=adventure' },
  ],
  Company: [
    { label: 'About Us', path: '#' },
    { label: 'Careers', path: '#' },
    { label: 'Press', path: '#' },
    { label: 'Blog', path: '#' },
    { label: 'Contact Us', path: '#' },
  ],
  Support: [
    { label: 'Help Center', path: '#' },
    { label: 'Cancellation Policy', path: '#' },
    { label: 'Privacy Policy', path: '#' },
    { label: 'Terms of Service', path: '#' },
    { label: 'Cookie Policy', path: '#' },
  ],
}

export default function Footer() {
  return (
    <footer className="bg-gray-950 text-gray-300">
      {/* Main footer */}
      <div className="page-container py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
          {/* Brand */}
          <div className="lg:col-span-2">
            <Link to="/" className="flex items-center gap-2 mb-5">
              <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center">
                <FiGlobe className="text-white text-xl" />
              </div>
              <span className="font-heading font-bold text-2xl text-white">
                Wander<span className="text-secondary">Lux</span>
              </span>
            </Link>
            <p className="text-sm leading-relaxed text-gray-400 max-w-xs mb-6">
              Your premium travel companion. We craft unforgettable journeys with AI-powered personalization and expert local knowledge.
            </p>
            <div className="space-y-2.5">
              {[
                { icon: <FiMail />, text: 'hello@wanderlux.in' },
                { icon: <FiPhone />, text: '+91 98765 43210' },
                { icon: <FiMapPin />, text: 'Mumbai, Maharashtra, India' },
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-2.5 text-sm">
                  <span className="text-primary">{item.icon}</span>
                  <span className="text-gray-400">{item.text}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Links */}
          {Object.entries(footerLinks).map(([section, links]) => (
            <div key={section}>
              <h4 className="font-semibold text-white mb-4">{section}</h4>
              <ul className="space-y-2.5">
                {links.map(link => (
                  <li key={link.label}>
                    <Link
                      to={link.path}
                      className="text-sm text-gray-400 hover:text-secondary transition-colors duration-200"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-gray-800">
        <div className="page-container py-5 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-gray-500">
            © {new Date().getFullYear()} WanderLux Travel Agency. All rights reserved.
          </p>
          <div className="flex items-center gap-3">
            {[
              { icon: <FiInstagram />, href: '#' },
              { icon: <FiFacebook />, href: '#' },
              { icon: <FiTwitter />, href: '#' },
              { icon: <FiYoutube />, href: '#' },
            ].map((s, i) => (
              <a
                key={i}
                href={s.href}
                className="w-8 h-8 rounded-lg bg-gray-800 flex items-center justify-center text-gray-400 hover:bg-primary hover:text-white transition-all duration-200"
              >
                {s.icon}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  )
}
