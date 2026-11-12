"use client";

import { useState } from "react";
import Link from "next/link";
import { FileText, Play, Printer } from "lucide-react";
import { DECKS, GROUP_LABEL } from "@/lib/decks";
import type { Deck, DeckGroup } from "@/lib/decks/types";
import { Input } from "@/components/ui/form";
import { PageHeader } from "@/components/hq/ui";
import { Scaled } from "./Presenter";
import { SlideView } from "./SlideView";

const minutesLabel = (m: number) => (m < 60 ? `${m} min` : m % 60 ? `${Math.floor(m / 60)} h ${m % 60} min` : `${m / 60} h`);

/** A school from the Schools CRM, offered for the meeting deck's cover. */
export interface CrmSchool {
  name: string;
  city?: string;
  stage: string;
}

function DeckCard({ deck, schools }: { deck: Deck; schools: CrmSchool[] }) {
  const [school, setSchool] = useState("");
  const slides = deck.slides({ school: school || undefined });
  const q = school.trim() ? `?school=${encodeURIComponent(school.trim())}` : "";
  const amp = q ? "&" : "?";
  return (
    <article className="flex flex-col overflow-hidden rounded-[var(--radius-md)] border border-graphite/12 bg-paper-50 shadow-[var(--shadow-paper)]" data-deck={deck.id}>
      <Link href={`/hq/print/present/${deck.id}${q}`} className="block border-b border-graphite/10" aria-label={`Present ${deck.title}`}>
        <Scaled className="aspect-video w-full">
          <SlideView deck={deck} slide={slides[0]} index={0} total={slides.length} />
        </Scaled>
      </Link>
      <div className="flex flex-1 flex-col p-4">
        <p className="annot text-blueprint">{deck.audience}</p>
        <h3 className="mt-1 text-lg font-bold leading-snug tracking-[-0.01em] text-graphite">{deck.title}</h3>
        <p className="mt-1.5 text-[13px] leading-relaxed text-charcoal">{deck.blurb}</p>
        <p className="mt-2 font-mono text-[11px] text-blueprint">
          {slides.length} slides · {minutesLabel(deck.minutes)}
        </p>
        {deck.group === "school" && (
          <div className="mt-3">
            {schools.length > 0 && (
              <>
                <label htmlFor={`crm-${deck.id}`} className="annot text-[10px] text-blueprint">
                  Pick a school from the CRM
                </label>
                <select
                  id={`crm-${deck.id}`}
                  value={schools.some((x) => x.name === school) ? school : ""}
                  onChange={(e) => setSchool(e.target.value)}
                  className="mt-1 mb-3 h-9 w-full rounded-[var(--radius-sm)] border border-graphite/20 bg-paper px-2 text-sm text-graphite"
                >
                  <option value="">— Choose a school —</option>
                  {schools.map((x) => (
                    <option key={x.name + x.city} value={x.name}>
                      {x.name}
                      {x.city ? ` · ${x.city}` : ""} ({x.stage})
                    </option>
                  ))}
                </select>
              </>
            )}
            <label htmlFor={`school-${deck.id}`} className="annot text-[10px] text-blueprint">
              {schools.length > 0 ? "Or type the name" : "School’s name on the cover (optional)"}
            </label>
            <Input id={`school-${deck.id}`} value={school} onChange={(e) => setSchool(e.target.value)} maxLength={80} placeholder="e.g. Sri Vidya Public School" className="mt-1 h-9" />
          </div>
        )}
        <div className="mt-auto flex flex-wrap gap-2 pt-4">
          <Link href={`/hq/print/present/${deck.id}${q}`} className="inline-flex h-9 items-center gap-1.5 rounded-[var(--radius-sm)] bg-graphite px-3 text-sm font-semibold text-paper hover:bg-ink">
            <Play className="size-4" aria-hidden /> Present
          </Link>
          <a href={`/hq/print/deck/${deck.id}${q}`} target="_blank" rel="noopener noreferrer" className="inline-flex h-9 items-center gap-1.5 rounded-[var(--radius-sm)] border border-graphite/25 px-3 text-sm font-semibold text-graphite hover:border-graphite">
            <Printer className="size-4" aria-hidden /> PDF
          </a>
          <a href={`/hq/print/deck/${deck.id}${q}${amp}notes=1`} target="_blank" rel="noopener noreferrer" className="inline-flex h-9 items-center gap-1.5 rounded-[var(--radius-sm)] border border-graphite/25 px-3 text-sm font-semibold text-graphite hover:border-graphite" title="Two slides per A4 page with the trainer's words under each">
            <FileText className="size-4" aria-hidden /> PDF with notes
          </a>
        </div>
      </div>
    </article>
  );
}

