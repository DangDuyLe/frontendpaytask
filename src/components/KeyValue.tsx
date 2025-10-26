'use client';

import { Shield, Hand, Gift, Users, TrendingUp, Zap } from 'lucide-react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef, useState } from 'react';

// Animated Feature Card with 3D Tilt
function FeatureCard({ feature, index }: { feature: any; index: number }) {
  const [isHovered, setIsHovered] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  return (
    <motion.div
      ref={cardRef}
      className="bg-white rounded-2xl p-6 shadow-md border border-gray-100 relative overflow-hidden group cursor-pointer"
      initial={{ opacity: 0, y: 50, rotateX: -15 }}
      whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ 
        duration: 0.6, 
        delay: index * 0.15,
        ease: [0.25, 0.46, 0.45, 0.94]
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      whileHover={{ 
        y: -10,
        scale: 1.05,
        boxShadow: '0 20px 40px rgba(0, 0, 0, 0.15)',
        transition: { duration: 0.3 }
      }}
    >
      {/* Animated gradient border */}
      <motion.div
        className="absolute inset-0 rounded-2xl opacity-0"
        style={{
          background: `linear-gradient(135deg, ${feature.iconColor.includes('blue') ? '#3B82F6' : 
                                                feature.iconColor.includes('purple') ? '#A855F7' :
                                                feature.iconColor.includes('pink') ? '#EC4899' :
                                                feature.iconColor.includes('gray') ? '#6B7280' :
                                                feature.iconColor.includes('emerald') ? '#10B981' : '#EAB308'} 0%, transparent 100%)`,
        }}
        animate={{
          opacity: isHovered ? 0.1 : 0,
        }}
        transition={{ duration: 0.3 }}
      />

      {/* Sparkle particles on hover */}
      {isHovered && (
        <>
          {[...Array(5)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1 h-1 rounded-full bg-white"
              style={{
                left: `${20 + i * 15}%`,
                top: `${20 + i * 10}%`,
              }}
              initial={{ scale: 0, opacity: 0 }}
              animate={{ 
                scale: [0, 1, 0],
                opacity: [0, 1, 0],
                y: [0, -20, -40],
              }}
              transition={{
                duration: 1,
                delay: i * 0.1,
                repeat: Infinity,
                repeatDelay: 1,
              }}
            />
          ))}
        </>
      )}

      <div className="flex flex-col items-center text-center space-y-4 relative z-10">
        <motion.div 
          className={`w-16 h-16 ${feature.iconBg} rounded-2xl flex items-center justify-center shadow-sm relative`}
          animate={isHovered ? {
            rotate: [0, -10, 10, -10, 0],
            scale: [1, 1.1, 1],
          } : {}}
          transition={{ duration: 0.5 }}
        >
          {/* Pulse ring effect */}
          <motion.div
            className={`absolute inset-0 rounded-2xl ${feature.iconBg}`}
            animate={isHovered ? {
              scale: [1, 1.5, 1.5],
              opacity: [0.5, 0, 0],
            } : {}}
            transition={{
              duration: 1.5,
              repeat: Infinity,
            }}
          />
          
          <feature.icon className={`w-8 h-8 ${feature.iconColor} relative z-10`} />
        </motion.div>
        
        <div>
          <motion.h4 
            className="font-semibold text-gray-900 text-lg mb-1"
            animate={isHovered ? { scale: 1.05 } : {}}
            transition={{ duration: 0.2 }}
          >
            {feature.title}
          </motion.h4>
          <motion.p 
            className="text-sm text-gray-600 whitespace-pre-line"
            initial={{ opacity: 0.8 }}
            animate={isHovered ? { opacity: 1 } : { opacity: 0.8 }}
          >
            {feature.description}
          </motion.p>
        </div>
      </div>

      {/* Shine effect on hover */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-0"
        animate={isHovered ? {
          x: ['-100%', '100%'],
          opacity: [0, 0.3, 0],
        } : {}}
        transition={{ duration: 0.8 }}
      />
    </motion.div>
  );
}

