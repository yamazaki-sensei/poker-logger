import { Tabs } from "@radix-ui/themes";

export function meta() {
  return [
    { title: "New React Router App" },
    { name: "description", content: "Welcome to React Router!" },
  ];
}

export default function Home() {
  return (
    <Tabs.Root defaultValue="pre-flop">
      <Tabs.List className="flex gap-4">
        <Tabs.Trigger value="pre-flop">Pre-Flop</Tabs.Trigger>
        <Tabs.Trigger value="flop">Flop</Tabs.Trigger>
        <Tabs.Trigger value="turn">Turn</Tabs.Trigger>
        <Tabs.Trigger value="river">River</Tabs.Trigger>
      </Tabs.List>
      <Tabs.Content value="pre-flop">pre-flop</Tabs.Content>
      <Tabs.Content value="flop">flop</Tabs.Content>
      <Tabs.Content value="turn">turn</Tabs.Content>
      <Tabs.Content value="river">river</Tabs.Content>
    </Tabs.Root>
  );
}
