import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Reveal } from "@/components/site/Reveal";
import { gradeBands, kits, trainingRules } from "@/lib/content/business";
import { formatINR } from "@/lib/utils";
import { SectionHeading } from "./SectionHeading";
import { TiltCard } from "./TiltCard";
import { RAIL, RAIL_HINT, RAIL_ITEM } from "./rail";

export function duration(min: number) {
  if (min < 60) return `${min} min`;
  const h = Math.floor(min / 60);
  const m = min % 60;
  return m ? `${h} h ${m} min` : `${h} h`;
}

const kitOf = (id: string) => kits.find((k) => k.id === id);

/** Programs by age — four tilt cards from gradeBands, each with the kit it is taught with. */
export function Programs() {
  return (
    <section aria-labelledby="programs-title" className="relative overflow-hidden bg-paper py-24 sm:py-32">
      <div aria-hidden className="bp-grid-fine pointer-events-none absolute inset-x-0 top-0 h-64 opacity-60 [mask-image:linear-gradient(to_bottom,#000,transparent)]" />
      <div className="container-bp relative">
        <SectionHeading
          id="programs-title"
          index="03"
          eyebrow="Programs by age"
          title={["Four kits,", "one for every age."]}
          intro="Every grade band has its own kit, project and lesson plans, designed around how children of that age learn: from wonder-first play to training real AI models. Your teachers run them, trained by us."
          action={
            <Button href="/programs" variant="secondary" arrow>
              Explore all programs
            </Button>
          }
        />

        <ul className={`mt-10 sm:mt-14 sm:grid-cols-2 sm:gap-6 lg:mt-20 xl:grid-cols-4 ${RAIL}`}>
          {gradeBands.map((b, i) => (
            <Reveal as="li" key={b.id} delay={i * 0.08} className={RAIL_ITEM}>
              <Link
                href={`/programs#${b.id}`}
                className="group block h-full rounded-[var(--radius-md)] focus-visible:outline-offset-4"
                aria-label={`${b.name}, ${b.grades}: ${b.theme}. ${kitOf(b.kitId)?.name ?? "JOVE kit"}, ${formatINR(kitOf(b.kitId)?.schoolPrice ?? 0)} per kit. View program`}
              >
                <TiltCard className="flex flex-col overflow-hidden rounded-[var(--radius-md)] border border-graphite/15 bg-paper-50 shadow-[var(--shadow-paper)] transition-shadow duration-500 group-hover:shadow-[var(--shadow-lift)]">
                  <div className="relative aspect-[4/3] overflow-hidden border-b border-graphite/10 bg-paper">
                    <Image
                      src={b.image}
                      alt=""
                      fill
                      sizes="(min-width: 1280px) 22vw, (min-width: 640px) 46vw, 92vw"
                      quality={75}
                      className="object-cover mix-blend-multiply transition-transform duration-700 ease-[var(--ease-out-expo)] group-hover:scale-[1.05]"
                    />
                    <span aria-hidden className="hatch absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-60" />
                    <span className="absolute left-3 top-3 border border-graphite/20 bg-paper/90 px-2 py-1 font-mono text-[10px] uppercase tracking-[0.14em] text-graphite">
                      {b.grades}
                    </span>
                  </div>
                  <div className="flex flex-1 flex-col p-5 sm:p-6">
                    <div className="flex items-center justify-between font-mono text-[11px] uppercase tracking-[0.14em] text-blueprint">
                      <span>{String(i + 1).padStart(2, "0")}</span>
                      <span>{kitOf(b.kitId)?.name.replace(/^JOVE\s+/, "")}</span>
                    </div>
                    <h3 className="mt-3 text-2xl font-bold tracking-tight text-graphite">{b.name}</h3>
                    <p className="mt-1 font-medium text-charcoal">{b.theme}</p>
                    <p className="mt-3 text-sm leading-relaxed text-blueprint">{b.tagline}</p>
                    <div className="mt-auto flex items-end justify-between gap-3 border-t border-graphite/10 pt-5">
                      <span>
                        <span className="font-mono text-2xl font-medium tracking-tight text-graphite">{formatINR(kitOf(b.kitId)?.schoolPrice ?? 0)}</span>
                        <span className="ml-1 text-xs text-charcoal">/ kit</span>
                      </span>
                      <span className="grid size-9 place-items-center rounded-full border border-graphite/20 text-graphite transition-all duration-500 group-hover:rotate-45 group-hover:bg-graphite group-hover:text-paper">
                        <ArrowUpRight className="size-4" aria-hidden />
                      </span>
                    </div>
                  </div>
                </TiltCard>
              </Link>
            </Reveal>
          ))}
        </ul>
        <p aria-hidden className={`${RAIL_HINT} text-blueprint`}>
          <span className="h-px w-6 bg-graphite/30" /> Swipe · {gradeBands.length} programs
        </p>

        <p className="annot mt-8 text-blueprint">
          School price per kit · GST included · from {trainingRules.minimumKits} kits · teacher training and lesson plans for every kit
        </p>
      </div>
    </section>
  );
}
