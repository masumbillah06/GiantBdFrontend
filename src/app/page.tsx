import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { AUTH_TOKEN_KEY } from "@/lib/auth/session";

export default async function Home() {
  const cookieStore = await cookies();
  const token = cookieStore.get(AUTH_TOKEN_KEY)?.value;

  if (token) {
    redirect("/inventory/dashboard");
  } else {
    redirect("/login");
  }
}
