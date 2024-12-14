import type { Card } from "~/game";

export function cardText(card: Card): string {
  switch (card.suit) {
    case "c":
      return `${card.number}♣`;
    case "d":
      return `${card.number}♦`;
    case "h︎":
      return `${card.number}♥`;
    case "s":
      return `${card.number}♠`;
  }
}
