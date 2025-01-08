import { revalidateTimestampPage } from "../revalidate";

export async function POST(request: Request) {
  // we can't call unstable_expirePath from middleware, so we need to do it from here instead
  const url = new URL(request.url);
  const path = url.searchParams.get("path");
  const id = url.searchParams.get("id");
  if (!path) {
    return Response.json(
      { message: 'Missing "path" search param' },
      { status: 400 }
    );
  }
  await revalidateTimestampPage(path, id ?? "no id");
  return Response.json({});
}
