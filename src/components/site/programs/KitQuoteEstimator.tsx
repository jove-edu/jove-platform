"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import { CheckCircle2, Loader2, MessageCircle, Minus, Plus, Send } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Field, Input } from "@/components/ui/form";
import { CornerMarks } from "@/components/brand/Blueprint";
import { kits, teacherTraining, trainingRules, type KitId } from "@/lib/content/business";
import { MAX_KITS, MAX_TEACHERS, computeKitQuote, emptyQuote, kitQuoteText, type KitQuoteInput } from "@/lib/kit-quote";
import { track } from "@/lib/analytics";
import { cn, formatINR } from "@/lib/utils";

function Stepper({ value, onChange, max, label, step = 1 }: { value: number; onChange: (n: number) => void; max: number; label: string; step?: number }) {
  const set = (n: number) => onChange(Math.min(max, Math.max(0, Math.round(n))));
  return (
    <div className="flex items-center gap-1.5">
      <button type="button" aria-label={`Fewer: ${label}`} onClick={() => set(value - step)} className="grid size-9 place-items-center rounded-[var(--radius-sm)] border border-graphite/20 text-graphite hover:bg-graphite/5">
        <Minus className="size-4" aria-hidden />
      </button>
      <input
        type="number"
        inputMode="numeric"
        min={0}
        max={max}
        value={value}
        aria-label={label}
        onChange={(e) => set(Number(e.target.value) || 0)}
        className="h-9 w-20 rounded-[var(--radius-sm)] border border-graphite/20 bg-paper text-center font-mono text-sm text-graphite"
      />
      <button type="button" aria-label={`More: ${label}`} onClick={() => set(value + step)} className="grid size-9 place-items-center rounded-[var(--radius-sm)] border border-graphite/20 text-graphite hover:bg-graphite/5">
        <Plus className="size-4" aria-hidden />
      </button>
    </div>
  );
}

