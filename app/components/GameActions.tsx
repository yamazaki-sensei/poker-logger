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
  const { gameState, toNextRound, updatePlayerState } = useGameState();
  const actions = gameState.actions[round];
  const [handsSelectTarget, setHandsSelectTarget] = useState<Position>();
  const handleHandSelectTarget = (position: Position) => {
    setHandsSelectTarget(position);
  };
  const handleHands = (hands: Card[], stack: number | undefined) => {
    if (!handsSelectTarget) {
      return;
    }
    updatePlayerState(handsSelectTarget, {
      initialStack: stack,
      hands: [hands[0], hands[1]],
    });
    setHandsSelectTarget(undefined);
  };
  const [currentStackInputRef, setCurrentStackInputRef] =
    useState<HTMLInputElement | null>(null);

  const isFolded = (player: Position) =>
    !gameState.activePlayers.includes(player);

  const isCurrent = (player: Position) => gameState.currentPlayer === player;

  return (
    <div>
      <div>{`${gameState.activePlayers.length} Players:`}</div>
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
              <PositionText
                key={v}
                position={v}
                className={gameState.playersState[v].hands ? undefined : "mr-2"}
              />
              {
                <div className="text-xs">
                  {gameState.playersState[v].hands
                    ? `${cardText(
                        gameState.playersState[v].hands[0]
                      )} ${cardText(gameState.playersState[v].hands[1])}`
                    : "手札: ?"}
                </div>
              }
              {
                <div className="text-[0.625rem]">
                  {gameState.playersState[v].initialStack
                    ? gameState.playersState[v].initialStack
                    : "初期スタック: ?"}
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
            <div className="col-span-4">
              {actionToText({ position: player, action })}
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
            <DialogTitle>手札・初期スタックを設定</DialogTitle>
            <DialogDescription />
            <div>
              <span className="text-sm">初期スタック</span>
              <div className="flex items-center w-48">
                {handsSelectTarget && (
                  <Input
                    ref={setCurrentStackInputRef}
                    type="number"
                    defaultValue={
                      gameState.playersState[handsSelectTarget].initialStack
                    }
                  />
                )}
                <div className="ml-2">chips</div>
              </div>
            </div>
            <CardSelect
              count={2}
              onSelect={(cards: Card[]) => {
                const stack = currentStackInputRef?.value
                  ? Number(currentStackInputRef?.value)
                  : undefined;
                handleHands(cards, stack);
              }}
            />
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};
