import { suitMark } from "~/utils/card_util";
import { useState } from "react";
import { Button } from "./ui/button";
import { cardNumbers, cardSuits, type Card } from "~/types";

export const CardSelect = ({
  count,
  onSelect,
}: {
  count: number;
  onSelect: (cards: Card[]) => void;
}) => {
  const [cards, setCards] = useState<Card[]>([]);

  const onCardClick = (card: Card) => {
    const next = [...cards];
    if (next.some((c) => c.number === card.number && c.suit === card.suit)) {
      next.splice(
        next.findIndex((c) => c.number === card.number),
        1
      );
    } else {
      next.push(card);
    }

    if (next.length > count) {
      return;
    }
    setCards(next);
  };

  const buttonText =
    cards.length === count ? "確定" : `あと${count - cards.length}枚`;

  return (
    <div className="space-y-4">
      <div className="border p-4 rounded-lg space-y-3">
        <div className="grid gap-3">
          {cardSuits.map((suit) => (
            <div key={suit} className="grid grid-cols-7">
              {cardNumbers.map((number) => (
                <div key={`${number}-${suit}`}>
                  <Button
                    variant="outline"
                    onClick={() => {
                      onCardClick({ number, suit });
                    }}
                    className={
                      cards.some((c) => c.number === number && c.suit === suit)
                        ? "bg-blue-200"
                        : ""
                    }
                  >
                    <div
                      className={`flex h-10 items-center justify-center rounded-md cursor-pointer ${
                        suit === "h" || suit === "d"
                          ? "text-red-500"
                          : "text-black"
                      }`}
                    >
                      {number}
                      {suitMark(suit)}
                    </div>
                  </Button>
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>

      <div className="flex justify-end space-x-4">
        <Button onClick={() => setCards([])}>リセット</Button>
        <Button disabled={cards.length < count} onClick={() => onSelect(cards)}>
          {buttonText}
        </Button>
      </div>
    </div>
  );
};
