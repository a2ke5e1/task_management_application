import express from "express";
import teamsRouter from "./routes/teams.route";
import tasksRouter from "./routes/tasks.route";
import cors from "cors";
import projectsRouter from "./routes/projects.route";

const app = express();
app.use(
  cors({
    origin: (origin, callback) => {
      callback(null, true); // Allow all origins dynamically
    },
    credentials: true,
  })
);
// Middleware
app.use(express.json());

// Routes
app.use("/api/teams", teamsRouter);
app.use("/api/projects", projectsRouter);
app.use("/api/tasks", tasksRouter);

export default app;
