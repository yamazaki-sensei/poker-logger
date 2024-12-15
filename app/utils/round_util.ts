import type { GameRound } from "~/types";

export const gameRoundText = (round: GameRound): string => {
  switch (round) {
    case "preFlop":
      return "Pre Flop";
    case "flop":
      return "Flop";
    case "turn":
      return "Turn";
    case "river":
      return "River";
  }
};
