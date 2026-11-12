import type { Metadata } from "next";
import { site } from "@/lib/site";
import { getPublishedTestimonials } from "@/lib/public-data";
import { Hero } from "@/components/site/home/Hero";
import { Marquee } from "@/components/site/home/Marquee";
import { Manifesto } from "@/components/site/home/Manifesto";
import { HowItWorks } from "@/components/site/home/HowItWorks";
import { Programs } from "@/components/site/home/Programs";
import { MediaPack } from "@/components/site/home/MediaPack";
import { LabsTeaser } from "@/components/site/home/LabsTeaser";
import { PackagesTeaser } from "@/components/site/home/PackagesTeaser";
import { KitsTeaser } from "@/components/site/home/KitsTeaser";
import { Founders } from "@/components/site/home/Founders";
import { Testimonials } from "@/components/site/home/Testimonials";
import { Faq } from "@/components/site/home/Faq";
import { Booking } from "@/components/site/home/Booking";

export const revalidate = 86400;

const title = `${site.name} — Robotics & AI Kits and Teacher Training for Schools`;
const description =
  "Robotics & AI kits in class sets for Grades 1–10, and hands-on training that certifies your teachers to teach with them: lesson plans for every project, a free 3D practice bench and a film of the training day.";

export const metadata: Metadata = {
  title: { absolute: title },
  description,
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    url: "/",
    siteName: site.name,
    title,
    description,
    locale: "en_IN",
    images: [{ url: "/brand/og-image.jpg?v=2", alt: "JOVE — Building real-world skills through Robotics & AI" }],
  },
  twitter: { card: "summary_large_image", title, description, images: ["/brand/og-image.jpg?v=2"] },
};

export default async function HomePage() {
  const testimonials = await getPublishedTestimonials();

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "EducationalOrganization",
    name: site.name,
    alternateName: site.expansion,
    url: site.url,
    logo: new URL("/brand/icon-512.png", site.url).toString(),
    description: site.description,
    slogan: site.tagline,
    areaServed: "IN",
    founder: site.founders.map((f) => ({ "@type": "Person", name: f.name, jobTitle: f.role })),
    ...(site.contact.email ? { email: site.contact.email } : {}),
    ...(site.contact.phone ? { telephone: site.contact.phone } : {}),
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }} />
      <Hero />
      <Marquee />
      <Manifesto />
      <HowItWorks />
      <Programs />
      <MediaPack />
      <LabsTeaser />
      <PackagesTeaser />
      <KitsTeaser />
      <Founders />
      <Testimonials items={testimonials} />
      <Faq />
      <Booking />
    </>
  );
}
