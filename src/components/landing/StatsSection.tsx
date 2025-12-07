const StatsSection = () => {
  const stats = [
    { number: '10K+', label: 'Produk Tersedia' },
    { number: '50K+', label: 'Pelanggan Puas' },
    { number: '100+', label: 'Mitra Terpercaya' },
    { number: '4.8/5', label: 'Rating Pengguna' }
  ];

  return (
    <section className="py-12 sm:py-16 md:py-20 px-4 bg-zinc-900 text-white">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 md:gap-8">
          {stats.map((stat, idx) => (
            <div key={idx} className="text-center">
              <div className="text-2xl sm:text-3xl md:text-4xl font-bold mb-1 sm:mb-2">{stat.number}</div>
              <div className="text-xs sm:text-sm md:text-base text-zinc-400">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default StatsSection;
