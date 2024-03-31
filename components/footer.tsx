import Image from "next/image";
import logo from "@/public/inclusiveTalksLogo.svg";

const Footer = () => {
  return (
    <footer className="bg-brown text-white ">
      <div className="flex gap-10 items-start p-10 flex-wrap">
        <div>
          <Image src={logo} width={100} height={100} alt="logo" />
          <div>
            <p className="font-bold">Blog</p>
            <div className="text-sm font-light">
              <p>Dedicated To Diversity</p>
              <div></div>
              <p>inclusivetalks@gmail.com</p>
            </div>
          </div>
        </div>
        <div>
          <p className="font-bold">Our Programs</p>
          <div className="text-sm font-light">
            <p>What Makes You Feel Excluded?</p>
            <p>Become a Guest</p>
            <p>Writer</p>
            <p>5 Days Of Love</p>
          </div>
        </div>
        <div>
          <p className="font-bold">About Us</p>
          <div className="text-sm font-light">
            <p>How it Started</p>
            <p>Where We Are</p>
            <p>Our Goal</p>
            <p>Meet the Team</p>
            <p>FAQ</p>
          </div>
        </div>
      </div>

      <div className="w-full border-t-[.5px] border-white text-xs font-light p-2 text-center">
        <p>Copyright 2023 Inclusive Talks</p>
        <p>All Right Reserved</p>
      </div>
    </footer>
  );
};

export default Footer;
