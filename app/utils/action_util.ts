import type { Action, Position } from "~/types";

export const actionToText = ({
  position,
  action,
}: {
  position: Position;
  action: Action;
}): string => {
  switch (action.type) {
    case "call":
      return `${position} が call`;
    case "check":
      return `${position} が check`;
    case "raise":
      return `${position} が ${action.amount} に raise`;
    case "fold":
      return `${position} が fold`;
  }
};
