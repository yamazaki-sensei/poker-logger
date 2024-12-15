import { useCallback } from "react";
import { useGameState, type GameState } from "./game";
import { useTable, type TableState } from "./table";

const storeKey = "results";

type GameResult = Omit<
  GameState,
  "currentRound" | "currentPlayer" | "activePlayers" | "gameIndex"
>;

export type BoardResult = {
  game: GameState;
  table: TableState;
};

export const loadResults = async (): Promise<
  { date: Date; payload: BoardResult }[]
> => {
  const results = JSON.parse(localStorage.getItem(storeKey) ?? "[]") as {
    date: string;
    payload: BoardResult;
  }[];

  return results.map((v) => ({
    date: new Date(v.date),
    payload: v.payload,
  }));
};

export const useResultsWriter = (): {
  storeCurrentBoard: () => void;
} => {
  const { gameState } = useGameState();
  const { tableState } = useTable();

  const storeCurrentBoard = useCallback(() => {
    const current = localStorage.getItem(storeKey);
    const timestamp = new Date().toISOString();
    const gameResult: GameResult = {
      myCards: gameState.myCards,
      actions: gameState.actions,
      communityCards: gameState.communityCards,
    };
    const next = [
      ...JSON.parse(current || "[]"),
      {
        date: timestamp,
        payload: {
          game: gameResult,
          table: tableState,
        },
      },
    ];

    localStorage.setItem(storeKey, JSON.stringify(next));
  }, [gameState, tableState]);

  return {
    storeCurrentBoard,
  };
};
