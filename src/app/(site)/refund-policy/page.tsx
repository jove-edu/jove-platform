import type { Metadata } from "next";
import { joveDayRules, teacherTraining } from "@/lib/content/business";
import { formatINR } from "@/lib/utils";
import { LegalLayout, type LegalSection } from "@/components/site/legal/LegalLayout";
import { RefundTimeline } from "@/components/site/legal/figures";
import { A, DataTable, H3, Note, OL, P, ReachUs, UL } from "@/components/site/legal/prose";

export const metadata: Metadata = {
  title: "Refund & Cancellation Policy",
  description:
    "How rescheduling, cancellations and refunds work for JOVE teacher training and school kit orders, and how kit returns and 7-day replacements work for online store orders.",
  alternates: { canonical: "/refund-policy" },
};

const smallestTraining = teacherTraining.pricePerTeacher * teacherTraining.minimumTeachers;
const advance = (smallestTraining * joveDayRules.advancePercent) / 100;
const kept = advance * 0.25;

const sections: LegalSection[] = [
  {
    id: "scope",
    title: "What this policy covers",
    body: (
      <>
        <P>
          This policy covers <strong>teacher training</strong> at your school, <strong>school kit orders</strong>, and <strong>kits</strong> bought from our online store. Our Virtual Labs are free, so there is nothing to
          refund. It sits alongside our <A href="/terms">Terms of Service</A> and <A href="/shipping-policy">Shipping Policy</A>.
        </P>
        <P>
          All timings are counted in calendar days from the date and time of your written notice to us (the “notice date”), back to the start of the teacher training. Notice means a message through our{" "}
          <A href="/contact">contact page</A>, or an email or WhatsApp to a founder.
        </P>
      </>
    ),
  },
  {
    id: "rescheduling",
    title: "Rescheduling a teacher training",
    body: (
      <>
        <P>
          Things change: exams get moved, holidays are declared, teachers are suddenly needed elsewhere. You can <strong>reschedule a booked teacher training free of charge if you tell us at least 7 days before the date.</strong> Your
          advance simply carries over to the new date, and we will offer you the nearest dates our team is free.
        </P>
        <P>
          If you ask to reschedule inside the 7-day window, we will try our best to find a new date, but we cannot promise it, because the trainer, film crew and travel are already arranged. If we cannot re-allot the date,
          the cancellation rules below apply.
        </P>
        <P>If <em>we</em> have to move or cancel a training for any reason on our side, we will offer a new date that suits you or, if you prefer, refund everything you have paid us for it in full.</P>
      </>
    ),
  },
  {
    id: "cancellations",
    title: "Cancelling a teacher training",
    body: (
      <>
        <P>If you decide to cancel rather than reschedule, this is how your advance is treated:</P>
        <DataTable
          caption="Refund of the training advance when a training is cancelled"
          head={["When you tell us", "What happens to the advance"]}
          rows={[
            ["More than 7 days before the training", "Refunded in full"],
            ["Between 7 days and 48 hours before", "Refunded minus 25% of the advance, which we retain for costs already committed"],
            ["Within 48 hours of the training", "Not refundable, except in a force majeure event (below)"],
          ]}
        />
        <Note title="Worked example">
          <p>
            On the smallest training ({teacherTraining.minimumTeachers} teachers, {formatINR(smallestTraining)} before GST), the {joveDayRules.advancePercent}% advance is {formatINR(advance)}. If you cancel five days before the date, we retain 25% of the
            advance ({formatINR(kept)}) and refund {formatINR(advance - kept)}. The same cancellation 10 days before refunds the full {formatINR(advance)}. Amounts are shown before GST. GST is adjusted as the applicable
            rules require.
          </p>
        </Note>
        <H3>Force majeure</H3>
        <P>
          If a training cannot go ahead because of an event beyond anyone’s reasonable control (for example floods, severe weather, an epidemic, a government or school-closure order, or an emergency at the venue), the
          48-hour rule does not apply. We will either move the training to a new date at no charge, or refund the advance in full, whichever you prefer.
        </P>
        <H3>Programmes booked before November 2026</H3>
        <P>
          JOVE Days and the Quarter, Year and Club programmes booked before we moved to kits and teacher training keep the terms in their signed proposal, which applies if it says something different.
        </P>
      </>
    ),
  },
  {
    id: "school-kits",
    title: "School kit orders",
    body: (
      <>
        <P>
          A school order is confirmed by its advance. <strong>If you cancel before we dispatch the kits, the kit advance is refunded in full.</strong> Once the kits are dispatched, a school order follows the
          terms in its written quote; damaged, defective or missing parts are always replaced, as for store orders below.
        </P>
        <H3>The training film</H3>
        <P>
          The film and photographs of the training are included with Kits + Teacher Training, so they have no separate price and are not refunded on their own. If anything is late or falls short of what your quote
          promises, tell us and we will fix it.
        </P>
      </>
    ),
  },
  {
    id: "kit-replacement",
    title: "Kits: damaged or defective on arrival",
    body: (
      <>
        <P>
          If a kit arrives <strong>damaged, defective or with parts missing</strong>, we will replace it, or send the missing part, at no cost to you.
        </P>
        <OL
          items={[
            "Tell us within 7 days of delivery, through the contact page or by replying to your order confirmation.",
            "Send your order number, photos of the parcel and the item, and, if you have one, a short video of you opening the parcel. This helps us claim from the courier.",
            "We confirm the problem, usually within 2 working days, and dispatch a replacement. If we cannot replace the item, we refund the price you paid for it, including shipping.",
          ]}
        />
      </>
    ),
  },
  {
    id: "kit-returns",
    title: "Kits: returns",
    body: (
      <>
        <P>
          Changed your mind? You can return a kit <strong>unopened and in its original condition within 7 days of delivery.</strong> We will refund the price of the kit less shipping charges (the delivery fee you paid,
          if any, and the cost of sending the kit back to us).
        </P>
        <UL
          items={[
            "Contact us first so we can give you a return address and confirm the return. Please do not post a kit back without telling us.",
            "Kits that have been opened, assembled, powered on or used cannot be returned unless they are defective (see above).",
            "Please pack the kit securely in its original box. We may decline a refund if it comes back damaged because of poor packing.",
            "School and bulk orders follow the terms in their quote.",
          ]}
        />
        <P>Nothing here limits your rights under the Consumer Protection Act, 2019.</P>
      </>
    ),
  },
  {
    id: "how-refunds-paid",
    title: "How and when refunds are paid",
    body: (
      <>
        <P>
          Approved refunds go back to the original payment method (or, for a bank transfer, to the account it came from) within 10 working days of approval. Your bank or payment provider may take a few more days to
          show it.
        </P>
        <P>For training and school-order refunds we issue a credit note against the invoice, with GST adjusted as the applicable rules require.</P>
      </>
    ),
  },
  {
    id: "contact",
    title: "How to ask for a change or refund",
    body: (
      <>
        <P>Write to us and include your school name and the training date, or your order number. A founder will reply within one working day.</P>
        <ReachUs subject="Refund" />
      </>
    ),
  },
];

export default function RefundPolicyPage() {
  return (
    <LegalLayout
      index="LEGAL 03"
      eyebrow="Refund & Cancellation"
      title={["Plans change.", "Here is how we handle it."]}
      intro="We would rather move a date than lose one. This policy explains rescheduling and cancelling a teacher training, cancelling a school kit order, and returns and replacements for kits from our store."
      summary={[
        "Reschedule a teacher training free of charge up to 7 days before the date.",
        "Cancel a training within 7 days and we keep 25% of its advance. Within 48 hours it is not refundable, unless a force majeure event stops the training.",
        "Cancel a school kit order before dispatch for a full refund of the kit advance.",
        "A damaged or defective kit is replaced if you tell us within 7 days of delivery.",
        "Unopened kits can be returned within 7 days, with shipping charges deducted from the refund.",
      ]}
      sections={sections}
      current="/refund-policy"
      figure={<RefundTimeline />}
    />
  );
}
