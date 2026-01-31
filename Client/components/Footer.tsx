// components/Footer.tsx
export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-8 py-12">
        <div className="text-center">
          <p className="text-gray-400">
            © {new Date().getFullYear()} SchoolMS. All rights reserved.
          </p>
          <p className="mt-2 text-sm text-gray-500">
            Made with care for modern schools
          </p>
        </div>
      </div>
    </footer>
  );
}