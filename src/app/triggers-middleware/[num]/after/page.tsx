import { requestId } from "../request-id";

export default async function Page() {
  return <div>triggered ping for after (requestId: {await requestId()})</div>;
}
