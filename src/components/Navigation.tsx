import Link from 'next/link';
import { Search } from 'lucide-react';

export default function Navigation() {
  return (
    <nav className="w-full bg-white border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full flex items-center justify-center" style={{ backgroundColor: '#20A277' }}>
              <span className="text-white font-bold text-sm">P</span>
            </div>
            <span className="text-xl font-semibold" style={{ color: '#344256' }}>PayTask</span>
          </Link>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center gap-8">
            <Link href="#" className="text-gray-600 hover:text-gray-900 text-sm font-medium" style={{ color: '#344256' }}>
              How It Works
            </Link>
            <Link href="#" className="text-gray-600 hover:text-gray-900 text-sm font-medium" style={{ color: '#344256' }}>
              Categories
            </Link>
            <Link href="#" className="text-gray-600 hover:text-gray-900 text-sm font-medium" style={{ color: '#344256' }}>
              Pricing
            </Link>
          </div>

          {/* Right Side Actions */}
          <div className="flex items-center gap-4">
            <Link href="/discover-tasks">
              <button className="p-2 hover:bg-gray-100 rounded-full">
                <Search className="w-5 h-5" style={{ color: '#344256' }} />
              </button>
            </Link>
            <Link href="/login" className="text-sm font-medium" style={{ color: '#344256' }}>
              Sign In
            </Link>
            <Link
              href="/signup"
              className="text-white px-6 py-2 rounded-lg text-sm font-medium transition-colors hover:opacity-90"
              style={{ backgroundColor: '#20A277' }}
            >
              Get Started
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}
