import express from "express";
import cors from "cors";
import todoRoutes from "./routes/todoRoutes";

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.get("/health", (_, res) => {
  res.send({ status: "ok" });
});

app.use("/todos", todoRoutes);

app.listen(PORT, () => {
  console.log(`🚀 Server is running at http://localhost:${PORT}`);
});
