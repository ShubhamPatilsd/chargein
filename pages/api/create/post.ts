import { NextApiRequest, NextApiResponse } from "next";
import { db } from "../../../db/db";

import { authOptions } from "../../api/auth/[...nextauth]";
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

      const {
        location,
        kW,
        indoor,
        pricePerHour,
        teslaOnly,
        selfCheckIn,
        description,
        Address,
      } = req.body;

      const result = await db.post.create({
        data: {
          authorId: user.id,
          location,
          kW,
          indoor,
          pricePerHour,
          teslaOnly,
          selfCheckIn,
          description,
          Address,
        },
      });

      await res.status(200).json({ status: 200, response: result });
    } catch (err) {
      await res.status(500).send(`Err: ${err}`);
    }
  } else {
    res.send("Only POST request allowed");
  }
}
