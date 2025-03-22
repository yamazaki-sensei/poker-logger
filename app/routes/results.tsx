import { ChevronLeft, TrashIcon } from "lucide-react";
import { Suspense, use, useState, type ReactNode } from "react";
import { Form, Link, useLoaderData, useSubmit } from "react-router";
import { Spinner } from "~/components/ui/spinner";
import { loadResults, removeBoard, type BoardResult } from "~/results";
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
import { Button } from "@radix-ui/themes";
import type { Route } from "./+types/results";

export async function clientLoader() {
  return await loadResults();
}

export async function clientAction({
  request,
  params,
}: Route.ClientActionArgs) {
  console.log(request);
  console.log(params);
  const formData = await request.formData();
  const index = formData.get("index");
  await removeBoard(Number(index));

  return await loadResults();
}

const DataTable = ({
  results,
}: {
  results: { date: Date; payload: BoardResult }[];
}) => {
  const { toast } = useToast();
  const submit = useSubmit();
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
                  "ハンド履歴メーカーのURLをクリップボードにコピーしました",
              });
            }}
          >
            <TableCell>{format(v.date, "yyyy/MM/dd hh:mm:ss")}</TableCell>
            <TableCell>{v.payload.game.memo}</TableCell>
            <TableCell>
              <Form
                method="POST"
                onSubmit={(event) => {
                  const formData = new FormData(event.currentTarget);
                  formData.set("index", `${i}`);
                  submit(formData);
                }}
              >
                <Button
                  type="submit"
                  variant="ghost"
                  name="index"
                  value={i}
                  onClick={(event) => {
                    event.stopPropagation();
                  }}
                >
                  <TrashIcon />
                </Button>
              </Form>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default function Results() {
  const results = useLoaderData<typeof clientLoader>();
  return (
    <>
      <div className="p-4">
        <Link to="/">
          <ChevronLeft />
        </Link>
      </div>
      <Suspense fallback={<Spinner />}>
        <div className="p-4">
          <DataTable results={results} />
        </div>
      </Suspense>
    </>
  );
}
