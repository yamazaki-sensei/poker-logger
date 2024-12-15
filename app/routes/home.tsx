import { useEffect, useState, type ReactNode } from "react";
import * as Tabs from "@radix-ui/react-tabs";
import { GameActions } from "~/components/GameActions";
import { useGameState } from "~/game";

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

export default function Home() {
  const { gameState, resetGameState } = useGameState();
  useEffect(resetGameState, []);
  const [tab, setTab] = useState("preFlop");

  useEffect(() => {
    if (gameState.gameIndex > 0) {
      setTab("preFlop");
    }
  }, [gameState.gameIndex]);

  return (
    <Tabs.Root value={tab} className="w-full" onValueChange={(v) => setTab(v)}>
      <Tabs.List
        aria-label="Tabs"
        className="flex overflow-x-auto border-b border-gray-300 p-2 gap-2 w-full"
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
        <h2 className="text-lg font-semibold mb-2">Pre Flop</h2>
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
        <h2 className="text-lg font-semibold mb-2">Flop</h2>
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
        <h2 className="text-lg font-semibold mb-2">Turn</h2>
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
        <h2 className="text-lg font-semibold mb-2">River</h2>
        <GameActions round="river" />
      </Tabs.Content>
    </Tabs.Root>
  );
}
