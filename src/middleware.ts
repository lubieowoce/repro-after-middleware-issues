import { waitUntil } from "@vercel/functions";
import {
  after,
  MiddlewareConfig,
  NextFetchEvent,
  NextRequest,
  NextResponse,
} from "next/server";
import { match } from "path-to-regexp";

// the URL of a service running an instance of `ping.mjs` from the root of the repo
const PINGER_BASE_URL = process.env.PINGER_BASE_URL;

export async function middleware(request: NextRequest, event: NextFetchEvent) {
  const url = new URL(request.url);
  if (request.method !== "GET") {
    return;
  }
  const requestId =
    (Math.floor(Math.random() * 1000 + performance.now()) % 10000) + "";

  // add x-request-id
  const requestHeaders = new Headers(request.headers);
  requestHeaders.set("x-request-id", requestId);
  const response = NextResponse.next({ request: { headers: requestHeaders } });

  // no delay/waitUntil/anything, just run the ping directly as a sanity check
  if (match("/triggers-middleware/:num/instant")(url.pathname)) {
    console.log(`[${requestId}] middleware hit for path`, url.pathname);

    console.log(`[${requestId}] INSTANT triggered for path`, url.pathname);
    await sendPing(url.pathname, requestId);
    console.log(`[${requestId}] INSTANT finished for path`, url.pathname);

    return response;
  }

  // do the ping from after()
  if (match("/triggers-middleware/:num/after")(url.pathname)) {
    // after()
    console.log(`[${requestId}] middleware hit for path`, url.pathname);
    after(async () => {
      console.log(`[${requestId}] after() triggered for path`, url.pathname);
      await sendPing(url.pathname, requestId);
      console.log(`[${requestId}] after() finished for path`, url.pathname);
    });
    return response;
  }

  // do the ping from waitUntil(), after a delay
  if (match("/triggers-middleware/:num/waitUntil")(url.pathname)) {
    console.log(`[${requestId}] middleware hit for path`, url.pathname);
    waitUntil(
      (async () => {
        await sleep(300);
        console.log(
          `[${requestId}] waitUntil() triggered for path`,
          url.pathname
        );
        await sendPing(url.pathname, requestId);
        console.log(
          `[${requestId}] waitUntil() finished for path`,
          url.pathname
        );
      })()
    );
    return response;
  }

  // do the ping from event.waitUntil(), after a delay
  if (match("/triggers-middleware/:num/event.waitUntil")(url.pathname)) {
    console.log(`[${requestId}] middleware hit for path`, url.pathname);
    event.waitUntil(
      (async () => {
        await sleep(300);
        console.log(
          `[${requestId}] event.waitUntil() triggered for path`,
          url.pathname
        );
        await sendPing(url.pathname, requestId);
        console.log(
          `[${requestId}] event.waitUntil() finished for path`,
          url.pathname
        );
      })()
    );
    return response;
  }
}

async function sendPing(pathToRevalidate: string, requestId: string) {
  try {
    const pingUrl = new URL("/ping", PINGER_BASE_URL);
    pingUrl.searchParams.append("path", pathToRevalidate);
    pingUrl.searchParams.append("requestId", requestId);
    const res = await fetch(pingUrl);
    if (!res.ok) {
      throw new Error(`Ping request failed with status ${res.status}`);
    }
  } catch (err) {
    console.error("An error occurred while sending ping:", err);
  }
}

function sleep(ms: number) {
  return new Promise<void>((resolve) => setTimeout(resolve, ms));
}

export const config: MiddlewareConfig = {
  matcher: ["/triggers-middleware/:path*"],
};
