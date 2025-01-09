import { headers } from "next/headers";

export async function requestId() {
  return (await headers()).get("x-request-id");
}
