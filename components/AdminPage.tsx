"use client";

import { MdArrowUpward } from "react-icons/md";
import { useForm } from "react-hook-form";
import { FaArrowDown } from "react-icons/fa6";
import { z } from "zod";
import { postValidations } from "@/lib/validations/post";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { LoginLink } from "@kinde-oss/kinde-auth-nextjs";
import { trpc } from "@/app/_trpc/client";
import toast from "react-hot-toast";
import { format } from "date-fns";
import { useEffect, useState } from "react";
import { UploadDropzone } from "@/lib/uploadthing";
import "@uploadthing/react/styles.css";
import { FaCheckCircle } from "react-icons/fa";
const ReactQuill = dynamic(() => import("react-quill"), { ssr: false });
import "react-quill/dist/quill.snow.css";
import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";
import { post } from "@/types";
import TableContainer from "./Table/Table";
import { Blog, useAppContext } from "@/context";

type FormData = z.infer<typeof postValidations>;
const AdminPage = ({ user }: any) => {
  const router = useRouter();
  const [imgData, setImgData] = useState<{
    name: string;
    url: string;
  } | null>();
  const [audioData, setAudioData] = useState<{
    name: string;
    url: string;
  } | null>();

  const [content, setContent] = useState("");
  const { setBlogs, state } = useAppContext();

  const handleChange = (value: string) => {
    setContent(value);
  };

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormData>({ resolver: zodResolver(postValidations) });

  const resetFields = () => {
    // setImgData(null);
    // setAudioData(null);
    // setContent("");
    // reset();
  };

  const { mutate: createPost, isLoading } = trpc.createPost.useMutation({
    onSuccess: (data: any) => {
      toast.success("Posted Successfully");
      console.log("sort started");
      setBlogs([...state.blogs, data]);
      resetFields();
    },
  });

  const {
    data: allPostsDb,
    isLoading: allPostsLoading,
    refetch,
    error,
  } = trpc.getAllPost.useQuery(undefined, {
    onSuccess: (post: any) => {
      console.log({ post });
      setBlogs(post);
    },
  });

  const onSubmit = async (data: FormData) => {
    const { writtenBy, title } = data;
    try {
      if (!imgData) return toast.error("Youve not added an image");
      createPost({
        writtenBy,
        title,
        imgUrl: imgData?.url!,
        audioUrl: audioData?.url!,
        content: content,
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
            <div className="bg-white rounded-xl grid place-items-center border-brown mt-10 p-5 border-2 overflow-x-auto ">
              {allPostsLoading ? (
                <Loader2 className="animate-spin w-7 h-7 text-brown" />
              ) : (
                <TableContainer />
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
                    <div className="bg-white w-full border-brown border-2 mt-10 rounded-lg h-[30em]">
                      <ReactQuill
                        className="h-fuull border-none"
                        value={content}
                        onChange={handleChange}
                        modules={{
                          toolbar: [
                            [{ header: [1, 2, false] }],
                            ["bold", "italic", "underline"],
                            [{ list: "ordered" }, { list: "bullet" }],
                            ["clean"],
                          ],
                        }}
                        formats={[
                          "header",
                          "bold",
                          "italic",
                          "underline",
                          "list",
                          "bullet",
                        ]}
                      />
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
