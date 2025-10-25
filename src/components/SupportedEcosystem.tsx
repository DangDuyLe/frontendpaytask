'use client';

import { Wallet } from 'lucide-react';
import Image from 'next/image';

export default function SupportedEcosystem() {
  const wallets = [
    { 
      name: 'Solana', 
      logo: 'https://upload.wikimedia.org/wikipedia/en/b/b9/Solana_logo.png',
      bgColor: 'bg-purple-50'
    },
    { 
      name: 'MetaMask', 
      logo: 'https://upload.wikimedia.org/wikipedia/commons/3/36/MetaMask_Fox.svg',
      bgColor: 'bg-orange-50'
    },
    { 
      name: 'Phantom', 
      logo: 'https://avatars.githubusercontent.com/u/78782331?s=200&v=4',
      bgColor: 'bg-indigo-50'
    },
    { 
      name: 'Coinbase', 
      logo: 'https://images.ctfassets.net/q5ulk4bp65r7/3TBS4oVkD1ghowTqVQJlqj/2dfd4ea3b623a7c0d8deb2ff445dee9e/Consumer_Wordmark.svg',
      bgColor: 'bg-blue-50'
    },
    { 
      name: 'Trust Wallet', 
      logo: 'https://avatars.githubusercontent.com/u/32179889?s=200&v=4',
      bgColor: 'bg-cyan-50'
    },
    { 
      name: 'WalletConnect', 
      logo: 'https://avatars.githubusercontent.com/u/37784886?s=200&v=4',
      bgColor: 'bg-emerald-50'
    },
  ];

  return (
    <section className="w-full bg-gray-50 py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Badge */}
        <div className="flex justify-center mb-6">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium" style={{ backgroundColor: '#E3F2FD', color: '#2463EB' }}>
            <Wallet className="w-4 h-4" />
            Web3 Integration
          </div>
        </div>

        {/* Heading */}
        <h2 className="text-4xl font-bold text-center mb-12" style={{ color: '#344256' }}>
          Supported Ecosystem
        </h2>

        {/* Wallet Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6 max-w-5xl mx-auto">
          {wallets.map((wallet) => (
            <div
              key={wallet.name}
              className="flex flex-col items-center gap-4 bg-white rounded-2xl p-8 shadow-sm hover:shadow-md transition-shadow cursor-pointer group"
            >
              <div
                className={`w-16 h-16 ${wallet.bgColor} rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform overflow-hidden relative`}
              >
                <img
                  src={wallet.logo}
                  alt={`${wallet.name} logo`}
                  className="w-10 h-10 object-contain"
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
              </div>
              <span className="text-sm font-medium text-gray-900">{wallet.name}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
