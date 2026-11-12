import { Check } from "lucide-react";
import { faqs, joveDayRules, offers, teacherTraining, trainingFilm, trainingRules } from "@/lib/content/business";
import { CornerMarks } from "@/components/brand/Blueprint";
import { Button } from "@/components/ui/Button";
import { Reveal } from "@/components/site/Reveal";
import { cn, pad2 } from "@/lib/utils";

export const QUOTE_ID = "quote";

/* ── What a school can buy ───────────────────────────────────────────── */

export function OfferCards() {
  return (
    <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
      {offers.map((o, i) => (
        <Reveal key={o.id} delay={i * 0.06} className="h-full">
          <article className={cn("relative flex h-full flex-col rounded-[var(--radius-lg)] border p-6", o.highlight ? "border-graphite bg-graphite text-paper shadow-[var(--shadow-lift)]" : "border-graphite/15 bg-paper-50 shadow-[var(--shadow-paper)]")}>
            <CornerMarks className={cn("m-3", o.highlight ? "text-paper/40" : "text-graphite/25")} />
            <p className={cn("annot", o.highlight ? "text-paper/60" : "text-blueprint")}>{o.tag}</p>
            <h3 className="mt-2 text-xl font-bold tracking-tight">{o.name}</h3>
            <p className={cn("mt-2 text-sm leading-relaxed", o.highlight ? "text-paper/80" : "text-charcoal")}>{o.headline}</p>
            <p className={cn("mt-4 border-y py-3 font-mono text-xs leading-relaxed", o.highlight ? "border-paper/20 text-paper/85" : "border-graphite/12 text-graphite")}>{o.priceNote}</p>
            <ul className="mt-4 flex-1 space-y-2 text-sm">
              {o.includes.map((x) => (
                <li key={x} className="flex gap-2">
                  <Check className={cn("mt-0.5 size-4 shrink-0", o.highlight ? "text-paper/70" : "text-blueprint")} aria-hidden />
                  <span className={o.highlight ? "text-paper/85" : "text-charcoal"}>{x}</span>
                </li>
              ))}
            </ul>
            <p className={cn("mt-5 text-xs leading-relaxed", o.highlight ? "text-paper/60" : "text-blueprint")}>Ideal for: {o.idealFor}</p>
            <div className="mt-5">
              <Button href={o.id === "lab-setup" ? "/contact" : `#${QUOTE_ID}`} variant={o.highlight ? "light" : "secondary"} size="sm" arrow>
                {o.id === "lab-setup" ? "Talk to us" : "Estimate"}
              </Button>
            </div>
          </article>
        </Reveal>
      ))}
    </div>
  );
}

/* ── Payment terms ────────────────────────────────────────────────────── */

const paySteps = [
  { k: "Quote", t: "Written quote", d: "Kits by kind and number, teachers to train, GST shown line by line. Nothing is booked until you agree." },
  { k: "Order", t: `${joveDayRules.advancePercent}% advance`, d: `Pay ${joveDayRules.advancePercent}% of the order to confirm it. We dispatch the kits and fix the training date.` },
  { k: "Training", t: "Kits in, teachers trained", d: `The kits arrive and we train your teachers on campus in ${teacherTraining.hours} hours, with the film crew.` },
  { k: `Day + ${joveDayRules.balanceDueDays}`, t: "Balance due", d: `The remaining ${100 - joveDayRules.advancePercent}% within ${joveDayRules.balanceDueDays} days of the training.` },
];

const payNotes = [
  { t: "GST", d: `Kit prices include GST. Training is priced before GST; ${joveDayRules.gstPercent}% is added on the tax invoice. Your CA can confirm how it applies to your institution.` },
  { t: "Minimums", d: `School prices apply from ${trainingRules.minimumKits} kits in one order. A training is for ${teacherTraining.minimumTeachers} teachers or more.` },
  { t: "Bank transfer or UPI", d: "Pay against our invoice by bank transfer or UPI. Every payment is acknowledged with a receipt." },
];

export function PaymentTerms() {
  return (
    <div className="space-y-10">
      <ol className="relative grid gap-4 md:grid-cols-4">
        <span aria-hidden className="absolute left-0 right-0 top-[22px] hidden border-t border-dashed border-graphite/30 md:block" />
        {paySteps.map((s, i) => (
          <Reveal as="li" key={s.k} delay={i * 0.08} className="relative">
            <span className={cn("relative grid size-11 place-items-center rounded-full border font-mono text-xs", i === 1 || i === 3 ? "border-graphite bg-graphite text-paper" : "border-graphite/30 bg-paper text-graphite")}>{pad2(i + 1)}</span>
            <p className="annot mt-4 text-blueprint">{s.k}</p>
            <p className="mt-1 text-lg font-bold tracking-tight text-graphite">{s.t}</p>
            <p className="mt-1.5 text-sm leading-relaxed text-charcoal">{s.d}</p>
          </Reveal>
        ))}
      </ol>
      <div className="grid gap-4 md:grid-cols-3">
        {payNotes.map((n, i) => (
          <Reveal key={n.t} delay={i * 0.06}>
            <div className="relative h-full rounded-[var(--radius-md)] border border-graphite/15 bg-paper-50 p-5">
              <p className="text-sm font-semibold text-graphite">{n.t}</p>
              <p className="mt-1.5 text-sm leading-relaxed text-charcoal">{n.d}</p>
            </div>
          </Reveal>
        ))}
      </div>
    </div>
  );
}

/* ── FAQ ──────────────────────────────────────────────────────────────── */

export const packageFaqs: { q: string; a: string }[] = [
  ...faqs.slice(0, 5),
  {
    q: "When do we pay?",
    a: `${joveDayRules.advancePercent}% of the order confirms it, and the balance is due within ${joveDayRules.balanceDueDays} days of the teacher training. Kit prices include GST; ${joveDayRules.gstPercent}% GST is added to the training on the invoice.`,
  },
  {
    q: "What do we get on film?",
    a: `${trainingFilm.items.map((i) => i.title).join(" and ")}. ${trainingFilm.rights}`,
  },
  ...faqs.slice(5),
];

/** Native <details> accordion — works without JavaScript, keyboard-operable out of the box. */
export function PackagesFaq() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: packageFaqs.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })),
  };
  return (
    <>
      <div className="divide-y divide-graphite/12 border-y border-graphite/12">
        {packageFaqs.map((f, i) => (
          <details key={f.q} className="group" open={i === 0}>
            <summary className="flex cursor-pointer list-none items-start gap-4 py-5 text-left outline-none focus-visible:bg-graphite/[0.04] [&::-webkit-details-marker]:hidden">
              <span className="mt-1 font-mono text-[11px] text-blueprint">{pad2(i + 1)}</span>
              <span className="flex-1 text-base font-semibold leading-snug text-graphite sm:text-lg">{f.q}</span>
              <span aria-hidden className="relative mt-1.5 size-4 shrink-0">
                <span className="absolute left-0 top-1/2 h-px w-4 -translate-y-1/2 bg-graphite" />
                <span className="absolute left-1/2 top-0 h-4 w-px -translate-x-1/2 bg-graphite transition-transform duration-300 group-open:scale-y-0" />
              </span>
            </summary>
            <p className="max-w-3xl pb-6 pl-9 pr-8 text-sm leading-relaxed text-charcoal sm:text-base">{f.a}</p>
          </details>
        ))}
      </div>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }} />
    </>
  );
}
