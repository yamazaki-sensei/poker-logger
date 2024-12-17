import { useAtom } from "jotai";
import { atomWithStorage } from "jotai/utils";
import { useMemo } from "react";
import type { Position } from "./types";
import { useGameState, useGameStateReset } from "./game";

export interface TableState {
  readonly sb: number;
  readonly bb: number;
  readonly anti: number;
  readonly playersCount: number;
}

const initialTableState: TableState = {
  sb: 0,
  bb: 0,
  anti: 0,
  playersCount: 9,
};

const tableAtom = atomWithStorage("TableState", initialTableState);

export const useTable = (): {
  table: TableState;
  updateTable: (state: TableState) => void;
} => {
  const [tableState, updateTableState] = useAtom(tableAtom);
  const { resetGame } = useGameStateReset();

  const updateTable = (state: TableState) => {
    updateTableState(state);
    resetGame(state);
  };

  return {
    table: tableState,
    updateTable,
  };
};

export const usePositions = (): Position[] => {
  const { table } = useTable();
  const playersCount = table.playersCount;

  return useMemo(() => {
    switch (playersCount) {
      case 2:
        return ["SB", "BB"];
      case 3:
        return ["SB", "BB", "BTN"];
      case 4:
        return ["SB", "BB", "UTG", "BTN"];
      case 5:
        return ["SB", "BB", "UTG", "CO", "BTN"];
      case 6:
        return ["SB", "BB", "UTG", "HJ", "CO", "BTN"];
      case 7:
        return ["SB", "BB", "UTG", "UTG1", "HJ", "CO", "BTN"];
      case 8:
        return ["SB", "BB", "UTG", "UTG1", "LJ", "HJ", "CO", "BTN"];
      case 9:
        return ["SB", "BB", "UTG", "UTG1", "UTG2", "LJ", "HJ", "CO", "BTN"];
      default:
        return ["SB", "BB"];
    }
  }, [playersCount]);
};
