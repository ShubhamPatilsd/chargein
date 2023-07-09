import { NextApiRequest, NextApiResponse } from "next";
import { db } from "../../../db/db";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "POST") {
    // await db.
  } else {
    res.send("Only POST");
  }
}
