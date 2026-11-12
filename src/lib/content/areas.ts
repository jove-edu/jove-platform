/**
 * Where JOVE supplies kits and trains teachers: the districts around the base in Bagalkot, one page each (/areas/<slug>).
 *
 * The library's rule (OPERATIONS/21_MARKETING/03): a town page only for a real service area, with its own words,
 * never a template with the name swapped. So every district below is written for itself, and nothing on these pages
 * claims schools, numbers or results that do not exist yet. Distances are described, not measured: the written
 * quote carries the delivery and travel plan for each school.
 */

export const BASE = { town: "Bagalkot", state: "Karnataka" };

export type Reach = "home" | "day" | "early";

export const REACH: Record<Reach, { label: string; line: string }> = {
  home: { label: "Home district", line: "Our base. We deliver the kits ourselves and drive over on the morning of the training." },
  day: { label: "Day trip", line: "A day trip from Bagalkot. The trainer sets off early and is on campus before the training starts." },
  early: { label: "Early start or the evening before", line: "For the nearer towns the trainer leaves at dawn; for the farther ones it travels the evening before." },
};

export interface Area {
  slug: string;
  /** "Vijayapura" */
  name: string;
  /** "Vijayapura district" */
  title: string;
  /** the search-result description, written for this district (under 160 characters) */
  description: string;
  reach: Reach;
  /** towns and taluk headquarters the team goes to */
  towns: string[];
  /** the opening paragraph, written for this district */
  intro: string;
  /** a second paragraph: how delivery and the teacher training work from here */
  plan: string;
  faqs: { q: string; a: string }[];
}

