'use client';

import { Search, Sparkles, Users, DollarSign } from 'lucide-react';
import { motion, useMotionValue, useTransform, animate } from 'framer-motion';
import { useEffect, useState } from 'react';

// Animated Counter Component
function AnimatedCounter({ value, suffix = '' }: { value: string; suffix?: string }) {
  const [displayValue, setDisplayValue] = useState(0);
  const numericValue = parseFloat(value.replace(/[^0-9.]/g, ''));

  useEffect(() => {
    const controls = animate(0, numericValue, {
      duration: 2,
      ease: "easeOut",
      onUpdate: (v) => setDisplayValue(v)
    });
    return controls.stop;
  }, [numericValue]);

  const formattedValue = value.includes('K') ? 
    `${Math.floor(displayValue)}K` : 
    value.includes('M') ? 
    `$${displayValue.toFixed(1)}M` : 
    displayValue.toFixed(0);

  return <span>{formattedValue}{suffix}</span>;
}

// Gradient Text Component
function GradientText({ children }: { children: React.ReactNode }) {
  return (
    <span 
      className="inline-block bg-gradient-to-r from-[#20A277] via-[#25B586] to-[#20A277] bg-clip-text text-transparent animate-gradient-x"
      style={{
        backgroundSize: '200% auto',
      }}
    >
      {children}
    </span>
  );
}

export default function Hero() {
  return (
    <section className="relative w-full px-10 py-6">
      {/* Container */}
      <div className="w-full mx-auto">
        {/* Hero Image with Rounded Corners */}
        <motion.div 
          className="relative rounded-3xl overflow-hidden shadow-2xl"
          initial={{ opacity: 0, y: 20, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
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
              {/* Badge with Shimmer Effect */}
              <motion.div 
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium relative overflow-hidden" 
                style={{ backgroundColor: '#E8F5F1', color: '#20A277' }}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                whileHover={{ scale: 1.05 }}
              >
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent"
                  initial={{ x: '-100%' }}
                  animate={{ x: '200%' }}
                  transition={{ duration: 2, repeat: Infinity, repeatDelay: 3, ease: 'easeInOut' }}
                />
                <Sparkles className="w-4 h-4 relative z-10" />
                <span className="relative z-10">Web3-Powered Platform</span>
              </motion.div>

              {/* Heading with Gradient Text and Cursor Effect */}
              <motion.div 
                className="space-y-3"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
              >
                <h1 className="text-3xl lg:text-5xl font-bold leading-tight">
                  {/* Staggered character animation */}
                  {['Turn Your Skills Into', ' '].map((word, i) => (
                    <motion.span
                      key={i}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: 0.4 + i * 0.1 }}
                      style={{ color: '#344256', display: 'inline-block', marginRight: i === 0 ? '0.3em' : 0 }}
                    >
                      {word}
                    </motion.span>
                  ))}
                  <motion.span
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: 0.6 }}
                    style={{ display: 'inline-block' }}
                  >
                    <GradientText>Real Earnings</GradientText>
                  </motion.span>
                </h1>
                <motion.p 
                  className="text-base lg:text-lg max-w-xl" 
                  style={{ color: '#344256' }}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.6, delay: 0.7 }}
                >
                  Connect with global opportunities on Web3.{' '}
                  <span className="font-semibold">Transparent, fair,</span> and instant payments for everyone.
                </motion.p>
              </motion.div>

              {/* Search Bar with Focus Animation */}
              <motion.div 
                className="flex gap-2 max-w-xl"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.8 }}
              >
                <motion.div 
                  className="flex-1 relative bg-white rounded-lg shadow-sm"
                  whileHover={{ scale: 1.02 }}
                  whileFocus={{ scale: 1.02 }}
                >
                  <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    placeholder='Try "data entry" or "content writing"...'
                    className="w-full pl-12 pr-4 py-3 rounded-lg border focus:outline-none focus:ring-2 focus:border-transparent"
                    style={{ borderColor: '#D9D9D9', '--tw-ring-color': '#20A277' } as any}
                  />
                </motion.div>
                <motion.button 
                  className="text-white px-6 py-3 rounded-lg font-medium whitespace-nowrap relative overflow-hidden group" 
                  style={{ backgroundColor: '#20A277' }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <motion.span
                    className="absolute inset-0 bg-white opacity-0 group-hover:opacity-20"
                    initial={false}
                  />
                  <span className="relative z-10">Search</span>
                </motion.button>
              </motion.div>

              {/* Action Buttons with Enhanced Hover */}
              <motion.div 
                className="flex flex-wrap gap-4"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.9 }}
              >
                <motion.button 
                  className="flex items-center gap-2 text-white px-6 py-3 rounded-lg font-medium group relative overflow-hidden" 
                  style={{ backgroundColor: '#20A277' }}
                  whileHover={{ scale: 1.05, boxShadow: '0 10px 30px rgba(32, 162, 119, 0.3)' }}
                  whileTap={{ scale: 0.95 }}
                >
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                    initial={{ x: '-100%' }}
                    whileHover={{ x: '100%' }}
                    transition={{ duration: 0.6 }}
                  />
                  <span className="relative z-10">Find Work</span>
                  <motion.svg 
                    className="w-4 h-4 relative z-10" 
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                    animate={{ x: [0, 3, 0] }}
                    transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </motion.svg>
                </motion.button>
                <motion.button 
                  className="bg-white px-6 py-3 rounded-lg font-medium border" 
                  style={{ color: '#344256', borderColor: '#D9D9D9' }}
                  whileHover={{ 
                    scale: 1.05, 
                    borderColor: '#20A277',
                    boxShadow: '0 5px 15px rgba(0, 0, 0, 0.1)'
                  }}
                  whileTap={{ scale: 0.95 }}
                >
                  Post a Task
                </motion.button>
              </motion.div>

              {/* Stats with Counter Animation */}
              <motion.div 
                className="flex gap-8 pt-4"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 1.0 }}
              >
                <motion.div 
                  className="flex items-center gap-2"
                  whileHover={{ scale: 1.05 }}
                >
                  <motion.div
                    animate={{ rotate: [0, 10, -10, 0] }}
                    transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
                  >
                    <Users className="w-5 h-5" style={{ color: '#20A277' }} />
                  </motion.div>
                  <div>
                    <p className="text-sm font-medium" style={{ color: '#344256' }}>
                      <AnimatedCounter value="15K" />+ Active Workers
                    </p>
                  </div>
                </motion.div>
                <motion.div 
                  className="flex items-center gap-2"
                  whileHover={{ scale: 1.05 }}
                >
                  <motion.div
                    animate={{ rotate: [0, 10, -10, 0] }}
                    transition={{ duration: 2, repeat: Infinity, repeatDelay: 3, delay: 0.5 }}
                  >
                    <DollarSign className="w-5 h-5" style={{ color: '#20A277' }} />
                  </motion.div>
                  <div>
                    <p className="text-sm font-medium" style={{ color: '#344256' }}>
                      <AnimatedCounter value="$2.3M" />+ Paid Out
                    </p>
                  </div>
                </motion.div>
              </motion.div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}