import TopNav from "@/components/TopNav";
import { FunctionComponent } from "react";
import { IoSearch } from "react-icons/io5";
import { FaAngleDown } from "react-icons/fa6";

interface PageProps {}

const Page: FunctionComponent<PageProps> = () => {
  return (
    <section>
      <TopNav />
      <div className="p-5 md:p-10 bg-background">
        <p className="text-brown p-5 text-3xl my-10 font-extrabold">
          Admin <br /> Page
        </p>

        <div className="md:p-5">
          <div className="flex items-center justify-between">
            <div className="text-brown justify-between bg-white w-[25em] flex items-center p-3 rounded-xl border-2 border-brown">
              <IoSearch className="text-xl" />
              <input
                type="search"
                name=""
                id=""
                className="w-[90%] outline-none"
                placeholder="Search.."
              />
            </div>
            <div className="text-brown justify-between font-semibold bg-white gap-3 flex items-center p-3 rounded-xl border-2 border-brown">
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
        </div>
      </div>
    </section>
  );
};

export default Page;
