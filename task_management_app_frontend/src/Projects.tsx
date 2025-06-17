import { useQuery, keepPreviousData } from "@tanstack/react-query";
import api from "./api";
import { useState } from "react";
import type { ITeam } from "./Teams";

function Projects() {
  const [page, setPage] = useState(1);
  const { status, data: projects } = useQuery({
    queryKey: ["/projects", page],
    queryFn: async () => {
      const data = await api.get("/projects", {
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
    setPage((old) => (projects?.hasMore ? old + 1 : old));
  };

  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-5xl">Projects</h1>
      <div className="flex flex-col gap-4">
        {status === "pending" ? "Loading..." : ""}
        {projects?.data.map((project: IProject) => (
          <ProjectCard key={project._id} {...project} />
        ))}
      </div>
      <div className="flex flex-row items-center gap-2">
        <button
          className="rounded-full bg-blue-200 p-4"
          onClick={handlePrevButton}
        >
          prev
        </button>
        {page}/{projects?.totalPages}
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

export interface IProject {
  _id: string;
  name: string;
  description: string;
  teamMembers: ITeam[];
}

export function ProjectCard({ name, description, teamMembers }: IProject) {
  return (
    <div>
      <div>{name}</div>
      <div>{description}</div>
      <div>
        {teamMembers.map((team) => (
          <div key={team._id}>{team.name}</div>
        ))}
      </div>
    </div>
  );
}

export default Projects;
