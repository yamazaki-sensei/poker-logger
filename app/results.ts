import { format } from "date-fns";
import { useCallback } from "react";
import { useGameState } from "./game";
import { useTable } from "./table";
export const useResultsWriter = (): {
  storeCurrentBoard: () => void;
} => {
  const { gameState } = useGameState();
  const { tableState } = useTable();

  const storeCurrentBoard = useCallback(() => {
    const storeKey = "boards";
    const current = localStorage.getItem(storeKey);
    const jsonKey = format(new Date(), "yyyy-MM-dd HH:mm:ss");
    const next = {
      ...JSON.parse(current || "{}"),
      [jsonKey]: {
        game: gameState,
        table: tableState,
      },
    };

    console.log(next);
    console.log(JSON.stringify(next));
  }, [gameState, tableState]);

  return {
    storeCurrentBoard,
  };
};
