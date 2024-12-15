import { useCallback } from "react";
import { useTable } from "./table";
import type { Card, GameRound, Position } from "./types";
import { atom, useAtom } from "jotai";

interface GameState {
  myCards: [Card, Card] | undefined;
  currentPlayers: Position[];
}

const gameAtom = atom<GameState>({
  myCards: undefined,
  currentPlayers: [],
});

export const useGameState = (): {
  gameState: GameState;
  updateGameState: (state: GameState) => void;
  resetGameState: () => void;
} => {
  const [gameState, updateGameState] = useAtom(gameAtom);
  const { tableState } = useTable();

  const generateInitialPlayers = useCallback((): Position[] => {
    switch (tableState.setting.playersCount) {
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
        return ["SB", "BB", "UTG", "UTG1", "LJ", "HJ", "CO", "BTN"];
      case 9:
        return ["SB", "BB", "UTG", "UTG1", "UTG2", "LJ", "HJ", "CO", "BTN"];
      default:
        throw new Error("Invalid players count");
    }
  }, [tableState.setting.playersCount]);

  const resetGameState = useCallback(() => {
    updateGameState({
      myCards: undefined,
      currentPlayers: generateInitialPlayers(),
    });
  }, [generateInitialPlayers, updateGameState]);

  return {
    gameState,
    updateGameState,
    resetGameState,
  };
};

const playOrder = {
  SB: 0,
  BB: 1,
  UTG: 2,
  UTG1: 3,
  UTG2: 4,
  LJ: 5,
  HJ: 6,
  CO: 7,
  BTN: 8,
} satisfies Record<Position, number>;

const preFlopPlayOrder = {
  UTG: 0,
  UTG1: 1,
  UTG2: 2,
  LJ: 3,
  HJ: 4,
  CO: 5,
  BTN: 6,
  SB: 7,
  BB: 8,
} satisfies Record<Position, number>;

export const useNextPlayer = (
  round: GameRound,
  currentPlayer: Position | undefined
): Position | undefined => {
  const { gameState } = useGameState();

  if (currentPlayer === undefined) {
    if (round === "preFlop") {
      return gameState.currentPlayers.sort(
        (v1, v2) => preFlopPlayOrder[v1] - preFlopPlayOrder[v2]
      )[0];
    }

    return gameState.currentPlayers.sort(
      (v1, v2) => playOrder[v1] - playOrder[v2]
    )[0];
  }

  if (round === "preFlop") {
    const currentPlayerIndex = preFlopPlayOrder[currentPlayer];
    const nextPlayer = gameState.currentPlayers.find(
      (player) => preFlopPlayOrder[player] > currentPlayerIndex
    );

    return nextPlayer ?? gameState.currentPlayers[0];
  }

  const currentPlayerIndex = playOrder[currentPlayer];
  const nextPlayer = gameState.currentPlayers.find(
    (player) => playOrder[player] > currentPlayerIndex
  );

  return nextPlayer ?? gameState.currentPlayers[0];
};
