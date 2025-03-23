import { amountStringMap, type Action } from "~/types";
import { Button } from "./ui/button";

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
        <Button onClick={() => onAction({ type: "betOrRaise", amount: "S" })}>
          {amountStringMap.S}
        </Button>
        <Button onClick={() => onAction({ type: "betOrRaise", amount: "M" })}>
          {amountStringMap.M}
        </Button>
        <Button onClick={() => onAction({ type: "betOrRaise", amount: "L" })}>
          {amountStringMap.L}
        </Button>
        <Button onClick={() => onAction({ type: "betOrRaise", amount: "LL" })}>
          {amountStringMap.LL}
        </Button>
        <Button onClick={() => onAction({ type: "betOrRaise", amount: "AI" })}>
          {amountStringMap.AI}
        </Button>
      </div>
    </>
  );
};
