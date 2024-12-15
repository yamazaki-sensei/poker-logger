import type { Action } from "~/types";
import { useState } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";

export const PlayerAction = ({
  onAction,
}: {
  onAction: (action: Action) => void;
}) => {
  const [raiseAmount, setRaiseAmount] = useState<number>(0);

  return (
    <div className="items-center flex justify-between">
      <div className="flex items-center">
        <Button onClick={() => onAction({ type: "check" })} className="p-1">
          Check
        </Button>
      </div>
      <div className="flex items-center">
        <Button onClick={() => onAction({ type: "call" })} className="p-1">
          Call
        </Button>
      </div>
      <div className="flex items-center">
        <Button
          onClick={() => onAction({ type: "raise", amount: raiseAmount })}
          className="p-1"
        >
          Bet / Raise
        </Button>
        <div className="ml-2 flex items-center">
          <Input
            value={`${raiseAmount}`.replace(/^0+/, "") || "0"}
            type="number"
            min={0}
            size={1}
            className="w-24"
            onChange={(event) => {
              setRaiseAmount(Number.parseInt(event.currentTarget.value || "0"));
            }}
          />
          <div className="text-xs ml-2">chips</div>
        </div>
      </div>
      <div className="flex items-center">
        <Button onClick={() => onAction({ type: "fold" })} className="p-1">
          Fold
        </Button>
      </div>
    </div>
  );
};
