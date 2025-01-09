import Link from "next/link";

export default async function Page({
  params,
}: {
  params: Promise<{ num: string }>;
}) {
  const { num } = await params;
  return (
    <main style={{ fontFamily: "monospace" }}>
      <h3>Trigger a ping from middleware:</h3>
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
      <br />
      <hr />
      <Link prefetch={false} href="/logs">
        view ping logs
      </Link>
      <br />
      <Link prefetch={false} href={`/`}>
        New random number
      </Link>
      <br />
    </main>
  );
}
