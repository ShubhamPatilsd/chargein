import { NextApiRequest, NextApiResponse } from "next";
import { db } from "../../../db/db";

import { authOptions } from "../auth/[...nextauth]";
import { getServerSession } from "next-auth/next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "POST") {
    try {
      const session = await getServerSession(req, res, authOptions);

      if (!session) {
        res.status(401).json({ message: "You must be logged in." });
        return;
      }

      const user = await db.user.findUnique({
        where: {
          email: session.user?.email || "",
        },
      });

      if (!user) {
        return res.status(404).send("user-not-found");
      }

      const { startTime, endTime, postId } = req.body;

      const post = await db.post.findUnique({
        where: {
          id: postId,
        },
      });

      if (!post) {
        return res.status(404).send("post-not-found");
      }

      // console.log(parseFloat(pricePerHour));
      db.user.findUnique({
        where: {
          id: post.authorId,
        },
      });
      const result = await db.booking.create({
        data: {
          postId: postId,
          requesterId: user.id,
          authorId: post?.authorId,
          startTime,
          endTime,
        },
      });

      await res.status(200).json({ status: 200, response: result });
    } catch (err) {
      console.log(err);
      await res.status(500).send(`Err: ${err}`);
    }
  } else {
    res.send("Only POST request allowed");
  }
}