export default function KeyValue() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"]
  });

  const opacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0, 1, 1, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0.9, 1, 1, 0.9]);

  const earnRewards = [
    {
      icon: Shield,
      title: 'Safety',
      description: 'Projects Verified, Rewards Secured',
      iconBg: 'bg-emerald-50',
      iconColor: 'text-emerald-500',
    },
    {
      icon: Hand,
      title: 'Task',
      description: 'Simple and Fun',
      iconBg: 'bg-emerald-50',
      iconColor: 'text-emerald-500',
    },
    {
      icon: Gift,
      title: 'Winning',
      description: 'Fast & Big',
      iconBg: 'bg-emerald-50',
      iconColor: 'text-emerald-500',
    },
  ];

  const gettingGrowth = [
    {
      icon: Users,
      title: 'Users',
      description: 'Genuine & Active',
      iconBg: 'bg-emerald-50',
      iconColor: 'text-emerald-500',
    },
    {
      icon: TrendingUp,
      title: 'Growth',
      description: 'Organic and Fast',
      iconBg: 'bg-emerald-50',
      iconColor: 'text-emerald-500',
    },
    {
      icon: Zap,
      title: 'Efficiency',
      description: 'High and Automated',
      iconBg: 'bg-emerald-50',
      iconColor: 'text-emerald-500',
    },
  ];

  return (
    <section 
      ref={sectionRef}
      className="w-full py-20 relative overflow-hidden" 
      style={{ backgroundColor: '#F5F5F5' }}
    >
      {/* Animated background blobs */}
      <motion.div
        className="absolute top-20 left-10 w-72 h-72 rounded-full opacity-10"
        style={{ backgroundColor: '#20A277', filter: 'blur(80px)' }}
        animate={{
          scale: [1, 1.2, 1],
          x: [0, 50, 0],
          y: [0, 30, 0],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />
      <motion.div
        className="absolute bottom-20 right-10 w-96 h-96 rounded-full opacity-10"
        style={{ backgroundColor: '#2463EB', filter: 'blur(100px)' }}
        animate={{
          scale: [1, 1.3, 1],
          x: [0, -50, 0],
          y: [0, -30, 0],
        }}
        transition={{
          duration: 10,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Heading with Scale Animation */}
        <motion.div
          style={{ opacity, scale }}
        >
          <motion.h2 
            className="text-3xl font-bold text-center mb-16" 
            style={{ color: '#344256' }}
            initial={{ opacity: 0, y: 30, filter: 'blur(10px)' }}
            whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            Our Key Value
          </motion.h2>
        </motion.div>

        {/* Centered Container with Stacked Layout */}
        <div className="max-w-5xl mx-auto space-y-16">
          {/* Earn Rewards Section */}
          <div>
            <motion.div 
              className="text-center mb-10"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <motion.h3 
                className="text-3xl font-bold inline-block" 
                style={{ color: '#344256' }}
                whileHover={{ scale: 1.05 }}
              >
                Earn <motion.span 
                  style={{ color: '#20A277' }}
                  animate={{ 
                    textShadow: [
                      '0 0 0px rgba(32, 162, 119, 0)',
                      '0 0 20px rgba(32, 162, 119, 0.5)',
                      '0 0 0px rgba(32, 162, 119, 0)',
                    ]
                  }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  Rewards
                </motion.span>
              </motion.h3>
              <motion.p 
                className="mt-2" 
                style={{ color: '#344256' }}
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 }}
              >
                For Users
              </motion.p>
            </motion.div>

            {/* Feature Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {earnRewards.map((feature, index) => (
                <FeatureCard key={feature.title} feature={feature} index={index} />
              ))}
            </div>
          </div>

          {/* Animated Divider */}
          <motion.div 
            className="flex items-center justify-center"
            initial={{ opacity: 0, scale: 0.5 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, type: 'spring', stiffness: 100 }}
          >
            <motion.div 
              className="h-px bg-gray-300 w-32"
              initial={{ scaleX: 0 }}
              whileInView={{ scaleX: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            />
            <motion.div 
              className="mx-4 w-3 h-3 rounded-full relative" 
              style={{ backgroundColor: '#20A277' }}
              animate={{
                scale: [1, 1.3, 1],
                rotate: [0, 180, 360],
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
            >
              {/* Pulsing rings */}
              <motion.div
                className="absolute inset-0 rounded-full"
                style={{ border: '2px solid #20A277' }}
                animate={{
                  scale: [1, 2, 2],
                  opacity: [0.8, 0, 0],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                }}
              />
            </motion.div>
            <motion.div 
              className="h-px bg-gray-300 w-32"
              initial={{ scaleX: 0 }}
              whileInView={{ scaleX: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.3 }}
            />
          </motion.div>

          {/* Getting Growth Section */}
          <div>
            <motion.div 
              className="text-center mb-10"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <motion.h3 
                className="text-3xl font-bold inline-block" 
                style={{ color: '#344256' }}
                whileHover={{ scale: 1.05 }}
              >
                Getting <motion.span 
                  style={{ color: '#2463EB' }}
                  animate={{ 
                    textShadow: [
                      '0 0 0px rgba(36, 99, 235, 0)',
                      '0 0 20px rgba(36, 99, 235, 0.5)',
                      '0 0 0px rgba(36, 99, 235, 0)',
                    ]
                  }}
                  transition={{ duration: 2, repeat: Infinity, delay: 1 }}
                >
                  Growth
                </motion.span>
              </motion.h3>
              <motion.p 
                className="mt-2" 
                style={{ color: '#344256' }}
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 }}
              >
                For Communities
              </motion.p>
            </motion.div>

            {/* Feature Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {gettingGrowth.map((feature, index) => (
                <FeatureCard key={feature.title} feature={feature} index={index} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
