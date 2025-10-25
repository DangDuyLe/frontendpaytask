import { Shield, Hand, Gift, Users, TrendingUp, Zap } from 'lucide-react';

export default function KeyValue() {
  const earnRewards = [
    {
      icon: Shield,
      title: 'Safety',
      description: 'Projects Verified,\nRewards Secured',
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
        <h2 className="text-5xl font-bold text-center mb-16" style={{ color: '#344256' }}>
          Our Key Value
        </h2>

        {/* Two Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 max-w-6xl mx-auto">
          {/* Earn Rewards - Left Side */}
          <div className="space-y-8">
            <div className="text-center lg:text-left">
              <h3 className="text-3xl font-bold" style={{ color: '#344256' }}>
                Earn <span style={{ color: '#20A277' }}>Rewards</span>
              </h3>
              <p className="mt-2" style={{ color: '#344256' }}>For Users</p>
            </div>

            <div className="relative">
              {/* Center Circle */}
              <div className="flex justify-center mb-8">
                <div className="w-32 h-32 rounded-full shadow-lg" style={{ backgroundColor: '#20A277' }}></div>
              </div>

              {/* Feature Cards */}
              <div className="space-y-4">
                {earnRewards.map((feature, index) => (
                  <div
                    key={feature.title}
                    className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow flex items-center gap-4"
                  >
                    <div className={`w-12 h-12 ${feature.iconBg} rounded-xl flex items-center justify-center flex-shrink-0`}>
                      <feature.icon className={`w-6 h-6 ${feature.iconColor}`} />
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900 text-lg">{feature.title}</h4>
                      <p className="text-sm text-gray-600 whitespace-pre-line">{feature.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Getting Growth - Right Side */}
          <div className="space-y-8">
            <div className="text-center lg:text-left">
              <h3 className="text-3xl font-bold" style={{ color: '#344256' }}>
                Getting <span style={{ color: '#2463EB' }}>Growth</span>
              </h3>
              <p className="mt-2" style={{ color: '#344256' }}>For Communities</p>
            </div>

            <div className="relative">
              {/* Center Circle */}
              <div className="flex justify-center mb-8">
                <div className="w-32 h-32 rounded-full shadow-lg" style={{ backgroundColor: '#20A277' }}></div>
              </div>

              {/* Feature Cards */}
              <div className="space-y-4">
                {gettingGrowth.map((feature, index) => (
                  <div
                    key={feature.title}
                    className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow flex items-center gap-4"
                  >
                    <div className={`w-12 h-12 ${feature.iconBg} rounded-xl flex items-center justify-center flex-shrink-0`}>
                      <feature.icon className={`w-6 h-6 ${feature.iconColor}`} />
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900 text-lg">{feature.title}</h4>
                      <p className="text-sm text-gray-600">{feature.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
