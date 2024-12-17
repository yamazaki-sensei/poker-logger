import { ChevronLeft } from "lucide-react";
import { Suspense, use, useState, type ReactNode } from "react";
import { Link } from "react-router";
import { Spinner } from "~/components/ui/spinner";
import { loadResults, type BoardResult } from "~/results";
import { format } from "date-fns";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "~/components/ui/table";

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

const DataTable = ({
  results,
}: {
  results: { date: Date; payload: BoardResult }[];
}) => {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>日時</TableHead>
          <TableHead>メモ</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {results.map((v) => (
          <TableRow
            key={v.date.toISOString()}
            className="hover:bg-gray-100 cursor-pointer p-4"
          >
            <TableCell>{format(v.date, "yyyy/MM/dd hh:mm:ss")}</TableCell>
            <TableCell>{v.payload.game.memo}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default function Results() {
  return (
    <Suspense fallback={<Spinner />}>
      <div className="p-4">
        <Link to="/">
          <ChevronLeft />
        </Link>
      </div>
      <div className="p-4">
        <DataLoader consumer={(results) => <DataTable results={results} />} />
      </div>
    </Suspense>
  );
}
