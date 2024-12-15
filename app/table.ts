import { useAtom } from "jotai";
import { atomWithStorage } from "jotai/utils";
import { useMemo } from "react";
import type { Position } from "./types";

interface TableState {
  setting: {
    sb: number;
    bb: number;
    anti: number;
    playersCount: number;
    position: Position;
  };
}

const initialTableState: TableState = {
  setting: {
    sb: 0,
    bb: 0,
    anti: 0,
    playersCount: 9,
    position: "UTG",
  },
};

const tableAtom = atomWithStorage("TableState", initialTableState);

export const useTable = (): {
  tableState: TableState;
  updateTableState: (state: TableState) => void;
} => {
  const [tableState, updateTableState] = useAtom(tableAtom);

  return {
    tableState,
    updateTableState,
  };
};

export const usePositions = (): Position[] => {
  const { tableState } = useTable();
  const playersCount = tableState.setting.playersCount;

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
