'use client';

import { Star, ShieldCheck, Zap, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';

export default function CTASection() {
  const trustIndicators = [
    {
      icon: Star,
      text: '4.9/5 Average Rating',
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
    <section className="w-full py-20" style={{ background: 'linear-gradient(to bottom right, #20A277, #1A8260)' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          {/* Badge */}
          <motion.div 
            className="inline-flex items-center gap-2 text-white px-4 py-2 rounded-full text-sm font-medium mb-8" 
            style={{ backgroundColor: 'rgba(255, 255, 255, 0.2)' }}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            Join PayTask Today
          </motion.div>

          {/* Heading */}
          <motion.h2 
            className="text-4xl lg:text-5xl font-bold text-white mb-4"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            Ready to Start Earning or
            <br />
            Get Tasks Done?
          </motion.h2>

          {/* Subheading */}
          <motion.p 
            className="text-xl mb-10" 
            style={{ color: '#E8F5F1' }}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            Join <span className="font-bold text-white">15,000+ workers</span> and clients transforming how work gets done
          </motion.p>

          {/* CTA Buttons */}
          <motion.div 
            className="flex flex-col sm:flex-row gap-4 justify-center mb-12"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <button className="group bg-white text-lg px-8 py-4 rounded-lg font-semibold transition-all flex items-center justify-center gap-2 shadow-lg hover:bg-gray-50" style={{ color: '#20A277' }}>
              Start as a Worker
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
            <button className="text-white text-lg px-8 py-4 rounded-lg font-semibold transition-colors shadow-lg" style={{ backgroundColor: 'rgba(0, 0, 0, 0.2)' }}>
              Post a Task
            </button>
          </motion.div>

          {/* Trust Indicators */}
          <motion.div 
            className="flex flex-wrap justify-center gap-8 items-center"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            {trustIndicators.map((indicator, index) => (
              <motion.div
                key={indicator.text}
                className="flex items-center gap-2 text-white"
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: 0.5 + index * 0.1 }}
              >
                <indicator.icon className="w-5 h-5" />
                <span className="text-sm font-medium">{indicator.text}</span>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
