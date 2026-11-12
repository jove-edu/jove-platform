"use client";

/**
 * A3 school brochure: "Kits & Teacher Training" pricing (theme: Graphite).
 *
 * The price sheet a principal can take into a management meeting. Dark graphite field, warm-paper type,
 * and the tables set on paper-coloured plates so small numbers stay crisp in print.
 *
 *   OUTSIDE  back cover (training film, training, lab, ordering, contact)  |  front cover
 *   INSIDE   kit price table, order rules, worked example                 |  the four ways to start
 *
 * Every price, duration, minimum and count is read from src/lib/content/business.ts: nothing is typed here.
 * Geometry is fixed in millimetres on a 5 mm grid that starts 12.5 mm in from every edge and from the fold.
 *
 * Query string (all optional): for, contact, phone, sides (see BrochureBits), and one of its own:
 *   valid = free text, printed on the front cover as "Prices valid until <valid>"; left out when empty.
 */
import { Fragment, type CSSProperties, type ReactNode } from "react";
import Image from "next/image";
import { Award, Check, FileText, Globe, Mail, Phone, User, Users, Wrench, type LucideIcon } from "lucide-react";
import { addOns, gradeBands, joveDayRules, kits, offers, schoolDiscountPercent, teacherTraining, trainingFilm, trainingRules, type GradeBand } from "@/lib/content/business";
import { site } from "@/lib/site";
import { cn, formatINR, formatNumber, pad2 } from "@/lib/utils";
import { Wordmark } from "../PrintBits";
import type { Q } from "../util";
import { BrochureShell, Half, Qr, Spread, sessionLength, useBrochureInfo, useQr, type BrochureInfo } from "./BrochureBits";

/* ───────────────────────────── geometry ───────────────────────────── */

/** Margin on every side of an A4 half (sheet edge and fold alike), and the width of the text area between them. */
const M = 12.5;
const W = 185;

const mm = (n: number) => `${n}mm`;
/** An absolutely placed box, in mm from the top-left corner of the half it sits in. */
const at = (x: number, y: number, w?: number, h?: number): CSSProperties => ({
  position: "absolute",
  left: mm(x),
  top: mm(y),
  ...(w === undefined ? null : { width: mm(w) }),
  ...(h === undefined ? null : { height: mm(h) }),
});

/* ───────────────────────────── numbers (all from business.ts) ───────────────────────────── */

const kitOf = (b: GradeBand) => kits.find((k) => k.id === b.kitId);
const lowKit = kits.reduce((a, k) => (k.schoolPrice < a.schoolPrice ? k : a), kits[0]);
const lowPrice = lowKit.schoolPrice;

const gradeNumbers = gradeBands.flatMap((b) => (b.grades.match(/\d+/g) ?? []).map(Number));
/** "Grades 1–10", from the first and last grade band */
const gradeSpan = `Grades ${Math.min(...gradeNumbers)}–${Math.max(...gradeNumbers)}`;

const labSetup = addOns.find((a) => a.id === "lab-setup");

/** 75 → "1 h 15 min" · 180 → "3 hours" (the same on every brochure) */
const hoursMinutes = sessionLength;
/** keeps a number on the same line as the word it counts: "2 school teachers", "6 reels" */
const nb = (s: string) => s.replace(/(\d+) (?=[A-Za-z])/g, "$1 ");

/**
 * Worked example: the same number of kits for every grade group, the smallest round number that reaches the school
 * price, and the smallest training group.
 */
const exPerKit = Math.ceil(trainingRules.minimumKits / gradeBands.length / 5) * 5;
const exRows = gradeBands.flatMap((b) => {
  const k = kitOf(b);
  return k ? [{ band: b, kit: k, amount: exPerKit * k.schoolPrice }] : [];
});
const exKits = exPerKit * exRows.length;
const exKitsTotal = exRows.reduce((s, r) => s + r.amount, 0);
const exTeachers = teacherTraining.minimumTeachers;
const exTraining = exTeachers * teacherTraining.pricePerTeacher;
const exTrainingGst = Math.round((exTraining * joveDayRules.gstPercent) / 100);
const exBill = exKitsTotal + exTraining + exTrainingGst;
const exAdvance = Math.round((exBill * joveDayRules.advancePercent) / 100);

/* ───────────────────────────── small parts ───────────────────────────── */

/**
 * Text with the rupee sign and the arrow drawn as vectors. The brochure fonts carry neither glyph, and a
 * substitute from the computer's own fonts would look different on every machine that prints this.
 */
