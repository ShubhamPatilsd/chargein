import { GetServerSideProps } from "next";
import { db } from "../../db/db";
import { useSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import { AiFillCar } from "react-icons/ai";
import { userAgent } from "next/server";

const UserPage = ({ post, author }: { post: any; author: any }) => {
  const { data: session } = useSession();

  return (
    <div className="px-32 py-12">
      <div>
        <div className="py-100 inline w-fit">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="#ff6b00"
            className="inline h-12 w-12 "
          >
            <path
              fillRule="evenodd"
              d="M11.54 22.351l.07.04.028.016a.76.76 0 00.723 0l.028-.015.071-.041a16.975 16.975 0 001.144-.742 19.58 19.58 0 002.683-2.282c1.944-1.99 3.963-4.98 3.963-8.827a8.25 8.25 0 00-16.5 0c0 3.846 2.02 6.837 3.963 8.827a19.58 19.58 0 002.682 2.282 16.975 16.975 0 001.145.742zM12 13.5a3 3 0 100-6 3 3 0 000 6z"
              clipRule="evenodd"
            />
          </svg>{" "}
        </div>
        <span className="ml-2 text-5xl font-extrabold">{post.Address}</span>
        <br />
        <div className="-mt-1 text-xl ">
          <span className="ml-16">Hosted by </span>
          <a
            href={"/host/" + author.id}
            target="_blank"
            className="inline cursor-pointer rounded-lg p-0.5 underline decoration-gray-400 decoration-2 transition  hover:bg-gray-300  hover:bg-opacity-50"
            rel="noreferrer noopener"
          >
            <span>{author.name}</span>
            <img
              className="ml-2 inline w-10  rounded-full"
              src={author.image}
            />
          </a>
        </div>
        <div className="mt-8 bg-gray-100">
          <img
            src={
              post.imageUrls
              // "https://camo.githubusercontent.com/1ba1013d2941b5296fea379a3fee774387b651e7901bd2e2753fde50ddae4109/68747470733a2f2f6e6578742d73332d75706c6f61642e636f64696e6776616c75652e636f6d2f6f672d696d6167652e706e67"
            }
            className="h-96 w-full object-contain"
          />
        </div>

        <div className="mt-12">
          <p className="text-2xl font-bold">${post.pricePerHour}/hr</p>
        </div>
        <div className="mt-12">
          <p className="text-2xl font-bold">Description</p>
          {post.description}
        </div>

        <div className="mt-12 max-w-md">
          <p className="mb-4 text-2xl font-bold">Charger Details</p>
          <div className="grid grid-cols-2 grid-rows-2 gap-4 ">
            <div>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="inline h-6 w-6"
              >
                <path
                  fillRule="evenodd"
                  d="M14.615 1.595a.75.75 0 01.359.852L12.982 9.75h7.268a.75.75 0 01.548 1.262l-10.5 11.25a.75.75 0 01-1.272-.71l1.992-7.302H3.75a.75.75 0 01-.548-1.262l10.5-11.25a.75.75 0 01.913-.143z"
                  clipRule="evenodd"
                />
              </svg>{" "}
              <span className="font-bold">{post.kW} kW</span>
            </div>
            <div>
              <AiFillCar className="inline h-6 w-6" />{" "}
              <span className="font-bold">
                {post.teslaOnly ? "Tesla Only" : "All Cars"}
              </span>
            </div>
            <div>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="inline h-6 w-6"
              >
                <path d="M11.47 3.84a.75.75 0 011.06 0l8.69 8.69a.75.75 0 101.06-1.06l-8.689-8.69a2.25 2.25 0 00-3.182 0l-8.69 8.69a.75.75 0 001.061 1.06l8.69-8.69z" />
                <path d="M12 5.432l8.159 8.159c.03.03.06.058.091.086v6.198c0 1.035-.84 1.875-1.875 1.875H15a.75.75 0 01-.75-.75v-4.5a.75.75 0 00-.75-.75h-3a.75.75 0 00-.75.75V21a.75.75 0 01-.75.75H5.625a1.875 1.875 0 01-1.875-1.875v-6.198a2.29 2.29 0 00.091-.086L12 5.43z" />
              </svg>{" "}
              <span className="font-bold">
                {post.indoor ? "Indoor Charging" : "Outdoor Charging"}
              </span>
            </div>
            <div>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="inline h-6 w-6"
              >
                <path
                  fillRule="evenodd"
                  d="M12 1.5a5.25 5.25 0 00-5.25 5.25v3a3 3 0 00-3 3v6.75a3 3 0 003 3h10.5a3 3 0 003-3v-6.75a3 3 0 00-3-3v-3c0-2.9-2.35-5.25-5.25-5.25zm3.75 8.25v-3a3.75 3.75 0 10-7.5 0v3h7.5z"
                  clipRule="evenodd"
                />
              </svg>{" "}
              <span className="font-bold">
                {post.selfCheckIn
                  ? "Self Check-In with PIN"
                  : "Check in with Owner"}
              </span>
            </div>
          </div>
        </div>

        {session && (
          <div>
            <a
              href={
                "mailto:" +
                author.email +
                "?cc=&bcc=&subject=Charger%20Rental&body=Hi%20" +
                author.name +
                "%2C%0A%0AI%20came%20across%20your%20electric%20charger%20on%20ChargeLink!%20I%E2%80%99m%20currently%20in%20the%20area%2C%20and%20would%20be%20interested%20in%20renting%20out%20a%20charging%20slot%20for%20my%20vehicle.%0A%0AThanks%2C%0A" +
                session.user!.name
              }
              className="mt-12 flex w-fit cursor-pointer  rounded-lg p-0.5 underline decoration-gray-400 decoration-2 transition  hover:bg-gray-300  hover:bg-opacity-50"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="h-6 w-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75"
                />
              </svg>
              <span className="ml-2 text-lg">Book this charger</span>
              <div className="-rotate-45 no-underline">⚡</div>
            </a>
          </div>
        )}
      </div>
    </div>
  );
};

export async function getServerSideProps(context: any) {
  const id = context.params!.slug;

  const post = await db.post.findUnique({
    where: {
      id: id,
    },
  });

  if (!post) {
    return {
      notFound: true,
    };
  }

  const author = await db.user.findUnique({
    where: {
      id: post.authorId,
    },
  });

  return {
    props: {
      post,
      author,
    },
  };
}
export default UserPage;
