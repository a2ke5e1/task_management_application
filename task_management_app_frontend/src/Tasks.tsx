import { useQuery, keepPreviousData } from "@tanstack/react-query";
import api from "./api";
import { useState } from "react";
import type { IProject } from "./layouts/project-layout";
import type { ITeam } from "./components/teams/team-card";

function Tasks() {
  const [page, setPage] = useState(1);
  const { status, data: tasks } = useQuery({
    queryKey: ["/tasks", page],
    queryFn: async () => {
      const data = await api.get("/tasks", {
        params: { page, limit: 10 },
      });
      return data.data;
    },
    placeholderData: keepPreviousData,
    staleTime: 5000,
  });

  const handlePrevButton = () => {
    setPage((old) => Math.max(old - 1, 1));
  };
  const handleNextButton = () => {
    setPage((old) => (tasks?.hasMore ? old + 1 : old));
  };

  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-5xl">Tasks</h1>
      <div className="flex flex-col gap-4">
        {status === "pending" ? "Loading..." : ""}
        {tasks?.data.map((task: ITask) => (
          <TaskCard key={task._id} {...task} />
        ))}
      </div>
      <div className="flex flex-row items-center gap-2">
        <button
          className="rounded-full bg-blue-200 p-4"
          onClick={handlePrevButton}
        >
          prev
        </button>
        {page}/{tasks?.totalPages}
        <button
          className="rounded-full bg-blue-200 p-4"
          onClick={handleNextButton}
        >
          next
        </button>
      </div>
    </div>
  );
}

export interface ITask {
  _id: string;
  title: string;
  description: string;
  deadline: Date;
  project: IProject;
  assignedMembers: ITeam[];
  status: "to-do" | "in-progress" | "done" | "cancelled";
}

export function TaskCard({
  title,
  description,
  deadline,
  project,
  assignedMembers,
  status,
}: ITask) {
  return (
    <div>
      <div>{title}</div>
      <div>{description}</div>
      <div>{project?.name}</div>
      <div>{new Date(deadline).toString()}</div>
      <div>{status}</div>
      <div>
        {assignedMembers.map((team) => (
          <div key={team._id}>{team.name}</div>
        ))}
      </div>
    </div>
  );
}

export default Tasks;
