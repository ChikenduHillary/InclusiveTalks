"use client";

import { trpc } from "@/app/_trpc/client";
import TopNav from "@/components/TopNav";
import Image from "next/image";
import React from "react";
import Skeleton from "react-loading-skeleton";
// import aud from "../../../../public/audio.mp3";

const Page = ({ params: { blogId } }: { params: { blogId: string } }) => {
  const {
    data: blog,
    isLoading,
    error,
  } = trpc.getBlogPost.useQuery({ blogId });

  console.log(blog);

  return (
    <section>
      <TopNav />
      {isLoading ? (
        <div className="p-5">
          <Skeleton
            count={4}
            baseColor="rgba(0, 0, 0, 0.008)"
            className="h-[8em] space-y-2"
          />
        </div>
      ) : (
        <div className="bg-background border-t-2 border-white p-10 max-sm:p-5">
          <div>
            <h1 className="text-brown text-5xl mb-2 font-semibold">
              {blog?.title}
            </h1>
            <p className="text-3xl text-[#9e4021]">
              written By: {blog?.writtenBy}
            </p>
            <Image
              src={blog?.imgUrl!}
              className="w-full rounded-xl mt-5"
              height={1000}
              width={1000}
              alt="hapy"
            />

            <div className="p-2 w-full border-[#9e4021] border-2 my-5 rounded-full">
              <audio controls className="w-full">
                <source
                  className="bg-brown"
                  style={{ backgroundColor: "black" }}
                  src={blog?.audioUrl}
                  type="audio/mp3"
                />
                Your browser does not support the audio element.
              </audio>
            </div>
          </div>

          <div>
            <p
              className="text-lg text-[#9e4021] mt-10"
              dangerouslySetInnerHTML={{ __html: blog?.content! }}
            />
          </div>
        </div>
      )}
    </section>
  );
};

export default Page;
