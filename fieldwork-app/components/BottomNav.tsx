"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect } from "react";
import { useDraftState } from "@/lib/useDraftState";
import { Camera, CircleHelp, House, ShoppingBag, Tag } from "lucide-react";
import styles from "./BottomNav.module.css";

const items = [
  { id: "home", label: "Home", href: "/", Icon: House, match: (p: string) => p === "/" },
  { id: "buy", label: "Buy", href: "/agent", Icon: ShoppingBag, match: (p: string) => p.startsWith("/agent") || p.startsWith("/pass") || p.startsWith("/unbox") },
  { id: "capture", label: "Capture", href: "/sell", Icon: Camera, match: (p: string) => p === "/sell", centre: true },
  { id: "sell", label: "Sell", href: "/sell", Icon: Tag, match: (p: string) => p.startsWith("/sell") },
  { id: "help", label: "Help", href: "/help", Icon: CircleHelp, match: (p: string) => p.startsWith("/case") || p === "/help" },
] as const;

/* Home, Buy, centre Capture, Sell, Help. Active = weight + top marker + colour, never colour alone. */
export function BottomNav() {
  const pathname = usePathname() ?? "/";
  const [sellerRoute, setSellerRoute] = useDraftState("fw.nav.seller", "/sell");
  const [buyerRoute, setBuyerRoute] = useDraftState("fw.nav.buyer", "/agent");
  const [helpRoute, setHelpRoute] = useDraftState("fw.nav.help", "/help");
  useEffect(() => { if (pathname.startsWith("/sell")) setSellerRoute(pathname); }, [pathname, setSellerRoute]);
  useEffect(() => {
    const route = pathname + window.location.search;
    if (pathname === "/agent" || pathname.startsWith("/pass/") || pathname.startsWith("/unbox/")) setBuyerRoute(route);
    if (pathname === "/help" || pathname.startsWith("/case/")) setHelpRoute(route);
  }, [pathname, setBuyerRoute, setHelpRoute]);
  return (
    <nav className={styles.nav} aria-label="Main">
      <ul className={styles.list}>
        {items.map((it) => {
          const active = it.match(pathname);
          const Icon = it.Icon;
          const href = it.id === "sell" && sellerRoute.startsWith("/sell") ? sellerRoute :
            it.id === "buy" && /^\/(agent|pass\/|unbox\/)/.test(buyerRoute) ? buyerRoute :
            it.id === "help" && /^\/(help|case\/)/.test(helpRoute) ? helpRoute : it.href;
          if ("centre" in it && it.centre) {
            return (
              <li key={it.id} className={styles.centreCell}>
                <Link href={it.href} className={styles.capture} aria-label="Capture: film a One Take" aria-current={active ? "page" : undefined}>
                  <Icon size={24} strokeWidth={2} aria-hidden="true" />
                </Link>
              </li>
            );
          }
          return (
            <li key={it.id}>
              <Link href={href} className={`${styles.link} ${active ? styles.active : ""} t-label`} aria-current={active ? "page" : undefined}>
                <Icon size={24} strokeWidth={2} aria-hidden="true" />
                <span>{it.label}</span>
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
