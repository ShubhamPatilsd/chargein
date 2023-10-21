import { db } from "../db/db";
import { getServerSession } from "next-auth";
import { useSession, getSession, signIn, signOut } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/router";
import { HiOutlinePencilAlt, HiInbox, HiLogout, HiUser } from "react-icons/hi";
import { MdOutlineOutbox } from "react-icons/md";
import Image from "next/image";
import logo from "../public/logo.svg";

function Navbar() {
  const { data: session, status } = useSession();
  const router = useRouter();

  return (
    <nav className="relative h-16 w-full bg-white px-2 text-lg">
      <div className="mx-auto flex h-full max-w-5xl items-center justify-between">
        <div>
          <Link href="/" className="text-2xl  font-bold">
            <Image
              src={logo}
              width="30"
              alt="chargein logo"
              className="mr-2 -mt-1 inline-block"
            />
            <p className="inline-block"> ChargeLink</p>
          </Link>
        </div>
        {status === "loading" ? null : status === "authenticated" ? (
          <div className="flex items-stretch space-x-3 text-sm">
            <Link
              // className=" bg-orange-200 px-2 hover:bg-orange-300 rounded-md"
              href={`/user/${session.user!.id}`}
            >
              <p className="rounded-full bg-orange-200 p-2 hover:bg-orange-300">
                <p>
                  <span className="mr-2 pt-1">{session.user!.name}</span>
                  <img
                    className="inline-block rounded-full"
                    src={session.user!.image}
                    width={30}
                  />
                </p>
              </p>
            </Link>

            <button
              className="rounded-full bg-orange-200 hover:bg-orange-300"
              onClick={() => signOut()}
            >
              <HiLogout
                size={35}
                className="rounded-full bg-orange-200 p-2 hover:bg-orange-300"
              />
            </button>
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
  );
}

export default Navbar;
