'use client';

import Link from 'next/link';
import { User, Wallet, Settings, LogOut, ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useState, useRef, useEffect } from 'react';

interface UserDropdownProps {
  username: string;
  onLogout?: () => void;
}

export default function UserDropdown({ username, onLogout }: UserDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const menuItems = [
    {
      href: '/profile',
      icon: User,
      label: 'Profile',
      description: 'View and edit your profile'
    },
    {
      href: '/wallet',
      icon: Wallet,
      label: 'Wallet',
      description: 'Manage your funds'
    },
    {
      href: '/settings',
      icon: Settings,
      label: 'Settings',
      description: 'Account preferences'
    }
  ];

  const handleLogout = () => {
    setIsOpen(false);
    onLogout?.();
  };

  return (
    <div className="relative" ref={dropdownRef}>
      {/* User Button */}
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-4 py-2 rounded-lg border border-gray-200 bg-white hover:border-gray-300 transition-colors"
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        {/* Avatar */}
        <div 
          className="w-8 h-8 rounded-full flex items-center justify-center text-white font-medium text-sm"
          style={{ backgroundColor: '#20A277' }}
        >
          {username.charAt(0).toUpperCase()}
        </div>
        
        {/* Username */}
        <span className="font-medium text-sm" style={{ color: '#344256' }}>
          {username}
        </span>
        
        {/* Chevron Icon */}
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.2 }}
        >
          <ChevronDown className="w-4 h-4" style={{ color: '#344256' }} />
        </motion.div>
      </motion.button>

      {/* Dropdown Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-lg border border-gray-200 overflow-hidden"
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.2 }}
          >
            {/* User Info Header */}
            <div className="px-4 py-3 border-b border-gray-100 bg-gray-50">
              <p className="text-sm font-medium" style={{ color: '#344256' }}>
                Signed in as
              </p>
              <p className="text-sm font-semibold" style={{ color: '#20A277' }}>
                {username}
              </p>
            </div>

            {/* Menu Items */}
            <div className="py-2">
              {menuItems.map((item, index) => (
                <Link key={item.href} href={item.href} onClick={() => setIsOpen(false)}>
                  <motion.div
                    className="flex items-start gap-3 px-4 py-3 hover:bg-gray-50 transition-colors cursor-pointer"
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.2, delay: index * 0.05 }}
                    whileHover={{ x: 4 }}
                  >
                    <item.icon className="w-5 h-5 mt-0.5" style={{ color: '#20A277' }} />
                    <div className="flex-1">
                      <p className="text-sm font-medium" style={{ color: '#344256' }}>
                        {item.label}
                      </p>
                      <p className="text-xs text-gray-500">
                        {item.description}
                      </p>
                    </div>
                  </motion.div>
                </Link>
              ))}
            </div>

            {/* Logout Button */}
            <div className="border-t border-gray-100">
              <motion.button
                onClick={handleLogout}
                className="w-full flex items-center gap-3 px-4 py-3 hover:bg-red-50 transition-colors text-left"
                whileHover={{ x: 4 }}
              >
                <LogOut className="w-5 h-5" style={{ color: '#EF4444' }} />
                <div className="flex-1">
                  <p className="text-sm font-medium text-red-600">
                    Logout
                  </p>
                  <p className="text-xs text-gray-500">
                    Sign out of your account
                  </p>
                </div>
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
