"use client";

import { IoSearch } from "react-icons/io5";
import { FaAngleDown } from "react-icons/fa6";
import { MdArrowUpward } from "react-icons/md";
import { useForm } from "react-hook-form";
import { FaArrowDown } from "react-icons/fa6";
import { z } from "zod";
import { postValidations } from "@/lib/validations/post";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, TriangleAlert } from "lucide-react";
import { LoginLink } from "@kinde-oss/kinde-auth-nextjs";
import { trpc } from "@/app/_trpc/client";
import toast from "react-hot-toast";
import { format } from "date-fns";
import { useState } from "react";

type post = {
  id: string;
  num?: number;
  text: string;
  views?: number;
  createdAt?: string;
  updatedAt?: string;
  authorId: string | null;
};

type FormData = z.infer<typeof postValidations>;
const AdminPage = ({ user }: any) => {
  const [allPosts, setAllPosts] = useState<post[]>([]);

  const {
    register,
    handleSubmit,
    setError,
    reset,
    formState: { errors },
  } = useForm<FormData>({ resolver: zodResolver(postValidations) });

  const { mutate: createPost, isLoading } = trpc.createPost.useMutation({
    onSuccess: () => {
      toast.success("Posted Successfully");
      reset();
    },
  });

  const {
    data: allPostsDb,
    isLoading: allPostsLoadiing,
    error,
  } = trpc.getAllPost.useQuery();

  if (allPostsDb) {
    if (!(allPosts.length > 0)) setAllPosts(allPostsDb);
  }

  const onSubmit = async (data: FormData) => {
    try {
      createPost({ text: data.post });
    } catch (error) {
      toast.error("Something went wrong. try again later");
    }
  };

  return (
    <section>
      <div className="p-5 md:p-10 bg-background">
        <p className="text-brown p-5 text-3xl my-10 font-extrabold">
          Admin <br /> Page
        </p>

        {user ? (
          <div className="md:p-5">
            <div className="flex flex-col md:flex-row gap-5 items-center justify-between">
              <div className="text-brown self-start justify-between bg-white w-[25em] flex items-center p-3 rounded-xl border-2 border-brown">
                <IoSearch className="text-xl" />
                <input
                  type="search"
                  name=""
                  id=""
                  className="w-[90%] outline-none"
                  placeholder="Search.."
                />
              </div>
              <div className="text-brown self-end justify-between font-semibold bg-white gap-3 flex items-center p-3 rounded-xl border-2 border-brown">
                <p>Apr 1, 2024 - Apr 30, 2024</p>
                <FaAngleDown />
              </div>
            </div>

            <div className="bg-white rounded-xl grid place-items-center border-brown mt-10 p-5 border-2">
              {allPostsLoadiing ? (
                <Loader2 className="animate-spin w-7 h-7 text-brown" />
              ) : (
                <table className=" text-brown w-full">
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>Title</th>
                      <th>last Modified</th>
                      <th>Views</th>
                    </tr>
                  </thead>
                  <tbody className="text-center border-2 border-brown">
                    {allPosts
                      ? allPosts.map((post, i) => (
                          <tr
                            key={post.id}
                            className={`${
                              i % 2 == 0 ? "bg-[#DDAA99]" : "bg-[#FAE9DF]"
                            } bg-opacity-70 h-[2.5em]`}
                          >
                            <td>{i}</td>
                            <td>{post.text}</td>
                            <td>{format(post.createdAt!, "PPpp")}</td>
                            <td>{post.views}</td>
                          </tr>
                        ))
                      : null}
                  </tbody>
                </table>
              )}
            </div>

            <div>
              <div></div>
              <div>
                <div>
                  <div className="bg-brown p-3 mt-20 flex justify-center items-center rounded-lg text-white gap-2 w-[12em]">
                    <p>Add new blog post </p>
                    <FaArrowDown />
                  </div>
                  <form
                    onSubmit={handleSubmit(onSubmit)}
                    className="flex flex-col items-end"
                  >
                    <div className="bg-white w-full border-brown border-2 mt-10 rounded-lg p-5 pt-20 h-[30em]">
                      <textarea
                        className={`border-2 rounded-lg h-full p-5  w-full ${
                          errors.post?.message
                            ? "border-red-500"
                            : "border-brown"
                        }`}
                        {...register("post")}
                      />
                      {errors.post && (
                        <p className="text-red-600 gap-2 mt-5 flex items-center">
                          <TriangleAlert />
                          <span className="mt-1">{errors.post?.message}</span>
                        </p>
                      )}
                    </div>
                    <button
                      className="bg-brown p-3 mt-7 flex justify-center items-center rounded-lg text-white gap-2 w-[12em] disabled:bg-opacity-70"
                      disabled={isLoading}
                    >
                      <p>Upload Blog Post</p>
                      {isLoading ? (
                        <Loader2 className="animate-spin" />
                      ) : (
                        <MdArrowUpward />
                      )}
                    </button>
                  </form>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="text-brown text-center w-fit mx-auto">
            <p>Welcome please sign in to get started</p>
            <LoginLink>
              <p className="p-3 rounded-lg bg-brown mt-4 font-semibold text-white">
                Sign In
              </p>
            </LoginLink>
          </div>
        )}
      </div>
    </section>
  );
};

export default AdminPage;
