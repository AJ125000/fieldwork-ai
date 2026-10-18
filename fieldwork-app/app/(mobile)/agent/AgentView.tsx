"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { ArrowUp, FileSearch, Landmark, MessageCircleQuestion, ScrollText } from "lucide-react";
import { AIActivity } from "@/components/AIActivity";
import { AIMessage } from "@/components/AIMessage";
import { BottomNav } from "@/components/BottomNav";
import { Button } from "@/components/Button";
import { Chip } from "@/components/Chip";
import { StatusTag } from "@/components/StatusTag";
import { TopBar } from "@/components/TopBar";
import { agentChat, band, createEscrow, gradeRange, rememberMandate, words, yen, type SearchCard, type ToolCall } from "@/lib/api";
import styles from "@/components/Flow.module.css";

type Entry =
  | { kind: "you"; text: string }
  | { kind: "ai"; text: string }
  | { kind: "tool"; call: ToolCall }
  | { kind: "escrow"; text: string; itemId: string }
  | { kind: "error"; text: string };

/* ADK/MCP results arrive wrapped in different envelopes; walk the value and JSON strings to find what we need. */
function dig<T>(v: unknown, pred: (x: unknown) => x is T, depth = 0): T | undefined {
  if (depth > 6 || v == null) return undefined;
  if (pred(v)) return v;
  if (typeof v === "string") {
    try {
      return dig(JSON.parse(v), pred, depth + 1);
    } catch {
      return undefined;
    }
  }
  if (Array.isArray(v)) {
    for (const x of v) {
      const r = dig(x, pred, depth + 1);
      if (r !== undefined) return r;
    }
    return undefined;
  }
  if (typeof v === "object") {
    for (const x of Object.values(v as object)) {
      const r = dig(x, pred, depth + 1);
      if (r !== undefined) return r;
    }
  }
  return undefined;
}
const isCards = (x: unknown): x is SearchCard[] =>
  Array.isArray(x) && x.length > 0 && typeof x[0] === "object" && x[0] !== null && "grade_set" in x[0] && "id" in x[0];
const isAnswer = (x: unknown): x is { answer: string; state: string } =>
  typeof x === "object" && x !== null && "answer" in x && "state" in x;
const isMandate = (x: unknown): x is { id: string; amount: number; currency: string; item_id: string; status: string } =>
  typeof x === "object" && x !== null && "amount" in x && "status" in x && "id" in x;

function searchLine(a: Record<string, unknown>) {
  const parts: string[] = [];
  if (a.colour) parts.push(String(a.colour));
  if (a.type) parts.push(String(a.type));
  const ex = Array.isArray(a.exclude_defects) ? (a.exclude_defects as string[]) : [];
  for (const d of ex) parts.push(`no ${words(d)}s`);
  if (a.size) parts.push(`size ${a.size}`);
  if (a.min_grade) parts.push(`grade ${a.min_grade}+`);
  if (a.max_price) parts.push(`≤${yen(Number(a.max_price))}`);
  return parts.join(" · ") || "everything";
}

function ToolRow({ call }: { call: ToolCall }) {
  const a = call.args ?? {};
  const answer = call.tool === "ask_garment" ? dig(call.result, isAnswer) : undefined;
  let Icon = ScrollText;
  let text = words(call.tool);
  if (call.tool === "search_garments") {
    Icon = FileSearch;
    const n = dig(call.result, isCards)?.length;
    text = `Searched by evidence: ${searchLine(a)}${n !== undefined ? ` · ${n} found` : ""}`;
  } else if (call.tool === "ask_garment") {
    Icon = MessageCircleQuestion;
    text = `Asked the garment: ${String(a.question ?? "")}`;
  } else if (call.tool === "get_condition_record") {
    text = `Read the condition record: ${String(a.item_id ?? "")}`;
  } else if (call.tool === "create_escrow") {
    Icon = Landmark;
    const m = dig(call.result, isMandate);
    text = `Escrow held ${m ? yen(m.amount, m.currency) : yen(Number(a.amount ?? 0))}`;
  } else if (call.tool === "get_escrow") {
    Icon = Landmark;
    text = "Checked the escrow";
  }
  return (
    <div className={`${styles.tool} t-body-s`}>
      <Icon size={16} strokeWidth={2} aria-hidden="true" />
      <div>
        <p>{text}</p>
        {answer && (
          <p className="t-meta" style={{ marginTop: 2 }}>
            {answer.state === "shown" ? "Shown" : answer.state === "cant_judge" ? "Can't judge" : "Not shown in the take"} · {answer.answer}
          </p>
        )}
      </div>
    </div>
  );
}

function OptionCard({ c, onConfirm, busy, done }: { c: SearchCard; onConfirm: () => void; busy: boolean; done: boolean }) {
  const name = [c.item.brand, c.item.colour, c.item.type].filter(Boolean).join(" ");
  return (
    <article className={styles.card} aria-label={name}>
      <div className={styles.between}>
        <h3 className="t-heading-s">{name}</h3>
        <span className="t-num-m">{c.price_band ? yen(c.price_band[0], c.currency) : "—"}</span>
      </div>
      <p className="t-body-s">{gradeRange(c.grade_set)} · {band(c.price_band, c.currency)}</p>
      <div className={styles.row}>
        {c.shown_flaws.length === 0 ? <Chip>No flaws shown</Chip> : c.shown_flaws.map((f, i) => <Chip key={i}>{f.severity} {words(f.code)} · {words(f.region)}</Chip>)}
      </div>
      {c.cant_judge.length > 0 && <p className={`${styles.meta} t-meta`}>Can&rsquo;t judge from the take: {c.cant_judge.map(words).join(", ")}</p>}
      <div className={styles.row}>
        <Button variant="secondary" size="md" href={`/pass/${c.id}`}>Open the Pass</Button>
        <Button size="md" loading={busy} disabled={done || !c.price_band} onClick={onConfirm}>
          {done ? "Escrow held" : `Confirm · hold ${c.price_band ? yen(c.price_band[0], c.currency) : ""}`}
        </Button>
      </div>
    </article>
  );
}

