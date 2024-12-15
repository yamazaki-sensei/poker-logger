import { useCallback, useState, type ChangeEvent, type ReactNode } from "react";
import { useTable, usePositions } from "./table";
import { cardText } from "./utils/card_util";
import { CardSelect } from "./components/CardSelect";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "./components/ui/dialog";
import { Button } from "./components/ui/button";
import { Input } from "./components/ui/input";
import {
  Select,
  SelectItem,
  SelectTrigger,
  SelectContent,
} from "./components/ui/select";
import type { Card, Position } from "./types";
import { useGameState } from "./game";
import { Separator } from "./components/ui/separator";

const Footer = () => {
  const { tableState, updateTableState } = useTable();
  const { gameState, setMyCards } = useGameState();

  const positions = usePositions();
  const onPlayersCountChange = useCallback(
    (v: string) => {
      updateTableState({
        ...tableState,
        playersCount: Number.parseInt(v),
      });
    },
    [tableState, updateTableState]
  );

  const onPositionChange = useCallback(
    (v: string) => {
      updateTableState({
        ...tableState,
        position: v as Position,
      });
    },
    [tableState, updateTableState]
  );

  const onSbChange = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      updateTableState({
        ...tableState,
        sb: Number.parseInt(event.currentTarget.value || "0"),
      });
    },
    [tableState, updateTableState]
  );

  const onBbChange = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      updateTableState({
        ...tableState,
        bb: Number.parseInt(event.currentTarget.value || "0"),
      });
    },
    [tableState, updateTableState]
  );

  const onAntiChange = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      updateTableState({
        ...tableState,
        anti: Number.parseInt(event.currentTarget.value || "0"),
      });
    },
    [tableState, updateTableState]
  );

  const onCardsChange = useCallback(
    (cards: Card[]) => {
      setCardSelectDialogOpened(false);
      setMyCards(cards as [Card, Card]);
    },
    [setMyCards]
  );

  const [cardSelectDialogOpened, setCardSelectDialogOpened] = useState(false);

  return (
    <div>
      <div className="flex">
        <div className="flex items-center">
          <div className="text-sm">人数:</div>
          <div className="ml-2">
            <Select
              value={`${tableState.playersCount}`}
              onValueChange={onPlayersCountChange}
            >
              <SelectTrigger>
                <div className="flex items-center">
                  <span className="ml-1">{tableState.playersCount}人</span>
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
              value={`${tableState.position}`}
              onValueChange={onPositionChange}
            >
              <SelectTrigger className="flex items-center">
                <span className="ml-1">{tableState.position}</span>
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
              type="number"
              value={`${tableState.sb}`.replace(/^0+/, "") || "0"}
              onChange={onSbChange}
            />
          </div>
        </div>
        <div className="flex items-center pr-2">
          BB:
          <div className="ml-2">
            <Input
              min={0}
              value={`${tableState.bb}`.replace(/^0+/, "") || "0"}
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
              value={`${tableState.anti}`.replace(/^0+/, "") || "0"}
              type="number"
              onChange={onAntiChange}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export const TableSettingsFrame = ({ children }: { children: ReactNode }) => {
  const { resetGameState } = useGameState();
  return (
    <div className="relative w-full h-full pb-[200px]">
      {children}

      <div className="fixed bottom-0 w-full bg-secondary pt-4">
        <div className="flex justify-end mb-2 mr-2">
          <Button onClick={resetGameState}>リセット</Button>
        </div>
        <Separator />
        <div className="p-2">
          <Footer />
        </div>
      </div>
    </div>
  );
};
