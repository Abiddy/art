"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const links = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
  { href: "/selected-works", label: "Selected Works" },
  { href: "/projects", label: "Projects" },
];

export default function Navbar() {
  const pathname = usePathname();

  if (pathname.startsWith("/admin")) return null;

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white">
      <nav className="flex items-center justify-end gap-4 px-6 py-2 md:gap-6 md:px-10">
        {links.map(({ href, label }) => {
          const isActive =
            href === "/" ? pathname === "/" : pathname.startsWith(href);

          return (
            <Link
              key={href}
              href={href}
              className={`font-serif text-lg font-medium tracking-wide text-neutral-800 transition-colors hover:text-black md:text-xl ${
                isActive
                  ? "border-b border-black pb-0.5 text-black"
                  : "border-b border-transparent pb-0.5"
              }`}
            >
              {label}
            </Link>
          );
        })}
      </nav>
    </header>
  );
}
