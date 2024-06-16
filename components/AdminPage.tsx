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
import { UploadDropzone } from "@/lib/uploadthing";
import "@uploadthing/react/styles.css";
import { FaCheckCircle } from "react-icons/fa";
import { post } from "@/types";

type FormData = z.infer<typeof postValidations>;
const AdminPage = ({ user }: any) => {
  const [allPosts, setAllPosts] = useState<any>([]);
  const [imgData, setImgData] = useState<{
    name: string;
    url: string;
  } | null>();
  const [audioData, setAudioData] = useState<{ name: string; url: string }>();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormData>({ resolver: zodResolver(postValidations) });

  const { mutate: createPost, isLoading } = trpc.createPost.useMutation({
    onSuccess: (data) => {
      toast.success("Posted Successfully");
      console.log(data);
      setAllPosts((prev: any) => {
        const sortedPosts = [...prev].slice().sort((a: any, b: any) => {
          return (
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          );
        });
        return sortedPosts;
      });
      setImgData(null);
      reset();
    },
  });

  const {
    data: allPostsDb,
    isLoading: allPostsLoadiing,
    error,
  } = trpc.getAllPost.useQuery();

  console.log(allPostsDb);

  if (allPostsDb) {
    if (allPostsDb.length == 0) {
      // Do nothing
    } else if (allPostsDb.length > 0) {
      console.log("working");
      if (allPosts.length !== allPostsDb.length) setAllPosts(allPostsDb);
    }
  }

  const onSubmit = async (data: FormData) => {
    const { post, writtenBy, title } = data;
    try {
      if (!imgData) return toast.error("Youve not added an image");
      createPost({
        text: post,
        writtenBy,
        title,
        imgUrl: imgData?.url!,
        audioUrl: audioData?.url!,
      });
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
              <div className="text-brown self-start justify-between bg-white max-w-[25em] w-full flex items-center p-3 rounded-xl border-2 border-brown">
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

            <div className="bg-white rounded-xl grid place-items-center border-brown mt-10 p-5 border-2 overflow-x-auto ">
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
                  <tbody className="text-center border-2 space-x-2 border-brown">
                    {allPosts
                      ? allPosts.map((post: any, i: number) => (
                          <tr
                            key={post.id}
                            className={`${
                              i % 2 == 0 ? "bg-[#DDAA99]" : "bg-[#FAE9DF]"
                            } bg-opacity-70 h-[2.5em]`}
                          >
                            <td>{i}</td>
                            <td className="text-center grid place-items-center">
                              <p className="w-[15em] truncate text-center pt-2">
                                {post.title}
                              </p>
                            </td>
                            <td>
                              <p className="truncate">
                                {format(post.createdAt!, "PPpp")}
                              </p>
                            </td>
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
                    <div className="w-full flex flex-col mt-5 gap-5">
                      <div className="w-full">
                        <p className="text-brown font-semibold">Title</p>
                        <input
                          type="text"
                          className="w-full max-w-lg border-2 rounded-lg border-brown p-3"
                          placeholder="Title of the post"
                          {...register("title", { required: true })}
                        />
                      </div>
                      <div className="w-full">
                        <p className="text-brown font-semibold">Written By</p>
                        <input
                          type="text"
                          className="w-full max-w-lg border-2 rounded-lg border-brown p-3"
                          placeholder="the author"
                          {...register("writtenBy", { required: true })}
                        />
                      </div>
                    </div>
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
                    <div className=" bg-white border-2 border-dashed border-brown rounded-xl mx-auto mt-10 cursor-pointer w-full max-w-lg h-fit">
                      {!imgData ? (
                        <UploadDropzone
                          endpoint="imageUploader"
                          className="ut-label:text-brown border-none ut-upload-icon:text-brown ut-readying:text-brown ut-uploading:text-brown ut-button:bg-brown ut-label:hover:text-brown ut-button:ut-uploading:bg-opacity-80 ut-button:ut-uploading:bg-brown"
                          onClientUploadComplete={(res) => {
                            // Do something with the response
                            setImgData(res[0]);
                          }}
                          onUploadError={(error: Error) => {
                            // Do something with the error.
                            alert(`ERROR! ${error.message}`);
                          }}
                        />
                      ) : (
                        <div className="h-[15em] w-full flex flex-col items-center p-5 text-center">
                          <FaCheckCircle className="text-green-600 h-9 w-9 my-10" />
                          <div>
                            <p className="text-brown text-sm">
                              Successfully Uploaded
                            </p>
                            <p className="font-semibold text-brown ">
                              {imgData.name}
                            </p>
                          </div>
                        </div>
                      )}
                    </div>
                    <div className=" bg-white border-2 border-dashed border-brown rounded-xl mx-auto mt-10 cursor-pointer w-full max-w-lg h-fit">
                      {!audioData ? (
                        <UploadDropzone
                          endpoint="audioUploader"
                          className="ut-label:text-brown border-none ut-upload-icon:text-brown ut-readying:text-brown ut-uploading:text-brown ut-button:bg-brown ut-label:hover:text-brown ut-button:ut-uploading:bg-opacity-80 ut-button:ut-uploading:bg-brown"
                          onClientUploadComplete={(res) => {
                            // Do something with the response
                            setAudioData(res[0]);
                          }}
                          onUploadError={(error: Error) => {
                            // Do something with the error.
                            alert(`ERROR! ${error.message}`);
                          }}
                        />
                      ) : (
                        <div className="h-[15em] w-full flex flex-col items-center p-5 text-center">
                          <FaCheckCircle className="text-green-600 h-9 w-9 my-10" />
                          <div>
                            <p className="text-brown text-sm">
                              Successfully Uploaded
                            </p>
                            <p className="font-semibold text-brown ">
                              {audioData.name}
                            </p>
                          </div>
                        </div>
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
