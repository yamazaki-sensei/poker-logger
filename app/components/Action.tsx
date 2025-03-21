import type { Action } from "~/types";
import { useState } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";

export const PlayerAction = ({
  onAction,
}: {
  onAction: (action: Action) => void;
}) => {
  return (
    <>
      <div className="grid grid-cols-2 gap-2">
        <div className="flex items-center col-span-1">
          <Button
            onClick={() => onAction({ type: "checkOrCall" })}
            className="w-full"
          >
            Check / Call
          </Button>
        </div>
        <div className="flex items-center col-span-1">
          <Button onClick={() => onAction({ type: "fold" })} className="w-full">
            Fold
          </Button>
        </div>
      </div>
      <div className="grid grid-cols-5 gap-2 mt-2">
        <Button onClick={() => onAction({ type: "raise", amount: "S" })}>
          S
        </Button>
        <Button onClick={() => onAction({ type: "raise", amount: "M" })}>
          M
        </Button>
        <Button onClick={() => onAction({ type: "raise", amount: "L" })}>
          L
        </Button>
        <Button onClick={() => onAction({ type: "raise", amount: "LL" })}>
          LL
        </Button>
        <Button onClick={() => onAction({ type: "raise", amount: "AI" })}>
          AI
        </Button>
      </div>
    </>
  );
};