export const AREAS: Area[] = [
  {
    slug: "bagalkot",
    name: "Bagalkot",
    title: "Bagalkot district",
    description: "Robotics & AI kits and teacher training for schools across Bagalkot district, Grades 1 to 10. JOVE is based in Bagalkot.",
    reach: "home",
    towns: ["Bagalkot", "Navanagar", "Jamkhandi", "Mudhol", "Rabkavi-Banahatti", "Badami", "Guledgudda", "Ilkal", "Hungund", "Bilagi"],
    intro:
      "JOVE is based in Bagalkot, so schools in the district are the closest we work with. We supply Robotics & AI kits in class sets for Grades 1 to 10 and train your own teachers, on your campus, to teach with them.",
    plan:
      "Because there is no long drive, we deliver the kits ourselves and can run the teacher training on the day that suits your timetable best. Planning meetings can happen on your campus, in person, with a kit on the table.",
    faqs: [
      { q: "Can we see a kit at our school before we decide?", a: "Yes. We are based in Bagalkot, so a founder can visit with a kit, show how a lesson runs and answer the principal's questions in person." },
      { q: "Is delivery or travel charged for schools in Bagalkot district?", a: "Delivery and the trainer's travel are worked out for each school and written into your quote, so the full amount is clear before you confirm." },
      { q: "Do you work with CBSE, ICSE and State Board schools?", a: "Yes. The kits and lesson plans go by grade group, not by board, so they work for CBSE, ICSE and Karnataka State Board schools alike." },
    ],
  },
  {
    slug: "vijayapura",
    name: "Vijayapura",
    title: "Vijayapura district",
    description: "Robotics & AI kits and teacher training for schools in Vijayapura district, a day trip from our Bagalkot base. Grades 1 to 10.",
    reach: "day",
    towns: ["Vijayapura", "Basavana Bagewadi", "Muddebihal", "Talikota", "Sindagi", "Indi"],
    intro:
      "Schools in Vijayapura district are a day trip from our base in Bagalkot. We send the kits your classes need, then come to your campus to train your teachers: every project built by hand, the lesson plans walked through, and a certificate for each teacher.",
    plan:
      "The kits reach you before the training, so your teachers train on the same boxes they will use in class. The trainer leaves Bagalkot early on the day; we agree the start time with your coordinator in advance.",
    faqs: [
      { q: "Does a school in Vijayapura get the full training, or a shorter one?", a: "The full training. The trainer reaches your campus before it starts, so it is the same as for a school next door to us." },
      { q: "How are delivery and travel to Vijayapura district handled?", a: "Both are part of your written quote, so the total is clear before you confirm." },
      { q: "What do we need to arrange at our end?", a: "A room with tables and a few power points, a projector or screen, and the teachers free for the training. We bring the kits, tools and lesson plans." },
    ],
  },
  {
    slug: "gadag",
    name: "Gadag",
    title: "Gadag district",
    description: "Robotics & AI kits and teacher training for schools in Gadag, Ron, Gajendragad and across Gadag district, Grades 1 to 10.",
    reach: "day",
    towns: ["Gadag-Betageri", "Ron", "Naragund", "Gajendragad", "Mundargi", "Shirahatti", "Lakshmeshwar"],
    intro:
      "Gadag district is a day trip from Bagalkot, and the towns on the Ron and Gajendragad side are among the nearest. Our kits cover every grade from 1 to 10, from a glowing cardboard robot in Grades 1 and 2 to an AI that sees in Grades 9 and 10, and we train your teachers to teach each one.",
    plan:
      "We plan with your coordinator which kits each grade needs and how many teachers to train. The kits are delivered first; the trainer then sets off early on the training day with the tools, spares and the film crew.",
    faqs: [
      { q: "Which grades are the kits for?", a: "Grades 1 to 10, in four age groups. Each group has its own kit, project and lesson plans." },
      { q: "How are delivery and travel to Gadag district handled?", a: "They are included in your written quote, worked out for your town, so there are no surprises later." },
      { q: "Will our teachers be filmed?", a: "Only with the school's permission and the consent of the teachers shown. Anyone can ask to be left out, and the school receives the film and photos." },
    ],
  },
  {
    slug: "koppal",
    name: "Koppal",
    title: "Koppal district",
    description: "Robotics & AI kits and teacher training for schools in Koppal, Kushtagi, Gangavathi and across Koppal district, Grades 1 to 10.",
    reach: "day",
    towns: ["Koppal", "Kushtagi", "Yelburga", "Kukanoor", "Gangavathi", "Karatagi", "Kanakagiri"],
    intro:
      "Koppal district borders Bagalkot, and towns like Kushtagi are a short drive from Ilkal. Schools here get the same as any other: kits in class sets at the school price, and hands-on training that certifies your teachers to teach with them.",
    plan:
      "For towns on the far side of the district, such as Gangavathi, the trainer allows extra time and agrees an early start with your coordinator. The kit list and the teachers' names are settled before the day.",
    faqs: [
      { q: "Do you come to schools in Gangavathi and Karatagi as well?", a: "Yes. The farther towns need an earlier start, which we plan with your coordinator; the training itself is the same." },
      { q: "How are delivery and travel to Koppal district handled?", a: "They are written into your quote before you confirm, so the full amount is known up front." },
      { q: "How many teachers can be trained at once?", a: "A training is for a group of teachers from your school; the smallest group and the price per teacher are on our pricing page. Larger groups can be split into two sessions." },
    ],
  },
  {
    slug: "dharwad",
    name: "Hubballi-Dharwad",
    title: "Dharwad district (Hubballi-Dharwad)",
    description: "Robotics & AI kits and teacher training for schools in Hubballi, Dharwad and nearby towns, Grades 1 to 10. We plan delivery and travel from Bagalkot.",
    reach: "early",
    towns: ["Hubballi", "Dharwad", "Navalgund", "Annigeri", "Kundgol", "Kalghatgi", "Alnavar"],
    intro:
      "Schools in Hubballi, Dharwad and the towns around them can order JOVE kits and training too. It is a longer drive from Bagalkot, so we plan the delivery and the trainer's travel with care; the training on your campus is exactly the same.",
    plan:
      "Depending on your town, the trainer either leaves at dawn or travels the evening before, so the training starts on time. Your quote shows the delivery, the travel plan and their cost.",
    faqs: [
      { q: "Is Hubballi-Dharwad too far for the full training?", a: "No. The trainer either starts at dawn or arrives the evening before, so your teachers get the full training." },
      { q: "How is the travel cost worked out?", a: "It depends on your town and whether the trainer needs to stay the night before. It is shown in your written quote before you confirm." },
      { q: "Can several schools in the twin cities train on back-to-back days?", a: "Yes, and it makes the travel go further. Tell us when you enquire and we will plan the dates together." },
    ],
  },
  {
    slug: "belagavi",
    name: "Belagavi",
    title: "Belagavi district",
    description: "Robotics & AI kits and teacher training for schools in Belagavi district, from Ramdurg and Gokak to Belagavi city and Chikkodi, Grades 1 to 10.",
    reach: "early",
    towns: ["Ramdurg", "Saundatti", "Gokak", "Mudalagi", "Bailhongal", "Athani", "Belagavi", "Chikkodi"],
    intro:
      "Belagavi is a large district, and how we reach you depends on where your school is. Towns on our side, such as Ramdurg, Saundatti and Mudalagi, are close to Bagalkot district; Belagavi city, Athani and Chikkodi are farther. Wherever you are, the kits and the teacher training are the same.",
    plan:
      "For the nearer towns the trainer sets off early on the day. For Belagavi city and the north-western taluks it usually travels the evening before. We confirm the delivery, the start time and the teachers' list with your coordinator in advance.",
    faqs: [
      { q: "We are in Belagavi city. Will the training be shorter because of the travel?", a: "No. For the farther towns the trainer arrives the evening before, so the training starts on time." },
      { q: "How are delivery and travel to Belagavi district handled?", a: "They are worked out for your town and written into your quote before you confirm." },
      { q: "Can we buy only the training, for kits we already have?", a: "Yes. Schools with an Atal Tinkering Lab or their own kits can book the teacher training on its own." },
    ],
  },
];

export const areaBySlug = (slug: string) => AREAS.find((a) => a.slug === slug);
