import type { Metadata } from "next";
import Image from "next/image";
import { ArrowDownRight, Check } from "lucide-react";
import { gradeBands, kits, teacherTraining, trainingFilm, trainingRules } from "@/lib/content/business";
import { formatINR, pad2 } from "@/lib/utils";
import { Button } from "@/components/ui/Button";
import { CornerMarks, GridBackdrop } from "@/components/brand/Blueprint";
import { PageHero } from "@/components/site/PageHero";
import { CTASection } from "@/components/site/CTASection";
import { Reveal } from "@/components/site/Reveal";
import { BandTrack, type TrackItem } from "@/components/site/programs/BandTrack";
import { BandSection } from "@/components/site/programs/BandSection";
import { BringProvide } from "@/components/site/programs/BringProvide";
import { CurriculumAlignment, SafetyPanel } from "@/components/site/programs/Assurance";
import { SectionHeading } from "@/components/site/programs/SectionHeading";
import { fmtDuration, gradeRange, kitFor } from "@/components/site/programs/data";

export const metadata: Metadata = {
  title: "Programs — Robotics & AI Kits and Lessons for Grades 1–10",
  description:
    "Four age-specific Robotics & AI kits for Grades 1–10, each with lesson plans, learning outcomes and a free 3D practice bench, and hands-on training that certifies your teachers to teach them.",
  alternates: { canonical: "/programs" },
  openGraph: {
    title: "JOVE Programs — Little Inventors to AI Innovators",
    description: "Robotics & AI kits and lesson plans for Grades 1–10, taught by your own teachers after JOVE trains and certifies them.",
    images: [{ url: "/images/age/age-3.webp", width: 1600, height: 1195, alt: "Pencil blueprint sketch of an Arduino obstacle-avoiding robot car" }],
  },
};

const durations = gradeBands.map((b) => b.durationMin);
const facts = [
  { k: "Grades", v: "1 – 10", s: `${gradeBands.length} age-specific groups` },
  { k: "Lesson length", v: `${fmtDuration(Math.min(...durations))} – ${fmtDuration(Math.max(...durations))}`, s: "planned to the minute" },
  { k: "Teacher training", v: `${teacherTraining.hours} hours`, s: "hands-on, on your campus, certified" },
  { k: "Lesson plans", v: "Every project", s: "with every kit" },
];

