// backend/corsMiddleware.ts
import { NextApiRequest, NextApiResponse } from "next";
import Cors from "cors";

const cors = Cors({
  origin: "*", // Allow all origins, you can restrict this to specific origins if needed
  methods: ["GET", "POST", "OPTIONS"],
  allowedHeaders: ["Content-Type"],
});

// Helper method to wait for a middleware to execute before continuing
// And to throw an error when an error happens in a middleware
function runMiddleware(
  req: NextApiRequest,
  res: NextApiResponse,
  fn: Function
) {
  return new Promise((resolve, reject) => {
    fn(req, res, (result: any) => {
      if (result instanceof Error) {
        return reject(result);
      }
      return resolve(result);
    });
  });
}

export default async function corsMiddleware(
  req: NextApiRequest,
  res: NextApiResponse,
  next: Function
) {
  await runMiddleware(req, res, cors);
  next();
}
