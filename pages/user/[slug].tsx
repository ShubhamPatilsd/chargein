import { GetServerSideProps } from "next";
import { db } from "../../db/db";
import { getSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";

const UserPage = ({ user }: { user: any }) => {
  return (
<<<<<<< HEAD
    <div className="min-h-screen px-2 py-8">
=======
    <div className="min-h-screen bg-white px-2 py-8">
>>>>>>> 6c25d602ddff9652dec924d81e411eb651f695c9
      <div className="mx-auto flex max-w-5xl flex-col items-center">
        <div className="w-fit overflow-hidden rounded-full border-4 border-orange-200">
          <img
            alt={`${user.name}'s pfp`}
            src={user.image}
            height={128}
            width={128}
          />
        </div>
        <h1 className="mt-4 text-4xl font-bold">{user.name}</h1>
        {!user.requests ? (
          <p className="mt-14">Nothing to see here...</p>
        ) : (
          <div className="mt-8 grid gap-x-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {user.requests.map((request: any) => {
              return (
                <Link href="#" key={request.id}>
                  <div className="group relative aspect-square w-56 overflow-hidden rounded-md bg-white">
                    <div className="absolute z-10 h-full w-full duration-150 group-hover:bg-slate-800/70" />
                    <div className="absolute z-10 flex h-full w-full flex-col items-center justify-center px-2 py-2 text-center text-white opacity-0 duration-150 group-hover:opacity-100">
                      <span className="text-xl font-semibold italic">
                        {request.authorId}'s Charger
                      </span>
                      <span className="line-clamp-3 text-ellipsis font-light">
                        {request.startTime} - {request.endTime}
                      </span>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export async function getServerSideProps(context: any) {
  const session = await getSession(context);
  console.log(session);
  if (!session) {
    return {
      redirect: {
        destination: "/login",
        permanent: false,
      },
    };
  }

  const id = context.params!.slug;
  const user = await db.user.findUnique({
    where: {
      id: id as string,
      isSeller: false,
    },
  });
  const user2 = await db.user.findUnique({
    where: {
      id: id as string,
      isSeller: true,
    },
  });

  if (user2) {
    return {
      redirect: {
        destination: "/host/" + id,
        permanent: false,
      },
    };
  }

  if (!user) {
    return {
      notFound: true,
    };
  }

  return {
    props: {
      user,
    },
  };
}
export default UserPage;
