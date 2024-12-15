import { useCallback, useState } from "react";
import { useGameState, useNextPlayer } from "~/game";
import type { Position, GameRound, Action } from "~/types";
import { PlayerAction } from "./Action";
import { actionToText } from "~/utils/action_util";
import { Button } from "./ui/button";

export const GameActions = ({ round }: { round: GameRound }) => {
  const [actions, setActions] = useState<
    { player: Position; action: Action }[]
  >([]);
  const [prevPosition, setPrevPosition] = useState<Position>();
  const currentPlayer = useNextPlayer(round, prevPosition);
  const { gameState, removePlayer } = useGameState();

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
          if (currentPlayer) {
            removePlayer(currentPlayer);
          }
          break;
      }

      if (currentPlayer) {
        setActions([...actions, { player: currentPlayer, action }]);
        setPrevPosition(currentPlayer);
      }
    },
    [currentPlayer, actions, removePlayer]
  );

  return (
    <div>
      <div>{`Active Players: ${gameState.currentPlayers.join(", ")}`}</div>
      <div className="mt-3">
        {actions.map(({ player, action }, i) => (
          <div
            key={`${player}-${JSON.stringify(action)}-${i}`}
            className="items-center p-2 grid grid-cols-12"
          >
            <div className="col-span-2">
              {actionToText({ position: player, action })}
            </div>

            <Button variant="destructive" size="icon">
              削除
            </Button>
          </div>
        ))}
      </div>
      <div className="grid grid-cols-12 items-center">
        <div className="col-span-1">{currentPlayer}</div>
        <div className="col-span-11 px-2">
          <PlayerAction onAction={onAction} />
        </div>
      </div>
    </div>
  );
};
