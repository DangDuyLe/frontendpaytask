'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { Twitter, Linkedin, Github, Mail } from 'lucide-react';

export default function Footer() {
  const platformLinks = [
    { name: 'Find Tasks', href: '#' },
    { name: 'Post Task', href: '#' },
    { name: 'Dashboard', href: '#' },
    { name: 'Categories', href: '#' },
  ];

  const companyLinks = [
    { name: 'About Us', href: '#' },
    { name: 'How It Works', href: '#' },
    { name: 'Pricing', href: '#' },
    { name: 'Blog', href: '#' },
  ];

  const supportLinks = [
    { name: 'Help Center', href: '#' },
    { name: 'Terms of Service', href: '#' },
    { name: 'Privacy Policy', href: '#' },
    { name: 'Contact', href: '#' },
  ];

  const socialLinks = [
    { name: 'Twitter', icon: Twitter, href: '#', color: '#1DA1F2' },
    { name: 'LinkedIn', icon: Linkedin, href: '#', color: '#0A66C2' },
    { name: 'GitHub', icon: Github, href: '#', color: '#181717' },
    { name: 'Email', icon: Mail, href: '#', color: '#EA4335' },
  ];

  return (
    <footer className="w-full border-t relative overflow-hidden" style={{ backgroundColor: '#F5F5F5', borderColor: '#D9D9D9' }}>
      {/* Animated background gradient */}
      <motion.div
        className="absolute top-0 left-0 w-full h-full opacity-5"
        style={{
          background: 'radial-gradient(circle at 20% 50%, #20A277 0%, transparent 50%), radial-gradient(circle at 80% 50%, #2463EB 0%, transparent 50%)',
        }}
        animate={{
          backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: 'linear',
        }}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
          {/* Brand Column with Animation */}
          <motion.div 
            className="lg:col-span-1"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <motion.div
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.3 }}
            >
              <Link href="/" className="flex items-center gap-2 mb-4">
                <motion.img 
                  src="/logo.png" 
                  alt="PayTask Logo"
                  className="w-8 h-8 object-contain"
                  whileHover={{ rotate: 360 }}
                  transition={{ duration: 0.6 }}
                />
                <span className="text-xl font-semibold" style={{ color: '#344256' }}>PayTask</span>
              </Link>
            </motion.div>
            <motion.p 
              className="text-sm max-w-xs mb-6" 
              style={{ color: '#344256' }}
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              The Web3 task exchange that turns free time into real earnings. Transparent, fair, and instant for everyone.
            </motion.p>

            {/* Social Links with Hover Effects */}
            <div className="flex items-center gap-3">
              {socialLinks.map((social, index) => (
                <motion.a
                  key={social.name}
                  href={social.href}
                  className="w-9 h-9 rounded-full bg-white flex items-center justify-center group relative overflow-hidden"
                  initial={{ opacity: 0, scale: 0 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ 
                    duration: 0.4, 
                    delay: 0.3 + index * 0.1,
                    type: 'spring',
                    stiffness: 200
                  }}
                  whileHover={{ 
                    y: -5,
                    scale: 1.1,
                  }}
                  whileTap={{ scale: 0.9 }}
                >
                  <motion.div
                    className="absolute inset-0 rounded-full"
                    style={{ backgroundColor: social.color }}
                    initial={{ scale: 0, opacity: 0 }}
                    whileHover={{ scale: 1, opacity: 0.1 }}
                    transition={{ duration: 0.3 }}
                  />
                  <social.icon 
                    className="w-4 h-4 relative z-10 transition-colors" 
                    style={{ color: '#344256' }}
                  />
                </motion.a>
              ))}
            </div>
          </motion.div>

          {/* Platform Links */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <h3 className="font-semibold mb-4" style={{ color: '#344256' }}>Platform</h3>
            <ul className="space-y-3">
              {platformLinks.map((link, index) => (
                <motion.li 
                  key={link.name}
                  initial={{ opacity: 0, x: -10 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: 0.3 + index * 0.1 }}
                >
                  <Link href={link.href}>
                    <motion.span
                      className="text-sm transition-colors inline-flex items-center gap-2 group"
                      style={{ color: '#344256' }}
                      whileHover={{ x: 5, color: '#20A277' }}
                      transition={{ duration: 0.2 }}
                    >
                      <motion.span
                        className="w-0 h-0.5 group-hover:w-3 transition-all"
                        style={{ backgroundColor: '#20A277' }}
                      />
                      {link.name}
                    </motion.span>
                  </Link>
                </motion.li>
              ))}
            </ul>
          </motion.div>

          {/* Company Links */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <h3 className="font-semibold mb-4" style={{ color: '#344256' }}>Company</h3>
            <ul className="space-y-3">
              {companyLinks.map((link, index) => (
                <motion.li 
                  key={link.name}
                  initial={{ opacity: 0, x: -10 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: 0.4 + index * 0.1 }}
                >
                  <Link href={link.href}>
                    <motion.span
                      className="text-sm transition-colors inline-flex items-center gap-2 group"
                      style={{ color: '#344256' }}
                      whileHover={{ x: 5, color: '#20A277' }}
                      transition={{ duration: 0.2 }}
                    >
                      <motion.span
                        className="w-0 h-0.5 group-hover:w-3 transition-all"
                        style={{ backgroundColor: '#20A277' }}
                      />
                      {link.name}
                    </motion.span>
                  </Link>
                </motion.li>
              ))}
            </ul>
          </motion.div>

          {/* Support Links */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <h3 className="font-semibold mb-4" style={{ color: '#344256' }}>Support</h3>
            <ul className="space-y-3">
              {supportLinks.map((link, index) => (
                <motion.li 
                  key={link.name}
                  initial={{ opacity: 0, x: -10 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: 0.5 + index * 0.1 }}
                >
                  <Link href={link.href}>
                    <motion.span
                      className="text-sm transition-colors inline-flex items-center gap-2 group"
                      style={{ color: '#344256' }}
                      whileHover={{ x: 5, color: '#20A277' }}
                      transition={{ duration: 0.2 }}
                    >
                      <motion.span
                        className="w-0 h-0.5 group-hover:w-3 transition-all"
                        style={{ backgroundColor: '#20A277' }}
                      />
                      {link.name}
                    </motion.span>
                  </Link>
                </motion.li>
              ))}
            </ul>
          </motion.div>
        </div>

        {/* Bottom Bar with Slide Animation */}
        <motion.div 
          className="pt-8" 
          style={{ borderTop: '1px solid #D9D9D9' }}
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.6 }}
        >
          <motion.p 
            className="text-sm text-center" 
            style={{ color: '#344256' }}
            initial={{ y: 10, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: 0.7 }}
          >
            © 2024 PayTask. All rights reserved. Made with{' '}
            <motion.span
              className="inline-block"
              animate={{ 
                scale: [1, 1.2, 1],
              }}
              transition={{ 
                duration: 1,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
            >
              ❤️
            </motion.span>
            {' '}for the Web3 community
          </motion.p>
        </motion.div>
      </div>
    </footer>
  );
}
