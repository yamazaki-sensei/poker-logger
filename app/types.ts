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
export type ActionAmount = "S" | "M" | "L" | "LL" | "AI";
export const amountStringMap: Record<ActionAmount, string> = {
  S: "小",
  M: "中",
  L: "大",
  LL: "超大",
  AI: "オールイン",
};

export type Action =
  | {
      type: "checkOrCall";
    }
  | {
      type: "fold";
    }
  | {
      type: "betOrRaise";
      amount: ActionAmount;
    };

export type ActionWithPlayer = {
  player: Position;
  action: Action;
};

export type StackSize = "S" | "M" | "L" | "LL" | "AI";