export default function ProgramsPage() {
  const items: TrackItem[] = gradeBands.map((b, i) => ({ id: b.id, index: pad2(i + 1), grades: b.grades, range: gradeRange(b), name: b.name }));

  return (
    <>
      <PageHero
        eyebrow="Programs"
        index="01"
        title={["Every grade", "builds", "something real."]}
        intro={
          <>
            Every JOVE kit is age-specific and comes with lesson plans planned to the minute, from a glowing cardboard robot in Grade 1 to an AI that sees in Grade 10. We train your teachers to teach every one of them.
          </>
        }
        aside={
          <div className="relative rounded-[var(--radius-lg)] border border-graphite/15 bg-paper-50/90 p-2 shadow-[var(--shadow-lift)] backdrop-blur-sm">
            <CornerMarks className="text-graphite/40" />
            <p className="annot px-4 pb-1 pt-3 text-blueprint">Programme index · kit school prices</p>
            <ul>
              {gradeBands.map((b, i) => (
                <li key={b.id} className="border-t border-graphite/10 first:border-t-0">
                  <a href={`#${b.id}`} className="group grid grid-cols-[auto_1fr_auto] items-center gap-4 rounded-[var(--radius-sm)] px-4 py-3.5 transition-colors hover:bg-graphite/[0.04]">
                    <span className="font-mono text-[11px] text-blueprint">{pad2(i + 1)}</span>
                    <span className="min-w-0">
                      <span className="flex items-center gap-1.5 text-[15px] font-semibold text-graphite">
                        {b.name}
                        <ArrowDownRight className="size-3.5 text-blueprint opacity-0 transition-opacity group-hover:opacity-100" aria-hidden />
                      </span>
                      <span className="block truncate text-xs text-blueprint">
                        {b.grades} · {kitFor(b)?.name.replace(/^JOVE\s+/, "") ?? b.theme}
                      </span>
                    </span>
                    <span className="text-right font-mono text-sm text-graphite tabular">
                      {kitFor(b) ? formatINR(kitFor(b)!.schoolPrice) : "—"}
                      <span className="block font-sans text-[10px] text-blueprint">per kit</span>
                    </span>
                  </a>
                </li>
              ))}
            </ul>
            <p className="border-t border-graphite/10 px-4 py-3 text-[11px] text-blueprint">GST included · from {trainingRules.minimumKits} kits · lesson plans included</p>
          </div>
        }
      >
        <div className="flex flex-wrap gap-3">
          <Button href="/packages#quote" size="lg" arrow>
            Estimate for your school
          </Button>
          <Button href="#training" variant="secondary" size="lg">
            See the teacher training
          </Button>
        </div>
      </PageHero>

      {/* quick facts */}
      <section aria-label="At a glance" className="relative bg-graphite text-paper">
        <div aria-hidden className="bp-grid-dark absolute inset-0 opacity-70" />
        <dl className="container-bp relative grid grid-cols-2 lg:grid-cols-4">
          {facts.map((f, i) => (
            <Reveal key={f.k} delay={i * 0.06} className="border-paper/10 py-7 pr-4 [&:nth-child(n+3)]:border-t lg:border-l lg:px-6 lg:first:border-l-0 lg:first:pl-0 lg:[&:nth-child(n+3)]:border-t-0">
              <dt className="annot text-paper/50">{f.k}</dt>
              <dd className="mt-2 font-mono text-lg font-medium tracking-tight sm:text-2xl">{f.v}</dd>
              <dd className="mt-1 text-xs text-paper/55">{f.s}</dd>
            </Reveal>
          ))}
        </dl>
      </section>

      <BandTrack items={items}>
        {gradeBands.map((band, i) => (
          <BandSection key={band.id} band={band} n={i} total={gradeBands.length} />
        ))}
      </BandTrack>

      {/* Teacher training */}
      <section id="training" aria-labelledby="training-title" className="relative scroll-mt-20 overflow-hidden bg-graphite py-24 text-paper sm:py-32">
        <div aria-hidden className="absolute inset-0 opacity-[0.12]">
          <Image src="/images/studio/trainer-class.webp" alt="" fill sizes="100vw" quality={60} className="object-cover grayscale" />
        </div>
        <div aria-hidden className="bp-grid-dark absolute inset-0 opacity-80" />
        <div className="container-bp relative">
          <SectionHeading
            light
            index="02"
            eyebrow="Teacher training"
            id="training-title"
            title={["Your teachers,", "ready to teach it."]}
            intro={`In ${teacherTraining.hours} hands-on hours on your campus, your teachers build the projects themselves and learn to run them in class. Every teacher who completes it gets a JOVE certificate.`}
            aside={
              <dl className="grid grid-cols-2 gap-px overflow-hidden rounded-[var(--radius-md)] border border-paper/15 bg-paper/15">
                {[
                  ["Length", `${teacherTraining.hours} hours`],
                  ["Where", "Your campus"],
                  ["Price", `${formatINR(teacherTraining.pricePerTeacher)} / teacher`],
                  ["Group", `From ${teacherTraining.minimumTeachers} teachers`],
                ].map(([k, v]) => (
                  <div key={k} className="bg-graphite px-4 py-4">
                    <dt className="annot text-paper/50">{k}</dt>
                    <dd className="mt-1.5 font-mono text-lg tracking-tight">{v}</dd>
                  </div>
                ))}
              </dl>
            }
          />
          <div className="mt-14 grid gap-6 lg:grid-cols-12">
            <ul className="grid gap-4 sm:grid-cols-2 lg:col-span-8">
              {teacherTraining.includes.map((x, i) => (
                <Reveal as="li" key={x} delay={i * 0.05} className="relative rounded-[var(--radius-md)] border border-paper/15 bg-paper/[0.04] p-5">
                  <span className="font-mono text-[11px] text-paper/45">{pad2(i + 1)}</span>
                  <p className="mt-2 text-sm leading-relaxed text-paper/85">{x}</p>
                </Reveal>
              ))}
            </ul>
            <Reveal delay={0.1} className="lg:col-span-4">
              <div className="relative h-full rounded-[var(--radius-lg)] border border-paper/15 bg-ink/40 p-6">
                <CornerMarks className="m-3 text-paper/35" />
                <p className="annot text-paper/55">On film</p>
                <p className="mt-2 text-lg font-bold tracking-tight">{trainingFilm.name}</p>
                <ul className="mt-4 space-y-3 text-sm">
                  {trainingFilm.items.map((m) => (
                    <li key={m.title} className="flex gap-2">
                      <Check className="mt-0.5 size-4 shrink-0 text-paper/60" aria-hidden />
                      <span>
                        <span className="block font-semibold">{m.title}</span>
                        <span className="block text-xs leading-relaxed text-paper/60">{m.detail}</span>
                      </span>
                    </li>
                  ))}
                </ul>
                <p className="mt-4 border-t border-paper/15 pt-3 text-xs leading-relaxed text-paper/55">Included with Kits + Teacher Training. Prices exclude GST.</p>
              </div>
            </Reveal>
          </div>
          <p className="mt-6 max-w-3xl text-sm leading-relaxed text-paper/55">
            Kits: {kits.map((k) => k.name.replace(/^JOVE\s+/, "")).join(", ")}. The training covers the kits your school orders.
          </p>
        </div>
      </section>

      {/* Bring vs provide */}
      <section aria-labelledby="bring-title" className="relative overflow-hidden py-24 sm:py-32">
        <GridBackdrop />
        <div className="container-bp relative">
          <SectionHeading
            index="03"
            eyebrow="Training day"
            id="bring-title"
            title={["What we bring.", "What your school provides."]}
            intro="We arrive with everything for the training. Your coordinator's checklist is short, and we share it with the order confirmation."
          />
          <div className="mt-14">
            <BringProvide />
          </div>
        </div>
      </section>

      {/* Curriculum alignment */}
      <section aria-labelledby="align-title" className="relative overflow-hidden border-t border-graphite/10 bg-paper-200/60 py-24 sm:py-32">
        <div aria-hidden className="bp-grid absolute inset-0 opacity-50" />
        <div className="container-bp relative">
          <SectionHeading
            index="04"
            eyebrow="Curriculum alignment"
            id="align-title"
            title={["Built around what", "your students already learn."]}
            intro="The kits and lesson plans are designed to support NEP 2020's push for experiential learning and coding, board science and computer outcomes, and the Atal Tinkering Lab way of working."
          />
          <div className="mt-14">
            <CurriculumAlignment />
          </div>
        </div>
      </section>

      {/* Safety */}
      <section aria-labelledby="safety-title" className="relative overflow-hidden bg-graphite py-24 text-paper sm:py-32">
        <div aria-hidden className="bp-grid-dark absolute inset-0 opacity-80" />
        <div className="container-bp relative">
          <SectionHeading light index="05" eyebrow="Safety" id="safety-title" title={["Safe by design.", "In every class."]} intro="Low-voltage kits, teachers trained for hands-on classes, and filming only with consent." />
          <div className="mt-14">
            <SafetyPanel />
          </div>
        </div>
      </section>

      <CTASection
        eyebrow="Next step"
        title={["See what kits and", "training cost."]}
        body="Choose kits by kind and how many teachers to train for an instant, itemised estimate, then send it to us for a written quote."
        primary={{ label: "Estimate your quote", href: "/packages#quote" }}
        secondary={{ label: "Talk to us", href: "/contact" }}
      />
    </>
  );
}
