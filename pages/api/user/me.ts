import { NextApiRequest, NextApiResponse } from "next";
import { db } from "../../../db/db";

import { authOptions } from "../auth/[...nextauth]";
import { getServerSession } from "next-auth/next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "GET") {
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

      await res.status(200).json({ user });
    } catch (err) {
      console.log(err);
      await res.status(500).send(`Err: ${err}`);
    }
  } else {
    res.send("Only GET request allowed");
  }
}
