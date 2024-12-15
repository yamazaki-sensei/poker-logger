import { Suspense, use, useState, type ReactNode } from "react";
import { Spinner } from "~/components/ui/spinner";
import { loadResults, type BoardResult } from "~/results";

const DataLoader = ({
  consumer,
}: {
  consumer: (results: { date: Date; payload: BoardResult }[]) => ReactNode;
}) => {
  const [items] =
    useState<Promise<{ date: Date; payload: BoardResult }[]>>(loadResults);
  const results = use(items);
  return consumer(results);
};

export default function Results() {
  return (
    <Suspense fallback={<Spinner />}>
      <DataLoader
        consumer={(results) =>
          results.map((v) => (
            <div key={v.date.toISOString()}>{v.date.toISOString()}</div>
          ))
        }
      />
    </Suspense>
  );
}
