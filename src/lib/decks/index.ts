import { aiDeck } from "./ai";
import { littleDeck } from "./little";
import { roboDeck } from "./robo";
import { schoolDeck } from "./school";
import { trainerDeck } from "./trainer";
import { youngDeck } from "./young";
import type { Deck, DeckGroup } from "./types";

export const DECKS: Deck[] = [schoolDeck, littleDeck, youngDeck, roboDeck, aiDeck, trainerDeck];
export const deckById = (id: string) => DECKS.find((d) => d.id === id);

export const GROUP_LABEL: Record<DeckGroup, { title: string; blurb: string }> = {
  school: { title: "For school meetings", blurb: "Present to a principal or the management. Type the school's name and it goes on the cover." },
  classroom: { title: "Lessons for the classroom", blurb: "One presentation per grade group for teachers to run in class: the lesson as a story, with the build as a step-by-step tutorial (every wire drawn, every step checked). What to say is in the speaker notes. " },
  trainer: { title: "For trainers", blurb: "Training new JOVE trainers before they lead a teacher training." },
};
