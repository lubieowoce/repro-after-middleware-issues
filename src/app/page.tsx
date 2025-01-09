import { redirect } from "next/navigation";
import { connection } from "next/server";

export default async function Page() {
  await connection();
  // give each viewer a random id so that their logs don't conflict
  const num = (Math.floor(Math.random() * 1000) + "").padStart(4, "0");
  redirect("/links/" + num);
}
