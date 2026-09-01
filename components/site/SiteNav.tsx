"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { FileText, Users, Menu, X, MapPin, Phone } from "lucide-react";

const NAV_LINKS = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About Us" },
  { href: "/courses", label: "Courses" },
  { href: "/franchise", label: "Franchise" },
  { href: "/verification", label: "Verification" },
  { href: "/contact", label: "Contact Us" },
];

export default function SiteNav() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  return (
    <>
      {/* Top Announcement Bar */}
      <div className="bg-[#b91c1c] text-white py-2 overflow-hidden">
        <div className="flex items-center justify-between px-6 py-2 text-xs text-white">
          <div className="flex items-center">
            <span className="px-2 py-0.5 bg-red-900 font-bold rounded-sm text-[11px] flex items-center gap-1 whitespace-nowrap">
              <FileText className="w-3 h-3" /> Latest Announcement:
            </span>
            <span className="ml-3 animate-pulse">New Batches Starting Soon! Contact: 08299121689</span>
          </div>
          <div className="hidden md:flex items-center gap-4">
            <span className="flex items-center"><MapPin className="w-3 h-3 mr-1" /> Fatehpur, UP 212601</span>
            <span className="flex items-center"><Phone className="w-3 h-3 mr-1" /> 08299121689</span>
          </div>
        </div>
      </div>

      {/* Main Navigation */}
      <nav className="bg-white shadow-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between h-20">
          <Link href="/" className="flex items-center space-x-2 mr-12">
            <img
              src="/logo.jpeg"
              alt="Rama Coaching Center Logo"
              className="w-10 h-10 md:w-12 md:h-12 object-contain"
            />
            <div>
              <h1 className="text-sm md:text-lg font-semibold md:font-bold text-gray-800">Rama Coaching Center</h1>
              <p className="text-[10px] md:text-xs text-gray-600">And Computer Education Center</p>
            </div>
          </Link>

          <div className="hidden md:flex items-center gap-8">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`font-medium text-sm font-sans transition-colors ${
                  isActive(link.href)
                    ? "text-red-600"
                    : "text-gray-700 hover:text-red-600"
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>

          <div className="flex items-center gap-2">
            <Link
              href="/login"
              className="hidden md:inline-flex items-center bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2.5 rounded-md font-semibold text-sm shadow-sm gap-2"
            >
              <Users className="w-4 h-4" /> Student Login / Register
            </Link>

            <button
              type="button"
              aria-label="Toggle menu"
              onClick={() => setOpen((v) => !v)}
              className="md:hidden inline-flex items-center justify-center p-2 rounded-md text-gray-700 hover:text-red-600 hover:bg-gray-100"
            >
              {open ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Drawer */}
      {open && (
        <div className="fixed inset-0 z-[60] md:hidden">
          <div
            className="absolute inset-0 bg-black/50"
            onClick={() => setOpen(false)}
          />
          <div className="absolute right-0 top-0 h-full w-72 max-w-[80%] bg-white shadow-xl flex flex-col">
            <div className="flex items-center justify-between px-6 h-20 border-b">
              <span className="text-lg font-bold text-gray-800">Menu</span>
              <button
                type="button"
                aria-label="Close menu"
                onClick={() => setOpen(false)}
                className="inline-flex items-center justify-center p-2 rounded-md text-gray-700 hover:text-red-600 hover:bg-gray-100"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            <div className="flex flex-col px-6 py-4 gap-2">
              {NAV_LINKS.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setOpen(false)}
                  className={`font-medium text-sm font-sans transition-colors py-3 border-b border-gray-100 ${
                    isActive(link.href)
                      ? "text-red-600"
                      : "text-gray-700 hover:text-red-600"
                  }`}
                >
                  {link.label}
                </Link>
              ))}
              <Link
                href="/login"
                onClick={() => setOpen(false)}
                className="mt-4 inline-flex items-center justify-center bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-3 rounded-md font-semibold text-sm shadow-sm gap-2"
              >
                <Users className="w-4 h-4" /> Student Login / Register
              </Link>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