/** HQ → Presentations: the decks, grouped, and what to send or print for a teacher training. */
export function DeckLibrary({ schools = [] }: { schools?: CrmSchool[] }) {
  const groups: DeckGroup[] = ["school", "classroom", "trainer"];
  return (
    <div>
      <PageHeader
        eyebrow="Knowledge"
        title="Presentations"
        icon="Presentation"
        description="Slides for school meetings, a lesson for every grade group for teachers to use in class, and training trainers. Present from a laptop, or save a PDF to present offline. Only in HQ."
      />
      <div className="space-y-12">
        {groups.map((g) => (
          <section key={g} aria-labelledby={`g-${g}`}>
            <h2 id={`g-${g}`} className="text-base font-bold text-graphite">
              {GROUP_LABEL[g].title}
            </h2>
            <p className="mt-0.5 text-sm text-charcoal">{GROUP_LABEL[g].blurb}</p>
            <div className="mt-4 grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
              {DECKS.filter((d) => d.group === g).map((d) => (
                <DeckCard key={d.id} deck={d} schools={schools} />
              ))}
            </div>
          </section>
        ))}

        <section aria-labelledby="send-print" className="rounded-[var(--radius-md)] border border-graphite/12 bg-paper-50 p-5" data-guide>
          <h2 id="send-print" className="text-base font-bold text-graphite">
            Before a teacher training: what to send and what to print
          </h2>
          <div className="mt-3 grid gap-6 text-sm leading-relaxed text-charcoal md:grid-cols-3">
            <div>
              <p className="annot mb-1.5 text-blueprint">Send to the trainer (a week before)</p>
              <ul className="list-disc space-y-1 pl-5">
                <li>The lesson presentations for the kits the school ordered, as <strong>PDF with notes</strong> (above), to rehearse</li>
                <li>
                  The <strong>complete trainer pack</strong> for those grades: <Link href="/hq/curriculum" className="font-semibold underline underline-offset-2">Curriculum</Link> → the grade → Complete trainer pack
                </li>
                <li>The training&apos;s <strong>checklist</strong>: Trainings → the training → Checklist</li>
              </ul>
            </div>
            <div>
              <p className="annot mb-1.5 text-blueprint">Print for the teachers</p>
              <ul className="list-disc space-y-1 pl-5">
                <li>
                  <strong>Lesson plans and student worksheets</strong> for each grade ordered: Curriculum → the grade (one set per teacher)
                </li>
                <li>
                  <strong>Teacher certificates</strong>: <Link href="/hq/printables" className="font-semibold underline underline-offset-2">Printables</Link> → Certificates
                </li>
                <li>
                  <strong>Training feedback forms</strong>: Printables → Teacher training feedback
                </li>
              </ul>
            </div>
            <div>
              <p className="annot mb-1.5 text-blueprint">On the day</p>
              <ul className="list-disc space-y-1 pl-5">
                <li>Present each lesson on the projector as the teachers will in class; the notes stay on your laptop</li>
                <li>Keep a PDF of each deck on the laptop in case the internet fails</li>
                <li>Hand each school the decks as PDFs, so its teachers can present them in class</li>
              </ul>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
