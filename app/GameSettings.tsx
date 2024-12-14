import type { ReactNode } from "react";
import { useGame } from "./game";

export const GameSettings = ({ children }: { children: ReactNode }) => {
  const { gameState, updateGameState } = useGame();
  return (
    <div>
      {children}
      <div>人数</div>
      <div>ポジション</div>
      <div>SB BB Anti</div>
    </div>
  );
};
