"use client";

import { BlinkComparator } from "./BlinkComparator";
import { StatusTag } from "./StatusTag";
import { evidenceUrl, itemName, words, yen, type IssueReport } from "@/lib/api";
import styles from "./Flow.module.css";

export const assessmentLabel = {
  consistent: "Appears consistent in compared views",
  differs: "Possible condition difference",
  cant_tell: "Insufficient evidence",
};

export function IssueReportView({ report }: { report: IssueReport }) {
  const comparisons = report.inspection?.comparisons ?? [];
  const crops = comparisons.filter(pair => pair.kind !== "aligned_view");
  const focused = (crops.length ? crops : comparisons).slice(0, 3);
  const remaining = comparisons.filter(pair => !focused.includes(pair));
  const comparison = (pair: typeof comparisons[number], i: number) => <section className={styles.card} key={`pair-${i}`}>
    <h3 className="t-heading-s">{pair.what}</h3>
    {pair.listing_crop && pair.unbox_crop && <BlinkComparator listingSrc={evidenceUrl(pair.listing_crop)} unboxSrc={evidenceUrl(pair.unbox_crop)} />}
    <p className="t-body-s">{pair.reason}</p>
    {pair.unsure && <p className="t-body-s">The crop inspection was uncertain.</p>}
  </section>;
  return <>
    <section className={styles.card} aria-label="Human review status">
      <StatusTag state={report.status === "resolved" ? "shown" : "pending"} label={words(report.status)} />
      <h2 className="t-heading-s">{itemName(report.listing)}</h2>
      <p className="t-meta">Report {report.id} · {new Date(report.created_at).toLocaleString()}</p>
      {report.amount !== null && <p className="t-body-s">Escrow: {yen(report.amount, report.currency)}{report.status !== "resolved" ? " · held pending human review" : " · human decision recorded"}</p>}
      <p className="t-body-s">{report.status === "processing" ? "Your issue is saved. Evidence inspection is in progress." : "This report is saved in the human-review queue. The inspection does not decide payment."}</p>
    </section>
    <section className={styles.card}>
      <h2 className="t-heading-s">Buyer’s statement</h2>
      <p className="t-body">{report.buyer_text || "No written description supplied."}</p>
      <p className="t-caption t-secondary">Reported by the buyer; not an established finding.</p>
    </section>
    <section className={styles.card}>
      <h2 className="t-heading-s">Inspection suggestion</h2>
      <p className="t-body">{assessmentLabel[report.suggested_assessment]}</p>
      <p className="t-body-s">{report.summary}</p>
      <ul>{report.limitations.map((text, i) => <li key={i} className="t-body-s">{text}</li>)}</ul>
      {report.inspection?.closeup_request && <p className="t-body-s">Suggested close-up: {words(report.inspection.closeup_request)}. A reviewer will decide whether more evidence is needed.</p>}
    </section>
    {report.inspection?.findings.map((finding, i) => <section className={styles.card} key={`finding-${i}`}>
      <h3 className="t-heading-s">{finding.what}</h3><p className="t-body-s">{finding.reason}</p>
    </section>)}
    {focused.map(comparison)}
    {!!remaining.length && <details className={styles.details}>
      <summary className="t-label">More comparison evidence ({remaining.length})</summary>
      <div className={styles.section}>{remaining.map(comparison)}</div>
    </details>}
    <details className={styles.details}>
      <summary className="t-label">Original evidence</summary>
      <div className={styles.evidenceGrid}>{report.media.map((media, i) => <figure key={i}>
        {/\.(mp4|webm|mov)$/i.test(media.url) ? <video controls preload="metadata" src={evidenceUrl(media.url)} /> : <img src={evidenceUrl(media.url)} alt={media.label} loading="lazy" />}
        <figcaption className="t-caption">{media.label}</figcaption>
      </figure>)}</div>
    </details>
    {report.decision && <section className={styles.card}>
      <h2 className="t-heading-s">Human reviewer’s response</h2>
      <p className="t-body">{report.decision.action === "refund" ? `${report.decision.refund_pct}% refund` : report.decision.action === "release" ? "Release to the seller" : "More evidence requested"}</p>
      <p className="t-body">{report.decision.note}</p><p className="t-meta">{report.decision.reviewer}</p>
    </section>}
  </>;
}
