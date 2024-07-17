"use client";

import { FunctionComponent } from "react";
import logo from "@/public/inclusiveTalksLogo.svg";
import Image from "next/image";
import { RiMenu3Fill } from "react-icons/ri";
import Link from "next/link";
import { LogoutLink } from "@kinde-oss/kinde-auth-nextjs";

interface TopNavProps {}

const TopNav: FunctionComponent<TopNavProps> = () => {
  return (
    <nav className="bg-[#FAE9DF] h-20 flex p-5 md:p-7 items-center justify-between text-[#833200]">
      <div>
        <Image src={logo} alt="logo" width={65} height={65} />
      </div>
      <div className="hidden md:flex gap-8 items-center">
        <ul className="flex gap-5 items-center">
          <Link href={"/admin"}>
            <li>Home</li>
          </Link>
          <li>Blog</li>
          <li>Programs</li>
          <LogoutLink>Log Out</LogoutLink>
          <Link href={"/subscribers"}>
            <li>Subscribers</li>
          </Link>
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
