import express from "express";
import teamsRouter from "./routes/teams";
import tasksRouter from "./routes/tasks";
import projectsRouter from "./routes/projects";

const app = express();

// Middleware
app.use(express.json());

// Routes
app.use("/api/teams", teamsRouter);
app.use("/api/projects", projectsRouter);
app.use("/api/tasks", tasksRouter);

export default app;
