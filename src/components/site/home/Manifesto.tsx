"use client";

import { useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { ConstructionCircle, SectionLabel, SketchDivider } from "@/components/brand/Blueprint";
import { Reveal } from "@/components/site/Reveal";
import { kits, teacherTraining } from "@/lib/content/business";

gsap.registerPlugin(ScrollTrigger, useGSAP);

const LEAD = "Robotics and AI that stay in your school,".split(" ");
const MARK = "taught by your own teachers.".split(" ");

const PROOFS = [
  {
    title: "Kits in class sets",
    body: "Real parts for every team: light-up cardboard robots in Grade 1 to AI vision robots in Grade 10, at the school price. Supports CBSE, ICSE and State board outcomes and NEP 2020's experiential learning.",
    stat: `${kits.length} kits · Grades 1–10`,
  },
  {
    title: "Teachers trained and certified",
    body: "A hands-on training on your campus: every teacher builds the projects, learns how to run them in class and how to fix the usual faults, and leaves with lesson plans and a JOVE certificate.",
    stat: `${teacherTraining.hours} hours · from ${teacherTraining.minimumTeachers} teachers`,
  },
  {
    title: "Practice bench and a film",
    body: "A free 3D bench with the same parts as the kits, to rehearse a build and project it in class. And our studio, FrameMind AI Studio, films the training day for your school.",
    stat: "3D bench · training film",
  },
];

const WORD = "inline-block text-[#bdb7ab] motion-reduce:text-graphite";

/** The positioning statement — words ink from blueprint grey to graphite as you scroll. */
export function Manifesto() {
  const scope = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        const words = gsap.utils.toArray<HTMLElement>("[data-ink]");
        gsap.fromTo(
          words,
          { color: "#bdb7ab" },
          {
            color: "#2b2b2b",
            ease: "none",
            stagger: 0.12,
            scrollTrigger: { trigger: "[data-statement]", start: "top 82%", end: "bottom 48%", scrub: 0.4 },
          },
        );
        gsap.fromTo(
          "[data-mark]",
          { scaleX: 0 },
          { scaleX: 1, ease: "none", stagger: 0.25, scrollTrigger: { trigger: "[data-statement]", start: "center 72%", end: "bottom 45%", scrub: 0.4 } },
        );
      });
      return () => mm.revert();
    },
    { scope },
  );

  return (
    <section ref={scope} id="jove-manifesto" aria-labelledby="manifesto-title" className="relative overflow-hidden bg-paper py-24 sm:py-32 lg:py-40">
      <div aria-hidden className="bp-grid pointer-events-none absolute inset-0 opacity-60 [mask-image:linear-gradient(to_bottom,transparent,#000_20%,#000_80%,transparent)]" />
      <ConstructionCircle size={620} className="pointer-events-none absolute -left-48 -top-24 text-graphite/[0.07]" />

      <div className="container-bp relative">
        <div className="flex items-center justify-between gap-6">
          <SectionLabel index="01">Why kits and training</SectionLabel>
          <span className="annot hidden font-mono text-blueprint sm:block">Fig. 02 — Positioning</span>
        </div>

        <h2
          id="manifesto-title"
          data-statement
          className="mt-10 max-w-[19ch] text-[clamp(2.1rem,1rem+4.4vw,5.25rem)] font-bold leading-[1.02] tracking-[-0.035em] sm:mt-14"
        >
          {LEAD.map((w, i) => (
            <span key={i}>
              <span data-ink className={WORD}>
                {w}
              </span>{" "}
            </span>
          ))}
          {MARK.map((w, i) => (
            <span key={i}>
              <span className="relative inline-block">
                <span data-ink className={`${WORD} relative z-10`}>
                  {w}
                </span>
                <span data-mark aria-hidden className="hatch absolute -inset-x-[0.06em] bottom-[0.1em] z-0 h-[0.3em] origin-left bg-graphite/[0.06]" />
              </span>
              {i < MARK.length - 1 ? " " : ""}
            </span>
          ))}
        </h2>

        <Reveal className="mt-10 max-w-2xl text-lg leading-relaxed text-charcoal sm:text-xl">
          A one-day workshop is over by evening. Kits in class sets and teachers who know how to use them mean robotics runs every week, in every
          section, all year.
        </Reveal>

        <SketchDivider className="mt-16 sm:mt-24" />

        <ol className="mt-12 grid gap-10 md:grid-cols-3 md:gap-8 lg:gap-14">
          {PROOFS.map((p, i) => (
            <Reveal as="li" key={p.title} delay={i * 0.1} className="relative border-t border-graphite/20 pt-6">
              <span aria-hidden className="absolute -top-[3px] left-0 size-[5px] bg-graphite" />
              <div className="flex items-baseline justify-between gap-4">
                <span className="font-mono text-xs tracking-[0.2em] text-blueprint">0{i + 1}</span>
                <span className="font-mono text-[11px] uppercase tracking-[0.12em] text-charcoal">{p.stat}</span>
              </div>
              <h3 className="mt-5 text-xl font-semibold tracking-tight text-graphite sm:text-2xl">{p.title}</h3>
              <p className="mt-3 leading-relaxed text-charcoal">{p.body}</p>
            </Reveal>
          ))}
        </ol>
      </div>
    </section>
  );
}
