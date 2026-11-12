import { Award, Building2, Camera, ClipboardList, Clapperboard, FileText, GraduationCap, Package, Plug, Presentation, UserCheck, Wrench } from "lucide-react";
import { CornerMarks } from "@/components/brand/Blueprint";
import { Reveal } from "@/components/site/Reveal";
import { cn } from "@/lib/utils";

const weBring = [
  { icon: Package, title: "Your kits", detail: "The kits you ordered, checked and counted, a printed build guide in every box." },
  { icon: UserCheck, title: "A JOVE trainer", detail: "A JOVE founder or certified trainer leads the training; the team is set out in your quote." },
  { icon: Wrench, title: "Tools and spares", detail: "Multimeters, screwdrivers, cells and spare parts for the training session." },
  { icon: FileText, title: "Lesson plans", detail: "A lesson plan and teacher guide for every project in the kits you chose." },
  { icon: Award, title: "Certificates", detail: "A JOVE certificate for every teacher who completes the training." },
  { icon: Clapperboard, title: "Film crew", detail: "FrameMind AI Studio films the training for your short film and photos." },
];

const youProvide = [
  { icon: Building2, title: "A room", detail: "A classroom or lab for the training, with tables the teachers can build on." },
  { icon: Plug, title: "Power points", detail: "A few working sockets for laptops, the projector and charging." },
  { icon: Presentation, title: "Projector / screen", detail: "To show the 3D practice bench and the lesson plans." },
  { icon: GraduationCap, title: "Your teachers", detail: "The teachers who will teach the kits, free for the training hours." },
  { icon: ClipboardList, title: "A list of names", detail: "Teachers' names before the day, for the certificates." },
  { icon: Camera, title: "Filming permission", detail: "The school's go-ahead to film the training. Any teacher can ask to be left out." },
];

function Column({ title, kicker, items, dark }: { title: string; kicker: string; items: typeof weBring; dark?: boolean }) {
  return (
    <div className={cn("relative h-full overflow-hidden rounded-[var(--radius-lg)] p-6 sm:p-8", dark ? "bg-graphite text-paper shadow-[var(--shadow-lift)]" : "border border-graphite/15 bg-paper-50 shadow-[var(--shadow-paper)]")}>
      {dark ? <div aria-hidden className="bp-grid-dark absolute inset-0 opacity-70" /> : <div aria-hidden className="bp-grid-fine absolute inset-0 opacity-60" />}
      <CornerMarks className={cn("m-3", dark ? "text-paper/40" : "text-graphite/40")} />
      <div className="relative">
        <p className={cn("annot", dark ? "text-paper/55" : "text-blueprint")}>{kicker}</p>
        <h3 className="mt-2 text-2xl font-bold tracking-tight sm:text-3xl">{title}</h3>
        <ul className="mt-7 space-y-5">
          {items.map(({ icon: Icon, title: t, detail }) => (
            <li key={t} className="flex gap-4">
              <span className={cn("grid size-10 shrink-0 place-items-center rounded-[var(--radius-sm)] border", dark ? "border-paper/20 bg-paper/5" : "border-graphite/15 bg-paper")}>
                <Icon className="size-[18px]" strokeWidth={1.6} aria-hidden />
              </span>
              <span>
                <span className="block text-[15px] font-semibold">{t}</span>
                <span className={cn("mt-0.5 block text-sm leading-relaxed", dark ? "text-paper/65" : "text-charcoal")}>{detail}</span>
              </span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

/** "What we bring vs what your school provides" for the teacher training: a two-column checklist for coordinators. */
export function BringProvide() {
  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <Reveal className="h-full">
        <Column dark kicker="On the training day" title="JOVE brings" items={weBring} />
      </Reveal>
      <Reveal delay={0.1} className="h-full">
        <Column kicker="Ready on campus" title="Your school provides" items={youProvide} />
      </Reveal>
    </div>
  );
}
