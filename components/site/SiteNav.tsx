"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { FileText, Users, Menu, X, MapPin, Phone, ClipboardList } from "lucide-react";

const NAV_LINKS = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About Us" },
  { href: "/courses", label: "Courses" },
  { href: "/mock-test", label: "Mock Test", highlight: true },
  { href: "/franchise", label: "Franchise" },
  { href: "/verification", label: "Verification" },
  { href: "/contact", label: "Contact" },
];

export default function SiteNav() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  return (
    <>
      {/* Top Announcement Bar */}
      <div className="bg-[#b91c1c] text-white overflow-hidden">
        <div className="flex items-center justify-between px-6 py-2 text-xs">
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 bg-red-900 font-medium rounded-sm text-[11px] flex items-center gap-1 whitespace-nowrap">
              <FileText className="w-3 h-3" /> Latest Announcement:
            </span>
            <span className="animate-pulse whitespace-nowrap">New Batches Starting Soon! Contact: 08299121689</span>
          </div>
          <div className="hidden md:flex items-center gap-4 whitespace-nowrap">
            <span className="flex items-center gap-1"><MapPin className="w-3 h-3" /> Fatehpur, UP 212601</span>
            <span className="flex items-center gap-1"><Phone className="w-3 h-3" /> 08299121689</span>
          </div>
        </div>
      </div>

      {/* Main Navigation */}
      <nav className="bg-white shadow-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 lg:px-6 flex items-center justify-between h-16">

          <Link href="/" className="flex items-center gap-2.5 shrink-0 mr-6">
            <img src="/logo.jpeg" alt="Rama Coaching Center" className="w-9 h-9 object-contain rounded" />
            <div className="hidden sm:block leading-tight">
              <p className="text-sm font-semibold text-gray-800 whitespace-nowrap">Rama Coaching Center</p>
              <p className="text-[10px] text-gray-500">And Computer Education Center</p>
            </div>
          </Link>

          <div className="hidden lg:flex items-center gap-0.5 flex-1">
            {NAV_LINKS.map((link) =>
              link.highlight ? (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`inline-flex items-center gap-1.5 whitespace-nowrap rounded px-3 py-1.5 text-[13px] font-medium transition-all ${
                    isActive(link.href)
                      ? "bg-red-600 text-white"
                      : "bg-red-600/10 text-red-600 hover:bg-red-600 hover:text-white"
                  }`}
                >
                  <ClipboardList className="h-3.5 w-3.5 shrink-0" />
                  {link.label}
                </Link>
              ) : (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`whitespace-nowrap px-3 py-1.5 text-[13px] transition-colors rounded ${
                    isActive(link.href)
                      ? "text-red-600 font-medium"
                      : "text-gray-700 hover:text-red-600 hover:bg-gray-50"
                  }`}
                >
                  {link.label}
                </Link>
              )
            )}
          </div>

          <div className="flex items-center gap-2 ml-4">
            <Link
              href="/login"
              className="hidden lg:inline-flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white px-3.5 py-2 rounded font-medium text-[13px] whitespace-nowrap transition-colors"
            >
              <Users className="w-3.5 h-3.5" /> Student Login
            </Link>
            <button
              type="button"
              aria-label="Toggle menu"
              onClick={() => setOpen((v) => !v)}
              className="lg:hidden p-2 rounded text-gray-700 hover:text-red-600 hover:bg-gray-100"
            >
              {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Drawer */}
      {open && (
        <div className="fixed inset-0 z-[60] lg:hidden">
          <div className="absolute inset-0 bg-black/50" onClick={() => setOpen(false)} />
          <div className="absolute right-0 top-0 h-full w-72 max-w-[85%] bg-white shadow-xl flex flex-col">
            <div className="flex items-center justify-between px-5 h-16 border-b">
              <span className="text-base font-medium text-gray-800">Menu</span>
              <button type="button" aria-label="Close" onClick={() => setOpen(false)} className="p-2 rounded text-gray-500 hover:text-red-600">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="flex flex-col px-4 py-3 gap-0.5 overflow-y-auto">
              {NAV_LINKS.map((link) =>
                link.highlight ? (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setOpen(false)}
                    className={`flex items-center gap-2.5 rounded px-4 py-2.5 text-sm font-medium transition-colors ${
                      isActive(link.href)
                        ? "bg-red-600 text-white"
                        : "bg-red-50 text-red-600 hover:bg-red-600 hover:text-white"
                    }`}
                  >
                    <ClipboardList className="h-4 w-4 shrink-0" />
                    Free Mock Test
                  </Link>
                ) : (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setOpen(false)}
                    className={`flex items-center px-4 py-2.5 text-sm rounded transition-colors ${
                      isActive(link.href)
                        ? "text-red-600 bg-red-50 font-medium"
                        : "text-gray-700 hover:text-red-600 hover:bg-gray-50"
                    }`}
                  >
                    {link.label}
                  </Link>
                )
              )}
            </div>
            <div className="mt-auto px-4 pb-6 pt-3 border-t">
              <Link
                href="/login"
                onClick={() => setOpen(false)}
                className="flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2.5 rounded font-medium text-sm transition-colors"
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