/** Kits per kind and teachers to train → an itemised estimate, then "request this quote" straight into HQ → Leads. */
export function KitQuoteEstimator({ whatsappBase }: { whatsappBase: string | null }) {
  const [input, setInput] = useState<KitQuoteInput>(() => ({ ...emptyQuote(), kits: { ...emptyQuote().kits, explorer: trainingRules.minimumKits }, teachers: teacherTraining.minimumTeachers }));
  const q = useMemo(() => computeKitQuote(input), [input]);
  const [state, setState] = useState<"idle" | "sending" | "done" | "error">("idle");
  const [error, setError] = useState("");

  const setKit = (id: KitId, n: number) => setInput((s) => ({ ...s, kits: { ...s.kits, [id]: n } }));
  const empty = q.kitCount === 0 && !q.training;

  async function send(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    setState("sending");
    setError("");
    try {
      const res = await fetch("/api/public/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...Object.fromEntries(fd.entries()),
          kind: "workshop",
          package: q.training && q.kitCount ? "kits-training" : q.training ? "training" : "kits",
          teachers: input.teachers,
          kits: q.kitCount,
          quote: { ...input, total: q.total },
          message: kitQuoteText(q),
          page: "/packages",
        }),
      });
      const json = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(json.error || "Could not send. Please try again.");
      track("generate_lead", { lead_type: "workshop", form: "quote" });
      setState("done");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not send.");
      setState("error");
    }
  }

  const wa = whatsappBase ? `${whatsappBase}${encodeURIComponent(`Hi JOVE, please send a quote:\n${kitQuoteText(q)}`)}` : null;

  return (
    <div className="grid gap-6 lg:grid-cols-12">
      {/* choices */}
      <div className="space-y-4 lg:col-span-7">
        <div className="rounded-[var(--radius-lg)] border border-graphite/15 bg-paper-50 p-5 shadow-[var(--shadow-paper)] sm:p-6">
          <p className="annot text-blueprint">1 · Kits, by kind</p>
          <ul className="mt-4 divide-y divide-graphite/10">
            {kits.map((k) => (
              <li key={k.id} className="flex flex-wrap items-center gap-4 py-3.5">
                <span className="relative size-14 shrink-0 overflow-hidden rounded-[var(--radius-sm)] border border-graphite/10 bg-paper">
                  <Image src={k.image} alt="" fill sizes="56px" className="object-cover" />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block text-sm font-semibold text-graphite">{k.name}</span>
                  <span className="block text-xs text-blueprint">
                    {k.grades.split("·")[0].trim()} · {formatINR(k.schoolPrice)} school price · {formatINR(k.mrp)} MRP
                  </span>
                </span>
                <Stepper value={input.kits[k.id]} onChange={(n) => setKit(k.id, n)} max={MAX_KITS} step={5} label={`${k.name} kits`} />
              </li>
            ))}
          </ul>
          <p className="mt-2 text-xs text-blueprint">GST included. School prices from {trainingRules.minimumKits} kits in one order.</p>
        </div>

        <div className="rounded-[var(--radius-lg)] border border-graphite/15 bg-paper-50 p-5 shadow-[var(--shadow-paper)] sm:p-6">
          <p className="annot text-blueprint">2 · Teachers to train</p>
          <div className="mt-4 flex flex-wrap items-center justify-between gap-4">
            <span className="min-w-0 flex-1">
              <span className="block text-sm font-semibold text-graphite">{teacherTraining.name}</span>
              <span className="block text-xs text-blueprint">
                {teacherTraining.price} + GST · {teacherTraining.hours} hours on campus · from {teacherTraining.minimumTeachers} teachers
              </span>
            </span>
            <Stepper value={input.teachers} onChange={(n) => setInput((s) => ({ ...s, teachers: n }))} max={MAX_TEACHERS} label="Teachers to train" />
          </div>
          <p className="mt-3 text-xs text-blueprint">Leave at 0 if your teachers are already trained.</p>
        </div>
      </div>

      {/* the estimate */}
      <div className="lg:col-span-5">
        <div className="relative overflow-hidden rounded-[var(--radius-lg)] bg-graphite p-5 text-paper shadow-[var(--shadow-lift)] sm:p-6 lg:sticky lg:top-24">
          <CornerMarks className="m-3 text-paper/40" />
          <p className="annot text-paper/55">Your estimate</p>
          {empty ? (
            <p className="mt-4 text-sm text-paper/70">Add kits or teachers to see an estimate.</p>
          ) : (
            <>
              <ul className="mt-4 space-y-3 text-sm">
                {q.kitLines.map((l) => (
                  <li key={l.id} className="flex justify-between gap-4">
                    <span>
                      <span className="block font-semibold">{l.label}</span>
                      <span className="block text-xs text-paper/55">{l.detail}</span>
                    </span>
                    <span className="font-mono tabular">{formatINR(l.amount)}</span>
                  </li>
                ))}
                {q.training && (
                  <>
                    <li className="flex justify-between gap-4">
                      <span>
                        <span className="block font-semibold">{q.training.label}</span>
                        <span className="block text-xs text-paper/55">{q.training.detail}</span>
                      </span>
                      <span className="font-mono tabular">{formatINR(q.training.amount)}</span>
                    </li>
                    <li className="flex justify-between gap-4 text-paper/70">
                      <span className="text-xs">GST {q.gstPercent}% on training</span>
                      <span className="font-mono tabular">{formatINR(q.trainingGst)}</span>
                    </li>
                  </>
                )}
              </ul>
              <div className="mt-5 flex items-baseline justify-between border-t border-paper/20 pt-4">
                <span className="text-sm font-semibold">Estimated total</span>
                <span className="font-mono text-2xl font-medium tabular">{formatINR(q.total)}</span>
              </div>
              {q.notes.length > 0 && (
                <ul className="mt-4 space-y-1.5 text-xs leading-relaxed text-paper/60">
                  {q.notes.map((n) => (
                    <li key={n}>· {n}</li>
                  ))}
                </ul>
              )}
            </>
          )}

          <div className="mt-6 border-t border-paper/15 pt-5">
            {state === "done" ? (
              <p className="flex items-start gap-2 text-sm text-paper/85">
                <CheckCircle2 className="mt-0.5 size-5 shrink-0" aria-hidden /> Received. A JOVE founder will call you within one working day with a written quote.
              </p>
            ) : (
              <form onSubmit={send} className={cn("grid gap-3 sm:grid-cols-2 [&_label]:text-paper/60", empty && "pointer-events-none opacity-50")}>
                <input type="text" name="website" tabIndex={-1} autoComplete="off" className="hidden" aria-hidden />
                <Field label="Your name" htmlFor="kq-name" required>
                  <Input id="kq-name" name="name" required autoComplete="name" className="h-10" />
                </Field>
                <Field label="School" htmlFor="kq-org" required>
                  <Input id="kq-org" name="organisation" required className="h-10" />
                </Field>
                <Field label="Phone / WhatsApp" htmlFor="kq-phone" required>
                  <Input id="kq-phone" name="phone" type="tel" required autoComplete="tel" placeholder="+91" className="h-10" />
                </Field>
                <Field label="City" htmlFor="kq-city">
                  <Input id="kq-city" name="city" autoComplete="address-level2" className="h-10" />
                </Field>
                <div className="flex flex-col gap-2 sm:col-span-2 sm:flex-row">
                  <Button type="submit" variant="light" disabled={state === "sending" || empty} className="flex-1">
                    {state === "sending" ? <Loader2 className="size-4 animate-spin" /> : <Send className="size-4" />} Request this quote
                  </Button>
                  {wa && !empty && (
                    <Button href={wa} external variant="outline-light">
                      <MessageCircle className="size-4" aria-hidden /> WhatsApp
                    </Button>
                  )}
                </div>
                {state === "error" && <p className="text-sm text-red-300 sm:col-span-2">{error}</p>}
              </form>
            )}
          </div>
          <p className="mt-4 text-[11px] leading-relaxed text-paper/45">An estimate, not an invoice. The written quote confirms prices, delivery and the training date.</p>
        </div>
      </div>
    </div>
  );
}
