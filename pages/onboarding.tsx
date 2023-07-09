import { useSession, getSession, signIn, signOut } from "next-auth/react";
import { useRouter } from "next/router";
import Image from "next/image";
import logo from "../public/logo.svg";
import { FcGoogle } from "react-icons/fc";
import { db } from "../db/db";
import { userAgent } from "next/server";
import { Prisma } from "@prisma/client";

interface props {
  user: any;
}
export default function Home({ user }: props) {
  const router = useRouter();
  //   const{ data: session } = useSession();

  // const user = await db.user.
  console.log(user);
  return (
    <>
      <div className="px-4 py-2 text-center lg:px-48 lg:py-24">
        <p className={"inline text-4xl font-bold"}>Welcome to ChargeIn! </p>
        <Image
          alt="chargein logo"
          width="35"
          className="-mt-2.5 inline "
          src={logo}
        />

        <div className="my-4 h-0.5 bg-gray-700" />

        <p className="mt-2 text-lg">
          Are you here to rent out your charger or find chargers near you?
        </p>

        <button
          onClick={async () => {
            const act = await fetch("/api/onboard/done", {
              method: "PUT",
              body: JSON.stringify({ userType: "no" }),
            });

            if (act.status == 200) {
              router.push("/");
            } else {
              // ???
              router.reload();
            }
          }}
          className={`font-md mt-6 mr-4  inline-block w-max space-x-2 rounded-lg border-2 p-2.5 duration-300 hover:scale-105`}
        >
          I want to find affordable chargers near me!
        </button>
        <button
          onClick={async () => {
            const act = await fetch("/api/onboard/done", {
              method: "PUT",
              body: JSON.stringify({ userType: "yes" }),
            });

            if (act.status == 200) {
              router.push("/");
            } else {
              // ???
              router.reload();
            }
          }}
          className={`font-md mt-6  inline-block w-max space-x-2 rounded-lg border-2 p-2.5 duration-300 hover:scale-105`}
        >
          I want to rent out my home charger!
        </button>
      </div>
    </>
  );
}

export async function getServerSideProps(context: any) {
  const session = await getSession(context);
  if (session) {
    const email = session?.user?.email ?? undefined;

    const user = await db.user.findUnique({
      where: {
        email: email,
      },
    });

    if (user?.onboardingComplete) {
      return {
        redirect: {
          destination: "/",
          permanent: false,
        },
      };
    } else {
      return {
        props: {
          user,
        },
      };
    }
  } else {
    return {
      props: {},
    };
  }
}
