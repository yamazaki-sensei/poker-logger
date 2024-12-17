import { type ChangeEvent, type ReactNode } from "react";
import { useTable, usePositions } from "./table";
import { Button } from "./components/ui/button";
import { Input } from "./components/ui/input";
import {
  Select,
  SelectItem,
  SelectTrigger,
  SelectContent,
} from "./components/ui/select";
import type { Card, Position } from "./types";
import { useGameState, useGameStateReset } from "./game";
import { Separator } from "./components/ui/separator";
import { loadResults, useResultsWriter } from "./results";

const Footer = () => {
  const { table, updateTable } = useTable();
  const { gameState, setMyPosition } = useGameState();

  const positions = usePositions();
  const onPlayersCountChange = (v: string) => {
    updateTable({
      ...table,
      playersCount: Number.parseInt(v),
    });
  };

  const onPositionChange = (v: string) => {
    setMyPosition(v as Position);
  };

  const onSbChange = (event: ChangeEvent<HTMLInputElement>) => {
    updateTable({
      ...table,
      sb: Number.parseInt(event.currentTarget.value || "0"),
    });
  };

  const onBbChange = (event: ChangeEvent<HTMLInputElement>) => {
    updateTable({
      ...table,
      bb: Number.parseInt(event.currentTarget.value || "0"),
    });
  };

  const onAntiChange = (event: ChangeEvent<HTMLInputElement>) => {
    updateTable({
      ...table,
      anti: Number.parseInt(event.currentTarget.value || "0"),
    });
  };

  return (
    <div>
      <div className="flex">
        <div className="flex items-center">
          <div className="text-sm">人数:</div>
          <div className="ml-2">
            <Select
              value={`${table.playersCount}`}
              onValueChange={onPlayersCountChange}
            >
              <SelectTrigger>
                <div className="flex items-center">
                  <span className="ml-1">{table.playersCount}人</span>
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
              value={`${gameState.myPosition}`}
              onValueChange={onPositionChange}
            >
              <SelectTrigger className="flex items-center">
                <span className="ml-1">{gameState.myPosition}</span>
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
      </div>
      <div className="grid grid-cols-3 mt-2">
        <div className="flex items-center pr-2">
          SB:
          <div className="ml-2">
            <Input
              min={0}
              type="number"
              value={`${table.sb}`.replace(/^0+/, "") || "0"}
              onChange={onSbChange}
            />
          </div>
        </div>
        <div className="flex items-center pr-2">
          BB:
          <div className="ml-2">
            <Input
              min={0}
              value={`${table.bb}`.replace(/^0+/, "") || "0"}
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
              value={`${table.anti}`.replace(/^0+/, "") || "0"}
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
  const { resetGame } = useGameStateReset();
  const { storeCurrentBoard } = useResultsWriter();
  const { table } = useTable();

  return (
    <div className="relative w-full h-full pb-[200px]">
      {children}

      <div className="flex justify-end flex-1 p-4">
        <Button
          onClick={() => {
            resetGame(table);
          }}
        >
          リセット
        </Button>
      </div>
      <div className="fixed bottom-0 w-full bg-secondary">
        <div className="flex p-2">
          <Button onClick={storeCurrentBoard}>現在のボードを保存</Button>
          <Button
            onClick={() => {
              const results = loadResults();
              console.log(results);
            }}
            className="ml-2"
          >
            保存したボードを確認
          </Button>
        </div>
        <Separator />
        <div className="p-2">
          <Footer />
        </div>
      </div>
    </div>
  );
};
