import { redirect } from "next/navigation";
import { connection } from "next/server";

export default async function Page() {
  await connection();
  const num = (Math.floor(Math.random() * 1000) + "").padStart(4, "0");
  redirect("/links/" + num);
}
