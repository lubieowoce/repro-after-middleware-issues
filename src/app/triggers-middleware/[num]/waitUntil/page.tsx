import { requestId } from "../request-id";

export default async function Page() {
  return (
    <div>triggered ping for waitUntil (requestId: {await requestId()})</div>
  );
}
