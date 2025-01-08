import Link from "next/link";

export default function Page() {
  return (
    <main>
      <Links href={"/triggers-middleware/after"} />
      <Links href={"/triggers-middleware/waitUntil"} />
    </main>
  );
}

function Links({ href }: { href: string }) {
  return (
    <div>
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
