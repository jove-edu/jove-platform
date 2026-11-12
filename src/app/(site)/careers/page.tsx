import type { Metadata } from "next";
import { site } from "@/lib/site";
import { gradeBands } from "@/lib/content/business";
import { formatINR } from "@/lib/utils";
import { Button } from "@/components/ui/Button";
import type { RoleId } from "@/lib/content/careers";
import { CornerMarks, Crosshair, GridBackdrop, SectionLabel } from "@/components/brand/Blueprint";
import { PageHero } from "@/components/site/PageHero";
import { CTASection } from "@/components/site/CTASection";
import { ApplyForm, ApplyForRole } from "@/components/site/careers/ApplyForm";
import { Reveal, RevealLines } from "@/components/site/Reveal";

/** Day rate for freelance trainers (per training day at a school). */
const TRAINER_DAY_RATE = { min: 1500, max: 2500 };
const dayRate = `${formatINR(TRAINER_DAY_RATE.min)}–${formatINR(TRAINER_DAY_RATE.max)}`;

export const metadata: Metadata = {
  title: "Careers — Build the Future with JOVE",
  description: `Join JOVE as a freelance Robotics & AI teacher trainer (${dayRate} per training day), lead trainer, video editor / media intern or school partnerships associate. Choose your role and apply in a few minutes.`,
  alternates: { canonical: "/careers" },
  openGraph: {
    title: "Careers at JOVE — Build the future with us",
    description: "Train school teachers in hands-on robotics and AI, film it with our in-house studio, or bring new schools on board.",
    images: [{ url: "/images/studio/kids-build.webp", width: 2400, height: 1340, alt: "Illustration of students' hands building a small robot" }],
  },
};

const heading = "text-[clamp(2rem,4.6vw,3.8rem)] font-bold leading-[1.02] tracking-[-0.03em]";

const gradeNums = gradeBands.flatMap((g) => g.grades.match(/\d+/g) ?? []).map(Number);
const gradeSpan = `Grade ${Math.min(...gradeNums)} to Grade ${Math.max(...gradeNums)}`;

interface Role {
  id: RoleId;
  code: string;
  title: string;
  team: string;
  type: string;
  where: string;
  pay: string;
  payNote?: string;
  summary: string;
  responsibilities: string[];
  requirements: string[];
  plus?: string;
}

