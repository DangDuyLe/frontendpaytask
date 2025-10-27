'use client';

import { Wallet } from 'lucide-react';
import Image from 'next/image';
import { motion, useMotionValue, useTransform, useSpring } from 'framer-motion';
import { useState } from 'react';

// Animated Wallet Card with Magnetic Effect
function WalletCard({ wallet, index }: { wallet: any; index: number }) {
  const [isHovered, setIsHovered] = useState(false);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  
  const springConfig = { damping: 20, stiffness: 200 };
  const rotateX = useSpring(useTransform(y, [-0.5, 0.5], [8, -8]), springConfig);
  const rotateY = useSpring(useTransform(x, [-0.5, 0.5], [-8, 8]), springConfig);
  
  const handleMouseMove = (event: React.MouseEvent<HTMLAnchorElement>) => {
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
    <motion.a
      href={wallet.url}
      target="_blank"
      rel="noopener noreferrer"
      className="flex flex-col items-center gap-4 bg-white rounded-2xl p-8 shadow-sm border border-gray-100 cursor-pointer group relative overflow-hidden"
      style={{
        rotateX,
        rotateY,
        transformStyle: 'preserve-3d',
      }}
      initial={{ opacity: 0, scale: 0.5, y: 50 }}
      whileInView={{ opacity: 1, scale: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ 
        duration: 0.5, 
        delay: index * 0.1,
        ease: [0.25, 0.46, 0.45, 0.94]
      }}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={handleMouseLeave}
      whileHover={{ 
        y: -8,
        boxShadow: '0 15px 30px rgba(0, 0, 0, 0.15)',
        transition: { duration: 0.3 }
      }}
    >
      {/* Animated gradient background */}
      <motion.div
        className="absolute inset-0 opacity-0"
        style={{
          background: 'radial-gradient(circle at 50% 50%, rgba(32, 162, 119, 0.1) 0%, transparent 70%)',
        }}
        animate={isHovered ? { opacity: 1, scale: 1.5 } : { opacity: 0, scale: 1 }}
        transition={{ duration: 0.4 }}
      />

      {/* Shine effect */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent"
        initial={{ x: '-100%', opacity: 0 }}
        animate={isHovered ? {
          x: '100%',
          opacity: [0, 0.5, 0],
        } : {}}
        transition={{ duration: 0.8 }}
      />

      <motion.div
        className={`w-16 h-16 ${wallet.bgColor} rounded-2xl flex items-center justify-center relative overflow-hidden`}
        animate={isHovered ? {
          scale: [1, 1.15, 1],
          rotate: [0, 5, -5, 0],
        } : {}}
        transition={{ duration: 0.6 }}
      >
        {/* Orbit rings on hover */}
        {isHovered && (
          <>
            <motion.div
              className="absolute inset-0 rounded-2xl border-2 border-green-400"
              initial={{ scale: 1, opacity: 0.8 }}
              animate={{ scale: 1.5, opacity: 0 }}
              transition={{ duration: 1, repeat: Infinity }}
            />
            <motion.div
              className="absolute inset-0 rounded-2xl border-2 border-green-400"
              initial={{ scale: 1, opacity: 0.8 }}
              animate={{ scale: 1.5, opacity: 0 }}
              transition={{ duration: 1, delay: 0.5, repeat: Infinity }}
            />
          </>
        )}

        <img
          src={wallet.logo}
          alt={`${wallet.name} logo`}
          className="w-10 h-10 object-contain relative z-10"
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            target.style.display = 'none';
            const parent = target.parentElement;
            if (parent && !parent.querySelector('.fallback-text')) {
              const fallback = document.createElement('span');
              fallback.className = 'fallback-text text-2xl font-bold text-gray-700';
              fallback.textContent = wallet.name.charAt(0);
              parent.appendChild(fallback);
            }
          }}
        />
      </motion.div>

      <motion.span 
        className="text-sm font-medium text-gray-900 relative z-10"
        animate={isHovered ? { scale: 1.05, y: -2 } : {}}
        transition={{ duration: 0.2 }}
      >
        {wallet.name}
      </motion.span>

      {/* Corner sparkle effect */}
      {isHovered && (
        <motion.div
          className="absolute top-2 right-2 w-2 h-2 rounded-full bg-yellow-400"
          initial={{ scale: 0, opacity: 0 }}
          animate={{ 
            scale: [0, 1, 0],
            opacity: [0, 1, 0],
            rotate: [0, 180, 360],
          }}
          transition={{ duration: 1, repeat: Infinity }}
        />
      )}
    </motion.a>
  );
}

