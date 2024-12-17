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
    <div className="grid grid-cols-3 gap-2">
      <div className="flex items-center">
        <Button onClick={() => onAction({ type: "check" })} className="w-full">
          Check
        </Button>
      </div>
      <div className="flex items-center">
        <Button onClick={() => onAction({ type: "call" })} className="w-full">
          Call
        </Button>
      </div>
      <div className="flex items-center">
        <Button onClick={() => onAction({ type: "fold" })} className="w-full">
          Fold
        </Button>
      </div>
      <div className="flex items-center">
        <Button
          onClick={() => onAction({ type: "raise", amount: raiseAmount })}
        >
          Bet / Raise
        </Button>
        <div className="ml-2 flex items-center">
          <Input
            value={`${raiseAmount}`.replace(/^0+/, "") || "0"}
            type="number"
            min={0}
            className="w-24"
            onChange={(event) => {
              setRaiseAmount(Number.parseInt(event.currentTarget.value || "0"));
            }}
          />
          <div className="text-xs ml-2">chips</div>
        </div>
      </div>
    </div>
  );
};
