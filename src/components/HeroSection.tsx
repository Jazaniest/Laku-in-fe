import { ShoppingBag } from 'lucide-react';
import { Button } from '@/components/ui/button';

const HeroSection = () => (
  <section className="py-20 px-4 bg-linear-to-b from-zinc-50 to-white">
    <div className="max-w-6xl mx-auto text-center">
      <div className="inline-flex items-center gap-2 bg-zinc-900 text-white px-4 py-2 rounded-full mb-6">
        <ShoppingBag className="w-5 h-5" />
        <span className="font-semibold text-lg">Laku-In</span>
      </div>
      <h1 className="text-5xl sm:text-6xl font-bold text-zinc-900 mb-6">
        Belanja Mudah, <br />
        <span className="text-zinc-600">Cepat & Terpercaya</span>
      </h1>
      <p className="text-xl text-zinc-600 mb-8 max-w-2xl mx-auto">
        Platform e-commerce terpercaya untuk semua kebutuhan Anda. 
        Produk berkualitas, harga terjangkau, pengiriman cepat.
      </p>
      <div className="flex gap-4 justify-center flex-wrap">
        <Button size="lg">
          Mulai Belanja
        </Button>
        <Button size="lg" variant="outline">
          Pelajari Lebih Lanjut
        </Button>
      </div>
    </div>
  </section>
);

export default HeroSection;