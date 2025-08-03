import express from "express";
import cors from "cors";
import z from "zod";
import { PrismaClient } from "@prisma/client";
import todoRoutes from "./routes/todoRoutes";

const app = express();
const PORT = process.env.PORT || 3000;

const prisma = new PrismaClient();

app.use(cors());
app.use(express.json());

const TodoCreateSchema = z.object({
  title: z.string().min(1, "Title is required."),
});

app.get("/health", (_, res) => {
  res.send({ status: "ok" });
});

app.use("/todos", todoRoutes);

app.listen(PORT, () => {
  console.log(`🚀 Server is running at http://localhost:${PORT}`);
});
