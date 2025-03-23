import type { BoardResult } from "~/results";
import type { Action, ActionAmount, Card, Position } from "~/types";
import { cardText } from "./card_util";
import { stackSizeToText } from "./stack_util";

const actionsToReadableString = (
  actions: { player: Position; action: Action }[]
) => {
  return actions
    .map(({ player, action }) => {
      if (action.type === "fold") {
        return `${player} フォールド`;
      }
      if (action.type === "checkOrCall") {
        return `${player} チェック or コール`;
      }
      if (action.type === "betOrRaise") {
        return `${player} ベット or レイズ, サイズ:  ${action.amount}`;
      }
      return "";
    })
    .join(" -> ");
};

export const resultToHumanReadableString = (result: BoardResult): string => {
  const playersCount = `人数: ${result.table.playersCount}`;
  const heroPosition = result.game.myPosition;
  const hero = `Hero: ${heroPosition}`;
  const heroHands = result.game.playersState[heroPosition].hands;
  const heroHandsText = heroHands
    ? `Heroのハンド: ${result.game.playersState[heroPosition].hands
        ?.map(cardText)
        .join(", ")}`
    : "";
  const preFlop = `PreFlopのアクション: ${actionsToReadableString(
    result.game.actions.preFlop
  )}`;

  const flopCards = result.game.communityCards.flop?.at(0)
    ? `Flopのカード: ${result.game.communityCards.flop
        ?.map(cardText)
        .join(" ")}`
    : "";
  const flopActions =
    result.game.actions.flop.length > 0
      ? `Flopのアクション: ${actionsToReadableString(result.game.actions.flop)}`
      : "";

  const turnCard = result.game.communityCards.turn?.at(0)
    ? `Turnのカード: ${result.game.communityCards.turn?.map(cardText)}`
    : "";
  const turnActions =
    result.game.actions.turn.length > 0
      ? `Turnのアクション: ${actionsToReadableString(result.game.actions.turn)}`
      : "";

  const riverCard = result.game.communityCards.river?.at(0)
    ? `Riverのカード: ${result.game.communityCards.river?.map(cardText)}`
    : "";
  const riverActions =
    result.game.actions.river.length > 0
      ? `Riverのアクション: ${actionsToReadableString(
          result.game.actions.river
        )}`
      : "";

  const effectiveStack = result.game.effectiveStack
    ? `エフェクティブスタック: ${stackSizeToText(result.game.effectiveStack)}`
    : "";

  const prefix =
    "テキサスホールデムの以下の状況で、heroが取るべきだったアクションをGTOの観点から教えてください。";

  const suffix = `※ プリフロップでは3bb以下のオープンを中 それ以上を大としています。
ベットサイズは0.5ポット以下を小 1ポット以下を中 1.5ポット以下を大 それ以上を超大 としています。
レイズは2倍以下のサイズを小 2倍以上3倍以下を中 3倍以上を大としています。`;

  return `${prefix}\n${playersCount}\n${hero}\n${heroHandsText}\n\n${preFlop}\n${flopCards}\n${flopActions}\n${turnCard}${turnActions}\n${riverCard}\n${riverActions}\n${effectiveStack}\n\n${suffix}`;
};
