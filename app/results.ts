import { useGameState, type GameState } from "./game";
import { useTable, type TableState } from "./table";

const storeKey = "results";

type GameResult = Omit<
  GameState,
  | "currentRound"
  | "currentPlayer"
  | "activePlayers"
  | "allPlayers"
  | "gameIndex"
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
  removeBoard: (index: number) => void;
} => {
  const { gameState } = useGameState();
  const { table } = useTable();

  const storeCurrentBoard = () => {
    const current = localStorage.getItem(storeKey);
    const timestamp = new Date().toISOString();
    const gameResult: GameResult = {
      myPosition: gameState.myPosition,
      actions: gameState.actions,
      communityCards: gameState.communityCards,
      playersState: gameState.playersState,
      memo: gameState.memo,
    };
    const next = [
      ...JSON.parse(current || "[]"),
      {
        date: timestamp,
        payload: {
          game: gameResult,
          table: table,
        },
      },
    ];

    localStorage.setItem(storeKey, JSON.stringify(next));
  };

  const removeBoard = (index: number) => {
    const results = JSON.parse(localStorage.getItem(storeKey) ?? "[]") as {
      date: string;
      payload: BoardResult;
    }[];

    const next = results.filter((_, i) => i !== index);
    localStorage.setItem(storeKey, JSON.stringify(next));
  };

  return {
    storeCurrentBoard,
    removeBoard,
  };
};
