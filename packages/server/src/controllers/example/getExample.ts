import { postExampleRequestSchema } from "@chat-app/common";
import { Request, Response } from "express";

export const getExample = async (req: Request, res: Response) => {
  postExampleRequestSchema.parseAsync(req.body); // Validate request body against the schema

  res.send('Welcome to Express & TypeScript Server');
}