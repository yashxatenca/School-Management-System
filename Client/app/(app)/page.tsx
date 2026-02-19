// app/page.tsx
import Header from "@/components/ui/Header";
import Hero from "@/components/ui/Hero";
import Footer from "@/components/ui/Footer";

export default function Home() {
  return (
    <>
 
      <main>
        <Hero />
        {/* You can add more sections here */}
        <section className="py-16 sm:py-24 bg-white">
          <div className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-8">
            <h2 className="text-3xl sm:text-4xl font-bold text-center text-gray-900">
              Welcome to SchoolMS
            </h2>
            {/* ... more content ... */}
          </div>
        </section>
      </main>
    </>
  );
}