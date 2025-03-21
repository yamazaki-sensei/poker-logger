import { useGameState } from "~/game";
import type { Position } from "~/types";

export const PositionText = ({
  position,
  className,
}: {
  position: Position;
  className?: string;
}) => {
  const { gameState } = useGameState();

  const textStyle = gameState.myPosition === position ? "text-red-500" : "";
  return (
    <span>
      <span className={`${textStyle} ${className}`}>{position}</span>
    </span>
  );
};
