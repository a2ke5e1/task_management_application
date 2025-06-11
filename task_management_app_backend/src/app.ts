import express, { Request, Response } from "express";

const app = express();

// Middleware
app.use(express.json());

// Routes
app.use("/", (req: Request, res: Response) => {
  res.status(200).json({ Hello: "World!" });
});

export default app;
