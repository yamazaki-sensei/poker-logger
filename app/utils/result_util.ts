import { generateInitialPlayers, sortPlayersToGeneralOrder } from "~/game";
import type { BoardResult } from "~/results";
import type { Action, Card, Position } from "~/types";

type StoryMakerResult = {
  readonly PlayerCount: string;
  readonly HeroPosition: string;
  readonly BB: string;
  readonly SB: string;
  readonly Ante: string;
  readonly StartChipCount: string;
  readonly ViewMode: "Chip";
  readonly Hand: string;
  readonly Board: string;
  readonly Preflop: string;
  readonly Flop: string;
  readonly Turn: string;
  readonly River: string;
};

const positionToIndex = (position: Position, playersCount: number): number => {
  const sortedPlayers = sortPlayersToGeneralOrder(
    generateInitialPlayers(playersCount)
  );
  return sortedPlayers.indexOf(position) + 1;
};

const cardToText = (card: Card | undefined): string => {
  if (!card) {
    return "";
  }
  return `${card.number}${card.suit}`;
};

const actionsToText = (
  source: { player: Position; action: Action }[]
): string => {
  return source
    .map((v) => {
      if (v.action.type === "fold") {
        return "f";
      }
      if (v.action.type === "checkOrCall") {
        return `c:${v.action.amount}`;
      }
      if (v.action.type === "raise") {
        return `r:${v.action.amount}`;
      }
      return "";
    })
    .join(",");
};

const buildStoryMakerResult = (result: BoardResult): StoryMakerResult => {
  const { game, table } = result;
  const sortedPlayers = sortPlayersToGeneralOrder(
    generateInitialPlayers(table.playersCount)
  );
  const StartChipCount = sortedPlayers
    .map((player) => result.game.playersState[player].initialStack)
    .join(",");
  const Hand = sortedPlayers
    .map((v, i) => {
      const index = v === game.myPosition ? 0 : i + 1;
      return `${index}:${cardToText(
        result.game.playersState[v].hands?.[0]
      )}${cardToText(result.game.playersState[v].hands?.[1])}`;
    })
    .join(",");
  const Board = [
    ...(result.game.communityCards.flop ?? []),
    ...(result.game.communityCards.turn ?? []),
    ...(result.game.communityCards.river ?? []),
  ]
    .map(cardToText)
    .join("");
  const Preflop = actionsToText(result.game.actions.preFlop);
  const Flop = actionsToText(result.game.actions.flop);
  const Turn = actionsToText(result.game.actions.turn);
  const River = actionsToText(result.game.actions.river);

  return {
    PlayerCount: `${table.playersCount}`,
    HeroPosition: `${positionToIndex(game.myPosition, table.playersCount)}`,
    BB: `${table.bb}`,
    SB: `${table.sb}`,
    Ante: `${
      table.ante / table.playersCount - ((table.ante / table.playersCount) % 10)
    }`,
    StartChipCount,
    ViewMode: "Chip",
    Hand,
    Board,
    Preflop,
    Flop,
    Turn,
    River,
  };
};

// https://pokertrainer.jp/StoryMaker/?
// PlayerCount=4&
// HeroPosition=3&
// BB=200&
// SB=100&
// Ante=200&
// StartChipCount=20000,20000,20000,20000&
// ViewMode=Chip&
// Hand=0:6dQc,4:KsQd,1:7c8c,2:9hAc&
// Board=6cTdKcTsQd&
// Preflop=r:600,f,c:500,c:400&
// Flop=&
// Turn=&
// River=&
// WinPlayerPosition=&
// HideBetChip=0

export const resultToHandHistory = (result: BoardResult): string => {
  const storyMakerResult = buildStoryMakerResult(result);
  const query = new URLSearchParams(storyMakerResult).toString();
  return `https://pokertrainer.jp/StoryMaker/?${query}`;
};
