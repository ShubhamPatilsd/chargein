import { NextApiRequest, NextApiResponse } from "next";
import { db } from "../../../db/db";

import { authOptions } from "../../api/auth/[...nextauth]";
import { getServerSession } from "next-auth/next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "PUT") {
    try {
      const session = await getServerSession(req, res, authOptions);

      if (!session) {
        res.status(401).json({ message: "You must be logged in." });
        return;
      }

      const userType = JSON.parse(req.body);

      const user = await db.user.findUnique({
        where: {
          email: session.user?.email || "",
        },
      });

      if (!user) {
        return res.status(404).send("user-not-found");
      }

      const result = await db.user.update({
        where: {
          email: session.user?.email || "",
        },
        data: {
          onboardingComplete: true,
          isSeller: userType.userType == "yes",
        },
      });

      await res.status(200).json({ status: 200, response: result });
    } catch (err) {
      await res.status(500).send(`Err: ${err}`);
    }
  } else {
    res.send("Only PUT request allowed");
  }
}
