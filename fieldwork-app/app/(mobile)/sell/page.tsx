"use client";

import { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { ImagePlus } from "lucide-react";
import { AIActivity, type ActivityItem } from "@/components/AIActivity";
import { BottomNav } from "@/components/BottomNav";
import { Button } from "@/components/Button";
import { CameraCapture } from "@/components/CameraCapture";
import { TopBar } from "@/components/TopBar";
import { readDraftState, useDraftState } from "@/lib/useDraftState";
import { SavedListings } from "@/components/SavedListings";
import { postTake } from "@/lib/api";
import styles from "@/components/Flow.module.css";

const STEPS = ["Reading the take", "Choosing evidence frames", "Writing the condition record", "Estimating the condition grade set", "Translating the listing"];

/* One Take (brief): 12 seconds, one-time code in view. The code is generated here for now; the service will issue it later. */
function newCode() {
  const a = "ABCDEFGHJKMNPQRSTUVWXYZ23456789";
  return Array.from({ length: 4 }, () => a[Math.floor(Math.random() * a.length)]).join("");
}

export default function SellPage() {
  const router = useRouter();
  const [code, setCode] = useDraftState("fw.sell.code", "");
  const [busy, setBusy] = useDraftState("fw.sell.busy", false, false);
  const [step, setStep] = useDraftState("fw.sell.step", 0, false);
  const [error, setError] = useDraftState("fw.sell.error", "");
  const [photos, setPhotos] = useDraftState<File[]>("fw.sell.photos", [], false);
  const [videoFile, setVideoFile] = useDraftState<File | null>("fw.sell.video", null, false);
  const [resultId, setResultId] = useDraftState("fw.sell.result", "");
  const mounted = useRef(false);
  const timer = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (!readDraftState("fw.sell.code", "")) setCode(newCode());
    mounted.current = true;
    return () => { mounted.current = false; };
  }, []);
  useEffect(() => () => { if (timer.current) clearInterval(timer.current); }, []);

  async function submit(clip: Blob | null, files?: File[]) {
    setError("");
    setBusy(true);
    setStep(0);
    timer.current = setInterval(() => setStep((s) => Math.min(s + 1, STEPS.length - 1)), 6000);
    try {
      const rec = await postTake(clip ? code : "", clip, files);
      setResultId(rec.id); setPhotos([]); setVideoFile(null);
      if (mounted.current) router.push(`/sell/review/${encodeURIComponent(rec.id)}`);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Something went wrong.");
      setBusy(false);
    } finally {
      if (timer.current) clearInterval(timer.current);
      setBusy(false);
    }
  }

  const items: ActivityItem[] = STEPS.map((label, i) => ({ id: String(i), label, status: i < step ? "done" : i === step ? "active" : "pending" }));

  return (
    <>
      <TopBar title="One Take" backHref="/" titleAs="h1" />
      <main className={styles.main}>
        {resultId && <section className={styles.card}><h2 className="t-heading-s">Your last garment draft is saved</h2>
          <Button href={`/sell/review/${resultId}`} variant="secondary">Continue reviewing your garment</Button>
          <Button variant="tertiary" onClick={() => { setResultId(""); setCode(newCode()); }}>Start another capture</Button>
        </section>}
        <SavedListings />
        {busy ? (
          <AIActivity title="Making your Garment Pass…" items={items} source="Source · your take" />
        ) : (
          <>
            <section className={styles.section}>
              <p className="t-body t-secondary">Film the garment for 12 seconds: front, back, collar, cuffs, hem, label. Keep this code in view at the start.</p>
            </section>
            <CameraCapture
              seconds={12}
              idleText="The camera opens when you tap. Nothing is uploaded until you finish."
              onRecorded={(clip) => submit(clip, photos)}
              overlay={
                <>
                  <p className="t-overline">One-time code · show it to the camera</p>
                  <p className={styles.bigCode} aria-label={`Code ${code.split("").join(" ")}`}>{code || "····"}</p>
                </>
              }
            />
            <section className={styles.card} aria-labelledby="video-h">
              <h2 id="video-h" className="t-heading-s">Use a recorded video</h2>
              <p className="t-body-s t-secondary">Choose a clip under 60 seconds and 128 MiB. Include the front, back and a label close-up. Keep the code above in view if recording now.</p>
              <input className={styles.field} type="file" accept="video/mp4,video/webm,video/quicktime"
                aria-label="Choose a garment video" onChange={e => {
                  const file = e.target.files?.[0];
                  if (!file) return;
                  if (file.size > 128 * 1024 * 1024) { setError("Choose a video under 128 MiB."); return; }
                  setVideoFile(file);
                }} />
              {videoFile && <p className="t-body-s">Selected: {videoFile.name}. You can add close-up photos below before submitting.</p>}
            </section>
            <section className={styles.card} aria-labelledby="photos-h">
              <h2 id="photos-h" className="t-heading-s">Photos and close-ups</h2>
              <p className="t-body-s t-secondary">Add photos to your video, or use at least 3 photos on their own: front, back and label. Include close-ups of known issues, with a wider view showing the nearby seam or pocket. For trousers, show both hips, pockets, crotch and hems. Photo-only captures carry no one-time code.</p>
              <input
                className={styles.field}
                type="file"
                accept="image/*"
                multiple
                aria-label="Choose three or more photos"
                onChange={(e) => setPhotos(Array.from(e.target.files ?? []))}
              />
              {photos.length > 0 && <p className="t-body-s">Selected photos: {photos.map(file => file.name).join(", ")}</p>}
              <Button
                variant="secondary"
                fullWidth
                disabled={!videoFile && photos.length < 3}
                onClick={() => submit(videoFile, photos)}
                iconLeading={<ImagePlus size={20} strokeWidth={2} aria-hidden="true" />}
              >
                {videoFile ? `Make a Pass from video${photos.length ? ` and ${photos.length} photos` : ""}` : photos.length < 3 ? `Choose 3 photos (${photos.length} chosen)` : `Make a Pass from ${photos.length} photos`}
              </Button>
            </section>
          </>
        )}
        {error && <p className={`${styles.err} t-body-s`} role="alert">{error}</p>}
      </main>
      <BottomNav />
    </>
  );
}
