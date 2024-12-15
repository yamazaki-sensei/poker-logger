import type { Card, CardSuit } from "~/types";

export function cardText(card: Card): string {
  switch (card.suit) {
    case "c":
      return `${card.number}♣`;
    case "d":
      return `${card.number}♢`;
    case "h":
      return `${card.number}♡`;
    case "s":
      return `${card.number}♠`;
  }
}

export function suitMark(suit: CardSuit): string {
  switch (suit) {
    case "c":
      return "♣";
    case "d":
      return "♢";
    case "h":
      return "︎♡";
    case "s":
      return "♠";
  }
}
