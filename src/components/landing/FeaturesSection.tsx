import { Mic, Bot, TrendingUp, Image } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

const FeaturesSection = () => {
  const features = [
    {
      icon: <Mic className="w-10 h-10" />,
      title: 'AI Voice Powered',
      description: 'Teknologi AI voice recognition untuk pengalaman belanja hands-free yang lebih mudah'
    },
    {
      icon: <Bot className="w-10 h-10" />,
      title: 'AI Cashier Powered',
      description: 'Sistem kasir otomatis berbasis AI untuk transaksi yang lebih cepat dan efisien'
    },
    {
      icon: <TrendingUp className="w-10 h-10" />,
      title: 'AI Finance Analytics',
      description: 'Analisis keuangan cerdas untuk membantu bisnis Anda berkembang lebih optimal'
    },
    {
      icon: <Image className="w-10 h-10" />,
      title: 'AI Poster Generation',
      description: 'Buat poster promosi menarik secara otomatis dengan teknologi AI generatif'
    }
  ];

  return (
    <section className="py-12 sm:py-16 md:py-20 px-4 bg-white">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-8 sm:mb-16">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-zinc-900 mb-2 sm:mb-4">
            Kenapa Memilih Laku-In?
          </h2>
          <p className="text-sm sm:text-base md:text-lg text-zinc-600 max-w-2xl mx-auto leading-relaxed">
            Kami berkomitmen memberikan pengalaman belanja online terbaik dengan teknologi AI terdepan
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 md:gap-8">
          {features.map((feature, idx) => (
            <Card key={idx} className="hover:shadow-lg transition-shadow">
              <CardContent className="pt-4 sm:pt-6 p-4 sm:p-6 text-center sm:text-left">
                <div className="w-12 h-12 sm:w-16 sm:h-16 bg-zinc-100 rounded-lg flex items-center justify-center mb-3 sm:mb-4 text-zinc-900 mx-auto sm:mx-0">
                  {feature.icon}
                </div>
                <h3 className="text-lg sm:text-xl font-semibold mb-2 text-zinc-900">
                  {feature.title}
                </h3>
                <p className="text-sm sm:text-base text-zinc-600 leading-relaxed">
                  {feature.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;