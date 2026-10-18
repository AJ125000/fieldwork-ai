"use client";

import { useEffect, useState } from "react";
import { ArrowRight, Send } from "lucide-react";
import { AIActivity } from "@/components/AIActivity";
import { BottomNav } from "@/components/BottomNav";
import { Button } from "@/components/Button";
import { Chip, ChipGroup } from "@/components/Chip";
import { Crop } from "@/components/Crop";
import { EvidenceBadge } from "@/components/EvidenceBadge";
import { StatusTag } from "@/components/StatusTag";
import { TopBar } from "@/components/TopBar";
import { ask, band, getListing, getRecord, gradeRange, itemName, recordUrl, words, type Answer, type Claim, type ConditionRecord, type Lane, type Listing } from "@/lib/api";
import type { EvidenceState } from "@/lib/mock";
import styles from "@/components/Flow.module.css";

const LANES: { lane: Lane; title: string; blurb: string; state: EvidenceState; label: string }[] = [
  { lane: "shown", title: "Shown", blurb: "Visible in the take, with the frame it comes from.", state: "shown", label: "Shown" },
  { lane: "measured", title: "Measured", blurb: "A number we computed, with its margin.", state: "shown", label: "Measured" },
  { lane: "declared", title: "Declared", blurb: "The seller said so. Not checkable from the take.", state: "not-shown", label: "Seller said" },
  { lane: "cant_judge", title: "Can't judge", blurb: "Photos and video can't establish these.", state: "cant-tell", label: "Can't judge" },
];
const LANG_LABEL: Record<string, string> = { en: "English", ja: "日本語", ko: "한국어", "zh-TW": "繁體中文", th: "ไทย", id: "Indonesia", vi: "Tiếng Việt", hi: "हिन्दी" };
const MAIN_REGIONS = ["front", "back", "collar", "left_sleeve", "right_sleeve", "left_cuff", "right_cuff", "hem", "pocket"];

function claimText(c: Claim) {
  if (c.lane === "measured" && c.value != null) return `${words(c.code)}: ${c.value}${c.error != null ? ` ± ${c.error}` : ""}`;
  return c.note || words(c.code);
}

