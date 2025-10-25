'use client';

import { Database, ShoppingCart, FileText, FileEdit, Image, TestTube } from 'lucide-react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { useState } from 'react';

// Magnetic Card Component with Advanced Hover
function MagneticCard({ category, index }: { category: any; index: number }) {
  const [isHovered, setIsHovered] = useState(false);
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const springConfig = { damping: 15, stiffness: 150 };
  const rotateX = useSpring(useTransform(y, [-0.5, 0.5], [5, -5]), springConfig);
  const rotateY = useSpring(useTransform(x, [-0.5, 0.5], [-5, 5]), springConfig);

  const handleMouseMove = (event: React.MouseEvent<HTMLDivElement>) => {
    const rect = event.currentTarget.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const mouseX = event.clientX - rect.left;
    const mouseY = event.clientY - rect.top;
    const xPct = (mouseX / width - 0.5) * 2;
    const yPct = (mouseY / height - 0.5) * 2;
    x.set(xPct);
    y.set(yPct);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div
      className="rounded-2xl p-8 cursor-pointer group relative overflow-hidden" 
      style={{ 
        backgroundColor: '#F5F5F5',
        rotateX,
        rotateY,
        transformStyle: 'preserve-3d',
      }}
      initial={{ opacity: 0, y: 50, rotateX: -10 }}
      whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ 
        duration: 0.6, 
        delay: index * 0.1,
        ease: [0.25, 0.46, 0.45, 0.94]
      }}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={handleMouseLeave}
      whileHover={{ 
        scale: 1.05,
        transition: { duration: 0.2 }
      }}
    >
      {/* Animated gradient border */}
      <motion.div
        className="absolute inset-0 rounded-2xl opacity-0 transition-opacity"
        style={{
          background: 'linear-gradient(45deg, #20A277, #25B586, #20A277)',
          backgroundSize: '200% 200%',
          padding: '2px',
          zIndex: 0,
        }}
        animate={{
          opacity: isHovered ? 1 : 0,
          backgroundPosition: isHovered ? ['0% 50%', '100% 50%', '0% 50%'] : '0% 50%',
        }}
        transition={{ 
          opacity: { duration: 0.2 },
          backgroundPosition: { duration: 3, repeat: Infinity, ease: 'linear' }
        }}
      >
        <div className="absolute inset-[2px] rounded-2xl" style={{ backgroundColor: '#F5F5F5' }} />
      </motion.div>

      {/* Spotlight effect */}
      <motion.div
        className="absolute inset-0 rounded-2xl"
        style={{
          background: 'radial-gradient(circle at 50% 50%, rgba(32, 162, 119, 0.15) 0%, transparent 70%)',
          opacity: 0,
        }}
        animate={{
          opacity: isHovered ? 1 : 0,
          scale: isHovered ? [1, 1.2, 1] : 1,
        }}
        transition={{ 
          opacity: { duration: 0.2 },
          scale: { duration: 2, repeat: Infinity }
        }}
      />

      <div className="relative z-10">
        <motion.div 
          className="w-12 h-12 rounded-xl flex items-center justify-center mb-4 relative" 
          style={{ backgroundColor: '#E8F5F1' }}
          animate={isHovered ? {
            scale: [1, 1.1, 1],
            rotate: [0, 5, -5, 0],
          } : {}}
          transition={{ duration: 0.5 }}
        >
          <category.icon className="w-6 h-6 relative z-10" style={{ color: '#20A277' }} />
        </motion.div>
        
        <motion.h3 
          className="font-semibold text-lg mb-2" 
          style={{ color: '#344256' }}
          animate={isHovered ? { x: [0, 3, 0] } : {}}
          transition={{ duration: 0.3 }}
        >
          {category.title}
        </motion.h3>
        
        <motion.p 
          className="text-sm" 
          style={{ color: '#344256' }}
          initial={{ opacity: 0.7 }}
          animate={isHovered ? { opacity: 1 } : { opacity: 0.7 }}
        >
          {category.description}
        </motion.p>

        {/* Animated arrow on hover */}
        <motion.div
          className="flex items-center gap-1 mt-3 text-sm font-medium"
          style={{ color: '#20A277' }}
          initial={{ opacity: 0, x: -10 }}
          animate={isHovered ? { opacity: 1, x: 0 } : { opacity: 0, x: -10 }}
          transition={{ duration: 0.2 }}
        >
          <span>Explore</span>
          <motion.svg 
            className="w-4 h-4" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
            animate={isHovered ? { x: [0, 3, 0] } : {}}
            transition={{ duration: 0.8, repeat: Infinity }}
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </motion.svg>
        </motion.div>
      </div>
    </motion.div>
  );
}

export default function PopularCategories() {
  const categories = [
    {
      icon: Database,
      title: 'AI & Data',
      description: 'Training, labeling, annotation',
      iconBg: '#E8F5F1',
      iconColor: '#20A277',
    },
    {
      icon: ShoppingCart,
      title: 'E-commerce',
      description: 'Product listing, optimization',
      iconBg: '#E8F5F1',
      iconColor: '#20A277',
    },
    {
      icon: FileText,
      title: 'Content Review',
      description: 'Moderation, proofreading',
      iconBg: '#E8F5F1',
      iconColor: '#20A277',
    },
    {
      icon: FileEdit,
      title: 'Data Entry',
      description: 'Collection, transcription',
      iconBg: '#E8F5F1',
      iconColor: '#20A277',
    },
    {
      icon: Image,
      title: 'Media Tasks',
      description: 'Image tagging, video review',
      iconBg: '#E8F5F1',
      iconColor: '#20A277',
    },
    {
      icon: TestTube,
      title: 'Testing',
      description: 'QA, user testing, surveys',
      iconBg: '#E8F5F1',
      iconColor: '#20A277',
    },
  ];

  return (
    <section className="w-full bg-white py-20 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Heading with Blur In Effect */}
        <motion.div 
          className="text-center mb-12"
          initial={{ opacity: 0, filter: 'blur(10px)', y: 20 }}
          whileInView={{ opacity: 1, filter: 'blur(0px)', y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
        >
          <motion.h2 
            className="text-4xl font-bold mb-3" 
            style={{ color: '#344256' }}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            Popular Task Categories
          </motion.h2>
          <motion.p 
            style={{ color: '#344256' }}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            Find the perfect micro-tasks that match your skills and interests
          </motion.p>
        </motion.div>

        {/* Categories Grid with Staggered Animation */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {categories.map((category, index) => (
            <MagneticCard key={category.title} category={category} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
}