function Tx({ children }: { children: string }) {
  // a chain such as "1 → 2 → 3" is kept on one line
  return (
    <>
      {children.split(/(\S+(?: → \S+)+)/).map((chunk, i) =>
        chunk.includes("→") ? (
          <span key={i} className="whitespace-nowrap">
            <Glyphs text={chunk} />
          </span>
        ) : (
          <Glyphs key={i} text={chunk} />
        ),
      )}
    </>
  );
}

function Glyphs({ text }: { text: string }) {
  return (
    <>
      {text.split(/(₹|→)/).map((part, i) => (
        <Fragment key={i}>{part === "₹" ? <RupeeSign /> : part === "→" ? <ArrowSign /> : part}</Fragment>
      ))}
    </>
  );
}

function RupeeSign() {
  return (
    <svg role="img" aria-label="₹" viewBox="0 0 100 140" overflow="visible" fill="none" stroke="currentColor" strokeWidth="16" strokeLinejoin="bevel" className="mr-[0.07em] inline-block h-[0.73em] w-[0.52em] align-baseline">
      <path d="M4 8H96M4 41H96M4 8H36C78 8 78 74 36 74H14L72 138" />
    </svg>
  );
}

function ArrowSign() {
  return (
    <svg role="img" aria-label="to" viewBox="0 0 100 60" overflow="visible" fill="none" stroke="currentColor" strokeWidth="9" className="inline-block h-[0.5em] w-[0.84em] align-baseline">
      <path d="M2 30H94M70 6L96 30L70 54" />
    </svg>
  );
}

const Inr = ({ value }: { value: number }) => <Tx>{formatINR(value)}</Tx>;

/** Mono annotation: column heads, units, sheet furniture. */
function Label({ children, className }: { children: ReactNode; className?: string }) {
  // the line height goes last: tailwind-merge drops an earlier leading-* whenever a font size follows it
  return <span className={cn("block font-mono text-[6.8pt] font-medium uppercase tracking-[0.18em]", className, "leading-[1.25]")}>{children}</span>;
}

/** Section eyebrow on the dark field: "— 01 / JOVE DAY" */
function Eyebrow({ n, children }: { n?: string; children: ReactNode }) {
  return (
    <p className="flex items-center gap-[2.5mm] font-mono text-[7pt] font-medium uppercase leading-none tracking-[0.22em] text-paper/70">
      <span aria-hidden className="h-px w-[10mm] bg-paper/55" />
      {n && <span className="text-paper">{n}</span>}
      {n && (
        <span aria-hidden className="text-paper/40">
          /
        </span>
      )}
      <span>{children}</span>
    </p>
  );
}

/** L-shaped corner marks just outside a plate, as on a drawing sheet. */
function Corners({ size = 2.5, gap = 1, className }: { size?: number; gap?: number; className?: string }) {
  const s = { width: mm(size), height: mm(size) };
  const o = mm(-gap);
  return (
    <span aria-hidden className={cn("pointer-events-none absolute inset-0 text-paper/60", className)}>
      <span className="absolute border-l border-t border-current" style={{ ...s, left: o, top: o }} />
      <span className="absolute border-r border-t border-current" style={{ ...s, right: o, top: o }} />
      <span className="absolute border-b border-l border-current" style={{ ...s, left: o, bottom: o }} />
      <span className="absolute border-b border-r border-current" style={{ ...s, right: o, bottom: o }} />
    </span>
  );
}

/** Dimension line with end ticks and arrowheads, and a label set into the middle of it. */
function Dimension({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <div className={cn("flex items-center gap-[2.5mm] text-paper/55", className)}>
      <span aria-hidden className="h-[3mm] w-px bg-current" />
      <span aria-hidden className="relative -ml-[2.5mm] h-px flex-1 bg-current">
        <span className="absolute left-0 top-[-0.75mm] border-y-[0.8mm] border-r-[2mm] border-y-transparent border-r-current" />
      </span>
      <Label className="shrink-0 text-paper/75">{children}</Label>
      <span aria-hidden className="relative -mr-[2.5mm] h-px flex-1 bg-current">
        <span className="absolute right-0 top-[-0.75mm] border-y-[0.8mm] border-l-[2mm] border-y-transparent border-l-current" />
      </span>
      <span aria-hidden className="h-[3mm] w-px bg-current" />
    </div>
  );
}

