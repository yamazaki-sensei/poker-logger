export type Position =
  | "UTG"
  | "UTG1"
  | "UTG2"
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

export type GameRound = "preFlop" | "flop" | "turn" | "river";

export type ActionType = "check" | "fold" | "call" | "raise";
export type Action =
  | {
      type: "checkOrCall";
      amount?: undefined;
    }
  | {
      type: "fold";
      amount?: undefined;
    }
  | {
      type: "raise";
      amount: number;
    };

export type ActionWithPlayer = {
  player: Position;
  action: Action;
};
