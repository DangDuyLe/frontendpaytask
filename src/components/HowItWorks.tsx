'use client';

import { UserPlus, Search, CheckCircle, DollarSign } from 'lucide-react';
import { motion, useScroll, useTransform, useSpring } from 'framer-motion';
import { useRef } from 'react';

// Animated Step Card with Advanced Effects
function AnimatedStepCard({ step, index, totalSteps }: { step: any; index: number; totalSteps: number }) {
  const cardRef = useRef<HTMLDivElement>(null);
  
  return (
    <motion.div 
      ref={cardRef}
      className="relative flex flex-col items-center text-center"
      initial={{ opacity: 0, y: 50, scale: 0.8 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ 
        duration: 0.6, 
        delay: index * 0.15,
        ease: [0.25, 0.46, 0.45, 0.94]
      }}
    >
      {/* Icon Circle with Pulse Animation */}
      <motion.div 
        className="relative z-10 w-24 h-24 rounded-full flex items-center justify-center mb-6 shadow-lg" 
        style={{ backgroundColor: '#20A277' }}
        whileHover={{ 
          scale: 1.1,
          transition: { duration: 0.3, type: 'spring' }
        }}
        initial={{ scale: 0, rotate: -180 }}
        whileInView={{ scale: 1, rotate: 0 }}
        viewport={{ once: true }}
        transition={{ 
          duration: 0.8, 
          delay: index * 0.15 + 0.2,
          type: 'spring',
          stiffness: 200
        }}
      >
        {/* Animated rings */}
        <motion.div
          className="absolute inset-0 rounded-full"
          style={{ border: '3px solid #20A277' }}
          animate={{
            scale: [1, 1.3, 1.3],
            opacity: [0.7, 0, 0],
          }}
          transition={{
            duration: 5,
            repeat: Infinity,
            ease: 'easeOut',
          }}
        />
        <motion.div
          className="absolute inset-0 rounded-full"
          style={{ border: '3px solid #20A277' }}
          animate={{
            scale: [1, 1.3, 1.3],
            opacity: [0.7, 0, 0],
          }}
          transition={{
            duration: 5,
            delay: 2.5,
            repeat: Infinity,
            ease: 'easeOut',
          }}
        />
        
        {/* Icon */}
        <step.icon className="w-12 h-12 text-white" strokeWidth={2.5} />

        {/* Step number badge */}
        <motion.div
          className="absolute -top-2 -right-2 w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white shadow-md"
          style={{ backgroundColor: '#1A8260' }}
          initial={{ scale: 0 }}
          whileInView={{ scale: 1 }}
          viewport={{ once: true }}
          transition={{ 
            duration: 0.4, 
            delay: index * 0.15 + 0.4,
            type: 'spring',
            stiffness: 300
          }}
        >
          {step.step}
        </motion.div>
      </motion.div>

      {/* Connecting Line with Animated Progress */}
      {index < totalSteps - 1 && (
        <div className="hidden lg:block absolute top-12 left-1/2 w-full h-1 overflow-hidden" 
             style={{ zIndex: 0 }}>
          {/* Base line */}
          <motion.div
            className="absolute inset-0"
            style={{ backgroundColor: '#D9D9D9' }}
          />
          {/* Animated progress line */}
          <motion.div
            className="absolute inset-0 origin-left"
            style={{ backgroundColor: '#20A277' }}
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true }}
            transition={{ 
              duration: 0.8, 
              delay: index * 0.15 + 0.5,
              ease: 'easeInOut'
            }}
          />
          
          {/* Moving dot along the line */}
          <motion.div
            className="absolute top-1/2 -translate-y-1/2 w-3 h-3 rounded-full"
            style={{ backgroundColor: '#20A277' }}
            initial={{ left: '0%' }}
            animate={{ left: ['0%', '100%'] }}
            transition={{
              duration: 2,
              delay: index * 0.15 + 1,
              repeat: Infinity,
              repeatDelay: 3,
              ease: 'easeInOut'
            }}
          />
        </div>
      )}

      {/* Content with Stagger Effect */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, delay: index * 0.15 + 0.3 }}
      >
        <motion.h3 
          className="font-bold text-lg mb-2" 
          style={{ color: '#344256' }}
          whileHover={{ scale: 1.05, color: '#20A277' }}
          transition={{ duration: 0.2 }}
        >
          {step.title}
        </motion.h3>
        
        <motion.p 
          className="text-sm max-w-xs" 
          style={{ color: '#344256' }}
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: index * 0.15 + 0.4 }}
        >
          {step.description}
        </motion.p>
      </motion.div>

      {/* Decorative particles */}
      {[...Array(3)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-2 h-2 rounded-full"
          style={{ 
            backgroundColor: '#20A277',
            top: `${20 + i * 25}%`,
            left: `${10 + i * 15}%`,
          }}
          animate={{
            y: [0, -20, 0],
            opacity: [0, 1, 0],
          }}
          transition={{
            duration: 2,
            delay: index * 0.15 + i * 0.3,
            repeat: Infinity,
            repeatDelay: 2,
          }}
        />
      ))}
    </motion.div>
  );
}

