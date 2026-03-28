'use client';

/**
 * Floating stats row — social proof
 */
export default function Stats() {
  const stats = [
    { value: '10x', label: 'Faster Notes' },
    { value: '3x', label: 'Better Retention' },
    { value: '14+', label: 'AI Tools' },
    { value: '0', label: 'Setup Needed' },
  ];

  return (
    <section className="py-16 px-4">
      <div className="max-w-5xl mx-auto">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {stats.map((stat, i) => (
            <div
              key={i}
              className="glass-card p-6 text-center hover:border-student-accent/30 transition-all duration-300 group"
            >
              <div className="text-3xl sm:text-4xl font-black gradient-text-red group-hover:scale-110 transition-transform duration-300 inline-block">
                {stat.value}
              </div>
              <div className="text-xs sm:text-sm text-os-muted mt-2 uppercase tracking-wider font-semibold">
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
