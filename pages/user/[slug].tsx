import { GetServerSideProps } from "next";
import { db } from "../../db/db";
import { getSession } from "next-auth/react";

export const getServerSideProps: GetServerSideProps = async ({ params }) => {
  const id = params!.id;
  const user = await db.user.findUnique({
    where: {
      id: id as string,
    },
  });

  if (!user) {
    return {
      notFound: true,
    };
  }

  const posts = await db.post.findMany({
    where: {
      authorId: user.id,
    },
    select: {
      id: true,
      title: true,
      description: true,
      imageUrl: true,
    },
  });

  return {
    props: {
      user: {
        id: user.id,
        name: user.name,
        image: user.image,
      },
      posts,
    },
  };
};
