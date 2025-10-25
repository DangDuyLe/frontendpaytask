'use client';

import { Search, Sparkles, Users, DollarSign } from 'lucide-react';
import { motion } from 'framer-motion';

export default function Hero() {
  return (
    <section className="relative w-full px-10 py-6">
      {/* Container */}
      <div className="w-full mx-auto">
        {/* Hero Image with Rounded Corners */}
        <motion.div 
          className="relative rounded-3xl overflow-hidden shadow-2xl"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <img
            src="/person working.jpg"
            alt="Person working on laptop"
            className="w-full h-[480px] lg:h-[580px] object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-white/60 via-white/40 to-transparent lg:from-white/60 lg:via-white/40 lg:to-transparent"></div>
          
          {/* Content Overlay */}
          <div className="absolute inset-0 flex items-center">
            <div className="max-w-2xl space-y-6 py-8 px-8 lg:px-12">
              {/* Badge */}
              <motion.div 
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium" 
                style={{ backgroundColor: '#E8F5F1', color: '#20A277' }}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                <Sparkles className="w-4 h-4" />
                Web3-Powered Platform
              </motion.div>

              {/* Heading */}
              <motion.div 
                className="space-y-3"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
              >
                <h1 className="text-3xl lg:text-5xl font-bold leading-tight" style={{ color: '#344256' }}>
                  Turn Your Skills Into{' '}
                  <span style={{ color: '#20A277' }}>Real Earnings</span>
                </h1>
                <p className="text-base lg:text-lg max-w-xl" style={{ color: '#344256' }}>
                  Connect with global opportunities on Web3.{' '}
                  <span className="font-semibold">Transparent, fair,</span> and instant payments for everyone.
                </p>
              </motion.div>

              {/* Search Bar */}
              <motion.div 
                className="flex gap-2 max-w-xl"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
              >
                <div className="flex-1 relative bg-white rounded-lg shadow-sm">
                  <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    placeholder='Try "data entry" or "content writing"...'
                    className="w-full pl-12 pr-4 py-3 rounded-lg border focus:outline-none focus:ring-2 focus:border-transparent"
                    style={{ borderColor: '#D9D9D9', '--tw-ring-color': '#20A277' } as any}
                  />
                </div>
                <button className="text-white px-6 py-3 rounded-lg font-medium transition-colors hover:opacity-90 whitespace-nowrap" style={{ backgroundColor: '#20A277' }}>
                  Search
                </button>
              </motion.div>

              {/* Action Buttons */}
              <motion.div 
                className="flex flex-wrap gap-4"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.5 }}
              >
                <button className="flex items-center gap-2 text-white px-6 py-3 rounded-lg font-medium transition-colors hover:opacity-90" style={{ backgroundColor: '#20A277' }}>
                  Find Work
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
                <button className="bg-white px-6 py-3 rounded-lg font-medium border transition-colors hover:bg-gray-50" style={{ color: '#344256', borderColor: '#D9D9D9' }}>
                  Post a Task
                </button>
              </motion.div>

              {/* Stats */}
              <motion.div 
                className="flex gap-8 pt-4"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.6 }}
              >
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
              </motion.div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
