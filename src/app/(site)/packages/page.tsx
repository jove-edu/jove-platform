import type { Metadata } from "next";
import Image from "next/image";
import { joveDayRules, kits, teacherTraining, trainingFilm, trainingRules } from "@/lib/content/business";
import { whatsappLink } from "@/lib/site";
import { formatINR, pad2 } from "@/lib/utils";
import { Button } from "@/components/ui/Button";
import { CornerMarks, GridBackdrop } from "@/components/brand/Blueprint";
import { PageHero } from "@/components/site/PageHero";
import { CTASection } from "@/components/site/CTASection";
import { Reveal } from "@/components/site/Reveal";
import { SectionHeading } from "@/components/site/programs/SectionHeading";
import { KitQuoteEstimator } from "@/components/site/programs/KitQuoteEstimator";
import { OfferCards, PackagesFaq, PaymentTerms, QUOTE_ID } from "@/components/site/programs/PackageExtras";

const lowestKit = Math.min(...kits.map((k) => k.schoolPrice));

export const metadata: Metadata = {
  title: "Pricing — Robotics & AI Kits and Teacher Training for Schools",
  description: `JOVE kits for schools from ${formatINR(lowestKit)} per kit (GST included) and teacher training at ${teacherTraining.price}. Build an itemised estimate for your school in a minute.`,
  alternates: { canonical: "/packages" },
  openGraph: {
    title: "JOVE Pricing — Kits + Teacher Training",
    description: "Class sets of Robotics & AI kits at the school price, and hands-on training that certifies your teachers. Itemised estimate in a minute.",
    images: [{ url: "/images/studio/trainer-class.webp", alt: "Illustration of a JOVE trainer with a class" }],
  },
};

export default function PackagesPage() {
  const whatsappBase = whatsappLink("");

  return (
    <>
      <PageHero
        eyebrow="Kits, training & pricing"
        index="01"
        title={["Kits for every team.", "Teachers who", "can teach them."]}
        intro={
          <>
            Buy JOVE kits in class sets at the school price, and we train your own teachers to teach with them. Kit prices include GST; training is {teacherTraining.price} plus GST, {teacherTraining.hours} hours on your campus.
          </>
        }
        aside={
          <figure className="relative overflow-hidden rounded-[var(--radius-lg)] bg-graphite text-paper shadow-[var(--shadow-lift)]">
            <div className="relative aspect-[16/9]">
              <Image src="/images/studio/trainer-class.webp" alt="Black-and-white illustration of a trainer showing a robotics build to a class" fill sizes="(max-width: 1024px) 100vw, 40vw" quality={75} preload className="object-cover" />
              <div aria-hidden className="absolute inset-0 bg-linear-to-t from-graphite via-graphite/30 to-transparent" />
              <span className="annot absolute right-3 top-3 rounded-[var(--radius-sm)] bg-graphite/70 px-2 py-1 text-[9px] text-paper/80 backdrop-blur-sm">Illustrative image</span>
            </div>
            <CornerMarks className="m-3 text-paper/40" />
            <figcaption className="relative -mt-10 px-5 pb-5">
              <p className="annot text-paper/60">Included with Kits + Teacher Training</p>
              <p className="mt-1 text-xl font-bold tracking-tight">{trainingFilm.name}</p>
              <ul className="mt-3 space-y-1.5 text-xs text-paper/75">
                {trainingFilm.items.map((m, i) => (
                  <li key={m.title} className="flex gap-2">
                    <span className="font-mono text-paper/40">{pad2(i + 1)}</span>
                    {m.title}
                  </li>
                ))}
              </ul>
            </figcaption>
          </figure>
        }
      >
        <div className="flex flex-wrap gap-3">
          <Button href={`#${QUOTE_ID}`} size="lg" arrow>
            Build your estimate
          </Button>
          <Button href="/programs" variant="secondary" size="lg">
            See the kits by grade
          </Button>
        </div>
      </PageHero>

      {/* Offers */}
      <section aria-labelledby="offers-title" className="relative overflow-hidden border-t border-graphite/10 bg-paper-200/50 py-24 sm:py-28">
        <div aria-hidden className="bp-grid absolute inset-0 opacity-50" />
        <div className="container-bp relative">
          <SectionHeading
            index="02"
            eyebrow="What you can buy"
            id="offers-title"
            title={["Kits, training,", "or both."]}
            intro={`Most schools take kits and training together. School prices start at ${trainingRules.minimumKits} kits; a training is for ${teacherTraining.minimumTeachers} teachers or more.`}
          />
          <div className="mt-14">
            <OfferCards />
          </div>
        </div>
      </section>

      {/* Estimator */}
      <section id={QUOTE_ID} aria-labelledby="estimate-title" className="relative scroll-mt-20 overflow-clip py-24 sm:py-28">
        <GridBackdrop />
        <div className="container-bp relative">
          <SectionHeading
            index="03"
            eyebrow="Estimate"
            id="estimate-title"
            title={["Your estimate,", "itemised in a minute."]}
            intro="Choose kits by kind and how many teachers to train. Every line updates as you go, GST included, and you can send it to us as a quote request."
          />
          <div className="mt-14">
            <KitQuoteEstimator whatsappBase={whatsappBase} />
          </div>
        </div>
      </section>

      {/* Payment terms */}
      <section aria-labelledby="terms-title" className="relative overflow-hidden border-t border-graphite/10 py-24 sm:py-28">
        <GridBackdrop />
        <div className="container-bp relative">
          <SectionHeading
            index="04"
            eyebrow="Payment terms"
            id="terms-title"
            title={["Simple terms.", "No surprises."]}
            intro={`${joveDayRules.advancePercent}% to confirm the order, the balance within ${joveDayRules.balanceDueDays} days of the training, GST shown on every invoice.`}
          />
          <div className="mt-14">
            <PaymentTerms />
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section aria-labelledby="faq-title" className="relative overflow-hidden border-t border-graphite/10 bg-paper-200/50 py-24 sm:py-28">
        <div aria-hidden className="bp-grid absolute inset-0 opacity-50" />
        <div className="container-bp relative grid gap-12 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <SectionHeading index="05" eyebrow="FAQ" id="faq-title" title={["Questions", "schools ask."]} className="lg:block" />
            <Reveal delay={0.1}>
              <p className="mt-5 max-w-sm text-sm leading-relaxed text-charcoal">Something not covered here? Send your estimate with a note, or ask us directly. A founder replies.</p>
              <div className="mt-6">
                <Button href="/contact" variant="secondary" arrow>
                  Ask a question
                </Button>
              </div>
            </Reveal>
          </div>
          <div className="lg:col-span-8">
            <PackagesFaq />
          </div>
        </div>
      </section>

      <CTASection
        eyebrow="Ready when you are"
        title={["Kits in your classes.", "Teachers ready to teach."]}
        body="Send us your estimate, or just the grades and how many teachers. We'll come back with a written quote and a training date."
        primary={{ label: "Get a quote", href: "/contact" }}
        secondary={{ label: "See the kits by grade", href: "/programs" }}
      />
    </>
  );
}
