import { GetServerSideProps } from "next";
import { db } from "../../db/db";
import { getSession, useSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import { AiFillCar } from "react-icons/ai";
const HostPage = ({ user, listings }: { user: any; listings: any }) => {
  const { data: session } = useSession();
  const posts = JSON.parse(listings);
  return (
    <div className="min-h-screen  px-2 py-8">
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

        <Link
          href={"/create/post"}
          className="mt-4 rounded-lg bg-[#ff6b00] p-2 text-xl font-medium text-white transition duration-200  hover:scale-105"
        >
          Create Rental
        </Link>

        {posts.length > 0 && (
          <div className="mt-8 grid gap-x-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {posts.map((listing: any) => {
              return (
                <Link href={"/post/" + listing.id} key={listing.id}>
                  <div className="group relative aspect-square w-56 overflow-hidden rounded-md border-2  border-black bg-white">
                    <div className="absolute z-10 h-full w-full duration-150 " />
                    <div className="absolute z-10 flex h-full w-full flex-col  px-2 py-2  duration-150 ">
                      <span className="mb-6 text-xl font-semibold italic">
                        {listing.Address}
                      </span>

                      <div className="mb-2">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 24 24"
                          fill="currentColor"
                          className="mr-1 inline h-8 w-8 rounded-sm bg-orange-200 p-1"
                        >
                          <path
                            fill-rule="evenodd"
                            d="M14.615 1.595a.75.75 0 01.359.852L12.982 9.75h7.268a.75.75 0 01.548 1.262l-10.5 11.25a.75.75 0 01-1.272-.71l1.992-7.302H3.75a.75.75 0 01-.548-1.262l10.5-11.25a.75.75 0 01.913-.143z"
                            clip-rule="evenodd"
                          />
                        </svg>
                        {" " + listing.kW + " kW"}
                      </div>
                      <div className="mb-2">
                        <AiFillCar className="roudned-sm mr-1 inline h-8 w-8 bg-orange-200 p-1" />
                        {" " + (listing.teslaOnly ? "Tesla Only" : "All Cars")}
                      </div>
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

  const id = context.params!.slug;

  const listings = await db.post.findMany({
    where: {
      authorId: id,
    },
  });
  const user = await db.user.findUnique({
    where: {
      id: id as string,
      isSeller: true,
    },
  });

  const user2 = await db.user.findUnique({
    where: {
      id: id as string,
      isSeller: false,
    },
  });

  if (user2) {
    return {
      redirect: {
        destination: "/user/" + id,
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
      listings: JSON.stringify(listings),
      user,
    },
  };
}
export default HostPage;
