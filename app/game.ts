import { atom, useAtom } from "jotai";
import { atomWithStorage } from "jotai/utils";
import { useMemo } from "react";

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

interface GameState {
  setting: {
    sb: number;
    bb: number;
    anti: number;
    playersCount: number;
    position: Position;
  };
  myCards: [Card, Card] | undefined;
}

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

export const cardSuits = ["c", "d", "h", "s"] as const;
type CardSuit = (typeof cardSuits)[number];

export type Card = {
  number: CardNumber;
  suit: CardSuit;
};

const initialGameState: GameState = {
  setting: {
    sb: 0,
    bb: 0,
    anti: 0,
    playersCount: 9,
    position: "UTG",
  },
  myCards: undefined,
};

const gameAtom = atomWithStorage("GameState", initialGameState);

export const useGame = (): {
  gameState: GameState;
  updateGameState: (state: GameState) => void;
} => {
  const [gameState, updateGameState] = useAtom(gameAtom);

  return {
    gameState,
    updateGameState,
  };
};

export const usePositions = (): Position[] => {
  const { gameState } = useGame();
  const playersCount = gameState.setting.playersCount;

  return useMemo(() => {
    switch (playersCount) {
      case 2:
        return ["SB", "BB"];
      case 3:
        return ["SB", "BB", "BTN"];
      case 4:
        return ["SB", "BB", "CO", "BTN"];
      case 5:
        return ["SB", "BB", "HJ", "CO", "BTN"];
      case 6:
        return ["SB", "BB", "LJ", "HJ", "CO", "BTN"];
      case 7:
        return ["SB", "BB", "UTG", "LJ", "HJ", "CO", "BTN"];
      case 8:
        return ["SB", "BB", "UTG", "UTG+1", "LJ", "HJ", "CO", "BTN"];
      case 9:
        return ["SB", "BB", "UTG", "UTG+1", "UTG+2", "LJ", "HJ", "CO", "BTN"];
      default:
        return ["SB", "BB"];
    }
  }, [playersCount]);
};