/** The blueprint grid on the dark field: 5 mm minor, 25 mm major, in register with the margins. */
function Field() {
  const line = (alpha: number, dir = "") => `linear-gradient(${dir}rgb(245 241 232 / ${alpha}) 0.25mm, transparent 0.25mm)`;
  return (
    <div
      aria-hidden
      className="pointer-events-none absolute inset-0"
      style={{
        backgroundImage: [line(0.08), line(0.08, "90deg, "), line(0.032), line(0.032, "90deg, ")].join(", "),
        backgroundSize: "25mm 25mm, 25mm 25mm, 5mm 5mm, 5mm 5mm",
        backgroundPosition: `${mm(M)} ${mm(M)}`,
      }}
    />
  );
}

/** Bottom line of a page: a hairline with a note on each side. */
function Footer({ left, right }: { left: ReactNode; right: ReactNode }) {
  return (
    <div className="flex items-center justify-between border-t border-paper/30 pt-[1.6mm] text-paper/80" style={at(M, 277.5, W)}>
      <Label className="text-[6.5pt]">{left}</Label>
      <Label className="text-[6.5pt]">{right}</Label>
    </div>
  );
}

/* ───────────────────────────── front cover ───────────────────────────── */

function FrontCover({ info, valid }: { info: BrochureInfo; valid: string }) {
  const schoolSize = info.school.length > 64 ? "text-[10pt]" : info.school.length > 36 ? "text-[11.5pt]" : "text-[14pt]";
  // the hero figure is set as large as its number of characters allows ("₹989" today)
  const heroSize = formatINR(lowPrice).length <= 4 ? "text-[132pt]" : "text-[100pt]";
  return (
    <Half side="right" className="text-paper">
      {/* the brand mark as a faint drawing behind the title */}
      <div aria-hidden className="absolute inset-0 overflow-hidden">
        <div style={at(102, -18, 152, 175)}>
          <Image src="/brand/jove-mark-white.png" alt="" fill sizes="1400px" quality={90} loading="eager" className="object-contain opacity-[0.1]" />
        </div>
      </div>

      <div style={at(M, M)}>
        <Wordmark white mm={52} />
      </div>
      <div className="text-right text-paper/70" style={at(M + 95, M + 1, 90)}>
        <Label className="text-paper">Price sheet</Label>
        <Label className="mt-[1.4mm]">Robotics · AI · Machine Learning</Label>
        <Label className="mt-[1.4mm]">{gradeSpan}</Label>
      </div>

      <div style={at(M, 68, W)}>
        <Eyebrow>For principals and school management</Eyebrow>
        <h1 className="mt-[5mm] text-[56pt] font-bold leading-[0.94] tracking-[-0.035em]">
          Kits &amp; Teacher
          <br />
          Training
        </h1>
        <p className="mt-[6mm] max-w-[112mm] text-[10.5pt] leading-[1.45] text-paper/85">
          Robotics, AI and Machine Learning kits in class sets for your school, and hands-on training that certifies your teachers to teach with them.
        </p>
      </div>

      {/* the price, dimensioned like a part on a drawing */}
      <div style={at(M, 147, W)}>
        <Label className="tracking-[0.32em] text-paper/70">From</Label>
        <div className="mt-[2mm] flex items-start gap-[7mm]">
          <p className={cn(heroSize, "font-mono font-medium leading-[0.8] tracking-[-0.04em] tabular-nums")}>
            <Inr value={lowPrice} />
          </p>
          <div className="pt-[1.5mm]">
            <p className="text-[14pt] font-semibold leading-tight tracking-[-0.01em]">per kit</p>
            <p className="mt-[1.4mm] text-[9.5pt] leading-snug text-paper/80">{lowKit.name}</p>
            <Label className="mt-[2.6mm] text-paper/80">GST included</Label>
          </div>
        </div>
      </div>
      <div style={at(M, 197.5, W)}>
        <Dimension>{`School price per kit by grade group · from ${trainingRules.minimumKits} kits`}</Dimension>
      </div>

      <div className="grid border border-paper/45" style={{ ...at(M, 205, W, 22.5), gridTemplateColumns: `repeat(${gradeBands.length}, 1fr)` }}>
        {gradeBands.map((b, i) => {
          const k = kitOf(b);
          return (
            <div key={b.id} className={cn("flex flex-col justify-between px-[3.5mm] py-[3mm]", i > 0 && "border-l border-paper/45", k?.id === lowKit.id && "bg-paper text-graphite")}>
              <Label className={k?.id === lowKit.id ? "text-charcoal" : "text-paper/70"}>{b.grades}</Label>
              <p className="font-mono text-[19pt] font-medium leading-none tracking-[-0.02em] tabular-nums">{k ? <Inr value={k.schoolPrice} /> : "—"}</p>
            </div>
          );
        })}
      </div>

      {/* title block */}
      <div className="border border-paper/45" style={at(M, 243, W, 39.5)}>
        <Corners />
        <div className="flex h-[25.4mm]">
          <div className="flex min-w-0 flex-1 flex-col justify-center px-[4mm]">
            <Label className="text-paper/80">{info.school ? "Prepared for" : "Inside"}</Label>
            {info.school ? (
              <p className={cn(schoolSize, "mt-[1.6mm] font-bold leading-[1.15] tracking-[-0.015em]")}>{info.school}</p>
            ) : (
              <p className="mt-[1.6mm] max-w-[120mm] text-[11.5pt] font-semibold leading-[1.25] tracking-[-0.01em]">Kit prices by grade, the teacher training, four ways to start and payment terms.</p>
            )}
          </div>
          {valid && (
            <div className="flex w-[58mm] shrink-0 flex-col justify-center border-l border-paper/45 px-[4mm]">
              <Label className="text-paper/80">Prices valid until</Label>
              <p className="mt-[1.6mm] font-mono text-[11pt] font-medium leading-tight">{valid}</p>
            </div>
          )}
        </div>
        <div className="flex h-[13.5mm] items-center justify-between border-t border-paper/45 px-[4mm] text-paper/70">
          <Label>{offers.map((o) => o.name).join(" · ")}</Label>
        </div>
      </div>
    </Half>
  );
}

