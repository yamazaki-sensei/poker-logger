import { use, useState } from "react";
import { useGameState } from "~/game";
import type { GameRound, Action, Position, Card } from "~/types";
import { PlayerAction } from "./Action";
import { actionToText } from "~/utils/action_util";
import { Button } from "./ui/button";
import { gameRoundText } from "~/utils/round_util";
import { PositionText } from "./PositionText";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "./ui/dialog";
import { CardSelect } from "./CardSelect";
import { cardText } from "~/utils/card_util";
import { Input } from "./ui/input";
import { Separator } from "./ui/separator";

const ActionArea = ({ round }: { round: GameRound }) => {
  const { gameState, commitAction } = useGameState();
  const onAction = (action: Action) => {
    commitAction(round, { player: gameState.currentPlayer, action });
  };

  if (gameState.activePlayers.length === 0) {
    return <div>全員foldしました</div>;
  }
  if (gameState.currentRound !== round) {
    return <div>{`現在は ${gameRoundText(gameState.currentRound)} です`}</div>;
  }

  return (
    <div className="">
      <PlayerAction onAction={onAction} />
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
  const {
    gameState,
    setMyPosition,
    toNextRound,
    updatePlayerState,
    revertLastAction,
  } = useGameState();
  const actions = gameState.actions[round];
  const [handsSelectTarget, setHandsSelectTarget] = useState<Position>();
  const handleHandSelectTarget = (position: Position) => {
    setHandsSelectTarget(position);
  };
  const handleHands = (hands: Card[]) => {
    if (!handsSelectTarget) {
      return;
    }
    updatePlayerState(handsSelectTarget, {
      hands: [hands[0], hands[1]],
    });
    setHandsSelectTarget(undefined);
  };
  const onPositionChange = (v: Position) => {
    setMyPosition(v);
  };

  const isFolded = (player: Position) =>
    !gameState.activePlayers.includes(player);

  const isCurrent = (player: Position) => gameState.currentPlayer === player;

  return (
    <div>
      <div>{`${gameState.activePlayers.length} Active Players:`}</div>
      <div className="grid grid-cols-3 gap-1 mt-1">
        {gameState.allPlayers.map((v) => (
          <Button
            key={v}
            variant="outline"
            onClick={() => handleHandSelectTarget(v)}
            className={`h-16 ${isFolded(v) ? "opacity-50" : ""} ${
              isCurrent(v) ? "bg-cyan-100" : ""
            }`}
          >
            <div key={v} className="text-sm h-16 flex justify-center flex-col">
              <PositionText key={v} position={v} />
              {
                <div className="text-xs">
                  {gameState.playersState[v].hands
                    ? `${cardText(
                        gameState.playersState[v].hands[0]
                      )} ${cardText(gameState.playersState[v].hands[1])}`
                    : "手札: ?"}
                </div>
              }
            </div>
          </Button>
        ))}
      </div>
      <div className="mt-4">
        <ActionArea round={round} />
      </div>
      <div className="mt-3">
        {actions.map(({ player, action }, i) => (
          <div
            key={`${player}-${JSON.stringify(action)}-${i}`}
            className="items-center p-2 grid grid-cols-12"
          >
            <div className="col-span-12">
              {i + 1}: {actionToText({ position: player, action })}
              {i === actions.length - 1 && (
                <Button
                  variant="destructive"
                  className="ml-2"
                  size="sm"
                  onClick={revertLastAction}
                >
                  取消
                </Button>
              )}
            </div>
          </div>
        ))}
      </div>
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
      <div>
        <Dialog
          open={handsSelectTarget !== undefined}
          onOpenChange={(open) => {
            if (!open) {
              setHandsSelectTarget(undefined);
            }
          }}
        >
          <DialogContent>
            <DialogTitle>
              <div className="flex">
                <div className="mt-2">手札を設定</div>
                <div>
                  {gameState.myPosition === handsSelectTarget ? (
                    <div className="mt-2 ml-2">(Hero)</div>
                  ) : (
                    <Button
                      onClick={() =>
                        handsSelectTarget && onPositionChange(handsSelectTarget)
                      }
                      className="ml-4"
                    >
                      heroに設定
                    </Button>
                  )}
                </div>
              </div>
            </DialogTitle>
            <CardSelect
              count={2}
              onSelect={(cards: Card[]) => {
                handleHands(cards);
              }}
            />
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};
