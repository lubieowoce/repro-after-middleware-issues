// @ts-check
import * as http from "node:http";

const STORED_PINGS = 100;
/** @typedef {{ timestamp: number, params: Record<string, string>, userAgent: string | null }} Entry */
/** @type {Entry[]} */
let pings = [];

const formatEntry = ({ timestamp, params, userAgent }) =>
  `[${new Date(
    timestamp
  ).toISOString()}] pinged at ${timestamp} ${JSON.stringify(
    params
  )} | ${userAgent}`;

http
  .createServer((req, res) => {
    if (!req.url) {
      throw new Error("No url");
    }

    const url = new URL(req.url, "http://_");
    if (url.pathname === "/ping") {
      const params = Object.fromEntries(url.searchParams.entries());
      const timestamp = Date.now();
      const entry = {
        params,
        timestamp,
        userAgent: req.headers["user-agent"] ?? null,
      };
      pings.push(entry);
      console.log(formatEntry(entry));

      if (pings.length > STORED_PINGS) {
        pings = pings.slice(-STORED_PINGS);
      }
      return res.end("pong");
    }

    if (url.pathname === "/logs") {
      res.setHeader("content-type", "application/json");
      return res.end(JSON.stringify(pings));
    }

    // default: 404
    res.statusCode = 404;
    res.end("not found");
  })
  .listen(
    {
      port: Number.parseInt(process.env.PORT ?? "8080"),
      host: process.env.HOST || "0.0.0.0",
    },
    () => {
      console.log("ping server started");
    }
  );
