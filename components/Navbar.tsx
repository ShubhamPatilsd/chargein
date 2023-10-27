import { db } from "../db/db";
import { getServerSession } from "next-auth";
import { useSession, getSession, signIn, signOut } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/router";
import {
  HiOutlinePencilAlt,
  HiInbox,
  HiLogout,
  HiUser,
  HiOutlineInbox,
} from "react-icons/hi";
import { MdOutlineOutbox } from "react-icons/md";
import { BsInboxFill } from "react-icons/bs";
import Image from "next/image";
import logo from "../public/logo.svg";
import { fetchData } from "next-auth/client/_utils";
import { useState, useEffect } from "react";
import { HiMiniInboxStack, HiOutlineInboxArrowDown } from "react-icons/hi2";
import Dropdown from "./Dropdown";

function Navbar() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [unread, setUnread] = useState(-1);
  useEffect(() => {
    const getData = async () => {
      const res = await fetch("/api/booking/unread", {
        cache: "no-store",
        method: "POST",
      });
      const data = await res.json();
      setUnread(data.response);
    };
    getData();
  }, []);

  return unread != -1 ? (
    <nav className="relative h-16 w-full bg-white px-2 text-lg">
      <div className="mx-auto flex h-full w-full items-center justify-between px-6">
        <div>
          <Link href="/" className="text-2xl  font-bold">
            <Image
              src={logo}
              width="30"
              alt="chargelink logo"
              className="mr-2 -mt-1 inline-block"
            />
            <p className="inline-block"> ChargeLink</p>
          </Link>
        </div>
        {status === "loading" ? null : status === "authenticated" ? (
          <div className=" grid grid-cols-2 grid-rows-1 items-center gap-3 text-sm">
            <Link
              // className=" flex items-center  justify-center rounded-md bg-orange-200 px-2 hover:bg-orange-300"
              className="flex aspect-square h-full  items-center  justify-center rounded-lg border-[1px] border-gray-300 transition hover:bg-gray-200"
              href={`/inbox`}
            >
              <HiOutlineInboxArrowDown
                size={23}
                className="font-black text-gray-600"
              />
              {unread > 0 ? (
                <div className="-mt-8 -mr-4 h-5 w-5 rounded-full bg-red-500 text-center font-bold text-white">
                  {unread}
                </div>
              ) : (
                <></>
              )}
              {
                //   <span className="mr-2 pt-1">{session.user!.name}</span>
                //   <img
                //     className="inline-block rounded-full"
                //     src={session.user!.image}
                //     width={30}
                //   />
                // </p>
              }
            </Link>

            <Dropdown />
            {/* <button
              className="rounded-md bg-orange-200 hover:bg-orange-300"
              onClick={() => signOut()}
            >
              <HiLogout
                size={35}
                className="rounded-full bg-orange-200 p-2 hover:bg-orange-300"
              />
            </button> */}
          </div>
        ) : (
          <div>
            <button
              className="rounded-md bg-orange-700 px-6 py-2 text-center text-sm  font-bold text-white hover:bg-orange-500"
              onClick={() => router.push("/login")}
            >
              Sign In
            </button>
          </div>
        )}
      </div>
      <div className="absolute -bottom-1 left-0 right-0 h-1 bg-gradient-to-r from-fuchsia-500 via-orange-500 to-indigo-600" />
    </nav>
  ) : (
    <></>
  );
}

export default Navbar;
