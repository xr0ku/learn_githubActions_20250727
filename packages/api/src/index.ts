import express from "express";
import cors from "cors";
import z from "zod";
import { PrismaClient } from "@prisma/client";

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

app.get("/todos", async (_, res) => {
  const todos = await prisma.todo.findMany({
    orderBy: { id: "asc" },
  });

  res.json(todos);
});

app.post("/todos", async (req, res) => {
  const parseResult = TodoCreateSchema.safeParse(req.body);
  if (!parseResult.success) {
    return res.status(400).json({
      error: parseResult.error.format(),
    });
  }

  const newTodo = await prisma.todo.create({
    data: { title: parseResult.data.title },
  });

  res.status(201).json(newTodo);
});

app.delete("/todos/:id", async (req, res) => {
  const id = Number(req.params.id);
  if (isNaN(id)) return res.status(400).json({ error: "Invalid ID" });

  const deleted = await prisma.todo
    .delete({
      where: { id },
    })
    .catch(() => null);

  if (!deleted) return res.status(404).json({ error: "Todos not found" });

  res.status(204).json(`✅ Successfully deleted ${id}`);
});

app.listen(PORT, () => {
  console.log(`🚀 Server is running at http://localhost:${PORT}`);
});
