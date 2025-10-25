import { Zap, DollarSign, Shield, Globe } from 'lucide-react';

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
      label: 'Market Size',
      value: '$2.1M+',
      subtitle: 'Total paid out',
    },
    {
      label: 'Avg Payout',
      value: '$47',
      subtitle: 'Per task',
    },
    {
      label: 'Platform Fee',
      value: '5%',
      subtitle: 'Industry lowest',
    },
  ];

  return (
    <section className="w-full bg-white py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Heading */}
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-3" style={{ color: '#344256' }}>
            Why Choose PayTask?
          </h2>
          <p style={{ color: '#344256' }}>
            The future of work is transparent, fair, and borderless
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {features.map((feature) => (
            <div
              key={feature.title}
              className="bg-white rounded-2xl p-8 hover:shadow-lg transition-shadow" style={{ borderColor: '#D9D9D9', borderWidth: '1px', borderStyle: 'solid' }}
            >
              <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-4" style={{ backgroundColor: '#E8F5F1' }}>
                <feature.icon className="w-6 h-6" style={{ color: feature.iconColor }} />
              </div>
              <h3 className="font-semibold text-lg mb-2" style={{ color: '#344256' }}>
                {feature.title}
              </h3>
              <p className="text-sm" style={{ color: '#344256' }}>
                {feature.description}
              </p>
            </div>
          ))}
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
          {stats.map((stat) => (
            <div
              key={stat.label}
              className="rounded-2xl p-8 text-center" style={{ backgroundColor: '#F5F5F5' }}
            >
              <p className="text-sm mb-2" style={{ color: '#344256' }}>{stat.label}</p>
              <p className="text-4xl font-bold mb-1" style={{ color: '#20A277' }}>{stat.value}</p>
              <p className="text-sm" style={{ color: '#344256' }}>{stat.subtitle}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
