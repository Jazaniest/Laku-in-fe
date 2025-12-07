import { ShoppingBag } from 'lucide-react';
import { Button } from '@/components/ui/button';

const HeroSection = () => (
  <section className="py-12 sm:py-16 md:py-20 px-4 bg-linear-to-b from-zinc-50 to-white min-h-screen flex items-center justify-center">
    <div className="max-w-6xl mx-auto text-center">
      <div className="inline-flex items-center gap-2 bg-zinc-900 text-white px-2 py-1 sm:px-4 sm:py-2 rounded-full mb-4 sm:mb-6">
        <ShoppingBag className="w-4 h-4 sm:w-5 sm:h-5" />
        <span className="font-semibold text-sm sm:text-lg">Laku-In</span>
      </div>
      <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold text-zinc-900 mb-4 sm:mb-6">
        Belanja Mudah, <br />
        <span className="text-zinc-600">Cepat & Terpercaya</span>
      </h1>
      <p className="text-base sm:text-lg md:text-xl text-zinc-600 mb-6 sm:mb-8 max-w-2xl mx-auto leading-relaxed">
        Platform e-commerce terpercaya untuk semua kebutuhan Anda. 
        Produk berkualitas, harga terjangkau, pengiriman cepat.
      </p>
      <div className="flex gap-2 sm:gap-4 justify-center flex-wrap">
        <Button size="sm" className="sm:hidden">
          Mulai Belanja
        </Button>
        <Button size="default" className="hidden sm:inline-flex">
          Mulai Belanja
        </Button>
        <Button size="sm" variant="outline" className="sm:hidden">
          Pelajari Lebih Lanjut
        </Button>
        <Button size="default" variant="outline" className="hidden sm:inline-flex">
          Pelajari Lebih Lanjut
        </Button>
      </div>
    </div>
  </section>
);

export default HeroSection;