export default function HowItWorks() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"]
  });

  const y = useTransform(scrollYProgress, [0, 1], [100, -100]);
  const opacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0, 1, 1, 0]);

  const steps = [
    {
      icon: UserPlus,
      title: 'Create Account',
      description: 'Sign up and connect your Web3 wallet in seconds',
      step: 1,
    },
    {
      icon: Search,
      title: 'Post or Find Task',
      description: 'Browse available tasks or post your own requirements',
      step: 2,
    },
    {
      icon: CheckCircle,
      title: 'Complete Work',
      description: 'Submit your work with proof and wait for approval',
      step: 3,
    },
    {
      icon: DollarSign,
      title: 'Get Paid Instantly',
      description: 'Receive payment directly to your wallet upon approval',
      step: 4,
    },
  ];

  return (
    <section 
      ref={sectionRef}
      className="w-full py-20 relative overflow-hidden" 
      style={{ backgroundColor: '#F5F5F5' }}
    >
      {/* Animated background elements */}
      <motion.div
        className="absolute top-10 left-10 w-64 h-64 rounded-full opacity-10"
        style={{ 
          backgroundColor: '#20A277',
          y,
          filter: 'blur(60px)',
        }}
      />
      <motion.div
        className="absolute bottom-10 right-10 w-96 h-96 rounded-full opacity-10"
        style={{ 
          backgroundColor: '#20A277',
          y: useTransform(scrollYProgress, [0, 1], [-50, 50]),
          filter: 'blur(80px)',
        }}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Heading with Parallax */}
        <motion.div 
          className="text-center mb-16"
          style={{ opacity }}
        >
          <motion.div
            initial={{ opacity: 0, y: 30, filter: 'blur(10px)' }}
            whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <motion.h2 
              className="text-4xl font-bold mb-3 inline-block" 
              style={{ color: '#344256' }}
              whileHover={{ scale: 1.05 }}
              transition={{ type: 'spring', stiffness: 300 }}
            >
              How PayTask Works
            </motion.h2>
          </motion.div>
          
          <motion.p 
            style={{ color: '#344256' }}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            Get started in four simple steps and join the future of work
          </motion.p>
        </motion.div>

        {/* Steps */}
        <div className="relative max-w-5xl mx-auto">
          {/* Steps Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {steps.map((step, index) => (
              <AnimatedStepCard 
                key={step.title} 
                step={step} 
                index={index}
                totalSteps={steps.length}
              />
            ))}
          </div>
        </div>

        {/* Call to action with pulse */}
        <motion.div
          className="text-center mt-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.8 }}
        >
          <motion.button
            className="px-8 py-4 rounded-lg text-white font-semibold text-lg shadow-lg"
            style={{ backgroundColor: '#20A277' }}
            whileHover={{ 
              scale: 1.05,
              boxShadow: '0 15px 35px rgba(32, 162, 119, 0.4)',
            }}
            whileTap={{ scale: 0.95 }}
            animate={{
              boxShadow: [
                '0 10px 25px rgba(32, 162, 119, 0.3)',
                '0 15px 35px rgba(32, 162, 119, 0.5)',
                '0 10px 25px rgba(32, 162, 119, 0.3)',
              ],
            }}
            transition={{
              boxShadow: {
                duration: 2,
                repeat: Infinity,
                ease: 'easeInOut',
              },
            }}
          >
            Get Started Now
          </motion.button>
        </motion.div>
      </div>
    </section>
  );
}
