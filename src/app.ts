import express, { Request, Response, NextFunction } from "express";

// Create an instance of Express
const app = express();

// Middleware to parse JSON requests
app.use(express.json());

// Basic route for the root
app.get("/", (req: Request, res: Response) => {
  res.send("Hello, World!");
});

// Example of another route
app.get("/api/example", (req: Request, res: Response) => {
  res.json({ message: "This is an example endpoint!" });
});

// Error handling middleware
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  console.error(err.stack);
  res.status(500).send("Something went wrong!");
});

export default app;