/* ───────────────────────────── back cover ───────────────────────────── */

/** The teacher training, the lab setup and payment terms on one paper plate. */
function PriceList() {
  const head = "flex h-[6.8mm] items-end border-b border-graphite pb-[1.3mm]";
  const terms = [
    { figure: `${joveDayRules.advancePercent}%`, text: "advance to confirm the order" },
    { figure: `${joveDayRules.balanceDueDays} days`, text: "after the training to pay the balance" },
    { figure: "+ GST", text: "on the training; kit prices include GST" },
  ];
  return (
    <div className="grid grid-cols-2 gap-x-[7mm] bg-paper px-[5mm] pb-[2.4mm] text-graphite" style={at(M, 121, W, 87)}>
      <Corners />
      <div>
        <div className={head}>
          <Label>{teacherTraining.name}</Label>
        </div>
        <div className="flex items-baseline justify-between gap-[3mm] pt-[2mm]">
          <p className="text-[9pt] font-semibold leading-tight">
            {teacherTraining.hours} hours on your campus
            <span className="block text-[8pt] font-normal text-charcoal">from {teacherTraining.minimumTeachers} teachers · before GST</span>
          </p>
          <p className="shrink-0 font-mono text-[15pt] font-medium leading-none tracking-[-0.03em] text-ink tabular-nums">
            <Inr value={teacherTraining.pricePerTeacher} />
            <span className="block text-right font-sans text-[7.5pt] font-semibold tracking-normal">per teacher</span>
          </p>
        </div>
        <ul className="mt-[2mm] space-y-[1mm] border-t border-graphite/20 pt-[1.8mm] text-[8pt] leading-[1.3] text-charcoal">
          {teacherTraining.includes.map((t) => (
            <li key={t} className="flex gap-[1.6mm]">
              <span aria-hidden className="mt-[1.25mm] size-[1mm] shrink-0 bg-graphite/70" />
              <span>{nb(t)}</span>
            </li>
          ))}
        </ul>
      </div>
      <div className="flex flex-col">
        {labSetup && (
          <>
            <div className={head}>
              <Label>A permanent lab</Label>
            </div>
            <div className="py-[1.6mm]">
              <div className="flex items-baseline justify-between gap-[3mm]">
                <p className="text-balance text-[8.5pt] font-semibold leading-[1.25] tracking-[-0.005em]">{labSetup.name}</p>
                <p className="shrink-0 whitespace-nowrap font-mono text-[9.5pt] font-medium leading-none tracking-[-0.02em] text-ink tabular-nums">
                  <Tx>{labSetup.price}</Tx>
                </p>
              </div>
              <p className="mt-[0.5mm] text-[8pt] leading-[1.3] text-charcoal">{nb(labSetup.detail)}</p>
            </div>
          </>
        )}
        <div className="mt-auto">
          <div className={head}>
            <Label>Payment terms</Label>
          </div>
          <ul className="mt-[1.6mm] space-y-[0.9mm] text-[8.5pt] leading-[1.3]">
            {terms.map((t) => (
              <li key={t.figure} className="flex items-baseline gap-[2.5mm]">
                <span className="w-[15mm] shrink-0 font-mono text-[9.5pt] font-medium tracking-[-0.02em] text-ink">{t.figure}</span>
                <span>{t.text}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

function BackCover({ info, qrSrc }: { info: BrochureInfo; qrSrc: string }) {
  const steps = [
    { title: "Tell us what you need", text: "The grades, roughly how many kits, and how many teachers to train." },
    { title: "Confirm the order", text: `We send a written, itemised quote. A ${joveDayRules.advancePercent}% advance confirms it.` },
    { title: "Kits in, teachers trained", text: "We deliver the kits, then train and certify your teachers on campus, with our film crew." },
  ];
  const contact: { icon: LucideIcon; label: string; value: string }[] = [];
  if (info.contactName) contact.push({ icon: User, label: "Ask for", value: info.contactName });
  if (info.phone) contact.push({ icon: Phone, label: "Phone", value: info.phone });
  if (info.email) contact.push({ icon: Mail, label: "Email", value: info.email });
  contact.push({ icon: Globe, label: "Web", value: info.web });

  return (
    <Half side="left" className="text-paper">
      {/* a trainer with a class, fading into the field */}
      <div aria-hidden className="absolute right-0 top-0 h-[72mm] w-[122mm] overflow-hidden">
        <Image src="/images/studio/trainer-class.webp" alt="" fill sizes="2000px" quality={90} loading="eager" className="object-cover object-left opacity-75" />
        <div className="absolute inset-0 bg-[linear-gradient(90deg,#2b2b2b_0%,rgb(43_43_43/0)_36%,rgb(43_43_43/0)_80%,rgb(43_43_43/0.9)_100%)]" />
        <div className="absolute inset-x-0 bottom-0 h-[24mm] bg-[linear-gradient(180deg,rgb(43_43_43/0)_0%,#2b2b2b_100%)]" />
      </div>

      <div style={at(M, M + 1, 92)}>
        <Eyebrow>With Kits + Teacher Training</Eyebrow>
        <h2 className="mt-[4mm] text-[21pt] font-bold leading-[1.05] tracking-[-0.03em]">Your training day, filmed by our own studio.</h2>
        <p className="mt-[3.5mm] text-[9.5pt] leading-[1.45] text-paper/90">
          {site.studio.name}, our in-house studio, films your teachers building and testing the projects, and hands your school the edited film and photos.
        </p>
      </div>

      {/* what the film includes */}
      <div style={at(M, 76, W)}>
        <Label className="border-b border-paper/40 pb-[1.4mm] text-paper/70">{trainingFilm.name} · what your school receives</Label>
        <ul className="grid grid-cols-2 gap-x-[5mm]">
          {trainingFilm.items.map((item, i) => (
            <li key={item.title} className="flex gap-[2mm] pt-[2.1mm]">
              <span className="font-mono text-[6.8pt] font-medium leading-[1.7] text-paper/80">{pad2(i + 1)}</span>
              <span>
                <span className="block text-[9pt] font-semibold leading-[1.2] tracking-[-0.005em]">{item.title}</span>
                <span className="mt-[0.8mm] block text-[8pt] leading-[1.3] text-paper/75">{item.detail}</span>
              </span>
            </li>
          ))}
        </ul>
      </div>
      <p className="text-[8pt] leading-[1.38] text-paper/75" style={at(M, 106, W)}>
        <strong className="font-semibold text-paper">We film only with the school&apos;s permission, and any teacher can ask to be left out.</strong> {trainingFilm.rights}
      </p>

      <PriceList />

      {/* ordering */}
      <div style={at(M, 213, W)}>
        <Label className="border-b border-paper/40 pb-[1.4mm] text-paper/70">How to order</Label>
        <ol className="mt-[2.6mm] grid grid-cols-3 gap-x-[5mm]">
          {steps.map((s, i) => (
            <li key={s.title} className="flex gap-[2.6mm]">
              <span className="font-mono text-[15pt] font-medium leading-[0.92] text-paper/55">{i + 1}</span>
              <span>
                <span className="block text-[9pt] font-semibold leading-tight">{s.title}</span>
                <span className="mt-[0.8mm] block text-balance text-[8pt] leading-[1.34] text-paper/80">{s.text}</span>
              </span>
            </li>
          ))}
        </ol>
      </div>

      {/* contact */}
      <div className="flex items-stretch border border-paper/45" style={at(M, 240, W, 33)}>
        <Corners />
        <div className="flex w-[54mm] shrink-0 flex-col justify-center px-[4mm]">
          <p className="text-[14pt] font-bold leading-none tracking-[-0.02em]">Talk to us</p>
          <p className="mt-[2mm] text-[8pt] leading-[1.34] text-paper/80">Tell us the grades and how many teachers to train. We reply with a written quote.</p>
        </div>
        <ul className="flex min-w-0 flex-1 flex-col justify-center gap-[1.9mm] border-l border-paper/30 px-[4mm]">
          {contact.map((c) => (
            <li key={c.label} className="flex items-center gap-[2.2mm]">
              <c.icon aria-hidden strokeWidth={1.5} className="size-[3.4mm] shrink-0 text-paper/70" />
              <Label className="w-[12mm] shrink-0 text-[6.5pt] tracking-[0.12em] text-paper/80">{c.label}</Label>
              <span className={cn(contact.some((x) => x.value.length > 24) ? "text-[8pt]" : contact.length === 1 ? "text-[12pt]" : "text-[9.5pt]", "min-w-0 break-words font-medium leading-tight")}>{c.value}</span>
            </li>
          ))}
        </ul>
        <div className="flex shrink-0 items-center gap-[3mm] pr-[3mm]">
          <p className="w-[22mm] text-right text-[7.5pt] font-medium leading-[1.3] text-paper/85">Build an itemised estimate for your school online</p>
          <span className="block bg-paper p-[3mm]">
            <Qr src={qrSrc} mm={21} label="QR code: pricing on the JOVE website" />
          </span>
        </div>
      </div>

      <Footer left="Images are illustrative." right={info.legalName} />
    </Half>
  );
}

/* ───────────────────────────── inside, left: kits for schools ───────────────────────────── */

const KIT_INCLUDES: { icon: LucideIcon; text: string }[] = [
  { icon: FileText, text: "A printed build guide in every kit" },
  { icon: Users, text: "Lesson plans for every project" },
  { icon: Globe, text: "The free 3D practice bench" },
  { icon: Wrench, text: "Faulty parts replaced within 7 days of delivery" },
  { icon: Check, text: "Reusable, class after class" },
  { icon: Award, text: "Teacher certificates with the training" },
];

function InsideKits() {
  const cols = "grid-cols-[31mm_1fr_25mm_42mm]";
  const rules = [
    { figure: formatNumber(trainingRules.minimumKits), head: "kits for the school price", note: "in one order; MRP below that" },
    { figure: `${schoolDiscountPercent}%`, head: "off MRP", note: "the school price, GST included" },
    { figure: formatNumber(teacherTraining.minimumTeachers), head: "teachers per training", note: "the smallest group" },
  ];
  return (
    <Half side="left" className="text-paper">
      <div style={at(M, M + 1, W)}>
        <Eyebrow n="01">Kits for schools · in class sets</Eyebrow>
        <h2 className="mt-[4.5mm] max-w-[150mm] text-[25pt] font-bold leading-[1.04] tracking-[-0.03em]">A kit for every team. One price per kit.</h2>
        <p className="mt-[3.5mm] max-w-[158mm] text-[9.5pt] leading-[1.45] text-paper/85">
          Each grade group has its own kit, built for that age. Order as many as your classes need. Prices are per kit and include GST.
        </p>
      </div>

      <div style={at(M, 55.2, W)}>
        <Dimension>{`${gradeSpan} · ${kits.length} kits`}</Dimension>
      </div>

      {/* price table */}
      <div className="bg-paper text-graphite" style={at(M, 62, W, 82)}>
        <Corners />
        <div className={cn("grid h-[8mm] items-center border-b border-graphite px-[5mm] text-charcoal", cols)}>
          <Label>Grades</Label>
          <Label>Kit · what students build</Label>
          <Label>Lesson</Label>
          <Label className="text-right">School price</Label>
        </div>
        {gradeBands.map((b, i) => {
          const kit = kitOf(b);
          return (
            <div key={b.id} className={cn("grid h-[18.5mm] items-center px-[5mm]", cols, i > 0 && "border-t border-graphite/20")}>
              <p className="text-[11pt] font-bold leading-none tracking-[-0.015em]">{b.grades}</p>
              <div className="pr-[4mm]">
                <p className="text-[11pt] font-semibold leading-none tracking-[-0.015em]">{kit?.name ?? b.name}</p>
                {kit && <p className="mt-[1.5mm] text-[8pt] leading-[1.28] text-charcoal">{kit.project}</p>}
              </div>
              <p className="font-mono text-[9pt] leading-none text-charcoal">{hoursMinutes(b.durationMin)}</p>
              <div className="text-right">
                <p className="font-mono text-[25pt] font-medium leading-none tracking-[-0.03em] text-ink tabular-nums">{kit ? <Inr value={kit.schoolPrice} /> : "—"}</p>
                {kit && (
                  <p className="mt-[1mm] font-mono text-[7.5pt] leading-none text-charcoal">
                    MRP <Inr value={kit.mrp} />
                  </p>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* what comes with the kits */}
      <div style={at(M, 149, W)}>
        <Label className="border-b border-paper/40 pb-[1.4mm] text-paper/70">With every school order</Label>
        <ul className="mt-[3mm] grid grid-cols-3 gap-x-[5mm] gap-y-[2.5mm]">
          {KIT_INCLUDES.map(({ icon: Icon, text }) => (
            <li key={text} className="flex h-[12mm] items-start gap-[2.6mm]">
              <span className="grid size-[8.5mm] shrink-0 place-items-center border border-paper/45">
                <Icon aria-hidden strokeWidth={1.5} className="size-[4.4mm]" />
              </span>
              <span className="text-[8.5pt] leading-[1.3] text-paper/90">{text}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* order rules */}
      <div className="grid grid-cols-3 border-y border-paper/40" style={at(M, 187, W, 23)}>
        {rules.map((r, i) => (
          <div key={r.head} className={cn("flex flex-col justify-center", i > 0 && "border-l border-paper/25 pl-[5mm]")}>
            <p className="font-mono text-[20pt] font-medium leading-none tracking-[-0.03em] tabular-nums">
              <Tx>{r.figure}</Tx>
            </p>
            <p className="mt-[1.8mm] text-[8.5pt] font-semibold leading-[1.28]">
              {r.head}
              <span className="block font-normal text-paper/75">{r.note}</span>
            </p>
          </div>
        ))}
      </div>

      {/* worked example */}
      <div className="flex bg-paper text-graphite" style={at(M, 214, W, 59)}>
        <Corners />
        <div className="min-w-0 flex-1 px-[5mm] pt-[3.6mm]">
          <div className="flex items-baseline justify-between border-b border-graphite pb-[1.6mm]">
            <Label className="text-graphite">Worked example</Label>
            <Label className="text-charcoal">An illustration, not a quote</Label>
          </div>
          <p className="mt-[2.6mm] text-[9pt] font-semibold leading-tight">
            {formatNumber(exPerKit)} kits of each kind ({formatNumber(exKits)} kits) and {formatNumber(exTeachers)} teachers trained.
          </p>
          <div className="mt-[2.4mm]">
            {exRows.map((r) => (
              <div key={r.band.id} className="grid h-[5.2mm] grid-cols-[30mm_1fr_30mm] items-center border-t border-graphite/20 text-[8.5pt]">
                <span>{r.band.grades}</span>
                <span className="font-mono text-[8.5pt] text-charcoal tabular-nums">
                  {formatNumber(exPerKit)} × <Inr value={r.kit.schoolPrice} />
                </span>
                <span className="text-right font-mono text-[9.5pt] font-medium text-ink tabular-nums">
                  <Inr value={r.amount} />
                </span>
              </div>
            ))}
            <div className="grid h-[5.2mm] grid-cols-[30mm_1fr_30mm] items-center border-t border-graphite/20 text-[8.5pt]">
              <span>Training</span>
              <span className="font-mono text-[8.5pt] text-charcoal tabular-nums">
                {formatNumber(exTeachers)} × <Inr value={teacherTraining.pricePerTeacher} /> + GST
              </span>
              <span className="text-right font-mono text-[9.5pt] font-medium text-ink tabular-nums">
                <Inr value={exTraining + exTrainingGst} />
              </span>
            </div>
          </div>
          <p className="mt-[1.4mm] border-t border-graphite/20 pt-[1.6mm] text-[8pt] leading-tight text-charcoal">Your quote is worked out the same way, from your own grades and teachers.</p>
        </div>
        <div className="flex w-[62mm] shrink-0 flex-col justify-between bg-ink px-[5mm] py-[4mm] text-paper">
          <div>
            <Label className="text-paper/65">Example total</Label>
            <p className="mt-[2.6mm] font-mono text-[26pt] font-medium leading-none tracking-[-0.035em] tabular-nums">
              <Inr value={exBill} />
            </p>
            <p className="mt-[2mm] text-[8.5pt] font-semibold leading-tight">GST included</p>
            <p className="mt-[2.4mm] text-balance text-[8pt] leading-[1.3] text-paper/75">Kits at the school price, and {joveDayRules.gstPercent}% GST on the training.</p>
          </div>
          <dl className="space-y-[1.3mm] border-t border-paper/30 pt-[2.4mm] text-[8pt] leading-tight text-paper/80">
            <div className="flex items-baseline justify-between gap-[2mm]">
              <dt>{joveDayRules.advancePercent}% advance to confirm</dt>
              <dd className="font-mono text-[9pt] font-medium text-paper tabular-nums">
                <Inr value={exAdvance} />
              </dd>
            </div>
          </dl>
        </div>
      </div>

      <Footer left={`Kits · ${gradeSpan}`} right="Kit prices include GST" />
    </Half>
  );
}

/* ───────────────────────────── inside, right: four ways to start ───────────────────────────── */

function InsideOffers() {
  const cols = "grid-cols-[repeat(4,1fr)]";
  const hi = offers.findIndex((o) => o.highlight);
  const dark = (i: number) => i === hi;

  return (
    <Half side="right" className="text-paper">
      <div style={at(M, M + 1, W)}>
        <Eyebrow n="02">Four ways to start</Eyebrow>
        <h2 className="mt-[4.5mm] max-w-[150mm] text-[25pt] font-bold leading-[1.04] tracking-[-0.03em]">Kits, training, or both.</h2>
        <p className="mt-[3.5mm] max-w-[158mm] text-[9.5pt] leading-[1.45] text-paper/85">
          Most schools take kits and training together. Schools that already have kits or an Atal Tinkering Lab can book the training on its own.
        </p>
      </div>

      <div className="bg-paper text-graphite" style={at(M, 62, W, 211)}>
        <Corners />
        {hi >= 0 && (
          <>
            <div aria-hidden className="absolute inset-y-0 bg-ink" style={{ left: `${(hi * 100) / offers.length}%`, width: `${100 / offers.length}%` }} />
            <div className="absolute flex h-[5mm] items-center justify-center bg-paper" style={{ left: `${(hi * 100) / offers.length}%`, width: `${100 / offers.length}%`, top: mm(-5) }}>
              <Label className="text-graphite">Most schools</Label>
            </div>
          </>
        )}
        <div className={cn("relative grid h-full", cols)}>
          {offers.map((o, i) => (
            <div key={o.id} className={cn("flex flex-col px-[4mm] pb-[4mm] pt-[4.6mm]", dark(i) ? "text-paper" : i > 0 && "border-l border-graphite/20")}>
              <Label className={cn("text-[6.5pt]", dark(i) ? "text-paper/70" : "text-charcoal")}>{o.tag}</Label>
              <p className="mt-[2mm] text-[13pt] font-bold leading-[1.05] tracking-[-0.02em]">{o.name}</p>
              <p className={cn("mt-[2.2mm] text-[8pt] leading-[1.32]", dark(i) ? "text-paper/85" : "text-charcoal")}>{o.headline}</p>
              <p className={cn("mt-[3mm] border-y py-[2mm] font-mono text-[7.6pt] leading-[1.35]", dark(i) ? "border-paper/30" : "border-graphite/20 text-ink")}>
                <Tx>{o.priceNote}</Tx>
              </p>
              <ul className={cn("mt-[3mm] space-y-[1.3mm] text-[8pt] leading-[1.3]", dark(i) ? "text-paper/90" : "text-graphite")}>
                {o.includes.map((text) => (
                  <li key={text} className="flex gap-[1.6mm]">
                    <span aria-hidden className={cn("mt-[1.25mm] size-[1mm] shrink-0", dark(i) ? "bg-paper/70" : "bg-graphite/70")} />
                    <span>
                      <Tx>{nb(text)}</Tx>
                    </span>
                  </li>
                ))}
              </ul>
              <p className={cn("mt-auto border-t pt-[2.4mm] text-[7.8pt] leading-[1.3]", dark(i) ? "border-paper/30 text-paper/80" : "border-graphite/20 text-charcoal")}>
                <span className="font-semibold">Suits: </span>
                {o.idealFor}
              </p>
            </div>
          ))}
        </div>
      </div>

      <Footer left={`Kits + teacher training · ${gradeSpan}`} right="Training: GST added on the invoice" />
    </Half>
  );
}

/* ───────────────────────────── the brochure ───────────────────────────── */

export function PricingBrochure({ q }: { q: Q }) {
  const info = useBrochureInfo(q);
  const qrSrc = useQr(info.link("/packages"), "#2b2b2b", "#f5f1e8");
  const valid = (q.valid ?? "").trim();

  return (
    <BrochureShell
      title="Brochure: Kits and teacher training pricing"
      q={q}
      ready={info.ready && !!qrSrc}
      outside={
        <Spread className="bg-graphite text-paper">
          <Field />
          <BackCover info={info} qrSrc={qrSrc} />
          <FrontCover info={info} valid={valid} />
        </Spread>
      }
      inside={
        <Spread className="bg-graphite text-paper">
          <Field />
          <InsideKits />
          <InsideOffers />
        </Spread>
      }
    />
  );
}
