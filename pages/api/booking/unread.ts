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

      const post = await db.booking.findMany({
        where: {
          authorId: user.id,
        },
      });

      if (!post) {
        return res.status(200).send(0);
      }

      // console.log(parseFloat(pricePerHour));
      let x = 0;
      await Promise.all(
        post.map(function (element) {
          x += element.readByRenter == true ? 0 : 1;
        })
      );
      res.status(200).json({ status: 200, response: x });
    } catch (err) {
      console.log(err);
      await res.status(500).send(`Err: ${err}`);
    }
  } else {
    res.send("Only POST request allowed");
  }
}
