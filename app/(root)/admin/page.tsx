import TopNav from "@/components/TopNav";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";

import Footer from "@/components/footer";
import AdminPage from "@/components/AdminPage";
import db from "@/db";
import { redirect } from "next/navigation";

interface User {
  name: string;
  id: string;
  email: string;
}

export default async function Page() {
  const { getUser } = getKindeServerSession();
  const user = await getUser();
  const userJsons = await db.smembers("users");
  console.log({ user });
  console.log({ userJsons });

  // Find the user object with the matching ID
  if (user?.id) {
    const dbUser = userJsons
      .map((userJson) => userJson as unknown as User)
      .find((userdb: any) => userdb.id === user?.id);

    if (!dbUser?.id) redirect("/auth-callback?origin=admin");
  }

  return (
    <section>
      <TopNav />
      <AdminPage user={user} />
      <Footer />
    </section>
  );
}
