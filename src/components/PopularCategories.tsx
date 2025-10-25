import { Database, ShoppingCart, FileText, FileEdit, Image, TestTube } from 'lucide-react';

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
    <section className="w-full bg-white py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Heading */}
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold mb-3" style={{ color: '#344256' }}>
            Popular Task Categories
          </h2>
          <p style={{ color: '#344256' }}>
            Find the perfect micro-tasks that match your skills and interests
          </p>
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {categories.map((category) => (
            <div
              key={category.title}
              className="rounded-2xl p-8 hover:shadow-lg transition-shadow cursor-pointer group" style={{ backgroundColor: '#F5F5F5' }}
            >
              <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform" style={{ backgroundColor: category.iconBg }}>
                <category.icon className="w-6 h-6" style={{ color: category.iconColor }} />
              </div>
              <h3 className="font-semibold text-lg mb-2" style={{ color: '#344256' }}>
                {category.title}
              </h3>
              <p className="text-sm" style={{ color: '#344256' }}>
                {category.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
