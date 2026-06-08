import Link from "next/link";
import { Calculator, Crown, Home, MessageCircle, Search } from "lucide-react";

const navItems = [
  { href: "/", label: "Home", icon: Home },
  { href: "/names", label: "Search", icon: Search },
  { href: "/numerology", label: "Numbers", icon: Calculator },
  { href: "/premium", label: "Premium", icon: Crown },
  { href: "/consultation", label: "WhatsApp", icon: MessageCircle },
];

export function BottomNav() {
  return (
    <nav className="fixed inset-x-0 bottom-0 z-20 mx-auto w-full max-w-md border-t border-orange-100 bg-white/95 px-2 pb-[max(0.75rem,env(safe-area-inset-bottom))] pt-2 shadow-lg shadow-orange-950/10 backdrop-blur">
      <ul className="grid grid-cols-5 gap-1">
        {navItems.map((item) => {
          const Icon = item.icon;

          return (
            <li key={item.href}>
              <Link
                className="flex min-h-12 flex-col items-center justify-center rounded-2xl px-1 text-[0.68rem] font-medium text-slate-500 transition-colors hover:bg-orange-50 hover:text-orange-700"
                href={item.href}
              >
                <Icon aria-hidden="true" className="mb-1 size-5" />
                <span>{item.label}</span>
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
