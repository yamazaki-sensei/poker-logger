import { use, useEffect, useState, type ReactNode } from "react";
import * as Tabs from "@radix-ui/react-tabs";
import { GameActions } from "~/components/GameActions";
import { useGameState, useGameStateReset } from "~/game";
import type { Card, GameRound } from "~/types";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "~/components/ui/dialog";
import { Button } from "~/components/ui/button";
import { cardText } from "~/utils/card_util";
import { CardSelect } from "~/components/CardSelect";
import { gameRoundText } from "~/utils/round_util";
import { TableSettingsFrame } from "~/TableSettingsFrame";
import { useTable } from "~/table";

export function meta() {
  return [
    { title: "Poker logger" },
    { name: "description", content: "For you" },
  ];
}

function TabsTrigger({
  children,
  value,
}: {
  children: ReactNode;
  value: string;
}) {
  return (
    <Tabs.Trigger
      className="flex-1 px-4 py-2 text-sm bg-transparent hover:bg-gray-100 rounded transition-colors data-[state=active]:bg-gray-400 font-medium whitespace-nowrap"
      value={value}
    >
      {children}
    </Tabs.Trigger>
  );
}

const RoundTitle = ({ round }: { round: GameRound }) => {
  const [cardsDialogOpened, setCardsDialogOpened] = useState(false);
  const { gameState, setCommunityCards } = useGameState();
  if (round === "preFlop") {
    return (
      <div className="flex items-center">
        <h2 className="text-lg font-semibold mb-2">{gameRoundText(round)}</h2>
      </div>
    );
  }

  const current = gameState.communityCards[round];
  const cardsCount = round === "flop" ? 3 : 1;
  const onCardsChange = (cards: Card[]) => {
    setCardsDialogOpened(false);
    setCommunityCards(round, cards);
  };

  return (
    <div className="flex items-center">
      <h2 className="text-lg font-semibold mb-2">{gameRoundText(round)}</h2>
      <div className="ml-2 mb-2">
        <Dialog open={cardsDialogOpened} onOpenChange={setCardsDialogOpened}>
          <Button variant="outline" onClick={() => setCardsDialogOpened(true)}>
            {current
              ? current.map((v) => cardText(v)).join(" ")
              : "コミュニティカード登録"}
          </Button>
          <DialogContent>
            <DialogTitle>{`${gameRoundText(round)}`}</DialogTitle>
            <DialogDescription>コミュニティカードを選択</DialogDescription>
            <CardSelect count={cardsCount} onSelect={onCardsChange} />
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default function Home() {
  const { gameState } = useGameState();
  const { resetGame } = useGameStateReset();
  const { table } = useTable();
  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  useEffect(() => {
    resetGame(table);
  }, [table]);

  const [tab, setTab] = useState("preFlop");

  useEffect(() => {
    if (gameState.gameIndex > 0) {
      setTab("preFlop");
    }
  }, [gameState.gameIndex]);

  return (
    <TableSettingsFrame>
      <Tabs.Root
        value={tab}
        className="w-full"
        onValueChange={(v) => setTab(v)}
      >
        <Tabs.List
          aria-label="Tabs"
          className="flex overflow-x-auto border-b border-gray-300 p-2 gap-2 w-full sticky top-0 bg-secondary"
        >
          <TabsTrigger value="preFlop">Pre Flop</TabsTrigger>
          <TabsTrigger value="flop">Flop</TabsTrigger>
          <TabsTrigger value="turn">Turn</TabsTrigger>
          <TabsTrigger value="river">River</TabsTrigger>
        </Tabs.List>

        <Tabs.Content
          value="preFlop"
          className={`p-4 ${tab === "preFlop" ? "" : "hidden"}`}
          forceMount
        >
          <RoundTitle round="preFlop" />
          <GameActions
            round="preFlop"
            onNextRound={() => {
              setTab("flop");
            }}
          />
        </Tabs.Content>

        <Tabs.Content
          value="flop"
          className={`p-4 ${tab === "flop" ? "" : "hidden"}`}
          forceMount
        >
          <RoundTitle round="flop" />
          <GameActions
            round="flop"
            onNextRound={() => {
              setTab("turn");
            }}
          />
        </Tabs.Content>

        <Tabs.Content
          value="turn"
          className={`p-4 ${tab === "turn" ? "" : "hidden"}`}
          forceMount
        >
          <RoundTitle round="turn" />
          <GameActions
            round="turn"
            onNextRound={() => {
              setTab("river");
            }}
          />
        </Tabs.Content>

        <Tabs.Content
          value="river"
          className={`p-4 ${tab === "river" ? "" : "hidden"}`}
          forceMount
        >
          <RoundTitle round="river" />
          <GameActions round="river" />
        </Tabs.Content>
      </Tabs.Root>
    </TableSettingsFrame>
  );
}
