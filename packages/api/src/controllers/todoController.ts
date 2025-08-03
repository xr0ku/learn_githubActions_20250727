import { PrismaClient } from "@prisma/client";
import { Request, Response } from "express";
import { z } from "zod";

const prisma = new PrismaClient();

export const getAllTodos = async (_req: Request, res: Response) => {
  const todos = await prisma.todo.findMany({
    orderBy: { id: "asc" },
  });

  res.json(todos);
};

const TodoCreateSchema = z.object({
  title: z.string().min(1, "Title is required."),
  category: z.string().optional(),
  tags: z.array(z.string()).optional(),
});

export const createTodo = async (req: Request, res: Response) => {
  const parse = TodoCreateSchema.safeParse(req.body);
  if (!parse.success) {
    return res.status(400).json({
      error: parse.error.format(),
    });
  }

  const { title, category, tags } = parse.data;

  const newTodo = await prisma.todo.create({
    data: {
      title,
      category,
      tags: tags ?? [],
    },
  });

  res.status(201).json(newTodo);
};

export const deleteTodo = async (req: Request, res: Response) => {
  const id = Number(req.params.id);
  if (isNaN(id)) return res.status(400).json({ error: "Invalid ID" });

  const deleted = await prisma.todo
    .delete({
      where: { id },
    })
    .catch(() => null);

  if (!deleted) return res.status(404).json({ error: "Todos not found" });

  res.status(204);
};
