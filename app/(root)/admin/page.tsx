"use client";

import TopNav from "@/components/TopNav";
import { FunctionComponent } from "react";
import { IoSearch } from "react-icons/io5";
import { FaAngleDown } from "react-icons/fa6";
import { MdArrowUpward } from "react-icons/md";
import { useForm } from "react-hook-form";
import { FaArrowDown } from "react-icons/fa6";
import Footer from "@/components/footer";

interface PageProps {}

const Page: FunctionComponent<PageProps> = () => {
  const { register, handleSubmit, errors }: any = useForm();

  const onSubmit = (data: string) => {
    // Handle form submission data here
    console.log(data);
  };
  return (
    <section>
      <TopNav />
      <div className="p-5 md:p-10 bg-background">
        <p className="text-brown p-5 text-3xl my-10 font-extrabold">
          Admin <br /> Page
        </p>

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

          <div className="bg-white rounded-xl border-brown mt-10 p-5 border-2">
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
                <tr className="bg-[#DDAA99] bg-opacity-70 h-[2.5em]">
                  <td>#000</td>
                  <td>Lorem Ipsum Dolor sit Amet</td>
                  <td>Apr 7, 2024</td>
                  <td>056</td>
                </tr>
                <tr className="bg-[#FAE9DF] bg-opacity-70 h-[2.5em]">
                  <td>#000</td>
                  <td>Lorem Ipsum Dolor sit Amet</td>
                  <td>Apr 7, 2024</td>
                  <td>056</td>
                </tr>
                <tr className="bg-[#DDAA99] bg-opacity-70 h-[2.5em]">
                  <td>#000</td>
                  <td>Lorem Ipsum Dolor sit Amet</td>
                  <td>Apr 7, 2024</td>
                  <td>056</td>
                </tr>
                <tr className="bg-[#FAE9DF] bg-opacity-70 h-[2.5em]">
                  <td>#000</td>
                  <td>Lorem Ipsum Dolor sit Amet</td>
                  <td>Apr 7, 2024</td>
                  <td>056</td>
                </tr>
                <tr className="bg-[#DDAA99] bg-opacity-70 h-[2.5em]">
                  <td>#000</td>
                  <td>Lorem Ipsum Dolor sit Amet</td>
                  <td>Apr 7, 2024</td>
                  <td>056</td>
                </tr>
              </tbody>
            </table>
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
                      name="textareaInput"
                      className="border-2 rounded-lg h-full p-5 border-brown w-full"
                      {...register("textareaInput", {
                        required: "Textarea is required",
                      })}
                    />
                    {errors?.textareaInput && (
                      <p>{errors.textareaInput.message}</p>
                    )}
                  </div>
                  <button className="bg-brown p-3 mt-7 flex justify-center items-center rounded-lg text-white gap-2 w-[12em]">
                    <p>Upload Blog Post</p>
                    <MdArrowUpward />
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </section>
  );
};

export default Page;
