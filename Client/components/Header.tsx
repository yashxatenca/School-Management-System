"use client";
import Link from "next/link";
import { useState, useEffect, useRef } from "react";
import { Menu, X, ChevronDown } from "lucide-react"; // Added Chevron for better UX

export default function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isLoginDropdownOpen, setIsLoginDropdownOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsLoginDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Shadow on scroll
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const closeAll = () => {
    setIsMobileMenuOpen(false);
    setIsLoginDropdownOpen(false);
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-[100] transition-all duration-300 ${
        isScrolled ? "bg-white/95 backdrop-blur-md shadow-sm" : "bg-white shadow-sm"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16 sm:h-18">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2" onClick={closeAll}>
            <span className="text-2xl sm:text-3xl font-extrabold text-indigo-600 tracking-tight">
              SchoolMS
            </span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-8">
            <nav className="flex gap-6">
              <Link href="/" className="text-gray-700 hover:text-indigo-600 font-medium">Home</Link>
              <Link href="/about" className="text-gray-700 hover:text-indigo-600 font-medium">About</Link>
              <Link href="/features" className="text-gray-700 hover:text-indigo-600 font-medium">Features</Link>
            </nav>

            {/* Desktop Login Dropdown */}
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setIsLoginDropdownOpen(!isLoginDropdownOpen)}
                className="bg-indigo-600 text-white px-5 py-2.5 rounded-lg font-medium flex items-center gap-2"
              >
                Login <ChevronDown size={16} />
              </button>

              {isLoginDropdownOpen && (
                <div className="absolute right-0 mt-3 w-56 bg-white rounded-xl shadow-xl border border-gray-100 z-[110]">
                  <div className="py-1">
                    <Link href="/login?role=student" className="block px-5 py-3 hover:bg-indigo-50" onClick={closeAll}>Student Login</Link>
                    <Link href="/login?role=teacher" className="block px-5 py-3 hover:bg-indigo-50" onClick={closeAll}>Teacher Login</Link>
                    <Link href="/login?role=principal" className="block px-5 py-3 hover:bg-indigo-50" onClick={closeAll}>Admin Login</Link>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Mobile menu button */}
          <button
            className="md:hidden text-gray-700 p-2 rounded-lg"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile menu - Fixed height and scrollable for small phones */}
      {isMobileMenuOpen && (
        <div className="md:hidden border-t bg-white absolute top-16 left-0 w-full h-screen overflow-y-auto pb-20">
          <div className="px-4 py-5 space-y-6">
            <nav className="flex flex-col gap-5 text-lg">
              <Link href="/" className="text-gray-800 font-medium" onClick={closeAll}>Home</Link>
              <Link href="/about" className="text-gray-800 font-medium" onClick={closeAll}>About</Link>
              <Link href="/features" className="text-gray-800 font-medium" onClick={closeAll}>Features</Link>
            </nav>

            <div className="pt-5 border-t space-y-4">
              <Link href="/login?role=student" className="block text-center bg-indigo-600 text-white py-4 rounded-xl font-medium" onClick={closeAll}>
                Student Login
              </Link>
              <Link href="/login?role=teacher" className="block text-center border-2 border-indigo-600 text-indigo-600 py-4 rounded-xl font-medium" onClick={closeAll}>
                Teacher Login
              </Link>
              <Link href="/login?role=principal" className="block text-center border border-gray-300 text-gray-700 py-4 rounded-xl font-medium" onClick={closeAll}>
                Admin Login
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}