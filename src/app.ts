import express from "express";
import userRoutes from "./routes/user.routes";

const app = express();

app.use(express.json());

// Rutas
app.use("/api/users", userRoutes); // Se accede con /api/users en lugar de solo /users

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

