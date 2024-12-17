import { useState } from "react";
import { useGameState } from "~/game";
import type { GameRound, Action, Position, Card } from "~/types";
import { PlayerAction } from "./Action";
import { actionToText } from "~/utils/action_util";
import { Button } from "./ui/button";
import { gameRoundText } from "~/utils/round_util";
import { PositionText } from "./PositionText";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { DropdownMenuItem } from "@radix-ui/react-dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "./ui/dialog";
import { CardSelect } from "./CardSelect";
import { cardText } from "~/utils/card_util";

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
  const { gameState, toNextRound, setHands } = useGameState();
  const actions = gameState.actions[round];
  const [handsSelectTarget, setHandsSelectTarget] = useState<Position>();
  const handleHandSelectTarget = (position: Position) => {
    setHandsSelectTarget(position);
  };
  const handleHands = (hands: Card[]) => {
    if (!handsSelectTarget) {
      return;
    }
    setHands(handsSelectTarget, [hands[0], hands[1]]);
    setHandsSelectTarget(undefined);
  };

  return (
    <div>
      <div>{`${gameState.activePlayers.length} Players:`}</div>
      <div className="grid grid-cols-3 gap-1 mt-1">
        {gameState.activePlayers.map((v) => (
          <Button key={v} variant="outline">
            <span key={v} className="text-sm">
              <PositionText
                key={v}
                position={v}
                className={gameState.hands[v] ? undefined : "mr-2"}
              />
              {gameState.hands[v] && (
                <span className="text-xs mr-2">{`(${cardText(
                  gameState.hands[v][0]
                )} ${cardText(gameState.hands[v][1])})`}</span>
              )}
            </span>
          </Button>
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
            <DialogTitle>手札を選択</DialogTitle>
            <DialogDescription>手札を選択</DialogDescription>
            <CardSelect count={2} onSelect={handleHands} />
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};
