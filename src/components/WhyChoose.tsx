'use client';

import { Zap, DollarSign, Shield, Globe } from 'lucide-react';
import { motion, useMotionValue, useSpring, useTransform, animate } from 'framer-motion';
import { useEffect, useState, useRef } from 'react';

// Count Up Animation Component
function CountUpStat({ endValue, duration = 2 }: { endValue: string; duration?: number }) {
  const [count, setCount] = useState(0);
  const nodeRef = useRef<HTMLSpanElement>(null);
  const [hasAnimated, setHasAnimated] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !hasAnimated) {
            setHasAnimated(true);
            const numeric = parseFloat(endValue.replace(/[^0-9.]/g, ''));
            const controls = animate(0, numeric, {
              duration,
              ease: 'easeOut',
              onUpdate: (v) => setCount(v),
            });
            return () => controls.stop();
          }
        });
      },
      { threshold: 0.5 }
    );

    if (nodeRef.current) {
      observer.observe(nodeRef.current);
    }

    return () => observer.disconnect();
  }, [endValue, duration, hasAnimated]);

  const displayValue = endValue.includes('+')
    ? `${Math.floor(count)}+`
    : endValue.includes('%')
    ? `${Math.floor(count)}%`
    : endValue.includes('<')
    ? `< ${Math.floor(count)}`
    : endValue.includes('M') 
    ? `$${count.toFixed(1)}M+`
    : `$${Math.floor(count)}`;

  return <span ref={nodeRef}>{displayValue}</span>;
}

// Floating Feature Card
function FloatingFeatureCard({ feature, index }: { feature: any; index: number }) {
  const [isHovered, setIsHovered] = useState(false);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const springConfig = { damping: 20, stiffness: 200 };
  const translateX = useSpring(useTransform(mouseX, [-200, 200], [-15, 15]), springConfig);
  const translateY = useSpring(useTransform(mouseY, [-200, 200], [-15, 15]), springConfig);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    mouseX.set(e.clientX - centerX);
    mouseY.set(e.clientY - centerY);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    mouseX.set(0);
    mouseY.set(0);
  };

  return (
    <motion.div
      className="bg-white rounded-2xl p-8 relative overflow-hidden cursor-pointer" 
      style={{ 
        borderColor: '#D9D9D9', 
        borderWidth: '1px', 
        borderStyle: 'solid',
        x: translateX,
        y: translateY,
      }}
      initial={{ opacity: 0, y: 50, rotateX: -15 }}
      whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ 
        duration: 0.6, 
        delay: index * 0.15,
        ease: [0.25, 0.46, 0.45, 0.94]
      }}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={handleMouseLeave}
      whileHover={{ 
        scale: 1.05,
        boxShadow: '0 20px 40px rgba(32, 162, 119, 0.15)',
        transition: { duration: 0.3 }
      }}
    >
      {/* Gradient background that follows mouse */}
      <motion.div
        className="absolute inset-0 opacity-0"
        style={{
          background: `radial-gradient(circle at ${mouseX}px ${mouseY}px, rgba(32, 162, 119, 0.1) 0%, transparent 50%)`,
        }}
        animate={isHovered ? { opacity: 1 } : { opacity: 0 }}
        transition={{ duration: 0.3 }}
      />

      {/* Shimmer effect */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-0"
        animate={isHovered ? {
          x: ['-100%', '100%'],
          opacity: [0, 0.3, 0],
        } : {}}
        transition={{ duration: 1.5, repeat: Infinity, repeatDelay: 2 }}
      />

      <div className="relative z-10">
        <motion.div 
          className="w-12 h-12 rounded-xl flex items-center justify-center mb-4 relative" 
          style={{ backgroundColor: '#E8F5F1' }}
          animate={isHovered ? {
            scale: [1, 1.1, 1],
            rotate: [0, 10, 0],
          } : {}}
          transition={{ duration: 0.5 }}
        >
          {/* Orbit effect */}
          {isHovered && (
            <motion.div
              className="absolute inset-0 rounded-xl border-2"
              style={{ borderColor: feature.iconColor }}
              initial={{ scale: 1, opacity: 0.5 }}
              animate={{ scale: 1.5, opacity: 0 }}
              transition={{ duration: 1, repeat: Infinity }}
            />
          )}
          <feature.icon 
            className="w-6 h-6 relative z-10" 
            style={{ color: feature.iconColor }} 
          />
        </motion.div>

        <motion.h3 
          className="font-semibold text-lg mb-2" 
          style={{ color: '#344256' }}
          animate={isHovered ? { x: [0, 5, 0] } : {}}
          transition={{ duration: 0.5 }}
        >
          {feature.title}
        </motion.h3>

        <motion.p 
          className="text-sm" 
          style={{ color: '#344256' }}
          initial={{ opacity: 0.8 }}
          animate={isHovered ? { opacity: 1 } : { opacity: 0.8 }}
        >
          {feature.description}
        </motion.p>
      </div>

      {/* Corner accent */}
      <motion.div
        className="absolute top-0 right-0 w-20 h-20 rounded-bl-full"
        style={{ backgroundColor: '#E8F5F1' }}
        initial={{ scale: 0, opacity: 0 }}
        animate={isHovered ? { scale: 1, opacity: 0.5 } : { scale: 0, opacity: 0 }}
        transition={{ duration: 0.3 }}
      />
    </motion.div>
  );
}

