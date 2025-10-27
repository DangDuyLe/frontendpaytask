'use client';

import { Star, ShieldCheck, Zap, ArrowRight } from 'lucide-react';
import { motion, useMotionValue, useTransform, animate } from 'framer-motion';
import { useEffect, useRef } from 'react';

// Particle background component
function FloatingParticles() {
  const particles = Array.from({ length: 20 });
  
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {particles.map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-2 h-2 rounded-full bg-white"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
          }}
          animate={{
            y: [0, -30, 0],
            opacity: [0.2, 0.8, 0.2],
            scale: [1, 1.5, 1],
          }}
          transition={{
            duration: 3 + Math.random() * 2,
            repeat: Infinity,
            delay: Math.random() * 2,
            ease: 'easeInOut',
          }}
        />
      ))}
    </div>
  );
}

// Shiny text with gradient animation
function ShinyText({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return (
    <motion.span
      className={`inline-block relative ${className}`}
      initial={{ backgroundPosition: '200% center' }}
      animate={{ backgroundPosition: '-200% center' }}
      transition={{
        duration: 3,
        repeat: Infinity,
        ease: 'linear',
      }}
      style={{
        backgroundImage: 'linear-gradient(90deg, rgba(255,255,255,1) 0%, rgba(255,255,255,0.8) 25%, rgba(255,255,255,1) 50%, rgba(255,255,255,0.8) 75%, rgba(255,255,255,1) 100%)',
        backgroundSize: '200% auto',
        WebkitBackgroundClip: 'text',
        backgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
      }}
    >
      {children}
    </motion.span>
  );
}

// Wave animation component
function AnimatedWaves() {
  return (
    <div className="absolute bottom-0 left-0 right-0 h-32 overflow-hidden opacity-30">
      <motion.svg
        className="absolute bottom-0 w-full h-full"
        viewBox="0 0 1440 320"
        preserveAspectRatio="none"
      >
        <motion.path
          fill="rgba(255, 255, 255, 0.3)"
          d="M0,192L48,197.3C96,203,192,213,288,229.3C384,245,480,267,576,250.7C672,235,768,181,864,181.3C960,181,1056,235,1152,234.7C1248,235,1344,181,1392,154.7L1440,128L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
          animate={{
            d: [
              "M0,192L48,197.3C96,203,192,213,288,229.3C384,245,480,267,576,250.7C672,235,768,181,864,181.3C960,181,1056,235,1152,234.7C1248,235,1344,181,1392,154.7L1440,128L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z",
              "M0,256L48,240C96,224,192,192,288,186.7C384,181,480,203,576,224C672,245,768,267,864,250.7C960,235,1056,181,1152,170.7C1248,160,1344,192,1392,208L1440,224L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z",
              "M0,192L48,197.3C96,203,192,213,288,229.3C384,245,480,267,576,250.7C672,235,768,181,864,181.3C960,181,1056,235,1152,234.7C1248,235,1344,181,1392,154.7L1440,128L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z",
            ],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
        <motion.path
          fill="rgba(255, 255, 255, 0.2)"
          d="M0,128L48,144C96,160,192,192,288,197.3C384,203,480,181,576,186.7C672,192,768,224,864,224C960,224,1056,192,1152,165.3C1248,139,1344,117,1392,106.7L1440,96L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
          animate={{
            d: [
              "M0,128L48,144C96,160,192,192,288,197.3C384,203,480,181,576,186.7C672,192,768,224,864,224C960,224,1056,192,1152,165.3C1248,139,1344,117,1392,106.7L1440,96L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z",
              "M0,96L48,112C96,128,192,160,288,160C384,160,480,128,576,138.7C672,149,768,203,864,213.3C960,224,1056,192,1152,165.3C1248,139,1344,117,1392,106.7L1440,96L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z",
              "M0,128L48,144C96,160,192,192,288,197.3C384,203,480,181,576,186.7C672,192,768,224,864,224C960,224,1056,192,1152,165.3C1248,139,1344,117,1392,106.7L1440,96L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z",
            ],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
      </motion.svg>
    </div>
  );
}

export default function CTASection() {
  const trustIndicators = [
    {
      icon: Star,
      text: 'Human-Verified Tasks',
    },
    {
      icon: ShieldCheck,
      text: 'Secure & Verified',
    },
    {
      icon: Zap,
      text: 'Instant Payments',
    },
  ];

  return (
    <section 
      className="w-full py-20 relative overflow-hidden" 
      style={{ background: 'linear-gradient(135deg, #20A277 0%, #1A8260 50%, #167050 100%)' }}
    >
      {/* Animated background elements */}
      <FloatingParticles />
      <AnimatedWaves />

      {/* Radial gradient overlay */}
      <motion.div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(circle at 50% 50%, rgba(255,255,255,0.1) 0%, transparent 70%)',
        }}
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.3, 0.5, 0.3],
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center">
          {/* Badge with Shimmer */}
          <motion.div 
            className="inline-flex items-center gap-2 text-white px-4 py-2 rounded-full text-sm font-medium mb-8 relative overflow-hidden" 
            style={{ backgroundColor: 'rgba(255, 255, 255, 0.2)' }}
            initial={{ opacity: 0, y: 20, scale: 0.8 }}
            whileInView={{ opacity: 1, y: 0, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, type: 'spring', stiffness: 200 }}
            whileHover={{ scale: 1.05 }}
          >
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
              animate={{ x: ['-100%', '200%'] }}
              transition={{ duration: 2, repeat: Infinity, repeatDelay: 1 }}
            />
            <motion.span
              className="relative z-10"
              animate={{ rotate: [0, 10, -10, 0] }}
              transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
            >
              ✨
            </motion.span>
            <span className="relative z-10">Join PayTask Today</span>
          </motion.div>

          {/* Heading with Shiny Effect */}
          <motion.h2 
            className="text-4xl lg:text-5xl font-bold mb-4"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.1 }}
          >
            <ShinyText className="text-white">
              Ready to Start Earning or
              <br />
              Get Tasks Done?
            </ShinyText>
          </motion.h2>

          {/* Subheading with Type Effect */}
          <motion.p 
            className="text-xl mb-10" 
            style={{ color: '#E8F5F1' }}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            Join the next generation of freelancers and creators redefining work on Web3
          </motion.p>

          {/* CTA Buttons with Advanced Hover */}
          <motion.div 
            className="flex flex-col sm:flex-row gap-4 justify-center mb-12"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <motion.button 
              className="group bg-white text-lg px-8 py-4 rounded-lg font-semibold flex items-center justify-center gap-2 shadow-lg relative overflow-hidden" 
              style={{ color: '#20A277' }}
              whileHover={{ 
                scale: 1.05,
                boxShadow: '0 20px 40px rgba(0, 0, 0, 0.3)',
              }}
              whileTap={{ scale: 0.95 }}
            >
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-transparent via-gray-100 to-transparent"
                initial={{ x: '-100%' }}
                whileHover={{ x: '100%' }}
                transition={{ duration: 0.6 }}
              />
              <span className="relative z-10">Start as a Worker</span>
              <motion.div
                className="relative z-10"
                animate={{ x: [0, 5, 0] }}
                transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
              >
                <ArrowRight className="w-5 h-5" />
              </motion.div>
            </motion.button>

            <motion.button 
              className="text-white text-lg px-8 py-4 rounded-lg font-semibold shadow-lg relative overflow-hidden group" 
              style={{ backgroundColor: 'rgba(0, 0, 0, 0.2)' }}
              whileHover={{ 
                scale: 1.05,
                backgroundColor: 'rgba(255, 255, 255, 0.2)',
                boxShadow: '0 20px 40px rgba(0, 0, 0, 0.3)',
              }}
              whileTap={{ scale: 0.95 }}
            >
              <span className="relative z-10">Post a Task</span>
            </motion.button>
          </motion.div>

          {/* Trust Indicators with Stagger */}
          <motion.div 
            className="flex flex-wrap justify-center gap-8 items-center"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            {trustIndicators.map((indicator, index) => (
              <motion.div
                key={indicator.text}
                className="flex items-center gap-2 text-white group cursor-pointer"
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.5 + index * 0.1 }}
                whileHover={{ scale: 1.1, y: -5 }}
              >
                <indicator.icon className="w-5 h-5" />
                <motion.span 
                  className="text-sm font-medium"
                  whileHover={{ textShadow: '0 0 8px rgba(255,255,255,0.8)' }}
                >
                  {indicator.text}
                </motion.span>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
