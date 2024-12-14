import { atom, useAtom } from "jotai";

type Position =
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

type PlayersCount = 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10;

interface GameState {
  setting: {
    sb: number;
    bb: number;
    anti: number;
    playersCount: PlayersCount;
    position: Position;
  };
}

const initialGameState: GameState = {
  setting: {
    sb: 1,
    bb: 2,
    anti: 2,
    playersCount: 9,
    position: "UTG",
  },
};

const gameAtom = atom(initialGameState);

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
