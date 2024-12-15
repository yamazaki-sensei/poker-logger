import type { Card } from "./types";
import { atom, useAtom } from "jotai";

interface GameState {
  myCards: [Card, Card] | undefined;
}

const gameAtom = atom<GameState>({
  myCards: undefined,
});

export const useGameState = (): {
  gameState: GameState;
  updateGameState: (state: GameState) => void;
} => {
  const [gameState, updateGameState] = useAtom(gameAtom);

  return {
    gameState,
    updateGameState,
  };
};
