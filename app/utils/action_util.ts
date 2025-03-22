import { amountStringMap, type Action, type Position } from "~/types";

export const actionToText = ({
  position,
  action,
}: {
  position: Position;
  action: Action;
}): string => {
  switch (action.type) {
    case "checkOrCall":
      return `${position} が check / call`;
    case "betOrRaise":
      return `${position} が bet / raise (サイズ: ${
        amountStringMap[action.amount]
      })`;
    case "fold":
      return `${position} が fold`;
  }
};
