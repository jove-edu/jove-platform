"use client";

import { useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { Award } from "lucide-react";
import { GridBackdrop, SectionLabel } from "@/components/brand/Blueprint";
import { Reveal, RevealLines } from "@/components/site/Reveal";
import { kits, teacherTraining, trainingRules } from "@/lib/content/business";

gsap.registerPlugin(ScrollTrigger, useGSAP);

const STEPS = [
  { title: "Talk to us", detail: "We visit or call, see your classes or lab, and suggest the kits for the grades you want.", who: "Principal · coordinator" },
  { title: "Choose your kits", detail: `${kits.map((k) => k.name.replace(/^JOVE\s+/, "").replace(/\s+Kit$/, "")).join(", ")}: in class sets, at the school price. You get a written quote.`, who: `From ${trainingRules.minimumKits} kits` },
  { title: "Kits arrive", detail: "Delivered to your campus, counted and checked, with a printed build guide in every kit.", who: "JOVE team" },
  { title: "Teachers trained", detail: `${teacherTraining.hours} hours on your campus: every teacher builds the projects and learns how to run them in class. Filmed by our studio.`, who: `From ${teacherTraining.minimumTeachers} teachers` },
  { title: "Classes begin", detail: "Your teachers teach with the lesson plans, and rehearse or project each build on the free 3D bench.", who: "Your teachers · your students" },
];

/** How working with JOVE goes: horizontal (pinned) on large screens with motion; a vertical list everywhere else. */
export function HowItWorks() {
  const scope = useRef<HTMLElement>(null);
  const pinRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLOListElement>(null);
  const progressRef = useRef<HTMLSpanElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(min-width: 1024px) and (prefers-reduced-motion: no-preference)", () => {
        const track = trackRef.current;
        const pin = pinRef.current;
        if (!track || !pin) return;
        const distance = () => Math.max(0, track.scrollWidth - pin.clientWidth);
        const tween = gsap.to(track, {
          x: () => -distance(),
          ease: "none",
          scrollTrigger: { trigger: pin, start: "top top", end: () => `+=${distance()}`, pin: true, scrub: 0.6, invalidateOnRefresh: true, anticipatePin: 1 },
        });
        gsap.fromTo(progressRef.current, { scaleX: 0 }, { scaleX: 1, ease: "none", scrollTrigger: { trigger: pin, start: "top top", end: () => `+=${distance()}`, scrub: 0.6, invalidateOnRefresh: true } });
        gsap.utils.toArray<HTMLElement>("[data-stop]", track).forEach((el) => {
          gsap.fromTo(el, { opacity: 0.28 }, { opacity: 1, ease: "none", scrollTrigger: { trigger: el, containerAnimation: tween, start: "left 88%", end: "left 58%", scrub: true } });
        });
      });
      return () => mm.revert();
    },
    { scope },
  );

  const header = (
    <div className="container-bp grid gap-8 lg:grid-cols-12 lg:items-end">
      <div className="lg:col-span-7">
        <SectionLabel index="02" light>
          How it works
        </SectionLabel>
        <h2 id="how-title" className="mt-5 text-[clamp(2rem,1.2rem+3vw,3.75rem)] font-bold leading-[1.02] tracking-[-0.03em] text-paper">
          <RevealLines lines={["Kits in your classes.", "Teachers who know them."]} />
        </h2>
      </div>
      <Reveal delay={0.1} className="lg:col-span-5">
        <p className="max-w-xl leading-relaxed text-paper/70 sm:text-[17px]">
          From the first conversation to the first class, in five steps. After that, robotics is part of your timetable, run by your own teachers.
        </p>
        <dl className="mt-6 grid grid-cols-3 gap-4 border-t border-paper/15 pt-5 font-mono text-paper">
          <div>
            <dt className="annot text-paper/45">Training</dt>
            <dd className="mt-1 text-sm">{teacherTraining.hours} hours</dd>
          </div>
          <div>
            <dt className="annot text-paper/45">Kits</dt>
            <dd className="mt-1 text-sm">Grades 1–10</dd>
          </div>
          <div>
            <dt className="annot text-paper/45">Where</dt>
            <dd className="mt-1 text-sm">Your campus</dd>
          </div>
        </dl>
      </Reveal>
    </div>
  );

  const finale = {
    title: "Certified, and on film.",
    text: "Every teacher who completes the training gets a JOVE certificate, and the school gets a short film and photos of the day.",
  };

  return (
    <section ref={scope} aria-labelledby="how-title" className="relative bg-graphite text-paper">
      <div ref={pinRef} className="relative flex flex-col justify-center overflow-hidden py-24 sm:py-28 lg:min-h-[100svh] lg:py-20">
        <GridBackdrop dark />
        <div className="relative">{header}</div>

        {/* horizontal blueprint track (lg + motion) */}
        <div className="relative mt-14 hidden lg:motion-safe:block">
          <span aria-hidden className="absolute inset-x-0 top-[100px] h-px bg-paper/20" />
          <span ref={progressRef} aria-hidden className="absolute inset-x-0 top-[100px] h-px origin-left bg-paper" />
          <ol ref={trackRef} className="relative flex w-max pl-[max(3rem,calc((100vw-1440px)/2+5rem))] pr-[20vw] will-change-transform xl:pl-[max(5rem,calc((100vw-1440px)/2+5rem))]">
            {STEPS.map((s, i) => (
              <li key={s.title} data-stop className="relative w-[300px] shrink-0 pr-10 xl:w-[330px]">
                <div className="flex h-16 items-end gap-3">
                  <span className="font-mono text-[2.6rem] font-medium leading-none tracking-[-0.04em] tabular-nums">{String(i + 1).padStart(2, "0")}</span>
                  <span className="pb-1 font-mono text-[11px] uppercase tracking-[0.12em] text-paper/50">Step</span>
                </div>
                <div className="relative mt-6 flex h-6 items-center">
                  <span className="relative z-10 grid size-6 place-items-center rounded-full border border-paper/60 bg-graphite">
                    <span className="size-2 rounded-full bg-paper" />
                  </span>
                </div>
                <h3 className="mt-6 text-xl font-semibold tracking-tight">{s.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-paper/65">{s.detail}</p>
                <p className="mt-3 font-mono text-[11px] uppercase tracking-[0.12em] text-paper/40">{s.who}</p>
              </li>
            ))}
            <li data-stop className="relative w-[340px] shrink-0">
              <div className="flex h-16 items-end">
                <span className="font-mono text-[2.6rem] font-medium leading-none tracking-[-0.04em]">Done.</span>
              </div>
              <div className="relative mt-6 flex h-6 items-center">
                <span className="relative z-10 grid size-6 place-items-center rounded-full bg-paper text-graphite">
                  <Award className="size-3.5" aria-hidden />
                </span>
              </div>
              <div className="mt-6 border border-paper/20 bg-paper/[0.04] p-5">
                <h3 className="text-lg font-semibold">{finale.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-paper/65">{finale.text}</p>
              </div>
            </li>
          </ol>
          <p className="container-bp annot mt-10 text-paper/40">Keep scrolling →</p>
        </div>

        {/* vertical list (mobile, tablet, reduced motion) */}
        <ol className="container-bp relative mt-14 lg:motion-safe:hidden">
          {STEPS.map((s, i) => (
            <Reveal as="li" key={s.title} delay={Math.min(i, 3) * 0.05} className="relative grid grid-cols-[1.5rem_1fr] gap-x-4 pb-9 sm:grid-cols-[1.5rem_6rem_1fr] sm:gap-x-6">
              <span aria-hidden className="absolute bottom-0 left-[11.5px] top-7 w-px bg-paper/20" />
              <span aria-hidden className="relative z-10 mt-1 grid size-6 place-items-center rounded-full border border-paper/60 bg-graphite">
                <span className="size-2 rounded-full bg-paper" />
              </span>
              <span className="col-start-2 block font-mono text-2xl font-medium leading-none tabular-nums sm:col-start-auto">{String(i + 1).padStart(2, "0")}</span>
              <div className="col-start-2 mt-3 sm:col-start-auto sm:mt-0">
                <h3 className="text-lg font-semibold tracking-tight">{s.title}</h3>
                <p className="mt-1.5 text-sm leading-relaxed text-paper/65">{s.detail}</p>
                <p className="mt-2 font-mono text-[11px] uppercase tracking-[0.12em] text-paper/40">{s.who}</p>
              </div>
            </Reveal>
          ))}
          <Reveal as="li" className="relative grid grid-cols-[1.5rem_1fr] gap-x-4 sm:grid-cols-[1.5rem_6rem_1fr] sm:gap-x-6">
            <span aria-hidden className="relative z-10 grid size-6 place-items-center rounded-full bg-paper text-graphite">
              <Award className="size-3.5" aria-hidden />
            </span>
            <span className="col-start-2 font-mono text-2xl font-medium leading-none sm:col-start-auto">Done.</span>
            <p className="col-start-2 mt-2 text-sm leading-relaxed text-paper/65 sm:col-start-auto sm:mt-0">{finale.text}</p>
          </Reveal>
        </ol>
      </div>
    </section>
  );
}
