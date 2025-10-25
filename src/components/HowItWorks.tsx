'use client';

import { UserPlus, Search, CheckCircle, DollarSign } from 'lucide-react';
import { motion } from 'framer-motion';

export default function HowItWorks() {
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
    <section className="w-full py-20" style={{ backgroundColor: '#F5F5F5' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Heading */}
        <motion.div 
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-4xl font-bold mb-3" style={{ color: '#344256' }}>
            How PayTask Works
          </h2>
          <p style={{ color: '#344256' }}>
            Get started in four simple steps and join the future of work
          </p>
        </motion.div>

        {/* Steps */}
        <div className="relative max-w-5xl mx-auto">
          {/* Steps Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {steps.map((step, index) => (
              <motion.div 
                key={step.title} 
                className="relative flex flex-col items-center text-center"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                {/* Icon Circle */}
                <div className="relative z-10 w-24 h-24 rounded-full flex items-center justify-center mb-6 shadow-lg" style={{ backgroundColor: '#20A277' }}>
                  <step.icon className="w-12 h-12 text-white" strokeWidth={2.5} />
                </div>

                {/* Connecting Line (hidden on mobile and last item) */}
                {index < steps.length - 1 && (
                  <div className="hidden lg:block absolute top-12 left-1/2 w-full h-1" 
                       style={{ 
                         zIndex: 0,
                         background: 'linear-gradient(to right, #20A277 0%, #20A277 40%, #D9D9D9 40%, #D9D9D9 100%)'
                       }}>
                  </div>
                )}

                {/* Content */}
                <h3 className="font-bold text-lg mb-2" style={{ color: '#344256' }}>
                  {step.title}
                </h3>
                <p className="text-sm max-w-xs" style={{ color: '#344256' }}>
                  {step.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
