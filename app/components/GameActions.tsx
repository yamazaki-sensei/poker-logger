import { useCallback, useState } from "react";
import { useNextPlayer } from "~/game";
import type { Position, GameRound, Action } from "~/types";
import { PlayerAction } from "./Action";
import { actionToText } from "~/utils/action_util";

export const GameActions = ({ round }: { round: GameRound }) => {
  const [actions, setActions] = useState<
    { player: Position; action: Action }[]
  >([]);
  const [currentPosition, setCurrentPosition] = useState<Position>();
  const nextPlayer = useNextPlayer(round, currentPosition);

  const onAction = useCallback(
    (action: Action) => {
      switch (action.type) {
        case "call":
          break;
        case "check":
          break;
        case "raise":
          break;
        case "fold":
          break;
      }

      if (nextPlayer) {
        setActions([...actions, { player: nextPlayer, action }]);
        setCurrentPosition(nextPlayer);
      }
    },
    [nextPlayer, actions]
  );

  return (
    <div>
      {actions.map(({ player, action }) => (
        <div key={`${player}-${JSON.stringify(action)}`}>
          {actionToText({ position: player, action })}
        </div>
      ))}
      <div className="grid grid-cols-12 items-center">
        <div className="col-span-1">{nextPlayer}</div>
        <div className="col-span-11 px-2">
          <PlayerAction onAction={onAction} />
        </div>
      </div>
    </div>
  );
};
