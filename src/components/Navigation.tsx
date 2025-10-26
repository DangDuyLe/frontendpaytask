'use client';

import Link from 'next/link';
import { Search, LayoutDashboard, PlusCircle, Compass, User, UserPlus, Briefcase, Menu, X, Bell, Wallet, Settings, Shield, HelpCircle, FileText, ClipboardCheck } from 'lucide-react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { useState } from 'react';

export default function Navigation() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { scrollY } = useScroll();
  
  // Create parallax effect for navbar background
  const navBackground = useTransform(
    scrollY,
    [0, 100],
    ['rgba(255, 255, 255, 0.95)', 'rgba(255, 255, 255, 1)']
  );
  
  const navShadow = useTransform(
    scrollY,
    [0, 100],
    ['0px 1px 2px rgba(0, 0, 0, 0.05)', '0px 4px 12px rgba(0, 0, 0, 0.1)']
  );

  return (
    <motion.nav 
      className="w-full bg-white border-b border-gray-100 sticky top-0 z-50 backdrop-blur-md"
      style={{
        backgroundColor: navBackground,
        boxShadow: navShadow,
      }}
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo with Bounce Animation */}
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Link href="/" className="flex items-center gap-2">
              <img 
                src="/logo.png" 
                alt="PayTask Logo" 
                className="w-8 h-8 object-contain"
              />
              <motion.span 
                className="text-xl font-semibold" 
                style={{ color: '#344256' }}
                whileHover={{ color: '#20A277' }}
                transition={{ duration: 0.3 }}
              >
                PayTask
              </motion.span>
            </Link>
          </motion.div>

          {/* Navigation Links with Underline Animation */}
          <div className="hidden md:flex items-center gap-8">
            {['How It Works', 'Categories', 'Pricing'].map((item, index) => (
              <motion.div
                key={item}
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.1 + index * 0.1 }}
              >
                <Link 
                  href="#" 
                  className="relative text-sm font-medium group" 
                  style={{ color: '#344256' }}
                >
                  <motion.span
                    whileHover={{ y: -2 }}
                    transition={{ duration: 0.2 }}
                    className="inline-block"
                  >
                    {item}
                  </motion.span>
                  <motion.div
                    className="absolute bottom-0 left-0 w-full h-0.5 origin-left"
                    style={{ backgroundColor: '#20A277' }}
                    initial={{ scaleX: 0 }}
                    whileHover={{ scaleX: 1 }}
                    transition={{ duration: 0.3 }}
                  />
                </Link>
              </motion.div>
            ))}
          </div>

          {/* Right Side Actions with Stagger Animation */}
          <div className="flex items-center gap-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4, delay: 0.3 }}
            >
              <Link href="/discover-tasks">
                <motion.button 
                  className="p-2 rounded-full relative group"
                  whileHover={{ 
                    scale: 1.1,
                    backgroundColor: 'rgba(32, 162, 119, 0.1)',
                  }}
                  whileTap={{ scale: 0.9 }}
                >
                  <Search className="w-5 h-5" style={{ color: '#344256' }} />
                </motion.button>
              </Link>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4, delay: 0.4 }}
            >
              <Link href="/login">
                <motion.span
                  className="text-sm font-medium" 
                  style={{ color: '#344256' }}
                  whileHover={{ color: '#20A277', scale: 1.05 }}
                  transition={{ duration: 0.2 }}
                >
                  Sign In
                </motion.span>
              </Link>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4, delay: 0.5 }}
            >
              <Link href="/signup">
                <motion.button
                  className="text-white px-6 py-2 rounded-lg text-sm font-medium relative overflow-hidden"
                  style={{ backgroundColor: '#20A277' }}
                  whileHover={{ 
                    scale: 1.05,
                    boxShadow: '0 5px 15px rgba(32, 162, 119, 0.3)',
                  }}
                  whileTap={{ scale: 0.95 }}
                >
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-0"
                    whileHover={{ 
                      x: ['-100%', '100%'],
                      opacity: [0, 0.3, 0],
                    }}
                    transition={{ duration: 0.6 }}
                  />
                  <span className="relative z-10">Get Started</span>
                </motion.button>
              </Link>
            </motion.div>
          </div>
        </div>
      </div>
      
      {/* Secondary Navigation Bar with Slide Animation */}
      <motion.div 
        className="border-t border-gray-100" 
        style={{ backgroundColor: '#F8F9FA' }}
        initial={{ opacity: 0, height: 0 }}
        animate={{ opacity: 1, height: 'auto' }}
        transition={{ duration: 0.4, delay: 0.6 }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2 py-3 overflow-x-auto">
            {[
              { href: '/client-dashboard', icon: LayoutDashboard, label: 'Client Dashboard' },
              { href: '/worker-dashboard', icon: Briefcase, label: 'Worker Dashboard' },
              { href: '/admin-dashboard', icon: Shield, label: 'Admin Dashboard' },
              { divider: true },
              { href: '/create-task', icon: PlusCircle, label: 'Create Task' },
              { href: '/discover-tasks', icon: Compass, label: 'Discover Tasks' },
              { href: '/task-detail', icon: FileText, label: 'Task Detail' },
              { divider: true },
              { href: '/notifications', icon: Bell, label: 'Notifications' },
              { href: '/wallet', icon: Wallet, label: 'Wallet' },
              { divider: true },
              { href: '/profile', icon: User, label: 'Profile' },
              { href: '/settings', icon: Settings, label: 'Settings' },
              { href: '/support', icon: HelpCircle, label: 'Support' },
              { divider: true },
              { href: '/login', icon: User, label: 'Login' },
              { href: '/signup', icon: UserPlus, label: 'Sign Up' },
            ].map((item, index) => {
              if (item.divider) {
                return <div key={`divider-${index}`} className="h-6 w-px bg-gray-300 mx-2"></div>;
              }
              return (
                <motion.div
                  key={item.label}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: 0.7 + index * 0.05 }}
                >
                  <Link href={item.href || '#'}>
                    <motion.div
                      className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap"
                      style={{ color: '#344256' }}
                      whileHover={{ 
                        backgroundColor: 'white',
                        color: '#20A277',
                        y: -2,
                      }}
                      whileTap={{ scale: 0.95 }}
                      transition={{ duration: 0.2 }}
                    >
                      {item.icon && <item.icon className="w-4 h-4" />}
                      {item.label}
                    </motion.div>
                  </Link>
                </motion.div>
              );
            })}
          </div>
        </div>
      </motion.div>
    </motion.nav>
  );
}
