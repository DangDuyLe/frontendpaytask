import { Star, ShieldCheck, Zap, ArrowRight } from 'lucide-react';

export default function CTASection() {
  const trustIndicators = [
    {
      icon: Star,
      text: '4.9/5 Average Rating',
    },
    {
      icon: ShieldCheck,
      text: 'Secure & Verified',
    },
    {
      icon: Zap,
      text: 'Instant Payments',
    },
  ];

  return (
    <section className="w-full py-20" style={{ background: 'linear-gradient(to bottom right, #20A277, #1A8260)' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 text-white px-4 py-2 rounded-full text-sm font-medium mb-8" style={{ backgroundColor: 'rgba(255, 255, 255, 0.2)' }}>
            Join PayTask Today
          </div>

          {/* Heading */}
          <h2 className="text-4xl lg:text-5xl font-bold text-white mb-4">
            Ready to Start Earning or
            <br />
            Get Tasks Done?
          </h2>

          {/* Subheading */}
          <p className="text-xl mb-10" style={{ color: '#E8F5F1' }}>
            Join <span className="font-bold text-white">15,000+ workers</span> and clients transforming how work gets done
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <button className="group bg-white text-lg px-8 py-4 rounded-lg font-semibold transition-all flex items-center justify-center gap-2 shadow-lg hover:bg-gray-50" style={{ color: '#20A277' }}>
              Start as a Worker
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
            <button className="text-white text-lg px-8 py-4 rounded-lg font-semibold transition-colors shadow-lg" style={{ backgroundColor: 'rgba(0, 0, 0, 0.2)' }}>
              Post a Task
            </button>
          </div>

          {/* Trust Indicators */}
          <div className="flex flex-wrap justify-center gap-8 items-center">
            {trustIndicators.map((indicator) => (
              <div
                key={indicator.text}
                className="flex items-center gap-2 text-white"
              >
                <indicator.icon className="w-5 h-5" />
                <span className="text-sm font-medium">{indicator.text}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
