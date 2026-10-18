import { Bot, ChevronRight, Film, Scale, ScanSearch } from "lucide-react";
import Link from "next/link";
import { BottomNav } from "@/components/BottomNav";
import { TopBar } from "@/components/TopBar";
import flow from "@/components/Flow.module.css";
import styles from "./home.module.css";

const flows = [
  { href: "/sell", Icon: Film, title: "Sell: film one take", body: "12 seconds and a one-time code become a Garment Pass." },
  { href: "/agent", Icon: Bot, title: "Buy: tell your agent", body: "Find a garment, inspect its photos and video, and confirm a simulated purchase." },
  { href: "/pass/fx_coat_navy_clean", Icon: ScanSearch, title: "Open a sample Pass", body: "Four lanes: shown, measured, declared, can't judge." },
  { href: "/help", Icon: Scale, title: "Help and issue history", body: "Track pending human reviews, requested evidence and completed decisions." },
];

/* Hub: one card per flow. */
export default function HomePage() {
  return (
    <>
      <TopBar variant="brand" />
      <main className={styles.main}>
        <section className={styles.hero} aria-labelledby="hero-title">
          <h1 id="hero-title" className="t-display-m">What the garment shows, and what it doesn&rsquo;t.</h1>
          <p className={`${styles.sub} t-body-l`}>A condition record agents and people can both read, with escrow that follows the evidence.</p>
        </section>
        <ul className={styles.cards}>
          {flows.map(({ href, Icon, title, body }) => (
            <li key={href}>
              <Link href={href} className={flow.hubLink}>
                <Icon size={24} strokeWidth={2} aria-hidden="true" />
                <div>
                  <p className="t-heading-s">{title}</p>
                  <p className="t-body-s t-secondary">{body}</p>
                </div>
                <ChevronRight size={20} aria-hidden="true" />
              </Link>
            </li>
          ))}
        </ul>
      </main>
      <BottomNav />
    </>
  );
}
