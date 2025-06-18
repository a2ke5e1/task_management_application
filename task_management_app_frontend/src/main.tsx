import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route, Navigate } from "react-router";
import "./globals.css";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import DashboardLayout from "./layouts/dashboard-layout";
import Tasks from "./Tasks";
import Teams from "./pages/Teams";
import ProjectsLayout from "./layouts/project-layout";
import Project from "./pages/Projects";
import CreateProjects from "./pages/CreateProjects";
import UpdateProjects from "./pages/UpdateProjects";

const queryClient = new QueryClient();

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<DashboardLayout />}>
            <Route index element={<Navigate to="/tasks" replace />} />
            <Route path="tasks" element={<Tasks />} />
            <Route path="projects" element={<ProjectsLayout />}>
              <Route path="create" element={<CreateProjects />} />
              <Route path=":pid" element={<Project />} />
              <Route path=":pid/edit" element={<UpdateProjects />} />
            </Route>
            <Route path="teams" element={<Teams />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </QueryClientProvider>
  </StrictMode>,
);
