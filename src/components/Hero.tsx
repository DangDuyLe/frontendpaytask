import { Search, Sparkles, Users, DollarSign } from 'lucide-react';

export default function Hero() {
  return (
    <section className="relative w-full h-[600px] lg:h-[700px] overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0">
        <img
          src="/person working.jpg"
          alt="Person working on laptop"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-white via-white/95 to-transparent lg:from-white/98 lg:via-white/90 lg:to-transparent"></div>
      </div>

      {/* Content */}
      <div className="relative h-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center">
        <div className="max-w-2xl space-y-8 py-12">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium" style={{ backgroundColor: '#E8F5F1', color: '#20A277' }}>
            <Sparkles className="w-4 h-4" />
            Web3-Powered Platform
          </div>

          {/* Heading */}
          <div className="space-y-4">
            <h1 className="text-5xl lg:text-6xl font-bold leading-tight" style={{ color: '#344256' }}>
              Turn Your Skills Into{' '}
              <span style={{ color: '#20A277' }}>Real Earnings</span>
            </h1>
            <p className="text-lg max-w-xl" style={{ color: '#344256' }}>
              Connect with global opportunities on Web3.{' '}
              <span className="font-semibold">Transparent, fair,</span> and instant payments for everyone.
            </p>
          </div>

          {/* Search Bar */}
          <div className="flex gap-2 max-w-xl">
            <div className="flex-1 relative bg-white rounded-lg shadow-sm">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder='Try "data entry" or "content writing"...'
                className="w-full pl-12 pr-4 py-4 rounded-lg border focus:outline-none focus:ring-2 focus:border-transparent"
                style={{ borderColor: '#D9D9D9', '--tw-ring-color': '#20A277' } as any}
              />
            </div>
            <button className="text-white px-8 py-4 rounded-lg font-medium transition-colors hover:opacity-90 whitespace-nowrap" style={{ backgroundColor: '#20A277' }}>
              Search
            </button>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap gap-4">
            <button className="flex items-center gap-2 text-white px-6 py-3 rounded-lg font-medium transition-colors hover:opacity-90" style={{ backgroundColor: '#20A277' }}>
              Find Work
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
            <button className="bg-white px-6 py-3 rounded-lg font-medium border transition-colors hover:bg-gray-50" style={{ color: '#344256', borderColor: '#D9D9D9' }}>
              Post a Task
            </button>
          </div>

          {/* Stats */}
          <div className="flex gap-8 pt-4">
            <div className="flex items-center gap-2">
              <Users className="w-5 h-5" style={{ color: '#20A277' }} />
              <div>
                <p className="text-sm font-medium" style={{ color: '#344256' }}>15K+ Active Workers</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <DollarSign className="w-5 h-5" style={{ color: '#20A277' }} />
              <div>
                <p className="text-sm font-medium" style={{ color: '#344256' }}>$2.3M+ Paid Out</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
