"use client";
import { useCallback } from "react";
import { useTable } from "./table";
import type {
  Action,
  ActionWithPlayer,
  Card,
  GameRound,
  Position,
} from "./types";
import { atom, useAtom } from "jotai";

export interface GameState {
  readonly currentRound: GameRound;
  readonly currentPlayer: Position;
  readonly gameIndex: number;
  readonly myCards: [Card, Card] | undefined;
  readonly activePlayers: Position[];
  readonly actions: {
    readonly preFlop: { player: Position; action: Action }[];
    readonly flop: { player: Position; action: Action }[];
    readonly turn: { player: Position; action: Action }[];
    readonly river: { player: Position; action: Action }[];
  };
  readonly communityCards: {
    flop: [Card, Card, Card] | undefined;
    turn: [Card] | undefined;
    river: [Card] | undefined;
  };
}

const gameAtom = atom<GameState>({
  currentRound: "preFlop",
  currentPlayer: "UTG",
  myCards: undefined,
  activePlayers: [],
  gameIndex: 0,
  actions: {
    preFlop: [],
    flop: [],
    turn: [],
    river: [],
  },
  communityCards: {
    flop: undefined,
    turn: undefined,
    river: undefined,
  },
});

export const useGameState = (): {
  readonly gameState: GameState;
  setMyCards: (cards: [Card, Card]) => void;
  commitAction: (round: GameRound, action: ActionWithPlayer) => void;
  toNextRound: () => void;
  setCommunityCards: (round: GameRound, cards: Card[]) => void;
  resetGameState: () => void;
} => {
  const [gameState, setGameState] = useAtom(gameAtom);
  const { tableState } = useTable();

  const setMyCards = useCallback(
    (cards: [Card, Card]) => {
      setGameState({
        ...gameState,
        myCards: cards,
      });
    },
    [gameState, setGameState]
  );

  const resetGameState = useCallback(() => {
    setGameState((prev) => ({
      currentRound: "preFlop",
      currentPlayer: findFirstPlayer(tableState.playersCount),
      gameIndex: prev.gameIndex + 1,
      myCards: undefined,
      activePlayers: sortPlayersToPreFlopOrder(
        generateInitialPlayers(tableState.playersCount)
      ),
      actions: {
        preFlop: [],
        flop: [],
        turn: [],
        river: [],
      },
      communityCards: {
        flop: undefined,
        turn: undefined,
        river: undefined,
      },
    }));
  }, [tableState.playersCount, setGameState]);

  const commitAction = useCallback(
    (round: GameRound, action: ActionWithPlayer) => {
      const nextPlayers =
        action.action.type === "fold"
          ? gameState.activePlayers.filter((v) => v !== action.player)
          : gameState.activePlayers;

      setGameState({
        ...gameState,
        actions: {
          ...gameState.actions,
          [round]: [...gameState.actions[round], action],
        },
        activePlayers: nextPlayers,
        currentPlayer: findNextPlayer({
          round: gameState.currentRound,
          currentPlayer: gameState.currentPlayer,
          activePlayers: gameState.activePlayers,
        }),
      });
    },
    [gameState, gameState.actions, setGameState]
  );

  const setCommunityCards = useCallback(
    (round: GameRound, cards: Card[]) => {
      setGameState({
        ...gameState,
        communityCards: {
          ...gameState.communityCards,
          [round]: cards,
        },
      });
    },
    [gameState, gameState.communityCards, setGameState]
  );

  const toNextRound = useCallback(() => {
    const activePlayers = sortPlayersToGeneralOrder(gameState.activePlayers);
    switch (gameState.currentRound) {
      case "preFlop":
        setGameState({
          ...gameState,
          currentRound: "flop",
          activePlayers,
          currentPlayer: activePlayers[0],
        });
        break;
      case "flop":
        setGameState({
          ...gameState,
          currentRound: "turn",
          activePlayers,
          currentPlayer: activePlayers[0],
        });
        break;
      case "turn":
        setGameState({
          ...gameState,
          currentRound: "river",
          activePlayers,
          currentPlayer: activePlayers[0],
        });
        break;
      default:
        throw new Error("Invalid round");
    }
  }, [gameState, setGameState]);

  return {
    gameState,
    setMyCards,
    commitAction,
    setCommunityCards,
    toNextRound,
    resetGameState,
  };
};

const playOrder = {
  SB: 0,
  BB: 1,
  UTG: 2,
  UTG1: 3,
  UTG2: 4,
  LJ: 5,
  HJ: 6,
  CO: 7,
  BTN: 8,
} as const satisfies Record<Position, number>;

const preFlopPlayOrder = {
  UTG: 0,
  UTG1: 1,
  UTG2: 2,
  LJ: 3,
  HJ: 4,
  CO: 5,
  BTN: 6,
  SB: 7,
  BB: 8,
} as const satisfies Record<Position, number>;

const sortPlayersToPreFlopOrder = (
  players: readonly Position[]
): Position[] => {
  return players.toSorted(
    (v1, v2) => preFlopPlayOrder[v1] - preFlopPlayOrder[v2]
  );
};

const sortPlayersToGeneralOrder = (
  players: readonly Position[]
): Position[] => {
  return players.toSorted((v1, v2) => playOrder[v1] - playOrder[v2]);
};

const findNextPlayer = ({
  round,
  currentPlayer,
  activePlayers,
}: {
  readonly round: GameRound;
  readonly currentPlayer: Position;
  readonly activePlayers: readonly Position[];
}): Position => {
  if (round === "preFlop") {
    const sorted = sortPlayersToPreFlopOrder(activePlayers);
    const currentPlayerIndex = preFlopPlayOrder[currentPlayer];
    return (
      sorted.find((player) => preFlopPlayOrder[player] > currentPlayerIndex) ||
      sorted[0]
    );
  }

  const sorted = sortPlayersToGeneralOrder(activePlayers);
  const currentPlayerIndex = playOrder[currentPlayer];
  return (
    sorted.find((player) => playOrder[player] > currentPlayerIndex) || sorted[0]
  );
};

const findFirstPlayer = (playersCount: number): Position => {
  switch (playersCount) {
    case 2:
      return "SB";
    case 3:
      return "BTN";
    default:
      return "UTG";
  }
};

const generateInitialPlayers = (playersCount: number): Position[] => {
  switch (playersCount) {
    case 2:
      return ["SB", "BB"];
    case 3:
      return ["BTN", "SB", "BB"];
    case 4:
      return ["UTG", "BTN", "SB", "BB"];
    case 5:
      return ["UTG", "CO", "BTN", "SB", "BB"];
    case 6:
      return ["UTG", "HJ", "CO", "BTN", "SB", "BB"];
    case 7:
      return ["UTG", "LJ", "HJ", "CO", "BTN", "SB", "BB"];
    case 8:
      return ["UTG", "UTG1", "LJ", "HJ", "CO", "BTN", "SB", "BB"];
    case 9:
      return ["UTG", "UTG1", "UTG2", "LJ", "HJ", "CO", "BTN", "SB", "BB"];
    default:
      throw new Error("Invalid players count");
  }
};
