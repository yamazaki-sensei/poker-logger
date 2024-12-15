export type Position =
  | "UTG"
  | "UTG+1"
  | "UTG+2"
  | "UTG+3"
  | "LJ"
  | "HJ"
  | "CO"
  | "BTN"
  | "SB"
  | "BB";

export const cardNumbers = [
  "2",
  "3",
  "4",
  "5",
  "6",
  "7",
  "8",
  "9",
  "T",
  "J",
  "Q",
  "K",
  "A",
] as const;
export type CardNumber = (typeof cardNumbers)[number];

export const cardSuits = ["s", "h", "d", "c"] as const;
export type CardSuit = (typeof cardSuits)[number];

export type Card = {
  number: CardNumber;
  suit: CardSuit;
};
