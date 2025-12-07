import { ShoppingBag } from 'lucide-react';

const Footer = () => (
  <footer className="py-8 sm:py-12 px-4 bg-white border-t border-zinc-200">
    <div className="max-w-6xl mx-auto">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8 mb-6 sm:mb-8">
        <div className="text-center md:text-left">
          <div className="flex items-center gap-2 mb-3 md:mb-4 justify-center md:justify-start">
            <ShoppingBag className="w-4 h-4 sm:w-6 sm:h-6" />
            <span className="font-bold text-base sm:text-xl">Laku-In</span>
          </div>
          <p className="text-zinc-600 text-sm md:text-base">
            Platform e-commerce terpercaya untuk semua kebutuhan Anda.
          </p>
        </div>
        <div className="text-center md:text-left">
          <h4 className="font-semibold mb-3 md:mb-4 text-sm md:text-base">Kategori</h4>
          <ul className="space-y-1 md:space-y-2 text-zinc-600 text-sm md:text-base">
            <li>Fashion</li>
            <li>Elektronik</li>
            <li>Rumah Tangga</li>
            <li>Olahraga</li>
          </ul>
        </div>
        <div className="text-center md:text-left">
          <h4 className="font-semibold mb-3 md:mb-4 text-sm md:text-base">Perusahaan</h4>
          <ul className="space-y-1 md:space-y-2 text-zinc-600 text-sm md:text-base">
            <li>Tentang Kami</li>
            <li>Karir</li>
            <li>Blog</li>
            <li>Kontak</li>
          </ul>
        </div>
        <div className="text-center md:text-left">
          <h4 className="font-semibold mb-3 md:mb-4 text-sm md:text-base">Bantuan</h4>
          <ul className="space-y-1 md:space-y-2 text-zinc-600 text-sm md:text-base">
            <li>FAQ</li>
            <li>Cara Belanja</li>
            <li>Kebijakan Privasi</li>
            <li>Syarat & Ketentuan</li>
          </ul>
        </div>
      </div>
      <div className="border-t border-zinc-200 pt-6 sm:pt-8 text-center text-zinc-600 text-sm md:text-base">
        <p>&copy; 2024 Laku-In. All rights reserved.</p>
      </div>
    </div>
  </footer>
);

export default Footer;