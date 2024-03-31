import { FunctionComponent } from "react";
import logo from "@/public/inclusiveTalksLogo.svg";
import Image from "next/image";
import { RiMenu3Fill } from "react-icons/ri";

interface TopNavProps {}

const TopNav: FunctionComponent<TopNavProps> = () => {
  return (
    <nav className="bg-[#FAE9DF] h-20 flex p-5 md:p-7 items-center justify-between text-[#833200]">
      <div>
        <Image src={logo} alt="logo" width={65} height={65} />
      </div>
      <div className="hidden md:flex gap-8 items-center">
        <ul className="flex gap-5 items-center">
          <li>Home</li>
          <li>Blog</li>
          <li>Programs</li>
          <li>About Us</li>
          <li>Contact</li>
        </ul>
        <button className="bg-[#833200] text-white  p-2 rounded-lg text-sm">
          SUBSCRIBE
        </button>
      </div>
      <RiMenu3Fill className="md:hidden text-2xl font-bold" />
    </nav>
  );
};

export default TopNav;
