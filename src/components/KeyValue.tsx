import { Shield, Hand, Gift, Users, TrendingUp, Zap } from 'lucide-react';

export default function KeyValue() {
  const earnRewards = [
    {
      icon: Shield,
      title: 'Safety',
      description: 'Projects Verified, Rewards Secured',
      iconBg: 'bg-blue-50',
      iconColor: 'text-blue-500',
    },
    {
      icon: Hand,
      title: 'Task',
      description: 'Simple and Fun',
      iconBg: 'bg-purple-50',
      iconColor: 'text-purple-500',
    },
    {
      icon: Gift,
      title: 'Winning',
      description: 'Fast & Big',
      iconBg: 'bg-pink-50',
      iconColor: 'text-pink-500',
    },
  ];

  const gettingGrowth = [
    {
      icon: Users,
      title: 'Users',
      description: 'Genuine & Active',
      iconBg: 'bg-gray-50',
      iconColor: 'text-gray-500',
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
      iconBg: 'bg-yellow-50',
      iconColor: 'text-yellow-500',
    },
  ];

  return (
    <section className="w-full py-20" style={{ backgroundColor: '#F5F5F5' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Heading */}
        <h2 className="text-3xl font-bold text-center mb-16" style={{ color: '#344256' }}>
          Our Key Value
        </h2>

        {/* Centered Container with Stacked Layout */}
        <div className="max-w-5xl mx-auto space-y-16">
          {/* Earn Rewards Section */}
          <div>
            <div className="text-center mb-10">
              <h3 className="text-3xl font-bold" style={{ color: '#344256' }}>
                Earn <span style={{ color: '#20A277' }}>Rewards</span>
              </h3>
              <p className="mt-2" style={{ color: '#344256' }}>For Users</p>
            </div>

            {/* Feature Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {earnRewards.map((feature, index) => (
                <div
                  key={feature.title}
                  className="bg-white rounded-2xl p-6 shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border border-gray-100"
                >
                  <div className="flex flex-col items-center text-center space-y-4">
                    <div className={`w-16 h-16 ${feature.iconBg} rounded-2xl flex items-center justify-center shadow-sm`}>
                      <feature.icon className={`w-8 h-8 ${feature.iconColor}`} />
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900 text-lg mb-1">{feature.title}</h4>
                      <p className="text-sm text-gray-600 whitespace-pre-line">{feature.description}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Divider */}
          <div className="flex items-center justify-center">
            <div className="h-px bg-gray-300 w-32"></div>
            <div className="mx-4 w-3 h-3 rounded-full" style={{ backgroundColor: '#20A277' }}></div>
            <div className="h-px bg-gray-300 w-32"></div>
          </div>

          {/* Getting Growth Section */}
          <div>
            <div className="text-center mb-10">
              <h3 className="text-3xl font-bold" style={{ color: '#344256' }}>
                Getting <span style={{ color: '#2463EB' }}>Growth</span>
              </h3>
              <p className="mt-2" style={{ color: '#344256' }}>For Communities</p>
            </div>

            {/* Feature Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {gettingGrowth.map((feature, index) => (
                <div
                  key={feature.title}
                  className="bg-white rounded-2xl p-6 shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border border-gray-100"
                >
                  <div className="flex flex-col items-center text-center space-y-4">
                    <div className={`w-16 h-16 ${feature.iconBg} rounded-2xl flex items-center justify-center shadow-sm`}>
                      <feature.icon className={`w-8 h-8 ${feature.iconColor}`} />
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900 text-lg mb-1">{feature.title}</h4>
                      <p className="text-sm text-gray-600">{feature.description}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