export default function WhyChoose() {
  const features = [
    {
      icon: Zap,
      title: 'Instant Payments',
      description: 'Get paid immediately after approval. No waiting for bank transfers or PayPal delays.',
      iconColor: '#20A277',
    },
    {
      icon: DollarSign,
      title: 'Fair Pricing',
      description: 'Transparent rates with no hidden fees. Workers keep more of what they earn.',
      iconColor: '#20A277',
    },
    {
      icon: Shield,
      title: 'Secure Escrow',
      description: 'Smart contract escrow ensures funds are protected until work is completed.',
      iconColor: '#20A277',
    },
    {
      icon: Globe,
      title: 'Global Access',
      description: 'Work from anywhere, anytime. Connect with clients across the world instantly.',
      iconColor: '#20A277',
    },
  ];

  const stats = [
    {
      label: 'Global Access',
      value: '120+',
      subtitle: 'Regions',
      description: '96% of the anytime with stablecoin payments',
    },
    {
      label: 'Avg Completion Time',
      value: '< 1',
      subtitle: 'Hour',
      description: 'From task started to payment received',
    },
    {
      label: 'Platform Fee',
      value: '3%',
      subtitle: 'Industry\'s lowest',
    },
  ];

  return (
    <section className="w-full bg-white py-20 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Heading with Reveal Animation */}
        <motion.div 
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <motion.h2 
            className="text-4xl font-bold mb-3" 
            style={{ color: '#344256' }}
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            Why Choose PayTask?
          </motion.h2>
          <motion.p 
            style={{ color: '#344256' }}
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            The future of work is transparent, fair, and borderless
          </motion.p>
        </motion.div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {features.map((feature, index) => (
            <FloatingFeatureCard key={feature.title} feature={feature} index={index} />
          ))}
        </div>

        {/* Stats with Perspective Effect */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              className="rounded-2xl p-8 text-center relative overflow-hidden group cursor-pointer" 
              style={{ backgroundColor: '#F5F5F5' }}
              initial={{ opacity: 0, scale: 0.8, rotateY: -20 }}
              whileInView={{ opacity: 1, scale: 1, rotateY: 0 }}
              viewport={{ once: true }}
              transition={{ 
                duration: 0.6, 
                delay: index * 0.15,
                ease: [0.25, 0.46, 0.45, 0.94]
              }}
              whileHover={{ 
                scale: 1.08,
                backgroundColor: '#E8F5F1',
                transition: { duration: 0.3 }
              }}
            >
              <div className="relative z-10">
                <motion.p 
                  className="text-sm mb-2" 
                  style={{ color: '#344256' }}
                  initial={{ opacity: 0, y: -10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: index * 0.15 + 0.3 }}
                >
                  {stat.label}
                </motion.p>
                
                <motion.p 
                  className="text-4xl font-bold mb-1" 
                  style={{ color: '#20A277' }}
                  initial={{ opacity: 0, scale: 0.5 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ 
                    duration: 0.5, 
                    delay: index * 0.15 + 0.4,
                    type: 'spring',
                    stiffness: 200
                  }}
                >
                  <CountUpStat endValue={stat.value} />
                </motion.p>
                
                <motion.p 
                  className="text-sm font-semibold mb-2" 
                  style={{ color: '#344256' }}
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: index * 0.15 + 0.5 }}
                >
                  {stat.subtitle}
                </motion.p>

                {stat.description && (
                  <motion.p 
                    className="text-xs" 
                    style={{ color: '#344256', opacity: 0.7 }}
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 0.7, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: index * 0.15 + 0.6 }}
                  >
                    {stat.description}
                  </motion.p>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
