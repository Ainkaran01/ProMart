import { Link } from 'react-router-dom';
import { Facebook, Twitter, Linkedin, Instagram, Mail, Phone, MapPin, ChevronDown } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useState } from 'react';
import logo from '@/assets/promart-logo.png';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  const [openSection, setOpenSection] = useState<string | null>(null);

  const footerSections = [
    {
      title: 'Company',
      links: [
        { label: 'About Us', href: '/about' },
        { label: 'Our Team', href: '/team' },
        { label: 'Careers', href: '/careers' },
        { label: 'Contact', href: '/contact' },
        { label: 'Blog', href: '/blog' },
      ],
    },
    {
      title: 'Services',
      links: [
        { label: 'Browse Listings', href: '/listings' },
        { label: 'Post a Listing', href: '/dashboard' },
        { label: 'Premium Features', href: '/premium' },
        { label: 'API Access', href: '/api' },
        { label: 'Partnerships', href: '/partners' },
      ],
    },
    {
      title: 'Support',
      links: [
        { label: 'Help Center', href: '/help' },
        { label: 'Community Forum', href: '/forum' },
        { label: 'Documentation', href: '/docs' },
        { label: 'Service Status', href: '/status' },
      ],
    },
    {
      title: 'Legal',
      links: [
        { label: 'Terms of Service', href: '/terms' },
        { label: 'Privacy Policy', href: '/privacy' },
        { label: 'Cookie Policy', href: '/cookies' },
        { label: 'GDPR', href: '/gdpr' },
      ],
    },
  ];

  const toggleSection = (title: string) => {
    setOpenSection(openSection === title ? null : title);
  };

  return (
    <footer className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white">
      {/* Main Footer Content */}
      <div className="container mx-auto px-4 py-8 lg:py-12">
        <div className="grid gap-6 lg:grid-cols-6 lg:gap-8">
          {/* Brand Section - Mobile Optimized */}
          <div className="lg:col-span-2 text-center lg:text-left">
            <div className="mb-4 lg:mb-6 flex flex-col items-center lg:items-start">
              <Link to="/" className="inline-block transition-transform hover:scale-105 mb-3">
                <img 
                  src={logo} 
                  alt="ProMart" 
                  className="h-14 lg:h-16 brightness-0 invert"
                />
              </Link>
              {/* Text logo */}
              <div className="mb-4">
                <h2 className="text-xl lg:text-2xl font-bold bg-gradient-to-r from-white to-slate-300 bg-clip-text text-transparent">
                  ProMart
                </h2>
                <div className="h-1 w-12 bg-gradient-to-r from-blue-500 to-cyan-500 mt-1 rounded-full mx-auto lg:mx-0"></div>
              </div>
            </div>
            
            <p className="mb-4 lg:mb-6 text-sm lg:text-lg font-light text-slate-300 leading-relaxed text-center lg:text-left">
              Connecting businesses worldwide with premium B2B solutions.
            </p>
            
            {/* Contact Info - Stacked on mobile */}
            <div className="space-y-2 lg:space-y-3 mb-6 lg:mb-0">
              <div className="flex items-center justify-center lg:justify-start gap-3 text-slate-300">
                <Mail className="h-4 w-4 flex-shrink-0" />
                <span className="text-xs lg:text-sm">promartlk@gmail.com</span>
              </div>
              <div className="flex items-center justify-center lg:justify-start gap-3 text-slate-300">
                <Phone className="h-4 w-4 flex-shrink-0" />
                <span className="text-xs lg:text-sm">+94 779520933  </span>
              </div>
              <div className="flex items-center justify-center lg:justify-start gap-3 text-slate-300">
                <MapPin className="h-4 w-4 flex-shrink-0" />
                <span className="text-xs lg:text-sm">Chavakachcheri , Jaffna.</span>
              </div>
            </div>
          </div>

          {/* Mobile Accordion Sections */}
          <div className="lg:hidden space-y-2">
            {footerSections.map((section) => (
              <div key={section.title} className="border-b border-slate-700">
                <button
                  onClick={() => toggleSection(section.title)}
                  className="flex w-full items-center justify-between py-4 text-left"
                >
                  <h3 className="text-sm font-semibold uppercase tracking-wider text-white">
                    {section.title}
                  </h3>
                  <ChevronDown 
                    className={`h-4 w-4 transition-transform duration-300 ${
                      openSection === section.title ? 'rotate-180' : ''
                    }`}
                  />
                </button>
                <div 
                  className={`overflow-hidden transition-all duration-300 ${
                    openSection === section.title ? 'max-h-96 pb-4' : 'max-h-0'
                  }`}
                >
                  <ul className="space-y-3 pl-2">
                    {section.links.map((link) => (
                      <li key={link.label}>
                        <Link
                          to={link.href}
                          className="text-sm text-slate-300 transition-all duration-300 hover:text-white hover:translate-x-1 hover:underline block py-1"
                          onClick={() => setOpenSection(null)}
                        >
                          {link.label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>

          {/* Desktop Link Sections */}
          {footerSections.map((section) => (
            <div key={section.title} className="hidden lg:block">
              <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-white">
                {section.title}
              </h3>
              <ul className="space-y-3">
                {section.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      to={link.href}
                      className="text-sm text-slate-300 transition-all duration-300 hover:text-white hover:translate-x-1 hover:underline"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          {/* Newsletter Section - Full width on mobile */}
          <div className="lg:col-span-1 lg:mt-0">
            <h3 className="mb-3 lg:mb-4 text-sm font-semibold uppercase tracking-wider text-white text-center lg:text-left">
              Newsletter
            </h3>
            <p className="mb-3 lg:mb-4 text-xs lg:text-sm text-slate-300 text-center lg:text-left">
              Subscribe for updates and offers.
            </p>
            <div className="flex flex-col sm:flex-row gap-2">
              <Input 
                type="email" 
                placeholder="Enter your email"
                className="bg-slate-700 border-slate-600 text-white placeholder:text-slate-400 text-sm"
              />
              <Button className="bg-blue-600 hover:bg-blue-700 text-white whitespace-nowrap text-sm">
                Subscribe
              </Button>
            </div>
          </div>
        </div>

        <Separator className="my-6 lg:my-8 bg-slate-700" />

        {/* Bottom Section - Stacked on mobile */}
        <div className="flex flex-col items-center gap-4 lg:flex-row lg:justify-between">
          {/* Copyright - Centered on mobile */}
          <div className="text-center lg:text-left order-2 lg:order-1">
            <p className="text-xs lg:text-sm text-slate-400">
              © {currentYear} ProMart. All rights reserved.
            </p>
            <p className="text-xs text-slate-500 mt-1 hidden lg:block">
              Enterprise B2B Platform • Trusted by 10,000+ Companies
            </p>
          </div>

          {/* Social Links - Centered on mobile */}
          <div className="flex flex-col items-center gap-4 order-1 lg:order-2">
            <div className="flex gap-2">
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-10 w-10 items-center justify-center rounded-lg bg-slate-700 transition-all duration-300 hover:bg-blue-600 hover:scale-110"
              >
                <Facebook className="h-5 w-5" />
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-10 w-10 items-center justify-center rounded-lg bg-slate-700 transition-all duration-300 hover:bg-sky-500 hover:scale-110"
              >
                <Twitter className="h-5 w-5" />
              </a>
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-10 w-10 items-center justify-center rounded-lg bg-slate-700 transition-all duration-300 hover:bg-blue-500 hover:scale-110"
              >
                <Linkedin className="h-5 w-5" />
              </a>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-10 w-10 items-center justify-center rounded-lg bg-slate-700 transition-all duration-300 hover:bg-pink-600 hover:scale-110"
              >
                <Instagram className="h-5 w-5" />
              </a>
            </div>
            
            {/* Trust Badges - Hidden on mobile */}
            <div className="hidden lg:flex items-center gap-4 pl-4 border-l border-slate-700">
              <div className="text-xs text-slate-400">
                <div>SSL Secured</div>
                <div className="font-semibold text-green-400">Verified</div>
              </div>
            </div>
          </div>
        </div>

        {/* Mobile Trust Badge */}
        <div className="mt-4 lg:hidden text-center">
          <div className="text-xs text-slate-400 inline-flex items-center gap-2 bg-slate-800 px-3 py-1 rounded-full">
            <div className="w-2 h-2 bg-green-400 rounded-full"></div>
            SSL Secured • Verified Platform
          </div>
        </div>
      </div>

      {/* Premium Accent */}
      <div className="h-1 bg-gradient-to-r from-blue-600 via-purple-600 to-cyan-600"></div>
    </footer>
  );
};

export default Footer;