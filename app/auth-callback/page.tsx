"use client";

import { Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { trpc } from "../_trpc/client";
import { Loader2 } from "lucide-react";

const Page = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const origin = searchParams.get("origin");

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <PageContent origin={origin} router={router} />
    </Suspense>
  );
};

const PageContent = ({ origin, router }: any) => {
  const { data, isLoading } = trpc.authCallback.useQuery(undefined, {
    onSuccess: ({ success }) => {
      if (success) {
        //user is synced to db
        router.push(origin ? `/${origin}` : "/admin");
      }
    },
    onError: (err) => {
      if (err.data?.code === "UNAUTHORIZED") {
        router.push("/admin");
      }
    },
    retry: true,
    retryDelay: 500,
  });

  return (
    <div className="w-full pt-24 text-center space-y-2 bg-background h-screen fixed top-0 justify-center">
      <div className="flex flex-col items-center gap-2">
        <Loader2 className="h-8 w-8 animate-spin text-zinc-800" />
        <h3 className="font-semibold text-xl">Setting up your account...</h3>
      </div>
      <p>You will be redirected automatically.</p>
    </div>
  );
};

export default Page;
