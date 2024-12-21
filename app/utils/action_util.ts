import type { Action, Position } from "~/types";

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
    case "raise":
      return `${position} が ${action.amount} に raise`;
    case "fold":
      return `${position} が fold`;
  }
};
