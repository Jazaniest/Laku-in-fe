import { ShoppingBag } from 'lucide-react';

const Footer = () => (
  <footer className="py-12 px-4 bg-white border-t border-zinc-200">
    <div className="max-w-6xl mx-auto">
      <div className="grid md:grid-cols-4 gap-8 mb-8">
        <div>
          <div className="flex items-center gap-2 mb-4">
            <ShoppingBag className="w-6 h-6" />
            <span className="font-bold text-xl">Laku-In</span>
          </div>
          <p className="text-zinc-600">
            Platform e-commerce terpercaya untuk semua kebutuhan Anda.
          </p>
        </div>
        <div>
          <h4 className="font-semibold mb-4">Kategori</h4>
          <ul className="space-y-2 text-zinc-600">
            <li>Fashion</li>
            <li>Elektronik</li>
            <li>Rumah Tangga</li>
            <li>Olahraga</li>
          </ul>
        </div>
        <div>
          <h4 className="font-semibold mb-4">Perusahaan</h4>
          <ul className="space-y-2 text-zinc-600">
            <li>Tentang Kami</li>
            <li>Karir</li>
            <li>Blog</li>
            <li>Kontak</li>
          </ul>
        </div>
        <div>
          <h4 className="font-semibold mb-4">Bantuan</h4>
          <ul className="space-y-2 text-zinc-600">
            <li>FAQ</li>
            <li>Cara Belanja</li>
            <li>Kebijakan Privasi</li>
            <li>Syarat & Ketentuan</li>
          </ul>
        </div>
      </div>
      <div className="border-t border-zinc-200 pt-8 text-center text-zinc-600">
        <p>&copy; 2024 Laku-In. All rights reserved.</p>
      </div>
    </div>
  </footer>
);

export default Footer;