export default function SupportedEcosystem() {
  const wallets = [
    { 
      name: 'Solana', 
      logo: 'https://upload.wikimedia.org/wikipedia/en/b/b9/Solana_logo.png',
      bgColor: 'bg-purple-50',
      url: 'https://solana.com/'
    },
    { 
      name: 'MetaMask', 
      logo: 'https://upload.wikimedia.org/wikipedia/commons/3/36/MetaMask_Fox.svg',
      bgColor: 'bg-orange-50',
      url: 'https://metamask.io/'
    },
    { 
      name: 'Phantom', 
      logo: 'https://avatars.githubusercontent.com/u/78782331?s=200&v=4',
      bgColor: 'bg-indigo-50',
      url: 'https://phantom.app/'
    },
    { 
      name: 'Coinbase', 
      logo: 'https://images.ctfassets.net/q5ulk4bp65r7/3TBS4oVkD1ghowTqVQJlqj/2dfd4ea3b623a7c0d8deb2ff445dee9e/Consumer_Wordmark.svg',
      bgColor: 'bg-blue-50',
      url: 'https://www.coinbase.com/wallet'
    },
    { 
      name: 'Trust Wallet', 
      logo: 'https://avatars.githubusercontent.com/u/32179889?s=200&v=4',
      bgColor: 'bg-cyan-50',
      url: 'https://trustwallet.com/'
    },
    { 
      name: 'WalletConnect', 
      logo: 'https://avatars.githubusercontent.com/u/37784886?s=200&v=4',
      bgColor: 'bg-emerald-50',
      url: 'https://walletconnect.com/'
    },
  ];

  return (
    <section className="w-full bg-gray-50 py-20 relative overflow-hidden">
      {/* Animated background patterns */}
      <motion.div
        className="absolute top-0 left-0 w-full h-full opacity-5"
        style={{
          backgroundImage: 'radial-gradient(circle, #20A277 1px, transparent 1px)',
          backgroundSize: '50px 50px',
        }}
        animate={{
          backgroundPosition: ['0px 0px', '50px 50px'],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: 'linear',
        }}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Badge with Bounce Animation */}
        <motion.div 
          className="flex justify-center mb-6"
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, type: 'spring', stiffness: 200 }}
        >
          <motion.div 
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium relative overflow-hidden" 
            style={{ backgroundColor: '#E3F2FD', color: '#2463EB' }}
            whileHover={{ scale: 1.05 }}
            animate={{
              boxShadow: [
                '0 0 0 0 rgba(36, 99, 235, 0.4)',
                '0 0 0 10px rgba(36, 99, 235, 0)',
              ],
            }}
            transition={{
              boxShadow: { duration: 1.5, repeat: Infinity },
            }}
          >
            <Wallet className="w-4 h-4" />
            <span>Web3 Integration</span>
          </motion.div>
        </motion.div>

        {/* Heading with Letter Animation */}
        <motion.h2 
          className="text-4xl font-bold text-center mb-12" 
          style={{ color: '#344256' }}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          {['S','u','p','p','o','r','t','e','d',' ','E','c','o','s','y','s','t','e','m'].map((letter, i) => (
            <motion.span
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.3, delay: 0.1 + i * 0.03 }}
              whileHover={{ 
                scale: 1.2, 
                color: '#20A277',
                transition: { duration: 0.2 }
              }}
              style={{ display: 'inline-block' }}
            >
              {letter === ' ' ? '\u00A0' : letter}
            </motion.span>
          ))}
        </motion.h2>

        {/* Wallet Grid with Infinite Loop Animation */}
        <div className="relative overflow-hidden py-8">
          <motion.div 
            className="flex gap-6"
            animate={{
              x: [0, -100 * wallets.length],
            }}
            transition={{
              x: {
                repeat: Infinity,
                repeatType: "loop",
                duration: 20,
                ease: "linear",
              },
            }}
          >
            {/* First set of wallets */}
            {wallets.map((wallet, index) => (
              <div key={`wallet-1-${wallet.name}`} className="flex-shrink-0 w-[140px]">
                <WalletCard wallet={wallet} index={index} />
              </div>
            ))}
            {/* Duplicate set for seamless loop */}
            {wallets.map((wallet, index) => (
              <div key={`wallet-2-${wallet.name}`} className="flex-shrink-0 w-[140px]">
                <WalletCard wallet={wallet} index={index} />
              </div>
            ))}
            {/* Third set for extra smooth transition */}
            {wallets.map((wallet, index) => (
              <div key={`wallet-3-${wallet.name}`} className="flex-shrink-0 w-[140px]">
                <WalletCard wallet={wallet} index={index} />
              </div>
            ))}
          </motion.div>
        </div>

        {/* Floating Connection Lines */}
        <motion.div
          className="mt-12 text-center"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.8 }}
        >
          <motion.p 
            className="text-sm text-gray-600 inline-flex items-center gap-2"
            animate={{
              y: [0, -5, 0],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          >
            <motion.span
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              🔗
            </motion.span>
            Seamlessly connect with your favorite Web3 wallet
          </motion.p>
        </motion.div>
      </div>
    </section>
  );
}