export function PassView({ id }: { id: string }) {
  const [rec, setRec] = useState<ConditionRecord | null>(null);
  const [listing, setListing] = useState<Listing | null>(null);
  const [error, setError] = useState("");
  const [lang, setLang] = useState("en");
  const [q, setQ] = useState("");
  const [asking, setAsking] = useState(false);
  const [answer, setAnswer] = useState<{ q: string; a: Answer } | null>(null);
  const [askErr, setAskErr] = useState("");

  useEffect(() => {
    getRecord(id).then(setRec).catch((e: Error) => setError(e.message));
    getListing(id).then(setListing).catch(() => {});
  }, [id]);

  async function submitQ() {
    if (!q.trim() || asking) return;
    setAsking(true);
    setAskErr("");
    try {
      setAnswer({ q, a: await ask(id, q) });
    } catch (e) {
      setAskErr(e instanceof Error ? e.message : "Couldn't ask.");
    } finally {
      setAsking(false);
    }
  }

  if (error)
    return (
      <>
        <TopBar title="Garment Pass" />
        <main className={styles.main}>
          <p className={`${styles.err} t-body`} role="alert">{error}</p>
          <Button variant="secondary" href="/sell">Make a Pass</Button>
        </main>
      </>
    );
  if (!rec)
    return (
      <>
        <TopBar title="Garment Pass" />
        <main className={styles.main}><AIActivity title="Loading the Pass…" /></main>
      </>
    );

  const langs = ["en", ...["ja", "ko", "zh-TW", "th", "id-ID", "vi", "hi"].filter((l) => typeof listing?.[l] === "string")];
  const listingText = lang === "en" ? listing?.en ?? rec.listing_text_en : (listing?.[lang] as string);
  const covered = new Set(rec.claims.filter((c) => c.lane === "shown" && c.evidence.length).map((c) => c.region));
  const uncovered = MAIN_REGIONS.filter((r) => !covered.has(r));
  const cited = answer ? rec.claims.filter((c) => answer.a.claim_ids.includes(c.id)) : [];
  const answerState: { state: EvidenceState; label: string } =
    answer?.a.state === "shown" ? { state: "shown", label: "Shown" } : answer?.a.state === "cant_judge" ? { state: "cant-tell", label: "Can't judge" } : { state: "not-shown", label: "Not shown in the take" };

  return (
    <>
      <TopBar title="Garment Pass" backHref="/" titleAs="p" />
      <main className={styles.main}>
        <section className={styles.section} aria-labelledby="pass-title">
          {listing?.publication_status === "draft" && <p className="t-body-s">Seller draft · not available for purchase. <a href={`/sell/review/${id}`}>Review and publish</a></p>}
          <h1 id="pass-title" className="t-heading-l">{itemName(rec) || "Garment"}</h1>
          <div className={styles.row}>
            {rec.item.size_label && <Chip>Size {rec.item.size_label}</Chip>}
            {rec.item.material && <Chip>{rec.item.material}</Chip>}
            {rec.capture.code_seen ? <EvidenceBadge variant="compact" /> : <Chip>No one-time code seen</Chip>}
          </div>
        </section>

        <section className={styles.dark} aria-label="Grade and price">
          <p className="t-overline">Grade range from our model</p>
          <h2 className="t-num-l">{gradeRange(rec.grade_set)}</h2>
          <p className={`${styles.quiet} t-body-s`}>Estimated from the take only. A range, not a promise.</p>
          <p className="t-overline" style={{ marginTop: "var(--fw-space-3)" }}>Price band</p>
          <p className="t-num-m">{band(rec.price_band, rec.currency)}</p>
        </section>

        <section className={styles.section} aria-labelledby="listing-h">
          <h2 id="listing-h" className="t-heading-s">Listing</h2>
          {langs.length > 1 && (
            <ChipGroup label="Language">
              {langs.map((l) => (
                <Chip key={l} variant="answer" role="radio" selected={lang === l} onClick={() => setLang(l)}>
                  <span lang={l}>{LANG_LABEL[l] ?? l}</span>
                </Chip>
              ))}
            </ChipGroup>
          )}
          <p className="t-body" lang={lang}>{listingText || "No listing text."}</p>
          {!!listing?.seller_limitations?.length && <div className={styles.card}>
            <h3 className="t-heading-s">Unresolved limitations</h3>
            <ul>{listing.seller_limitations.map((text, i) => <li className="t-body-s" key={i}>{text}</li>)}</ul>
          </div>}
        </section>

        {LANES.map(({ lane, title, blurb, state, label }) => {
          const cs = rec.claims.filter((c) => c.lane === lane);
          return (
            <section key={lane} className={styles.section} aria-labelledby={`lane-${lane}`}>
              <div className={styles.between}>
                <h2 id={`lane-${lane}`} className="t-heading-s">{title}</h2>
                <StatusTag state={state} label={`${label} · ${cs.length}`} size="sm" />
              </div>
              <p className="t-body-s t-secondary">{blurb}</p>
              {cs.length === 0 ? (
                <p className="t-body-s t-quiet">Nothing in this lane.</p>
              ) : (
                <ul className={styles.list}>
                  {cs.map((c) => (
                    <li key={c.id} className={styles.item}>
                      <p className="t-body">{claimText(c)}</p>
                      <p className={`${styles.meta} t-meta`}>
                        {words(c.region)}{c.severity !== "none" ? ` · ${c.severity}` : ""}
                      </p>
                      {c.evidence.length > 0 && (
                        <div className={styles.thumbs}>
                          {c.evidence.slice(0, 2).map((b, i) => (
                            <Crop key={i} itemId={rec.id} box={b} label={b.frame_id} />
                          ))}
                        </div>
                      )}
                    </li>
                  ))}
                </ul>
              )}
            </section>
          );
        })}

        <section className={styles.card} aria-labelledby="not-shown-h">
          <h2 id="not-shown-h" className="t-heading-s">Coverage and close-up guidance</h2>
          {listing?.capture_coverage && <>
            <ul className={styles.list}>
              {listing.capture_coverage.views.map(view => <li key={view.region}>
                <span className="t-body-s">{words(view.region)} · {words(view.status)}{view.note ? ` — ${view.note}` : ""}</span>
              </li>)}
            </ul>
            {listing.capture_coverage.guidance.map(text => <p key={text} className="t-body-s">{text}</p>)}
            <p className="t-body-s t-secondary">{listing.capture_coverage.limitation}</p>
          </>}
          <p className="t-body-s">
            {uncovered.length ? `No evidence crop for: ${uncovered.map(words).join(", ")}.` : "Every main region has an evidence crop."} Anything outside the 12-second take is unknown, not fine.
          </p>
        </section>

        <section className={styles.section} aria-labelledby="ask-h">
          <h2 id="ask-h" className="t-heading-s">Ask the garment</h2>
          <p className="t-body-s t-secondary">Answers come only from this record and its frames, in your language.</p>
          <label className="sr-only" htmlFor="ask-q">Your question</label>
          <textarea
            id="ask-q"
            className={styles.field}
            rows={2}
            value={q}
            placeholder="Is there a stain on the left cuff?"
            onChange={(e) => setQ(e.target.value)}
          />
          <Button variant="secondary" loading={asking} disabled={!q.trim()} onClick={submitQ} iconLeading={<Send size={20} strokeWidth={2} aria-hidden="true" />}>
            Ask
          </Button>
          {askErr && <p className={`${styles.err} t-body-s`} role="alert">{askErr}</p>}
          {answer && (
            <div className={styles.card} role="status" aria-live="polite">
              <p className={`${styles.meta} t-meta`}>{answer.q}</p>
              <StatusTag state={answerState.state} label={answerState.label} />
              <p className="t-body" lang={answer.a.lang}>{answer.a.answer}</p>
              {cited.map((c) => (
                <div key={c.id} className={styles.section}>
                  <p className={`${styles.meta} t-meta`}>Cited · {claimText(c)}</p>
                  {c.evidence[0] && <div className={styles.thumbs}><Crop itemId={rec.id} box={c.evidence[0]} label={c.evidence[0].frame_id} /></div>}
                </div>
              ))}
            </div>
          )}
        </section>

        <details className={styles.details}>
          <summary className="t-label">Agent-readable record</summary>
          <p className="t-body-s t-secondary">Shopping agents read this same record, not the listing text. The one-time code is hidden.</p>
          <p className="t-body-s">
            <a href={recordUrl(rec.id)} target="_blank" rel="noreferrer">Open raw JSON ({rec.spec})</a>
          </p>
        </details>
        <Button fullWidth href={`/agent?item=${encodeURIComponent(rec.id)}`} iconTrailing={<ArrowRight size={20} strokeWidth={2} aria-hidden="true" />}>
          Ask my shopping agent about this
        </Button>
      </main>
      <BottomNav />
    </>
  );
}
