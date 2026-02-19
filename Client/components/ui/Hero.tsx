// components/Hero.tsx
export default function Hero() {
  return (
    <section className="relative bg-gradient-to-br from-indigo-600 via-indigo-700 to-purple-700 text-white pt-24 pb-20 sm:pt-32 sm:pb-28 lg:pt-40 lg:pb-32 overflow-hidden">
      {/* Optional subtle background pattern */}
      <div className="absolute inset-0 opacity-10 pointer-events-none">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_30%,rgba(255,255,255,0.2)_0%,transparent_50%)]" />
      </div>

      <div className="relative max-w-7xl mx-auto px-5 sm:px-6 lg:px-8 text-center">
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight leading-tight">
          Smart School <span className="text-indigo-200">Management</span>
        </h1>

        <p className="mt-6 text-lg sm:text-xl md:text-2xl max-w-3xl mx-auto opacity-90 font-light">
          One powerful platform to manage students, teachers, attendance, exams,
          fees and reports — made simple.
        </p>

        <div className="mt-10 flex flex-col sm:flex-row justify-center gap-5 sm:gap-6">
          <a
            href="/login?role=student"
            className="inline-flex items-center justify-center px-8 py-4 bg-white text-indigo-700 font-semibold rounded-xl shadow-lg hover:bg-indigo-50 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 text-lg"
          >
            Student Portal
          </a>
          <a
            href="/login?role=teacher"
            className="inline-flex items-center justify-center px-8 py-4 border-2 border-white text-white font-semibold rounded-xl hover:bg-white/10 transition-all duration-300 text-lg"
          >
            Teacher Portal
          </a>
        </div>
      </div>
    </section>
  );
}