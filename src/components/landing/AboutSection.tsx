import { ShoppingBag } from 'lucide-react';
import { Button } from '@/components/ui/button';

const AboutSection = () => (
  <section className="py-12 sm:py-16 md:py-20 px-4 bg-zinc-50">
    <div className="max-w-6xl mx-auto">
      <div className="grid md:grid-cols-2 gap-8 md:gap-12 items-center">
        <div>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-zinc-900 mb-4 md:mb-6">
            Tentang Laku-In
          </h2>
          <p className="text-sm sm:text-base md:text-lg text-zinc-600 mb-4 leading-relaxed">
            Laku-In adalah platform e-commerce yang didirikan dengan misi untuk memudahkan 
            masyarakat dalam berbelanja online dengan pengalaman yang menyenangkan dan terpercaya.
          </p>
          <p className="text-sm sm:text-base md:text-lg text-zinc-600 mb-4 leading-relaxed">
            Kami menyediakan berbagai kategori produk mulai dari fashion, elektronik, 
            perlengkapan rumah tangga, hingga kebutuhan sehari-hari dengan harga yang kompetitif.
          </p>
          <p className="text-sm sm:text-base md:text-lg text-zinc-600 mb-6 leading-relaxed">
            Dengan sistem keamanan yang terjamin dan layanan customer service yang responsif, 
            kami berkomitmen menjadi partner belanja online terpercaya Anda.
          </p>
          <Button size="lg" className="w-full sm:w-auto">
            Hubungi Kami
          </Button>
        </div>
        <div className="bg-zinc-200 rounded-2xl h-48 md:h-96 sm:h-72 flex items-center justify-center order-first md:order-last mt-6 md:mt-0">
          <ShoppingBag className="w-16 h-16 md:w-32 md:h-32 text-zinc-400" />
        </div>
      </div>
    </div>
  </section>
);

export default AboutSection;