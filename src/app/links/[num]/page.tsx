import Link from "next/link";

export default async function Page({
  params,
}: {
  params: Promise<{ num: string }>;
}) {
  const { num } = await params;
  return (
    <main style={{ fontFamily: "monospace" }}>
      <div>
        <h3>Try to trigger a ping from middleware</h3>
        <Link href={`/triggers-middleware/${num}/after`}>inside after()</Link>
        <br />
        <Link href={`/triggers-middleware/${num}/waitUntil`}>
          inside waitUntil()
        </Link>
        <br />
        <Link href={`/triggers-middleware/${num}/event.waitUntil`}>
          inside event.waitUntil()
        </Link>
        <br />
        <Link href={`/triggers-middleware/${num}/instant`}>
          instantly (no wrappers)
        </Link>
      </div>
      <br />
      <hr />
      <h3>Check if the ping actually happened</h3>
      <div>
        your random prefix is: <strong>{num}</strong>. this allows multiple
        people to view this at once and filter out the logs. you can{" "}
        <Link prefetch={false} href={`/`}>
          get a new random prefix
        </Link>{" "}
        if you want
      </div>
      <br />
      <Link
        prefetch={false}
        href={
          "/logs" +
          "?" +
          new URLSearchParams({ filter: `/triggers-middleware/${num}` })
        }
      >
        view ping logs for prefix &quot;{num}&quot;
      </Link>
      {" / "}
      <Link prefetch={false} href="/logs">
        view all ping logs
      </Link>
      <br />
      <br />
    </main>
  );
}
