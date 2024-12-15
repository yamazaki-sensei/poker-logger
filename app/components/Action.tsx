import type { Action, ActionType } from "~/types";
import { RadioGroup, RadioGroupItem } from "./ui/radio-group";
import { useState } from "react";
import { Label } from "./ui/label";
import { Button } from "./ui/button";
import { Input } from "./ui/input";

export const PlayerAction = ({
  onAction,
}: {
  onAction: (action: Action) => void;
}) => {
  const [actionType, setActionType] = useState<ActionType>("check");
  const [raiseAmount, setRaiseAmount] = useState<number>(0);

  return (
    <div className="grid grid-cols-12 items-center">
      <RadioGroup
        value={actionType}
        orientation="horizontal"
        className="flex col-span-10"
        onValueChange={(v) => {
          setActionType(v as ActionType);
        }}
      >
        <div className="flex items-center">
          <RadioGroupItem id="action-check" value="check" />
          <Label htmlFor="action-check" className="ml-2">
            Check
          </Label>
        </div>
        <div className="flex items-center">
          <RadioGroupItem id="action-call" value="call" />
          <Label htmlFor="action-call" className="ml-2">
            Call
          </Label>
        </div>
        <div className="flex items-center">
          <RadioGroupItem id="action-raise" value="raise" />
          <Label htmlFor="action-raise" className="ml-2">
            Raise
          </Label>
          <div className="ml-2 flex items-center">
            <Input
              value={`${raiseAmount}`.replace(/^0+/, "") || "0"}
              type="number"
              min={0}
              size={2}
              onChange={(event) => {
                setRaiseAmount(
                  Number.parseInt(event.currentTarget.value || "0")
                );
              }}
            />
            <div className="text-xs ml-2">chips</div>
          </div>
        </div>
        <div className="flex items-center">
          <RadioGroupItem id="action-fold" value="fold" />
          <Label htmlFor="action-fold" className="ml-2">
            Fold
          </Label>
        </div>
      </RadioGroup>
      <div className="col-span-1 col-start-12">
        <Button
          onClick={() => {
            if (actionType === "raise") {
              onAction({ type: "raise", amount: raiseAmount });
            } else {
              onAction({ type: actionType });
            }
          }}
        >
          決定
        </Button>
      </div>
    </div>
  );
};
