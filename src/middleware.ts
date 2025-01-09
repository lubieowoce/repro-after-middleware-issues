import { waitUntil } from "@vercel/functions";
import {
  after,
  MiddlewareConfig,
  NextFetchEvent,
  NextRequest,
} from "next/server";
import { match } from "path-to-regexp";

export function middleware(request: NextRequest, event: NextFetchEvent) {
  const url = new URL(request.url);
  if (request.method !== "GET") {
    return;
  }
  const id =
    (Math.floor(Math.random() * 1000 + performance.now()) % 10000) + "";

  if (match("/triggers-middleware/:num/after")(url.pathname)) {
    console.log(`[${id}] middleware hit for path`, url.pathname);
    after(async () => {
      console.log(`[${id}] after() triggered for path`, url.pathname);
      try {
        await triggerRevalidate(url.pathname, url, id);
      } catch (err) {
        console.error(`[${id}] an error occurred while revalidating:`, err);
      }
      console.log(`[${id}] after() finished for path`, url.pathname);
    });
  } else if (match("/triggers-middleware/:num/waitUntil")(url.pathname)) {
    console.log(`[${id}] middleware hit for path`, url.pathname);
    waitUntil(
      (async () => {
        await sleep(300);
        console.log(`[${id}] waitUntil() triggered for path`, url.pathname);
        try {
          await triggerRevalidate(url.pathname, url, id);
        } catch (err) {
          console.error(`[${id}] an error occurred while revalidating:`, err);
        }
        console.log(`[${id}] waitUntil() finished for path`, url.pathname);
      })()
    );
  } else if (match("/triggers-middleware/:num/event.waitUntil")(url.pathname)) {
    console.log(`[${id}] middleware hit for path`, url.pathname);
    event.waitUntil(
      (async () => {
        await sleep(300);
        console.log(
          `[${id}] event.waitUntil() triggered for path`,
          url.pathname
        );
        try {
          await triggerRevalidate(url.pathname, url, id);
        } catch (err) {
          console.error(`[${id}] an error occurred while revalidating:`, err);
        }
        console.log(
          `[${id}] event.waitUntil() finished for path`,
          url.pathname
        );
      })()
    );
  }
}

async function triggerRevalidate(
  pathToRevalidate: string,
  url: URL,
  id: string
) {
  // we can't call unstable_expirePath from middleware, so we need to do it via an endpoint instead
  const postUrl = new URL("/timestamp/trigger-revalidate", url.href);
  postUrl.searchParams.append("path", pathToRevalidate);
  postUrl.searchParams.append("id", id);

  const response = await fetch(postUrl, { method: "POST" });
  if (!response.ok) {
    throw new Error(
      `Failed to revalidate path '${pathToRevalidate}' (status: ${response.status})`
    );
  }
}

function sleep(ms: number) {
  return new Promise<void>((resolve) => setTimeout(resolve, ms));
}

export const config: MiddlewareConfig = {
  matcher: ["/triggers-middleware/:path*"],
};
