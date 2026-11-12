import type { Metadata } from "next";
import { joveDayRules, teacherTraining, trainingFilm, trainingRules } from "@/lib/content/business";
import { FREE_SHIPPING_ABOVE, SHIPPING_FLAT } from "@/lib/shop";
import { site } from "@/lib/site";
import { formatINR } from "@/lib/utils";
import { LegalLayout, type LegalSection } from "@/components/site/legal/LegalLayout";
import { A, DataTable, H3, Note, OL, P, ReachUs, UL } from "@/components/site/legal/prose";

export const metadata: Metadata = {
  title: "Terms of Service",
  description:
    "The terms that apply to using the JOVE website, ordering kits and teacher training for a school, buying robotics kits and using our free Virtual Labs: orders, payments, media rights, liability and governing law (India).",
  alternates: { canonical: "/terms" },
};

const smallestTraining = teacherTraining.pricePerTeacher * teacherTraining.minimumTeachers;
const advance = (smallestTraining * joveDayRules.advancePercent) / 100;

const sections: LegalSection[] = [
  {
    id: "about",
    title: "About these terms",
    body: (
      <>
        <P>
          These terms are between you and <strong>{site.legalName}</strong> (“JOVE”, “we”, “us”), based in {site.location}. They apply when you use this website, order kits or teacher training for a school, attend a JOVE training, order from our online
          store or use our Virtual Labs.
        </P>
        <P>
          By using our website or placing a booking or order, you agree to these terms and to our <A href="/privacy">Privacy Policy</A>, <A href="/refund-policy">Refund &amp; Cancellation Policy</A> and{" "}
          <A href="/shipping-policy">Shipping Policy</A>, which form part of them. If you do not agree, please do not use our services.
        </P>
        <P>
          If you accept a quote or place an order for a school, you confirm that you are authorised to do so on the school’s behalf. If a quote, proposal or written agreement with a school says something different from
          these terms, that document applies for that order.
        </P>
      </>
    ),
  },
  {
    id: "services",
    title: "Our services",
    body: (
      <>
        <UL
          items={[
            <span key="1">
              <strong>Kits for schools:</strong> Robotics, AI &amp; Machine Learning kits for Grades 1 to 10 in class sets, with lesson plans, at the school price shown on our{" "}
              <A href="/packages">pricing</A> page.
            </span>,
            <span key="2">
              <strong>{teacherTraining.name}:</strong> hands-on training on the school’s campus that prepares its teachers to teach with our kits, with a certificate for every teacher who completes it. With Kits + Teacher
              Training, {site.studio.name} films the training for the school.
            </span>,
            <span key="3">
              <strong>Virtual Labs:</strong> a free, browser-based 3D bench where learners wire and run builds made with the same parts as our kits.
            </span>,
            <span key="4">
              <strong>Online store:</strong> robotics and AI kits sold to parents, students, schools and clubs.
            </span>,
          ]}
        />
        <P>
          Descriptions on this website are summaries. For a school, the written quote and order confirmation we send you set out the exact kits, training date, scope and price.
        </P>
      </>
    ),
  },
  {
    id: "bookings",
    title: "School orders and teacher training",
    body: (
      <>
        <P>A school order goes in four steps: enquiry, call and campus visit or online demo, written quote, and a confirmed order once the advance is received. A training date is not reserved until we confirm it in writing.</P>
        <DataTable
          caption="Standard terms for school orders"
          head={["Term", "Standard position"]}
          rows={[
            ["School price", `From ${trainingRules.minimumKits} kits in one order`],
            ["Teacher training", `${teacherTraining.hours} hours, from ${teacherTraining.minimumTeachers} teachers`],
            ["Advance to confirm the order", `${joveDayRules.advancePercent}% of the quote value`],
            ["Balance", `Within ${joveDayRules.balanceDueDays} days of the training (or of delivery, for kits only)`],
          ]}
        />
        <H3>What the school provides</H3>
        <P>
          For the training: a room with tables, power points, a projector or screen, the teachers free for the training hours, and permission to film. Someone at the school to receive the kits and check the count on
          delivery.
        </P>
        <H3>What JOVE provides</H3>
        <P>
          The kits ordered, with a printed guide in each; lesson plans for every project; a JOVE trainer, tools and spares for the training; a certificate for every teacher who completes it; and, with Kits + Teacher
          Training, the training film. We will make reasonable efforts to deliver and train on the dates in your quote, and will tell you promptly if anything changes.
        </P>
      </>
    ),
  },
  {
    id: "pricing",
    title: "Pricing, GST & payments",
    body: (
      <>
        <P>
          Kits are quoted in Indian rupees (₹) per kit, GST included. Teacher training is quoted per teacher, before GST; GST is charged as applicable (currently {joveDayRules.gstPercent}% on our training services) and
          is shown separately on every invoice. Please give us your school’s GSTIN, legal name and billing address before we issue an invoice.
        </P>
        <P>
          To confirm an order, we ask for an advance of {joveDayRules.advancePercent}% of the quote value. For the smallest training ({teacherTraining.minimumTeachers} teachers, {formatINR(smallestTraining)} before GST)
          that is {formatINR(advance)} plus GST. The balance is due within {joveDayRules.balanceDueDays} days of the training. Payment details (bank transfer or UPI) are printed on the invoice.
        </P>
        <P>
          Kit prices on the store are shown in rupees at checkout. Shipping is {formatINR(SHIPPING_FLAT)} on orders below {formatINR(FREE_SHIPPING_ABOVE)} and free on orders of {formatINR(FREE_SHIPPING_ABOVE)} or
          more (see our <A href="/shipping-policy">Shipping Policy</A>). Payment is taken through the payment provider we link to; we never see or store your card or UPI credentials.
        </P>
        <P>
          Prices can change from time to time. A price you have accepted in a written quote, or paid for at checkout, will not change for that order.
        </P>
      </>
    ),
  },
  {
    id: "cancellations",
    title: "Cancellations, rescheduling & refunds",
    body: (
      <>
        <P>Our <A href="/refund-policy">Refund &amp; Cancellation Policy</A> sets out the rules in full. In short:</P>
        <UL
          items={[
            "Training dates can be rescheduled free of charge up to 7 days before the date.",
            "If you cancel a training within 7 days, 25% of its advance is retained. Within 48 hours, it is non-refundable, except in a force majeure event.",
            "A school kit order cancelled before dispatch has its kit advance refunded in full.",
            "Kits: a 7-day replacement for items that are defective or damaged on arrival, and returns of unopened kits within 7 days (less shipping).",
          ]}
        />
      </>
    ),
  },
  {
    id: "safety",
    title: "Safety & school responsibilities",
    body: (
      <>
        <P>Safety comes first, in the training and in class. To keep it that way:</P>
        <UL
          items={[
            "Our trainers are background-verified and trained on our safety SOP and child-protection policy, and work under a founder’s supervision. Our kits are low-voltage and age-graded.",
            "When the kits are used in class, the school and its teachers are responsible for supervising students, following the safety notes in the lesson plans and the kit guides.",
            "The school ensures the training room is safe and accessible, and tells us in advance about anything we should know.",
            "The school confirms that the teachers agree to being filmed (see the Privacy Policy and the media section below) before the training.",
            "We may pause an activity, or leave out a specific item or activity, if we believe it is unsafe.",
          ]}
        />
      </>
    ),
  },
  {
    id: "media",
    title: "Photos, video & media rights",
    body: (
      <>
        <P>
          {site.studio.name} films the teacher training for Kits + Teacher Training orders. Media is produced and used on the following basis:
        </P>
        <UL
          items={[
            "Delivered media (the film and photographs) is licensed to the school for its own marketing and admissions use, at no extra charge.",
            "JOVE may use the media in its portfolio, with the consent of the teachers shown. Any teacher can ask to be left out of the film or blurred.",
            "Students are not part of the training. If students appear in any footage, they are filmed in an identifiable way only where a parent or guardian has consented through the school.",
            "Neither the school nor JOVE may use the media in a way that is misleading, defamatory or unlawful, or that presents it as an endorsement by someone who has not given one.",
          ]}
        />
        <Note title="In the quote">
          <p>
            The deliverables of the {trainingFilm.name.charAt(0).toLowerCase() + trainingFilm.name.slice(1)} are listed in your quote. The film is included with Kits + Teacher Training and has no separate cash value or refund.
          </p>
        </Note>
      </>
    ),
  },
  {
    id: "ip",
    title: "Intellectual property",
    body: (
      <>
        <P>
          The website, its text, graphics, brand, logo and design, our curriculum and workbooks, the Virtual Labs and the design of our kits belong to JOVE or its licensors. You may view and use them for personal,
          educational and non-commercial purposes. You may not copy, scrape, resell, republish or build on them for commercial use, or use the JOVE name or logo, without our written permission.
        </P>
        <P>
          A school may use the lesson plans, teacher guides and printed materials we provide for that school’s own teaching. Projects and models built by students belong to the students. We may show them (without
          identifying details unless consent is on record) to illustrate our work.
        </P>
      </>
    ),
  },
  {
    id: "labs",
    title: "Virtual Labs",
    body: (
      <>
        <P>
          Our Virtual Labs are free and need no account. They are provided for learning and are offered “as is”. Your progress is stored in your own browser, so clearing site data resets it.
        </P>
        <P>
          The certificate you can print at the end of a lab is a self-service record of completion. It is not a verified credential and is not recognised by any board or authority. Only certificates issued by JOVE
          after a training or workshop can be verified on our <A href="/verify">certificate checker</A>.
        </P>
      </>
    ),
  },
  {
    id: "store",
    title: "Online store",
    body: (
      <>
        <P>
          When you place an order, we confirm it by sending you an order number. A contract for the sale is formed when we confirm your order and receive your payment. Products are subject to availability. If an item
          is out of stock or a price was shown wrongly, we will tell you and either correct the order with your agreement or refund you in full.
        </P>
        <P>
          Each kit lists the grades it is designed for. Younger children should use kits with an adult’s supervision, and small parts are not suitable for very young children. Please read the guide in the box before
          you start.
        </P>
        <P>
          Delivery is covered by our <A href="/shipping-policy">Shipping Policy</A>, and returns and replacements by our <A href="/refund-policy">Refund &amp; Cancellation Policy</A>. Nothing in those policies affects
          your rights under the Consumer Protection Act, 2019.
        </P>
      </>
    ),
  },
  {
    id: "use",
    title: "Using the website",
    body: (
      <>
        <P>Please use the website lawfully and considerately. You agree not to:</P>
        <UL
          items={[
            "submit false or someone else’s personal details in a form, or use the forms to send spam or advertising;",
            "try to access the internal portal, other people’s data or our systems without authority, or probe or disrupt them;",
            "scrape the website at scale, or use automated tools that place a burden on it;",
            "upload or send anything harmful, unlawful or infringing.",
          ]}
        />
        <P>We may restrict access to the website for anyone who breaks these rules.</P>
      </>
    ),
  },
  {
    id: "liability",
    title: "Disclaimers & limits of liability",
    body: (
      <>
        <P>
          We take care to run a safe, well-organised and educational training, but we cannot promise particular learning outcomes, exam results or admissions results. Information on this website is for general guidance
          and is provided “as is”.
        </P>
        <P>
          To the extent the law allows, JOVE is not liable for indirect or consequential loss, or for loss of profit, reputation or opportunity. Our total liability to you for any claim connected with a training or
          order is limited to the amount you paid us for that training or order.
        </P>
        <P>
          Nothing in these terms limits liability that cannot be limited under applicable law, including liability for fraud, wilful misconduct or, where the law applies, death or personal injury caused by negligence,
          or your rights as a consumer.
        </P>
      </>
    ),
  },
  {
    id: "force-majeure",
    title: "Events beyond our control",
    body: (
      <P>
        Neither party is responsible for delay or failure caused by events beyond its reasonable control, for example natural disasters, floods, extreme weather, epidemics, government or school-closure orders, strikes,
        major transport or power disruption, or an emergency affecting the venue. If this stops a training from going ahead, we will work with you in good faith to reschedule it or, if you prefer, refund the advance, as
        set out in our <A href="/refund-policy">Refund &amp; Cancellation Policy</A>.
      </P>
    ),
  },
  {
    id: "changes",
    title: "Changes to these terms",
    body: (
      <P>
        We may update these terms from time to time. The “Last updated” date at the top shows the current version. A booking or order is governed by the terms in force on the date you confirmed it. Continuing to use
        the website after a change means you accept the updated terms.
      </P>
    ),
  },
  {
    id: "law",
    title: "Governing law & disputes",
    body: (
      <>
        <P>
          These terms are governed by the laws of India. If a problem comes up, please first <A href="/contact">talk to us</A>. Most issues are solved by a conversation between a founder and the school, and we will
          always try to find a fair answer. If we cannot resolve it informally, the courts at the place of JOVE’s registered office have jurisdiction, subject to any rights you have as a consumer to approach the forum
          the law allows.
        </P>
      </>
    ),
  },
  {
    id: "contact",
    title: "Contact",
    body: (
      <>
        <P>Questions about these terms? Reach us in any of these ways.</P>
        <OL items={["Tell us what you need, and which booking or order it concerns, if any.", "We reply within one working day and, if it needs a decision, a founder will call you."]} />
        <ReachUs subject="Terms" />
      </>
    ),
  },
];

export default function TermsPage() {
  return (
    <LegalLayout
      index="LEGAL 02"
      eyebrow="Terms of Service"
      title={["The ground rules,", "in plain English."]}
      intro="These terms cover using our website, ordering kits and teacher training for a school, buying a kit and learning with our Virtual Labs. We have kept them as short and clear as we can while still being precise."
      summary={[
        `A school pays ${joveDayRules.advancePercent}% in advance to confirm an order and the balance within ${joveDayRules.balanceDueDays} days of the training. Kit prices include GST; training GST is shown separately.`,
        "Our verified trainers lead the teacher training. In class, the school and its teachers supervise students.",
        "You may use the training film and photos for your school’s own marketing and admissions. We may show them in our portfolio, with the teachers’ consent.",
        "These terms are governed by Indian law, and our refund and shipping policies are part of them.",
      ]}
      sections={sections}
      current="/terms"
    />
  );
}
