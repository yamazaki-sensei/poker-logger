import { useState } from "react";
import { useNextPlayer } from "~/game";
import type { Position, GameRound } from "~/types";
import { PlayerAction } from "./Action";

export const GameActions = ({ round }: { round: GameRound }) => {
  const [position, currentPosition] = useState<Position>();
  const nextPlayer = useNextPlayer(round, position);
  return (
    <div className="grid grid-cols-12 items-center">
      <div className="col-span-1">{nextPlayer}</div>
      <div className="col-span-11 px-2">
        <PlayerAction
          onAction={(action) => {
            console.log(action);
          }}
        />
      </div>
    </div>
  );
};