const roles: Role[] = [
  {
    id: "trainer",
    code: "R-01",
    title: "Freelance Robotics & AI Teacher Trainer",
    team: "Teacher training",
    type: "Freelance · per training day",
    where: "On site at partner schools",
    pay: `${dayRate} per training day`,
    payNote: "Depends on experience and your role on the day.",
    summary: `Train school teachers to teach JOVE kits for ${gradeSpan}, working beside the founders at partner schools.`,
    responsibilities: [
      "Run the JOVE teacher training from the training plan: every project built by hand, then taught back",
      "Show teachers how to set up a class, run each lesson plan and fix the usual faults",
      "Keep every teacher building: troubleshoot wiring, sensors and code at the table",
      "Follow the safety SOP and child-protection policy without exception",
      "Check the training kits and spares in and out, and report missing or damaged parts",
    ],
    requirements: [
      "An engineering or science student, graduate, or a maker with projects to show",
      "Comfortable with basic electronics and Arduino; block-based coding for younger grades",
      "Clear, patient and respectful with adult learners, in English and ideally a regional language too",
      "Able to travel to schools, sometimes the evening before",
      "Willing to complete background verification before your first training",
    ],
    plus: "Nice to have: Python, basic machine-learning concepts, or earlier teaching or volunteering experience.",
  },
  {
    id: "lead-trainer",
    code: "R-02",
    title: "Lead Trainer",
    team: "Teacher training",
    type: "Senior freelance · scope to grow",
    where: "On site at partner schools",
    pay: "Discussed on the first call",
    payNote: "Based on experience and the scope you take on.",
    summary: "Lead teacher trainings on your own, coach the freelance trainers, and hold the bar on quality and safety.",
    responsibilities: [
      "Lead full trainings independently, including the Grades 6–10 kits with Arduino, sensors and AI vision",
      "Brief and coach freelance trainers before and during a training",
      "Keep the training to its plan and make sure every teacher finishes every build",
      "Run the kit and safety checks, and sign off the certificates for the teachers who completed",
      "Feed what teachers tell you back into the lesson plans and teacher guides",
    ],
    requirements: [
      "Experience teaching robotics, electronics or coding to school students — workshops, clubs or classrooms",
      "Strong hands-on skills: Arduino, sensors, motor drivers; working Python and ML basics",
      "Confident teaching a room of teachers, and helping them teach large classes",
      "Reliable availability on training days, including travel",
      "Background verification and our safety training before you lead",
    ],
    plus: "Nice to have: experience with Atal Tinkering Labs, robotics competitions or curriculum writing.",
  },
  {
    id: "media",
    code: "R-03",
    title: "Video Editor / Media Intern",
    team: site.studio.name,
    type: "Internship or freelance",
    where: "Studio work, plus shoot days at schools",
    pay: "Stipend or project fee — discussed on the first call",
    summary: `Turn a training day's footage into the short film and photos schools receive, and help ${site.studio.name} capture it on shoot days.`,
    responsibilities: [
      "Edit the short film of each teacher training to deadline",
      "Grade and select the photos the school receives",
      "Assist the media lead on shoot days: second camera, audio, backups",
      "Leave out anyone who asks not to be filmed, and follow the consent list for every school",
      "Write captions, organise footage and keep the archive tidy",
    ],
    requirements: [
      "A showreel or portfolio — student and personal work counts",
      "Fluent in at least one editor: Premiere Pro, DaVinci Resolve or similar",
      "A feel for pacing, music sync and clean sound",
      "Dependable with deadlines and careful with other people's footage",
      "Comfortable working on school campuses under the school's and our rules",
    ],
    plus: "Nice to have: camera or gimbal operation, colour grading, motion graphics.",
  },
  {
    id: "partnerships",
    code: "R-04",
    title: "School Partnerships Associate",
    team: "Growth · works with the CEO",
    type: "Part-time or full-time",
    where: "Calls, school visits and JOVE HQ",
    pay: "Discussed on the first call",
    summary: "Open conversations with schools, book meetings with principals, and help turn a first kit order into a long partnership.",
    responsibilities: [
      "Research and reach out to CBSE, ICSE and State Board schools",
      "Book and prepare meetings and demos with principals and correspondents",
      "Keep every lead, call and follow-up up to date in the JOVE HQ CRM",
      "Prepare quotes with the founder and follow through to a confirmed order",
      "Stay in touch after the training: teachers' feedback, more kits and new grades",
    ],
    requirements: [
      "A confident, courteous speaker — English plus a regional language",
      "Comfortable with phone calls and in-person school visits",
      "Organised: you write things down and follow up when you said you would",
      "Genuine interest in education and in what students get from robotics in class",
      "Honest selling — you never promise what we cannot deliver",
    ],
    plus: "Nice to have: experience in school sales or ed-tech. Not required.",
  },
];

const steps = [
  { title: "Apply", time: "About 5 minutes", body: "Fill in the form on this page. Tell us what you have built, taught or filmed, and add links if you have them." },
  { title: "Short call", time: "15 minutes", body: "A phone or video call with a founder — your background, your availability and your questions. If your profile fits, we call within a week." },
  { title: "Demo session", time: "20 minutes", body: "Teach us one build as if we were a room of Grade 6 teachers. We are looking for clarity and warmth, not polish." },
  { title: "Paid shadow training", time: "One training day", body: "Join a real teacher training beside the founders. You help at the tables, we pay you for the day, and both sides see if it fits." },
  { title: "Onboarding & safety training", time: "Before you lead", body: "The training plan, kit handling, the safety SOP, our child-protection policy and background verification, all before you lead a training." },
];

