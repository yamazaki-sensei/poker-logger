import { ChevronLeft, TrashIcon } from "lucide-react";
import { Suspense, use, useState, type ReactNode } from "react";
import { Link } from "react-router";
import { Spinner } from "~/components/ui/spinner";
import { loadResults, useResultsWriter, type BoardResult } from "~/results";
import { format } from "date-fns";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "~/components/ui/table";
import { resultToHandHistory } from "~/utils/result_util";
import { useToast } from "~/hooks/use-toast";

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
  onDelete,
}: {
  results: { date: Date; payload: BoardResult }[];
  onDelete: () => void;
}) => {
  const { removeBoard } = useResultsWriter();
  const { toast } = useToast();
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>日時</TableHead>
          <TableHead>メモ</TableHead>
          <TableHead>削除</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {results.map((v, i) => (
          <TableRow
            key={v.date.toISOString()}
            className="hover:bg-gray-100 cursor-pointer p-4"
            onClick={async () => {
              await navigator.clipboard.writeText(
                resultToHandHistory(v.payload)
              );
              toast({
                description:
                  "ハンド履歴をハンドヒストリーフォーマットでクリップボードにコピーしました",
              });
            }}
          >
            <TableCell>{format(v.date, "yyyy/MM/dd hh:mm:ss")}</TableCell>
            <TableCell>{v.payload.game.memo}</TableCell>
            <TableCell
              onClick={() => {
                removeBoard(i);
                onDelete();
              }}
            >
              <TrashIcon />
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default function Results() {
  const [index, setIndex] = useState(0);
  return (
    <>
      <div className="p-4">
        <Link to="/">
          <ChevronLeft />
        </Link>
      </div>
      <Suspense fallback={<Spinner />}>
        <div className="p-4" key={index}>
          <DataLoader
            consumer={(results) => (
              <>
                <DataTable
                  results={results}
                  onDelete={() => setIndex(index + 1)}
                />
                <div>{resultToHandHistory(results[0].payload)}</div>
              </>
            )}
          />
        </div>
      </Suspense>
    </>
  );
}
