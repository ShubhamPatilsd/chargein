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

      const {
        location,
        kW,
        indoor,
        pricePerHour,
        teslaOnly,
        selfCheckIn,
        description,
        Address,
        imageUrl,
      } = req.body;

      // console.log(parseFloat(pricePerHour));

      const result = await db.post.create({
        data: {
          authorId: user.id,
          location: JSON.stringify(location),
          kW,
          indoor,
          pricePerHour: parseFloat(pricePerHour).toFixed(2).toString(),
          teslaOnly,
          selfCheckIn,
          description,
          Address,
          // imageUrls: imageUrl,
          imageUrls: imageUrl,
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
