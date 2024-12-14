import { cardNumbers, type Card } from "~/game";

export const CardSelect = ({
  count,
  onSelect,
}: {
  count: number;
  onSelect: (card: Card) => void;
}) => {
  return (
    <div>
      {cardNumbers.map((v) => (
        <div key={v}>v</div>
      ))}
    </div>
  );
};
