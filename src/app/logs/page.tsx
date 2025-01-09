import Form from "next/form";
import { Refresh } from "./refresh";

type Entry = {
  timestamp: number;
  params: Record<string, string>;
  userAgent: string | null;
};

const REFRESH_SECONDS = 3;

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const res = await fetch(new URL("/logs", process.env.PINGER_BASE_URL), {
    headers: { accept: "application/json" },
    cache: "no-store",
  });
  if (!res.ok) {
    console.error(`Error while fetching logs: ${res.status}`, await res.text());
    return <>Something went wrong while fetching logs</>;
  }

  const pings = (await res.json()) as Entry[];
  const filter = (await searchParams).filter as string | null;

  return (
    <>
      <main style={{ fontFamily: "monospace" }}>
        <div style={{ opacity: 0.5 }}>
          (refreshes every {REFRESH_SECONDS}s, newest at the top)
        </div>
        <br />
        <Form action="/logs">
          <input
            type="text"
            name="filter"
            defaultValue={filter ?? undefined}
            placeholder="Filter logs"
          />
          <button type="submit">Go</button>
        </Form>
        <br />
        {[...pings]
          .reverse()
          .map((entry) => [entry, formatEntry(entry)] as const)
          .filter(([, line]) => (filter ? line.includes(filter) : true))
          .map(([entry, line]) => (
            <div key={entry.timestamp}>{line}</div>
          ))}
      </main>
      <Refresh interval={REFRESH_SECONDS * 1000} />
    </>
  );
}

const formatEntry = ({ timestamp, params, userAgent }: Entry) =>
  `[${new Date(
    timestamp
  ).toISOString()}] pinged at ${timestamp} ${JSON.stringify(
    params
  )} | ${userAgent}`;
