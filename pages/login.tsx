import { useSession, signIn, signOut, getSession } from "next-auth/react";
import { useRouter } from "next/router";
import Image from "next/image";
import logo from "../public/logo.svg";
import { FcGoogle } from "react-icons/fc";

export default function Home() {
  const router = useRouter();
  const { data: session } = useSession();

  return (
    <>
      <div className="px-4 py-2 lg:px-48 lg:py-24">
        <p className={"inline text-4xl font-bold"}>Login to ChargeIn </p>
        <Image
          alt="chargein logo"
          width="35"
          className="-mt-2.5 inline "
          src={logo}
        />

        <button
          onClick={() =>
            signIn("google", {
              callbackUrl: `${window.location.origin}/onboarding`,
            })
          }
          className={`font-md mt-6  flex w-max space-x-2 rounded-lg border-2 p-2.5 duration-300 hover:scale-105`}
        >
          <FcGoogle className={`h-6 w-6`} /> <span>Sign in with Google</span>
        </button>
      </div>
    </>
  );
}

export async function getServerSideProps(context: any) {
  const session = await getSession(context);

  if (session) {
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };
  } else {
    return {
      props: {},
    };
  }
}
