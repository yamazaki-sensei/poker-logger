import { useAtom } from "jotai";
import { atomWithStorage } from "jotai/utils";
import { useGameStateReset } from "./game";

export interface TableState {
  readonly sb: number;
  readonly bb: number;
  readonly ante: number;
  readonly playersCount: number;
}

const initialTableState: TableState = {
  sb: 0,
  bb: 0,
  ante: 0,
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
