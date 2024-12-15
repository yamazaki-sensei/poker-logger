import { useCallback } from "react";
import { useGameState } from "~/game";
import type { GameRound, Action } from "~/types";
import { PlayerAction } from "./Action";
import { actionToText } from "~/utils/action_util";
import { Button } from "./ui/button";
import { gameRoundText } from "~/utils/round_util";
import { PositionText } from "./PositionText";

const ActionArea = ({ round }: { round: GameRound }) => {
  const { gameState, commitAction } = useGameState();
  const onAction = useCallback(
    (action: Action) => {
      commitAction(round, { player: gameState.currentPlayer, action });
    },
    [gameState.currentPlayer, round, commitAction]
  );

  if (gameState.activePlayers.length === 0) {
    return <div>全員foldしました</div>;
  }
  if (gameState.currentRound !== round) {
    return <div>{`現在は ${gameRoundText(gameState.currentRound)} です`}</div>;
  }

  return (
    <div className="grid grid-cols-12 items-center">
      <div className="col-span-1">{gameState.currentPlayer}</div>
      <div className="col-span-11 px-2">
        <PlayerAction onAction={onAction} />
      </div>
    </div>
  );
};

export const GameActions = ({
  round,
  onNextRound,
}: {
  round: GameRound;
  onNextRound?: () => void;
}) => {
  const { gameState, toNextRound } = useGameState();
  const actions = gameState.actions[round];

  return (
    <div>
      <div>{`Active ${gameState.activePlayers.length}:`}</div>
      <div>
        {gameState.activePlayers.map((v) => (
          <PositionText key={v} position={v} className="mr-2" />
        ))}
      </div>
      <div className="mt-3">
        {actions.map(({ player, action }, i) => (
          <div
            key={`${player}-${JSON.stringify(action)}-${i}`}
            className="items-center p-2 grid grid-cols-12"
          >
            <div className="col-span-4">
              {actionToText({ position: player, action })}
            </div>

            <Button variant="destructive" size="icon">
              削除
            </Button>
          </div>
        ))}
      </div>
      <ActionArea round={round} />
      {gameState.currentRound === round && (
        <div className="mt-12">
          <Button
            disabled={onNextRound === undefined}
            className="w-full"
            onClick={() => {
              toNextRound();
              onNextRound?.();
            }}
          >
            次のラウンドへ
          </Button>
        </div>
      )}
    </div>
  );
};
