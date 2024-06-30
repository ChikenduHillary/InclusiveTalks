"use client";
import Skeleton from "react-loading-skeleton";
import { trpc } from "@/app/_trpc/client";
import TopNav from "@/components/TopNav";
import { format } from "date-fns";

const Page = () => {
  const { data: subscribers, isLoading } = trpc.getAllSubscribers.useQuery();

  return (
    <>
      <TopNav />
      <section className="p-5 md:p-10 bg-background min-h-screen">
        <div>
          <p className="text-brown p-5 text-3xl my-10 font-extrabold">
            Subscribers
          </p>
        </div>

        <div className="mt-10 p-5">
          {isLoading ? (
            <div className="space-y-3">
              <Skeleton baseColor="#FAE9DF" className="h-[5em]" />
              <Skeleton
                count={4}
                baseColor="rgba(0, 0, 0, 0.008)"
                className="h-[2em] space-y-2"
              />
            </div>
          ) : (
            <div className="bg-white rounded-xl grid place-items-center border-brown mt-10 p-5 border-2 mx-auto overflow-x-auto max-w-3xl ">
              <table className=" text-brown w-full">
                <thead>
                  <tr>
                    <th>Email</th>
                    <th>Date Subscribed</th>
                  </tr>
                </thead>
                <tbody className="text-center border-2 space-x-2 border-brown">
                  {subscribers
                    ? subscribers.map(({ email, subscribedAt }, i) => (
                        <tr
                          key={email}
                          className={`${
                            i % 2 == 0 ? "bg-[#DDAA99]" : "bg-[#FAE9DF]"
                          } bg-opacity-70 h-[2.5em]`}
                        >
                          <td>{email}</td>
                          <td>{format(subscribedAt, "Pp")}</td>
                        </tr>
                      ))
                    : null}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </section>
    </>
  );
};

export default Page;
