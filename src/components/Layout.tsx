import { Link, useLocation } from 'react-router-dom';
import { Tv, Menu, X, Film, Heart, LayoutGrid, Home, Monitor, BookOpen, Mail } from 'lucide-react';
import { useState } from 'react';

const navLinks = [
  { href: '/', label: 'Home', icon: Home },
  { href: '/live', label: 'Live TV', icon: Monitor },
  { href: '/movies', label: 'Movies', icon: Film },
  { href: '/categories', label: 'Categories', icon: LayoutGrid },
  { href: '/adult-zone', label: 'Adult Zone', icon: Heart },
  { href: '/others', label: 'Others', icon: BookOpen },
  { href: '/contact', label: 'Contact', icon: Mail },
];

const footerSections = [
  {
    title: 'Platform',
    links: [
      { href: '/live', label: 'Live TV' },
      { href: '/movies', label: 'Movies' },
      { href: '/categories', label: 'Categories' },
      { href: '/adult-zone', label: 'Adult Zone' },
    ],
  },
  {
    title: 'Support',
    links: [
      { href: '/about', label: 'About Us' },
      { href: '/contact', label: 'Contact' },
      { href: '/privacy', label: 'Privacy Policy' },
      { href: '/terms', label: 'Terms of Service' },
    ],
  },
  {
    title: 'Legal',
    links: [
      { href: '/privacy', label: 'Privacy Policy' },
      { href: '/terms', label: 'Terms of Service' },
      { href: '/disclaimer', label: 'Disclaimer' },
    ],
  },
];

const Navbar = () => {
  const [open, setOpen] = useState(false);
  const location = useLocation();

  return (
    <nav className="sticky top-0 z-50 glass border-b border-border">
      <div className="container mx-auto flex items-center justify-between h-16 px-4">
        <Link to="/" className="flex items-center gap-2.5 font-display font-bold text-xl">
          <div className="w-9 h-9 rounded-xl bg-hero-gradient flex items-center justify-center shadow-lg shadow-purple-500/20">
            <Tv className="w-5 h-5 text-white" />
          </div>
          <span className="text-foreground">
            Live<span className="text-gradient">Zone</span>
          </span>
        </Link>

        <div className="hidden md:flex items-center gap-1">
          {navLinks.map((l) => (
            <Link
              key={l.href}
              to={l.href}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 flex items-center gap-1.5 ${
                location.pathname === l.href
                  ? 'bg-primary/20 text-primary shadow-sm'
                  : 'text-muted-foreground hover:text-foreground hover:bg-accent/50'
              }`}
            >
              <l.icon className="w-4 h-4" />
              {l.label}
            </Link>
          ))}
        </div>

        <button
          onClick={() => setOpen(!open)}
          className="md:hidden p-2.5 rounded-lg hover:bg-accent/50 text-foreground transition-colors"
        >
          {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {open && (
        <div className="md:hidden border-t border-border glass animate-fade-in">
          <div className="px-4 py-3 space-y-1">
            {navLinks.map((l) => (
              <Link
                key={l.href}
                to={l.href}
                onClick={() => setOpen(false)}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                  location.pathname === l.href
                    ? 'bg-primary/20 text-primary'
                    : 'text-muted-foreground hover:bg-accent/50 hover:text-foreground'
                }`}
              >
                <l.icon className="w-4 h-4" />
                {l.label}
              </Link>
            ))}
          </div>
        </div>
      )}
    </nav>
  );
};

const Footer = () => (
  <footer className="bg-card border-t border-border mt-auto">
    <div className="container mx-auto px-4 py-12">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
        <div className="col-span-2 md:col-span-1">
          <Link to="/" className="flex items-center gap-2.5 font-display font-bold text-xl mb-3">
            <div className="w-8 h-8 rounded-lg bg-hero-gradient flex items-center justify-center shadow-lg shadow-purple-500/20">
              <Tv className="w-4 h-4 text-white" />
            </div>
            <span className="text-foreground">
              Live<span className="text-gradient">Zone</span>
            </span>
          </Link>
          <p className="text-muted-foreground text-sm leading-relaxed max-w-xs">
            Your gateway to live television and movies from around the world. Stream thousands of channels for free, anytime, anywhere.
          </p>
        </div>
        {footerSections.map((section) => (
          <div key={section.title}>
            <h4 className="font-display font-semibold text-foreground text-sm mb-3">{section.title}</h4>
            <ul className="space-y-2">
              {section.links.map((l) => (
                <li key={l.href}>
                  <Link to={l.href} className="text-sm text-muted-foreground hover:text-primary transition-colors">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <div className="border-t border-border mt-8 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
        <p className="text-sm text-muted-foreground">
          &copy; {new Date().getFullYear()} LiveZone TV. All rights reserved.
        </p>
        <p className="text-xs text-muted-foreground/50">
          Free IPTV Streaming Platform
        </p>
      </div>
    </div>
  </footer>
);

interface LayoutProps {
  children: React.ReactNode;
}

const Layout = ({ children }: LayoutProps) => (
  <div className="min-h-screen flex flex-col bg-grid-pattern">
    <Navbar />
    <main className="flex-1">{children}</main>
    <Footer />
  </div>
);

export default Layout;
