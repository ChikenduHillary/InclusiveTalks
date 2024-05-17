import TopNav from "@/components/TopNav";
import { FunctionComponent } from "react";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";

import Footer from "@/components/footer";
import AdminPage from "@/components/AdminPage";
import { db } from "@/db";
import { redirect } from "next/navigation";

interface PageProps {}

const Page: FunctionComponent<PageProps> = async () => {
  const { getUser } = getKindeServerSession();
  const user = await getUser();

  if (user) {
    const dbUser = await db.user.findFirst({
      where: {
        id: user!.id,
      },
    });

    if (!dbUser) redirect("/auth-callback?origin=admin");
  }

  return (
    <section>
      <TopNav />
      <AdminPage user={user} />
      <Footer />
    </section>
  );
};

export default Page;
