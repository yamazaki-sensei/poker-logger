import { useEffect, type ReactNode } from "react";
import * as Tabs from "@radix-ui/react-tabs";
import { GameActions } from "~/components/GameActions";
import { useGameState } from "~/game";

export function meta() {
  return [
    { title: "New React Router App" },
    { name: "description", content: "Welcome to React Router!" },
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
  const { resetGameState } = useGameState();
  useEffect(resetGameState, []);

  return (
    <Tabs.Root defaultValue="tab1" className="w-full">
      <Tabs.List
        aria-label="Tabs"
        className="flex overflow-x-auto border-b border-gray-300 p-2 gap-2 w-full"
      >
        <TabsTrigger value="tab1">Pre Flop</TabsTrigger>
        <TabsTrigger value="tab2">Flop</TabsTrigger>
        <TabsTrigger value="tab3">Turn</TabsTrigger>
        <TabsTrigger value="tab4">River</TabsTrigger>
      </Tabs.List>

      <Tabs.Content value="tab1" className="p-4 text-sm">
        <h2 className="text-lg font-semibold mb-2">Pre Flop</h2>
        <GameActions round="preFlop" />
      </Tabs.Content>

      <Tabs.Content value="tab2" className="p-4 text-sm">
        <h2 className="text-lg font-semibold mb-2">Flop</h2>
        <p>ここにタブ2の詳細コンテンツが表示されます。</p>
      </Tabs.Content>

      <Tabs.Content value="tab3" className="p-4 text-sm">
        <h2 className="text-lg font-semibold mb-2">Turn</h2>
        <p>ここにタブ3の詳細コンテンツが表示されます。</p>
      </Tabs.Content>

      <Tabs.Content value="tab4" className="p-4 text-sm">
        <h2 className="text-lg font-semibold mb-2">River</h2>
        <p>ここにタブ4の詳細コンテンツが表示されます。</p>
      </Tabs.Content>
    </Tabs.Root>
  );
}
