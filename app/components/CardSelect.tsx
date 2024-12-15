import { RadioGroup, RadioGroupItem } from "./ui/radio-group";
import { Label } from "./ui/label";
import { suitMark } from "~/utils/card_util";
import { useState } from "react";
import { Button } from "./ui/button";
import { cardNumbers, cardSuits, type Card } from "~/types";
import { Separator } from "./ui/separator";

export const CardSelect = ({
  count,
  onSelect,
}: {
  count: number;
  onSelect: (cards: Card[]) => void;
}) => {
  const [cards, setCards] = useState<Card[]>(
    Array(count).fill({ number: "2", suit: "s" })
  );

  const onCardChange = (i: number, key: "number" | "suit", value: string) => {
    const newCards = [...cards];
    newCards[i] = { ...newCards[i], [key]: value };
    setCards(newCards);
  };

  return (
    <div className="w-full">
      <div>
        {Array.from({ length: count })
          .map((_, i) => i)
          .map((i) => (
            <div key={`cards-${i}`} className="mb-2">
              <p className="font-bold">{`${i + 1}枚目`}</p>
              <RadioGroup
                value={cards[i].suit}
                onValueChange={(v) => onCardChange(i, "suit", v)}
                orientation="horizontal"
                className="flex"
              >
                {cardSuits.map((v) => (
                  <div
                    key={v}
                    className="flex flex-col justify-center items-center"
                  >
                    <Label htmlFor={`radio-suit-${i}-${v}`}>
                      {suitMark(v)}
                    </Label>
                    <RadioGroupItem id={`radio-suit-${i}-${v}`} value={v} />
                  </div>
                ))}
              </RadioGroup>
              <RadioGroup
                value={cards[i].number}
                onValueChange={(v) => onCardChange(i, "number", v)}
                orientation="horizontal"
                className="flex mt-2"
              >
                {cardNumbers.map((v) => (
                  <div
                    key={v}
                    className="flex flex-col justify-center items-center"
                  >
                    <Label htmlFor={`radio-${i}-${v}`}>{v}</Label>
                    <RadioGroupItem id={`radio-${i}-${v}`} value={v} />
                  </div>
                ))}
              </RadioGroup>
              <Separator className="mt-4" />
            </div>
          ))}
      </div>
      <div className="flex justify-end">
        <Button variant="default" onClick={() => onSelect(cards)}>
          確定
        </Button>
      </div>
    </div>
  );
};
