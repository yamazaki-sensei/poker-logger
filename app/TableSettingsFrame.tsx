import { useState, type ChangeEvent, type ReactNode } from "react";
import { useTable } from "./table";
import { Button } from "./components/ui/button";
import { Input } from "./components/ui/input";
import {
  Select,
  SelectItem,
  SelectTrigger,
  SelectContent,
} from "./components/ui/select";
import { useGameState, useGameStateReset } from "./game";
import { useResultsWriter } from "./results";
import { Link } from "react-router";
import { useToast } from "./hooks/use-toast";
import { Dialog, DialogTitle, DialogContent } from "./components/ui/dialog";

export const TableSettingsFrame = ({ children }: { children: ReactNode }) => {
  const { resetGame } = useGameStateReset();
  const { gameState, setMemo, setMyPosition } = useGameState();
  const { storeCurrentBoard } = useResultsWriter();
  const { toast } = useToast();
  const [positionDialogShown, setPositionDialogShown] = useState(false);
  const reset = () => {
    resetGame(table);
    setPositionDialogShown(true);
  };
  const { table, updateTable } = useTable();

  const onPlayersCountChange = (v: string) => {
    updateTable({
      ...table,
      playersCount: Number.parseInt(v),
    });
  };

  return (
    <div className="relative w-full h-full pb-[200px]">
      {children}

      <div className="flex justify-end flex-1 p-4">
        <Input
          placeholder="簡単なメモ(30文字以内)"
          className="mr-2"
          value={gameState.memo}
          maxLength={30}
          onChange={(event) => setMemo(event.currentTarget.value)}
        />
        <Button onClick={reset}>リセット</Button>
      </div>
      <div className="fixed bottom-0 w-full bg-secondary">
        <div className="flex p-2">
          <div>
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
          <div className="flex items-center ml-4 justify-end w-full">
            <Button
              onClick={() => {
                storeCurrentBoard();
                toast({
                  description: "ボードを保存しました",
                });
              }}
            >
              現在のボードを保存
            </Button>
            <div className="flex items-center ml-4">
              <Link to="/results" className="text-sm underline">
                保存したボードを確認
              </Link>
            </div>
          </div>
        </div>
      </div>
      <div>
        <Dialog open={positionDialogShown}>
          <DialogContent className="[&>button]:hidden">
            <DialogTitle>heroポジションを設定</DialogTitle>
            <div className="grid grid-cols-3 gap-2">
              {gameState.allPlayers.map((p) => (
                <Button
                  key={p}
                  onClick={() => {
                    setMyPosition(p);
                    setPositionDialogShown(false);
                  }}
                >
                  {p}
                </Button>
              ))}
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};
