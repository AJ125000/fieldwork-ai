"use client";

import { useEffect, useState } from "react";
import { AIActivity } from "@/components/AIActivity";
import { BottomNav } from "@/components/BottomNav";
import { Button } from "@/components/Button";
import { CameraCapture } from "@/components/CameraCapture";
import { IssueReportView } from "@/components/IssueReportView";
import { TopBar } from "@/components/TopBar";
import { acceptDelivery, getEscrow, getIssues, getRecord, itemName, recallMandate, rememberMandate, submitIssue, yen, type ConditionRecord, type IssueReport, type Mandate } from "@/lib/api";
import styles from "@/components/Flow.module.css";

export function UnboxView({ id }: { id: string }) {
  const [rec, setRec] = useState<ConditionRecord | null>(null);
  const [mandate, setMandate] = useState<Mandate | null>(null);
  const [mid, setMid] = useState<string | null>(null);
  const [report, setReport] = useState<IssueReport | null>(null);
  const [mode, setMode] = useState<"choose" | "issue">("choose");
  const [text, setText] = useState("");
  const [photos, setPhotos] = useState<File[]>([]);
  const [busy, setBusy] = useState(false);
  const [ready, setReady] = useState(false);
  const [accepted, setAccepted] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    let live = true;
    const known = new URLSearchParams(window.location.search).get("m") ?? recallMandate(id)?.id ?? null;
    setMid(known);
    Promise.all([getRecord(id), getIssues(id), known ? getEscrow(known) : Promise.resolve(null)]).then(([r, issues, m]) => {
      if (!live) return;
      setRec(r); setReport(issues[0] ?? null); setMandate(m); setReady(true);
    }).catch((e: Error) => { if (live) setError(e.message); });
    return () => { live = false; };
  }, [id]);

  async function allGood() {
    setBusy(true); setError("");
    try {
      if (mid) { const m = await acceptDelivery(mid); setMandate(m); rememberMandate(id, m); }
      setAccepted(true);
    } catch (e) { setError(e instanceof Error ? e.message : "Could not confirm acceptance."); }
    finally { setBusy(false); }
  }

  async function submit(clip: Blob | null) {
    setBusy(true); setError("");
    try {
      const r = await submitIssue(id, text.trim(), mid, clip, clip ? undefined : photos);
      setReport(r);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not submit your issue.");
      // Recover a queued report if the request completed but its response was lost.
      try { const reports = await getIssues(id); if (reports[0]) setReport(reports[0]); } catch {}
    } finally { setBusy(false); }
  }

  return <>
    <TopBar title="Received garment" backHref={`/pass/${id}`} titleAs="p" />
    <main className={styles.main}>
      <section className={styles.section}>
        <h1 className="t-heading-m">{rec ? itemName(rec) : "Your garment"}</h1>
        {mandate && <p className="t-body-s">Escrow {yen(mandate.amount, mandate.currency)} · {mandate.status}</p>}
      </section>
      {error && <p className={styles.err} role="alert">{error}</p>}
      {busy && <AIActivity title={mode === "issue" ? "Preparing evidence for a human reviewer…" : "Recording your acceptance…"} variant="plain" />}
      {!ready && !error && <p className="t-body-s">Loading your purchase…</p>}
      {accepted ? <section className={styles.card} role="status">
        <h2 className="t-heading-s">You accepted the garment</h2>
        <p className="t-body">{mandate ? "Escrow released to the seller." : "Your acceptance is confirmed on this device. No escrow was attached."}</p>
      </section> : report ? <>
        <IssueReportView report={report} />
        <Button href={`/case/${id}?issue=${report.id}`} fullWidth>Open your report</Button>
      </> : ready && !busy && (mandate && mandate.status !== "held" ? <p className="t-body">This purchase has already been settled.</p> : mode === "choose" ? <section className={styles.section}>
        <p className="t-body">Check the garment. Accept it if everything is good, or raise an issue for a person to review.</p>
        <Button fullWidth onClick={allGood}>All good</Button>
        <Button fullWidth variant="secondary" onClick={() => setMode("issue")}>Raise an issue</Button>
      </section> : <section className={styles.section}>
        <h2 className="t-heading-s">What went wrong?</h2>
        <label htmlFor="buyer-issue" className="t-label">Describe the issue (optional)</label>
        <textarea id="buyer-issue" rows={3} maxLength={5000} className={styles.field} value={text} onChange={e => setText(e.target.value)} placeholder="There is a stain on the left cuff that was not shown in the listing." />
        <p className="t-body-s">Record the front, back, collar, cuffs, hem and the area you are concerned about. Your evidence and the inspection suggestion go to a human. Escrow stays held.</p>
        <CameraCapture seconds={12} recordLabel="Record received garment" idleText="Hold the camera steady with good light." onRecorded={clip => submit(clip)} />
        <label htmlFor="received-photos" className="t-label">Or upload received-garment photos</label>
        <input id="received-photos" className={styles.field} type="file" accept="image/*" multiple onChange={e => setPhotos(Array.from(e.target.files ?? []))} />
        <Button fullWidth disabled={!photos.length} onClick={() => submit(null)}>Submit photos for human review</Button>
        <Button variant="tertiary" onClick={() => setMode("choose")}>Back</Button>
      </section>)}
    </main>
    <BottomNav />
  </>;
}
