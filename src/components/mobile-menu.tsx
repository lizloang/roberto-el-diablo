"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { siteConfig } from "@/config/site";

export function MobileMenu() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", onKeyDown);
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <div className="md:hidden">
      <button
        type="button"
        aria-expanded={open}
        aria-controls="mobile-menu"
        aria-label={open ? "Cerrar menú" : "Abrir menú"}
        onClick={() => setOpen(!open)}
        className="relative z-50 flex size-11 flex-col items-center justify-center gap-1.5"
      >
        <span
          className={`h-0.5 w-7 bg-current transition-transform ${open ? "translate-y-2 rotate-45" : ""}`}
        />
        <span
          className={`h-0.5 w-7 bg-current transition-opacity ${open ? "opacity-0" : ""}`}
        />
        <span
          className={`h-0.5 w-7 bg-current transition-transform ${open ? "-translate-y-2 -rotate-45" : ""}`}
        />
      </button>

      <nav
        id="mobile-menu"
        aria-label="Principal"
        hidden={!open}
        className="fixed inset-0 z-40 bg-negro px-5 pt-28"
      >
        <ul className="flex flex-col gap-6">
          {siteConfig.nav.map((item) => (
            <li key={item.label}>
              <Link
                href={item.href}
                onClick={() => setOpen(false)}
                className="font-display text-5xl uppercase"
              >
                {item.label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
}
