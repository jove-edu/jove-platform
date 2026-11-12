import { CalendarCheck, FileText, MapPinned, PhoneCall, type LucideIcon } from "lucide-react";
import { GridBackdrop, SectionLabel } from "@/components/brand/Blueprint";
import { Reveal, RevealLines } from "@/components/site/Reveal";
import { joveDayRules } from "@/lib/content/business";

const steps: { n: string; icon: LucideIcon; when: string; title: string; body: string }[] = [
  {
    n: "01",
    icon: PhoneCall,
    when: "Within 1 working day",
    title: "A founder calls you",
    body: "We listen first: your grades, your teachers, the kits you have, your calendar. No sales script, just a conversation about what would work for your school.",
  },
  {
    n: "02",
    icon: MapPinned,
    when: "At a time that suits you",
    title: "Campus visit or online demo",
    body: "We visit your campus with a kit where it is practical, or walk you through the kits and the 3D bench online, so you can see exactly what your classes will build.",
  },
  {
    n: "03",
    icon: FileText,
    when: "In writing, GST shown separately",
    title: "You receive a quote",
    body: "Kits by kind and number, teachers to train, the training date and what the school provides, with GST shown line by line.",
  },
  {
    n: "04",
    icon: CalendarCheck,
    when: `${joveDayRules.advancePercent}% advance`,
    title: "Kits arrive, teachers trained",
    body: `A ${joveDayRules.advancePercent}% advance confirms the order. We deliver the kits, train your teachers and film the day; the balance is due within ${joveDayRules.balanceDueDays} days of the training.`,
  },
];

/** "What happens next" blueprint timeline: dark section, horizontal on desktop, vertical rail on mobile. */
export function NextSteps() {
  return (
    <section aria-labelledby="next-steps-heading" className="relative overflow-hidden bg-graphite py-20 text-paper sm:py-28">
      <GridBackdrop dark />
      <div className="container-bp relative">
        <Reveal>
          <SectionLabel index="02" light>
            What happens next
          </SectionLabel>
        </Reveal>
        <h2 id="next-steps-heading" className="mt-6 max-w-3xl text-[clamp(2rem,4.6vw,3.8rem)] font-bold leading-[1] tracking-[-0.03em]">
          <RevealLines lines={["From your first message", "to robotics in your classes."]} />
        </h2>

        <ol className="relative mt-14 grid gap-10 lg:mt-20 lg:grid-cols-4 lg:gap-6">
          {/* connector: vertical rail on mobile, horizontal on desktop */}
          <span aria-hidden className="absolute bottom-3 left-[21px] top-3 border-l border-dashed border-paper/25 lg:bottom-auto lg:left-0 lg:right-0 lg:top-[21px] lg:border-l-0 lg:border-t" />
          {steps.map((s, i) => (
            <Reveal as="li" key={s.n} delay={i * 0.1} y={22} className="relative grid grid-cols-[2.75rem_1fr] gap-x-5 lg:block">
              <span className="relative z-10 grid size-[44px] place-items-center rounded-full border border-paper/50 bg-graphite text-paper shadow-[0_0_0_6px_var(--color-graphite)]">
                <s.icon className="size-[18px]" strokeWidth={1.5} aria-hidden />
              </span>
              <div className="lg:mt-6">
                <p className="annot flex items-center gap-2 text-paper/60">
                  <span className="font-mono tracking-[0.12em] text-paper">STEP {s.n}</span>
                </p>
                <h3 className="mt-2 text-xl font-bold leading-tight tracking-[-0.02em]">{s.title}</h3>
                <p className="mt-1.5 font-mono text-[11px] uppercase tracking-[0.1em] text-paper/55">{s.when}</p>
                <p className="mt-3 text-sm leading-relaxed text-paper/70">{s.body}</p>
              </div>
            </Reveal>
          ))}
        </ol>
      </div>
    </section>
  );
}
