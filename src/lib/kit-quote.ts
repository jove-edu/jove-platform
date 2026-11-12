/**
 * A school's quote for kits and teacher training (since Nov 2026): what the website estimator works out, what the
 * public form checks, and what HQ reads on the lead. Only the choices travel; prices are worked out again from
 * business.ts (the price book) wherever the quote is shown.
 */
import { joveDayRules, kits, teacherTraining, trainingRules, type KitId } from "@/lib/content/business";

export interface KitQuoteInput {
  /** kits of each kind */
  kits: Record<KitId, number>;
  /** teachers to train (0 = no training) */
  teachers: number;
}

export interface KitQuoteLine {
  id: string;
  label: string;
  detail: string;
  amount: number;
}

export interface KitQuote {
  kitLines: KitQuoteLine[];
  kitCount: number;
  /** true when the order reaches the smallest school order, so the school price applies */
  schoolPrice: boolean;
  /** kits, GST included */
  kitsTotal: number;
  training: KitQuoteLine | null;
  /** teachers billed: the smallest group applies */
  billedTeachers: number;
  gstPercent: number;
  trainingGst: number;
  total: number;
  notes: string[];
}

export const MAX_KITS = 5000;
export const MAX_TEACHERS = 500;

const whole = (v: unknown, max: number) => {
  const n = Math.round(Number(v));
  return Number.isFinite(n) ? Math.min(max, Math.max(0, n)) : 0;
};

export function emptyQuote(): KitQuoteInput {
  return { kits: Object.fromEntries(kits.map((k) => [k.id, 0])) as Record<KitId, number>, teachers: 0 };
}

export function computeKitQuote(input: KitQuoteInput): KitQuote {
  const kitCount = kits.reduce((s, k) => s + (input.kits[k.id] || 0), 0);
  const schoolPrice = kitCount >= trainingRules.minimumKits;
  const kitLines = kits
    .filter((k) => (input.kits[k.id] || 0) > 0)
    .map((k) => {
      const qty = input.kits[k.id];
      const unit = schoolPrice ? k.schoolPrice : k.mrp;
      return { id: k.id, label: k.name, detail: `${qty} × ₹${unit.toLocaleString("en-IN")}${schoolPrice ? " school price" : " MRP"}, GST included`, amount: qty * unit };
    });
  const kitsTotal = kitLines.reduce((s, l) => s + l.amount, 0);
  const billedTeachers = input.teachers > 0 ? Math.max(input.teachers, teacherTraining.minimumTeachers) : 0;
  const trainingAmount = billedTeachers * teacherTraining.pricePerTeacher;
  const gstPercent = joveDayRules.gstPercent;
  const trainingGst = Math.round((trainingAmount * gstPercent) / 100);
  const training =
    billedTeachers > 0
      ? {
          id: "training",
          label: teacherTraining.name,
          detail: `${billedTeachers} teachers × ₹${teacherTraining.pricePerTeacher.toLocaleString("en-IN")}, ${teacherTraining.hours} hours on campus`,
          amount: trainingAmount,
        }
      : null;
  const notes: string[] = [];
  if (kitCount > 0 && !schoolPrice) notes.push(`School prices start at ${trainingRules.minimumKits} kits. Below that, kits are at MRP.`);
  if (input.teachers > 0 && input.teachers < teacherTraining.minimumTeachers) notes.push(`A training is for ${teacherTraining.minimumTeachers} teachers or more, so ${teacherTraining.minimumTeachers} are billed.`);
  if (training) notes.push("The training includes lesson plans, a certificate for every teacher, and a short film of the day by FrameMind AI Studio.");
  return { kitLines, kitCount, schoolPrice, kitsTotal, training, billedTeachers, gstPercent, trainingGst, total: kitsTotal + trainingAmount + trainingGst, notes };
}

/** The quote as sent with an enquiry: only known kits and sensible numbers survive. */
export interface LeadKitQuote extends KitQuoteInput {
  /** the total the visitor saw, for reference only */
  total: number;
}

export function cleanKitQuote(v: unknown): LeadKitQuote | undefined {
  if (!v || typeof v !== "object" || Array.isArray(v)) return undefined;
  const e = v as Record<string, unknown>;
  const raw = e.kits && typeof e.kits === "object" ? (e.kits as Record<string, unknown>) : {};
  const k = Object.fromEntries(kits.map((x) => [x.id, whole(raw[x.id], MAX_KITS)])) as Record<KitId, number>;
  const teachers = whole(e.teachers, MAX_TEACHERS);
  if (!teachers && !Object.values(k).some((n) => n > 0)) return undefined;
  return { kits: k, teachers, total: whole(e.total, 100_000_000) };
}

/** A plain-text summary, for WhatsApp and for HQ. */
export function kitQuoteText(q: KitQuote) {
  const inr = (n: number) => `₹${Math.round(n).toLocaleString("en-IN")}`;
  const lines = [...q.kitLines.map((l) => `${l.label}: ${l.detail} = ${inr(l.amount)}`)];
  if (q.training) lines.push(`${q.training.label}: ${q.training.detail} = ${inr(q.training.amount)} + ${q.gstPercent}% GST ${inr(q.trainingGst)}`);
  lines.push(`Estimated total: ${inr(q.total)}`);
  return lines.join("\n");
}