const SUGGESTIONS = ["Navy wool coat, no stains, under ¥6,000", "A black jacket in M with no snags", "Jeans with no holes"];

export function AgentView() {
  const [log, setLog] = useState<Entry[]>([]);
  const [text, setText] = useState("");
  const [busy, setBusy] = useState(false);
  const [escrowBusy, setEscrowBusy] = useState("");
  const session = useRef("");
  const end = useRef<HTMLDivElement>(null);

  useEffect(() => {
    session.current = `s_${Math.random().toString(36).slice(2, 10)}`;
    const item = new URLSearchParams(window.location.search).get("item");
    if (item) setText(`Tell me about garment ${item}: what is shown, and what is not?`);
  }, []);
  useEffect(() => {
    if (log.length) end.current?.scrollIntoView({ block: "end", behavior: "smooth" });
  }, [log, busy]);

  async function send(msg: string) {
    const m = msg.trim();
    if (!m || busy) return;
    setText("");
    setLog((l) => [...l, { kind: "you", text: m }]);
    setBusy(true);
    try {
      const r = await agentChat(session.current, m);
      const next: Entry[] = r.tool_calls.map((call) => ({ kind: "tool", call }));
      for (const c of r.tool_calls) {
        if (c.tool === "create_escrow") {
          const md = dig(c.result, isMandate);
          if (md) {
            rememberMandate(md.item_id, md);
            next.push({ kind: "escrow", text: `Escrow held ${yen(md.amount, md.currency)}`, itemId: md.item_id });
          }
        }
      }
      if (r.text) next.push({ kind: "ai", text: r.text });
      setLog((l) => [...l, ...next]);
    } catch (e) {
      setLog((l) => [...l, { kind: "error", text: e instanceof Error ? e.message : "The agent didn't answer." }]);
    } finally {
      setBusy(false);
    }
  }

  async function confirm(c: SearchCard) {
    if (!c.price_band) return;
    setEscrowBusy(c.id);
    try {
      const md = await createEscrow(c.id, c.price_band[0], c.currency);
      rememberMandate(c.id, md);
      setLog((l) => [...l, { kind: "escrow", text: `Escrow held ${yen(md.amount, md.currency)}`, itemId: c.id }]);
    } catch (e) {
      setLog((l) => [...l, { kind: "error", text: e instanceof Error ? e.message : "Escrow failed." }]);
    } finally {
      setEscrowBusy("");
    }
  }

  const held = new Set(log.flatMap((e) => (e.kind === "escrow" ? [e.itemId] : [])));

  return (
    <>
      <TopBar title="Shopping agent" backHref="/" titleAs="h1" />
      <main className={styles.main}>
        <p className="t-body-s t-secondary">Tell your agent what you want in one sentence. It searches by evidence and asks the garment. After purchase, accept the delivery or raise an issue for human review while escrow stays held.</p>

        <div className={styles.chat} aria-live="polite">
          {log.length === 0 && (
            <div className={styles.row}>
              {SUGGESTIONS.map((s) => (
                <Chip key={s} variant="answer" onClick={() => send(s)}>{s}</Chip>
              ))}
            </div>
          )}
          {log.map((e, i) => {
            if (e.kind === "you") return <div key={i} className={styles.bubbleYou}><p className="t-body">{e.text}</p></div>;
            if (e.kind === "ai") return <AIMessage key={i} from="ai">{e.text}</AIMessage>;
            if (e.kind === "error") return <p key={i} className={`${styles.err} t-body-s`} role="alert">{e.text}</p>;
            if (e.kind === "escrow")
              return (
                <div key={i} className={styles.card}>
                  <div className={styles.tool}><Landmark size={16} aria-hidden="true" /><p className="t-body-s">{e.text}</p></div>
                  <StatusTag state="money" label="Held until you unbox" size="sm" />
                  <Button variant="secondary" size="md" href={`/unbox/${e.itemId}`}>When it arrives: check it</Button>
                </div>
              );
            const cards = e.call.tool === "search_garments" ? dig(e.call.result, isCards) : undefined;
            return (
              <div key={i} className={styles.section}>
                <ToolRow call={e.call} />
                {cards?.slice(0, 3).map((c) => (
                  <OptionCard key={c.id} c={c} busy={escrowBusy === c.id} done={held.has(c.id)} onConfirm={() => confirm(c)} />
                ))}
              </div>
            );
          })}
          {busy && <AIActivity title="Your agent is working…" variant="plain" />}
          <div ref={end} />
        </div>

        <form
          className={styles.section}
          onSubmit={(e) => {
            e.preventDefault();
            void send(text);
          }}
        >
          <label className="sr-only" htmlFor="agent-in">Tell the agent what you want</label>
          <textarea
            id="agent-in"
            className={styles.field}
            rows={2}
            value={text}
            placeholder="Navy wool coat, no stains, under ¥6,000"
            onChange={(e) => setText(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                void send(text);
              }
            }}
          />
          <Button type="submit" loading={busy} disabled={!text.trim()} iconLeading={<ArrowUp size={20} strokeWidth={2} aria-hidden="true" />}>
            Send
          </Button>
        </form>
        <p className="t-caption t-quiet">
          Prefer to look yourself? <Link href="/pass/fx_coat_navy_clean">Open a sample Pass</Link>.
        </p>
      </main>
      <BottomNav />
    </>
  );
}
