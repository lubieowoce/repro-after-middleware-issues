import Link from "next/link";

export default async function Page({
  params,
}: {
  params: Promise<{ num: string }>;
}) {
  const { num } = await params;
  return (
    <main>
      <Links href={`/triggers-middleware/${num}/after`} />
      <Links href={`/triggers-middleware/${num}/waitUntil`} />
      <Links href={`/triggers-middleware/${num}/event.waitUntil`} />
      <hr />
      <Link prefetch={false} href={`/`}>
        New id
      </Link>
    </main>
  );
}

function Links({ href }: { href: string }) {
  return (
    <div style={{ border: "1px solid lightgrey", padding: "0.5em" }}>
      <div>
        <Link href={href} prefetch={false}>
          {href}
        </Link>
      </div>
      <div>
        <Link
          href={"/timestamp/key/" + encodeURIComponent(href)}
          prefetch={false}
        >
          timestamp for &quot;{href}&quot;
        </Link>
      </div>
    </div>
  );
}
