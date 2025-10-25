import Link from 'next/link';

export default function Footer() {
  const platformLinks = [
    { name: 'Find Tasks', href: '#' },
    { name: 'Post Task', href: '#' },
    { name: 'Dashboard', href: '#' },
    { name: 'Categories', href: '#' },
  ];

  const companyLinks = [
    { name: 'About Us', href: '#' },
    { name: 'How It Works', href: '#' },
    { name: 'Pricing', href: '#' },
    { name: 'Blog', href: '#' },
  ];

  const supportLinks = [
    { name: 'Help Center', href: '#' },
    { name: 'Terms of Service', href: '#' },
    { name: 'Privacy Policy', href: '#' },
    { name: 'Contact', href: '#' },
  ];

  return (
    <footer className="w-full border-t" style={{ backgroundColor: '#F5F5F5', borderColor: '#D9D9D9' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
          {/* Brand Column */}
          <div className="lg:col-span-1">
            <Link href="/" className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-full flex items-center justify-center" style={{ backgroundColor: '#20A277' }}>
                <span className="text-white font-bold text-sm">P</span>
              </div>
              <span className="text-xl font-semibold" style={{ color: '#344256' }}>PayTask</span>
            </Link>
            <p className="text-sm max-w-xs" style={{ color: '#344256' }}>
              The Web3 task exchange that turns free time into real earnings. Transparent, fair, and instant for everyone.
            </p>
          </div>

          {/* Platform Links */}
          <div>
            <h3 className="font-semibold mb-4" style={{ color: '#344256' }}>Platform</h3>
            <ul className="space-y-3">
              {platformLinks.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-sm transition-colors hover:opacity-80"
                    style={{ color: '#344256' }}
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company Links */}
          <div>
            <h3 className="font-semibold mb-4" style={{ color: '#344256' }}>Company</h3>
            <ul className="space-y-3">
              {companyLinks.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-sm transition-colors hover:opacity-80"
                    style={{ color: '#344256' }}
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support Links */}
          <div>
            <h3 className="font-semibold mb-4" style={{ color: '#344256' }}>Support</h3>
            <ul className="space-y-3">
              {supportLinks.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-sm transition-colors hover:opacity-80"
                    style={{ color: '#344256' }}
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8" style={{ borderTop: '1px solid #D9D9D9' }}>
          <p className="text-sm text-center" style={{ color: '#344256' }}>
            © 2024 PayTask. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
