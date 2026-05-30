"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

const links = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
  { href: "/selected-works", label: "Selected Works" },
  { href: "/projects", label: "Projects" },
];

function NavLink({
  href,
  label,
  isActive,
  onClick,
  className = "",
}: {
  href: string;
  label: string;
  isActive: boolean;
  onClick?: () => void;
  className?: string;
}) {
  return (
    <Link
      href={href}
      onClick={onClick}
      className={`font-serif font-medium tracking-wide text-neutral-800 transition-colors hover:text-black ${
        isActive
          ? "border-b border-black pb-0.5 text-black"
          : "border-b border-transparent pb-0.5"
      } ${className}`}
    >
      {label}
    </Link>
  );
}

export default function Navbar() {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  if (pathname.startsWith("/admin")) return null;

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white">
      <nav className="flex items-center justify-end px-4 py-2 md:px-10">
        {/* Desktop nav */}
        <div className="hidden items-center gap-4 md:flex md:gap-6">
          {links.map(({ href, label }) => {
            const isActive =
              href === "/" ? pathname === "/" : pathname.startsWith(href);

            return (
              <NavLink
                key={href}
                href={href}
                label={label}
                isActive={isActive}
                className="text-lg md:text-xl"
              />
            );
          })}
        </div>

        {/* Mobile hamburger */}
        <button
          type="button"
          aria-label={menuOpen ? "Close menu" : "Open menu"}
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen((open) => !open)}
          className="flex h-10 w-10 items-center justify-center md:hidden"
        >
          <span className="relative block h-4 w-5">
            <span
              className={`absolute left-0 top-0 block h-px w-full bg-neutral-900 transition-transform duration-200 ${
                menuOpen ? "translate-y-[7px] rotate-45" : ""
              }`}
            />
            <span
              className={`absolute left-0 top-[7px] block h-px w-full bg-neutral-900 transition-opacity duration-200 ${
                menuOpen ? "opacity-0" : ""
              }`}
            />
            <span
              className={`absolute bottom-0 left-0 block h-px w-full bg-neutral-900 transition-transform duration-200 ${
                menuOpen ? "-translate-y-[7px] -rotate-45" : ""
              }`}
            />
          </span>
        </button>
      </nav>

      {/* Mobile menu */}
      {menuOpen && (
        <>
          <button
            type="button"
            aria-label="Close menu"
            className="fixed inset-0 top-[52px] bg-black/20 md:hidden"
            onClick={() => setMenuOpen(false)}
          />
          <div className="absolute left-0 right-0 top-full border-t border-neutral-100 bg-white px-6 py-6 shadow-sm md:hidden">
            <div className="flex flex-col items-end gap-5">
              {links.map(({ href, label }) => {
                const isActive =
                  href === "/" ? pathname === "/" : pathname.startsWith(href);

                return (
                  <NavLink
                    key={href}
                    href={href}
                    label={label}
                    isActive={isActive}
                    onClick={() => setMenuOpen(false)}
                    className="text-xl"
                  />
                );
              })}
            </div>
          </div>
        </>
      )}
    </header>
  );
}