export default function CareersPage() {
  return (
    <>
      {/* 01 — HERO */}
      <PageHero
        eyebrow="Careers"
        index="01"
        title={["Build the future", "with JOVE."]}
        intro={
          <>
            <p>
              We put real robots and real AI into classrooms from {gradeSpan}, and train the teachers who teach them. We are looking for the people
              who will stand at those tables with us.
            </p>
            <p className="mt-4">JOVE launches in October 2026. Join early, and help shape how it is done.</p>
          </>
        }
        aside={
          <div className="relative rounded-[var(--radius-lg)] border border-graphite/15 bg-paper-50 p-6 shadow-[var(--shadow-lift)] sm:p-8">
            <CornerMarks />
            <p className="annot flex items-center justify-between text-blueprint">
              <span>Hiring sheet</span>
              <span className="font-mono">Launch · Oct 2026</span>
            </p>
            <dl className="mt-5 divide-y divide-dashed divide-graphite/20">
              <div className="flex items-baseline justify-between gap-4 pb-4">
                <dt className="text-sm text-charcoal">Open roles</dt>
                <dd className="font-mono text-4xl font-medium tracking-tight text-graphite">{String(roles.length).padStart(2, "0")}</dd>
              </div>
              <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1 py-4">
                <dt className="text-sm text-charcoal">Freelance trainer</dt>
                <dd className="text-right">
                  <span className="font-mono text-xl font-medium tracking-tight text-graphite">{dayRate}</span>
                  <span className="block text-xs text-blueprint">per training day</span>
                </dd>
              </div>
              <div className="flex items-baseline justify-between gap-4 py-4">
                <dt className="text-sm text-charcoal">Hiring steps</dt>
                <dd className="text-sm font-semibold text-graphite">{steps.length} — including a paid shadow day</dd>
              </div>
              <div className="flex items-baseline justify-between gap-4 pt-4">
                <dt className="text-sm text-charcoal">Based in</dt>
                <dd className="text-sm font-semibold text-graphite">{site.location}</dd>
              </div>
            </dl>
          </div>
        }
      >
        <div className="flex flex-wrap gap-3">
          <Button href="#apply" size="lg" arrow>
            Apply now
          </Button>
          <Button href="#roles" variant="secondary" size="lg">
            See the roles
          </Button>
        </div>
      </PageHero>

      {/* 02 — APPLY */}
      <section id="apply" aria-labelledby="apply-title" className="relative scroll-mt-24 overflow-hidden border-t border-graphite/10 bg-paper-50 py-20 sm:py-28">
        <div aria-hidden className="bp-grid-fine pointer-events-none absolute inset-0 opacity-60" />
        <div className="container-bp relative grid gap-12 lg:grid-cols-12 lg:grid-rows-[auto_1fr] lg:gap-x-16 lg:gap-y-10">
          <div className="lg:col-span-4 lg:col-start-1 lg:row-start-1">
            <div>
              <Reveal>
                <SectionLabel index="02">Apply</SectionLabel>
              </Reveal>
              <h2 id="apply-title" className={`mt-6 text-graphite ${heading}`}>
                <RevealLines lines={["Step one", "starts here."]} />
              </h2>
              <Reveal delay={0.2}>
                <p className="mt-6 max-w-md text-base leading-relaxed text-charcoal">
                  Choose your role, tell us what you have built, taught or filmed, and send it. It takes about five minutes. Students are welcome.
                </p>
              </Reveal>
            </div>
          </div>
          <Reveal delay={0.15} className="lg:col-span-8 lg:col-start-5 lg:row-span-2 lg:row-start-1">
            <div className="relative rounded-[var(--radius-lg)] border border-graphite/15 bg-paper p-5 shadow-[var(--shadow-lift)] sm:p-10">
              <CornerMarks />
              <p className="annot mb-6 flex items-center justify-between text-blueprint">
                <span>Application</span>
                <span className="font-mono">Form C-01</span>
              </p>
              <ApplyForm />
            </div>
          </Reveal>
          <div className="lg:col-span-4 lg:col-start-1 lg:row-start-2">
            <Reveal>
                <h3 className="annot text-blueprint">What happens next</h3>
                <ol className="mt-4 space-y-4">
                  {steps.map((s, i) => (
                    <li key={s.title} className="grid grid-cols-[2rem_1fr] gap-x-3">
                      <span className="font-mono text-xs leading-6 text-blueprint">{String(i + 1).padStart(2, "0")}</span>
                      <span>
                        <span className="block text-[15px] font-bold tracking-[-0.01em] text-graphite">
                          {s.title} <span className="font-mono text-[11px] font-normal text-blueprint">· {s.time}</span>
                        </span>
                        <span className="mt-0.5 block text-[13px] leading-relaxed text-charcoal">{s.body}</span>
                      </span>
                    </li>
                  ))}
                </ol>
                <p className="mt-8 rounded-[var(--radius-sm)] border border-dashed border-graphite/30 bg-paper/70 px-4 py-3 text-[13px] leading-relaxed text-charcoal">
                  <strong className="font-semibold text-graphite">An honest note:</strong> we are a new company. Freelance work begins as a few training days a month and grows
                  as more schools order.
                </p>
                {site.contact.email && (
                  <p className="mt-6 text-[14px] text-charcoal">
                    Prefer email?{" "}
                    <a
                      href={`mailto:${site.contact.email}?subject=${encodeURIComponent("Careers at JOVE")}`}
                      className="break-all font-semibold text-graphite underline decoration-graphite/30 underline-offset-4 hover:decoration-graphite"
                    >
                      {site.contact.email}
                    </a>
                  </p>
                )}
            </Reveal>
          </div>
        </div>
      </section>

      {/* 03 — THE ROLES IN DETAIL */}
      <section id="roles" aria-labelledby="roles-title" className="relative scroll-mt-24 py-24 sm:py-32">
        <GridBackdrop vignette={false} className="opacity-70" />
        <Crosshair className="absolute right-[7%] top-16 hidden md:block" />
        <div className="container-bp relative">
          <div className="grid gap-12 lg:grid-cols-12 lg:gap-16">
            <div className="lg:col-span-4">
              <div className="lg:sticky lg:top-28">
                <Reveal>
                  <SectionLabel index="03">Open roles</SectionLabel>
                </Reveal>
                <h2 id="roles-title" className="mt-6 text-[clamp(2rem,4vw,3.2rem)] font-bold leading-[1.02] tracking-[-0.03em] text-graphite">
                  <RevealLines lines={["Four roles.", "One team."]} />
                </h2>
                <Reveal delay={0.2}>
                  <p className="mt-6 text-[15px] leading-relaxed text-charcoal">
                    Every role touches a school: at the training table, behind the camera or in the principal&apos;s office weeks before.
                  </p>
                  <nav aria-label="Open roles" className="mt-8">
                    <ul className="flex flex-wrap gap-2 lg:block lg:space-y-0 lg:border-b lg:border-graphite/15">
                      {roles.map((r) => (
                        <li key={r.id}>
                          <a
                            href={`#role-${r.id}`}
                            className="group flex items-center gap-3 rounded-full border border-graphite/25 px-4 py-2 text-[13px] font-semibold text-graphite transition-colors hover:bg-graphite hover:text-paper lg:rounded-none lg:border-0 lg:border-t lg:border-graphite/15 lg:px-0 lg:py-3.5 lg:text-[15px] lg:hover:bg-transparent lg:hover:text-ink"
                          >
                            <span className="font-mono text-xs text-blueprint transition-colors group-hover:text-paper/70 lg:group-hover:text-graphite">{r.code}</span>
                            <span className="lg:flex-1">{r.title}</span>
                            <span aria-hidden className="hidden h-px w-5 bg-graphite/40 transition-all duration-500 ease-[var(--ease-out-expo)] group-hover:w-9 group-hover:bg-graphite lg:block" />
                          </a>
                        </li>
                      ))}
                    </ul>
                  </nav>
                </Reveal>
              </div>
            </div>

            <ul className="space-y-6 lg:col-span-8">
              {roles.map((r, i) => (
                <Reveal as="li" key={r.id} delay={Math.min(i, 2) * 0.06}>
                  <article
                    id={`role-${r.id}`}
                    aria-labelledby={`role-${r.id}-title`}
                    className="relative scroll-mt-28 rounded-[var(--radius-lg)] border border-graphite/15 bg-paper-50 shadow-[var(--shadow-paper)] transition-shadow duration-500 hover:shadow-[var(--shadow-lift)]"
                  >
                    <CornerMarks />
                    <header className="relative overflow-hidden rounded-t-[var(--radius-lg)] border-b border-graphite/10 p-6 sm:p-8">
                      <div aria-hidden className="hatch-dense pointer-events-none absolute inset-y-0 right-0 w-1/3 opacity-[0.14] [mask-image:linear-gradient(to_left,black,transparent)]" />
                      <p className="annot relative flex flex-wrap items-center gap-x-3 gap-y-1 text-blueprint">
                        <span className="font-mono">{r.code}</span>
                        <span aria-hidden className="h-px w-5 bg-graphite/30" />
                        <span>{r.team}</span>
                      </p>
                      <h3 id={`role-${r.id}-title`} className="relative mt-3 text-[clamp(1.5rem,2.8vw,2.1rem)] font-bold leading-tight tracking-[-0.03em] text-graphite">
                        {r.title}
                      </h3>
                      <p className="relative mt-3 max-w-2xl text-[15px] leading-relaxed text-charcoal">{r.summary}</p>
                      <dl className="relative mt-6 grid gap-px overflow-hidden rounded-[var(--radius-sm)] border border-graphite/12 bg-graphite/12 sm:grid-cols-3">
                        {[
                          ["Type", r.type],
                          ["Where", r.where],
                          ["Pay", r.pay],
                        ].map(([k, v]) => (
                          <div key={k} className="bg-paper px-4 py-3">
                            <dt className="annot text-blueprint">{k}</dt>
                            <dd className="mt-1 text-[13.5px] font-semibold leading-snug text-graphite">{v}</dd>
                          </div>
                        ))}
                      </dl>
                      {r.payNote && <p className="relative mt-2 text-xs text-blueprint">{r.payNote}</p>}
                    </header>
                    <div className="grid gap-8 p-6 sm:p-8 md:grid-cols-2">
                      {[
                        { label: "What you'll do", items: r.responsibilities },
                        { label: "What you'll need", items: r.requirements },
                      ].map((col) => (
                        <div key={col.label}>
                          <h4 className="annot text-blueprint">{col.label}</h4>
                          <ul className="mt-4 space-y-3">
                            {col.items.map((x) => (
                              <li key={x} className="flex gap-3 text-[14px] leading-relaxed text-charcoal">
                                <span aria-hidden className="mt-[10px] h-px w-3 shrink-0 bg-graphite/50" />
                                {x}
                              </li>
                            ))}
                          </ul>
                        </div>
                      ))}
                    </div>
                    <footer className="flex flex-col items-start justify-between gap-4 border-t border-dashed border-graphite/20 px-6 py-5 sm:flex-row sm:items-center sm:px-8">
                      <p className="max-w-xl text-[13px] leading-relaxed text-blueprint">{r.plus}</p>
                      <ApplyForRole role={r.id} title={r.title} />
                    </footer>
                  </article>
                </Reveal>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <CTASection
        eyebrow="Know a school?"
        title={["Not job hunting?", "Bring JOVE to a school."]}
        body="If your school — or your child's — should have a full day of hands-on Robotics & AI, introduce us. We will take it from there."
        primary={{ label: "Get a quote", href: "/contact" }}
        secondary={{ label: "About JOVE", href: "/about" }}
      />
    </>
  );
}
