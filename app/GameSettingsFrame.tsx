import { useCallback, useState, type ChangeEvent, type ReactNode } from "react";
import { useGame, usePositions, type Card, type Position } from "./game";
import { cardText } from "./utils/card_util";
import { CardSelect } from "./components/CardSelect";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./components/ui/dialog";
import { Button } from "./components/ui/button";
import { Input } from "./components/ui/input";
import {
  Select,
  SelectItem,
  SelectTrigger,
  SelectValue,
  SelectContent,
} from "./components/ui/select";

const Footer = () => {
  const { gameState, updateGameState } = useGame();
  const positions = usePositions();
  const onPlayersCountChange = useCallback(
    (v: string) => {
      updateGameState({
        ...gameState,
        setting: {
          ...gameState.setting,
          playersCount: Number.parseInt(v),
        },
      });
    },
    [gameState, updateGameState]
  );

  const onPositionChange = useCallback(
    (v: string) => {
      updateGameState({
        ...gameState,
        setting: {
          ...gameState.setting,
          position: v as Position,
        },
      });
    },
    [gameState, updateGameState]
  );

  const onSbChange = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      updateGameState({
        ...gameState,
        setting: {
          ...gameState.setting,
          sb: Number.parseInt(event.currentTarget.value || "0"),
        },
      });
    },
    [gameState, updateGameState]
  );

  const onBbChange = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      updateGameState({
        ...gameState,
        setting: {
          ...gameState.setting,
          bb: Number.parseInt(event.currentTarget.value || "0"),
        },
      });
    },
    [gameState, updateGameState]
  );

  const onAntiChange = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      updateGameState({
        ...gameState,
        setting: {
          ...gameState.setting,
          anti: Number.parseInt(event.currentTarget.value || "0"),
        },
      });
    },
    [gameState, updateGameState]
  );

  const onCardsChange = useCallback(
    (cards: Card[]) => {
      setCardSelectDialogOpened(false);
      updateGameState({
        ...gameState,
        myCards: cards as [Card, Card],
      });
    },
    [gameState, updateGameState]
  );

  const [cardSelectDialogOpened, setCardSelectDialogOpened] = useState(false);

  return (
    <div>
      <div className="flex">
        <div className="flex items-center">
          <div className="text-sm">人数:</div>
          <div className="ml-2">
            <Select
              value={`${gameState.setting.playersCount}`}
              onValueChange={onPlayersCountChange}
            >
              <SelectTrigger>
                <div className="flex items-center">
                  <span className="ml-1">
                    {gameState.setting.playersCount}人
                  </span>
                </div>
              </SelectTrigger>
              <SelectContent position="popper">
                {[2, 3, 4, 5, 6, 7, 8, 9].map((n) => (
                  <SelectItem key={n} value={`${n}`} className="cursor-pointer">
                    {n}人
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        <div className="flex items-center ml-2">
          <div className="text-sm">ポジション:</div>
          <div className="ml-2">
            <Select
              value={`${gameState.setting.position}`}
              onValueChange={onPositionChange}
            >
              <SelectTrigger className="flex items-center">
                <span className="ml-1">{gameState.setting.position}</span>
              </SelectTrigger>
              <SelectContent align="center" position="popper">
                {positions.map((v) => (
                  <SelectItem key={v} value={v}>
                    {v}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        <div className="flex items-center flex-1 justify-end">
          手札:
          <div>
            <Dialog
              open={cardSelectDialogOpened}
              onOpenChange={setCardSelectDialogOpened}
            >
              <Button
                variant="ghost"
                onClick={() => setCardSelectDialogOpened(true)}
              >
                {gameState.myCards
                  ? gameState.myCards.map((v) => cardText(v)).join(" ")
                  : "未選択"}
              </Button>
              <DialogContent>
                <DialogTitle>手札を選択</DialogTitle>
                <DialogDescription>手札を選択</DialogDescription>
                <CardSelect count={2} onSelect={onCardsChange} />
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </div>
      <div className="grid grid-cols-3 mt-2">
        <div className="flex items-center pr-2">
          SB:
          <div className="ml-2">
            <Input
              min={0}
              value={`${gameState.setting.sb}`.replace(/^0+/, "") || "0"}
              onChange={onSbChange}
            />
          </div>
        </div>
        <div className="flex items-center pr-2">
          BB:
          <div className="ml-2">
            <Input
              min={0}
              value={`${gameState.setting.bb}`.replace(/^0+/, "") || "0"}
              type="number"
              onChange={onBbChange}
            />
          </div>
        </div>
        <div className="flex items-center">
          Anti:
          <div className="ml-2">
            <Input
              min={0}
              value={`${gameState.setting.anti}`.replace(/^0+/, "") || "0"}
              type="number"
              onChange={onAntiChange}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export const GameSettingsFrame = ({ children }: { children: ReactNode }) => {
  return (
    <div className="relative w-full h-full">
      {children}

      <div className="fixed bottom-0 w-full">
        <hr className="w-full" />
        <div className="p-2">
          <Footer />
        </div>
      </div>
    </div>
  );
};
