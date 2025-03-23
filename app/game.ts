"use client";
import type { TableState } from "./table";
import type {
  Action,
  ActionWithPlayer,
  Card,
  GameRound,
  Position,
  StackSize,
} from "./types";
import { atom, useAtom } from "jotai";

type PlayerState = {
  hands: [Card, Card] | undefined;
};

export interface GameState {
  readonly currentRound: GameRound;
  readonly currentPlayer: Position;
  readonly myPosition: Position;
  readonly playersState: Record<Position, PlayerState>;
  readonly currentBetSizes: Record<Position, number>;
  readonly gameIndex: number;
  readonly activePlayers: readonly Position[];
  readonly allPlayers: readonly Position[];
  readonly betSize: number;
  readonly potSize: number;
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
  readonly memo: string;
  readonly previousState?: GameState;
  readonly effectiveStack?: StackSize;
}

const defaultGameState: GameState = {
  currentRound: "preFlop",
  currentPlayer: "UTG",
  playersState: {
    UTG: { hands: undefined },
    UTG1: { hands: undefined },
    UTG2: { hands: undefined },
    LJ: { hands: undefined },
    HJ: { hands: undefined },
    CO: { hands: undefined },
    BTN: { hands: undefined },
    SB: { hands: undefined },
    BB: { hands: undefined },
  },
  currentBetSizes: {
    UTG: 0,
    UTG1: 0,
    UTG2: 0,
    LJ: 0,
    HJ: 0,
    CO: 0,
    BTN: 0,
    SB: 0,
    BB: 0,
  },
  myPosition: "UTG",
  activePlayers: [],
  allPlayers: [],
  betSize: 0,
  potSize: 0,
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
  memo: "",
  previousState: undefined,
};

const gameAtom = atom<GameState>(defaultGameState);

export const useGameState = (): {
  readonly gameState: GameState;
  updatePlayerState: (position: Position, state: PlayerState) => void;
  setMyPosition: (position: Position) => void;
  commitAction: (round: GameRound, action: ActionWithPlayer) => void;
  revertLastAction: () => void;
  toNextRound: () => void;
  setCommunityCards: (round: GameRound, cards: Card[]) => void;
  setMemo: (memo: string) => void;
} => {
  const [gameState, setGameState] = useAtom(gameAtom);

  const updatePlayerState = (position: Position, state: PlayerState) => {
    setGameState({
      ...gameState,
      playersState: {
        ...gameState.playersState,
        [position]: state,
      },
    });
  };

  const setMyPosition = (position: Position) => {
    setGameState({
      ...gameState,
      myPosition: position,
    });
  };

  const commitAction = (round: GameRound, action: ActionWithPlayer) => {
    const copiedAction = { ...action };

    const nextPlayers =
      copiedAction.action.type === "fold"
        ? gameState.activePlayers.filter((v) => v !== copiedAction.player)
        : gameState.activePlayers;

    setGameState({
      ...gameState,
      actions: {
        ...gameState.actions,
        [round]: [...gameState.actions[round], copiedAction],
      },
      activePlayers: nextPlayers,
      playersState: {
        ...gameState.playersState,
      },
      currentPlayer: findNextPlayer({
        round: gameState.currentRound,
        currentPlayer: gameState.currentPlayer,
        activePlayers: gameState.activePlayers,
      }),
      previousState: gameState,
    });
  };

  const revertLastAction = () => {
    if (!gameState.previousState) {
      return;
    }

    setGameState({ ...gameState.previousState, memo: gameState.memo });
  };

  const setCommunityCards = (round: GameRound, cards: Card[]) => {
    setGameState({
      ...gameState,
      communityCards: {
        ...gameState.communityCards,
        [round]: cards,
      },
    });
  };

  const toNextRound = () => {
    const activePlayers = sortPlayersToGeneralOrder(gameState.activePlayers);
    switch (gameState.currentRound) {
      case "preFlop":
        setGameState({
          ...gameState,
          betSize: 0,
          currentRound: "flop",
          currentBetSizes: {
            UTG: 0,
            UTG1: 0,
            UTG2: 0,
            LJ: 0,
            HJ: 0,
            CO: 0,
            BTN: 0,
            SB: 0,
            BB: 0,
          },
          activePlayers,
          currentPlayer: activePlayers[0],
        });
        break;
      case "flop":
        setGameState({
          ...gameState,
          betSize: 0,
          currentRound: "turn",
          currentBetSizes: {
            UTG: 0,
            UTG1: 0,
            UTG2: 0,
            LJ: 0,
            HJ: 0,
            CO: 0,
            BTN: 0,
            SB: 0,
            BB: 0,
          },
          activePlayers,
          currentPlayer: activePlayers[0],
        });
        break;
      case "turn":
        setGameState({
          ...gameState,
          betSize: 0,
          currentRound: "river",
          currentBetSizes: {
            UTG: 0,
            UTG1: 0,
            UTG2: 0,
            LJ: 0,
            HJ: 0,
            CO: 0,
            BTN: 0,
            SB: 0,
            BB: 0,
          },
          activePlayers,
          currentPlayer: activePlayers[0],
        });
        break;
      default:
        throw new Error("Invalid round");
    }
  };

  const setMemo = (memo: string) => {
    setGameState({ ...gameState, memo });
  };

  return {
    gameState,
    updatePlayerState,
    setMyPosition,
    commitAction,
    revertLastAction,
    setCommunityCards,
    toNextRound,
    setMemo,
  };
};

export const useGameStateReset = (): {
  resetGame: (table: TableState) => void;
} => {
  const setGameState = useAtom(gameAtom)[1];

  const resetGame = (table: TableState) => {
    setGameState((prev) => ({
      currentRound: "preFlop",
      currentPlayer: findFirstPlayer(table.playersCount),
      myPosition: prev.myPosition,
      gameIndex: prev.gameIndex + 1,
      playersState: {
        UTG: { initialStack: undefined, hands: undefined },
        UTG1: { initialStack: undefined, hands: undefined },
        UTG2: { initialStack: undefined, hands: undefined },
        LJ: { initialStack: undefined, hands: undefined },
        HJ: { initialStack: undefined, hands: undefined },
        CO: { initialStack: undefined, hands: undefined },
        BTN: { initialStack: undefined, hands: undefined },
        SB: {
          initialStack: undefined,
          hands: undefined,
        },
        BB: {
          initialStack: undefined,
          hands: undefined,
        },
      },
      currentBetSizes: {
        UTG: 0,
        UTG1: 0,
        UTG2: 0,
        LJ: 0,
        HJ: 0,
        CO: 0,
        BTN: 0,
        SB: table.sb,
        BB: table.bb,
      },
      betSize: table.bb,
      potSize: table.bb + table.sb + table.ante,
      activePlayers: sortPlayersToPreFlopOrder(
        generateInitialPlayers(table.playersCount)
      ),
      allPlayers: generateInitialPlayers(table.playersCount),
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
      memo: "",
    }));
  };

  return {
    resetGame,
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

export const sortPlayersToGeneralOrder = (
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

export const generateInitialPlayers = (playersCount: number): Position[] => {
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
