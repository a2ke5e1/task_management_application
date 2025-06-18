import { useParams } from "react-router";
import { useQuery } from "@tanstack/react-query";
import api from "./api";
import type { ITeam } from "./components/teams/team-card";
import type { IProject } from "./layouts/project";

function Projects() {
  const { pid } = useParams<{ pid: string }>();

  const { status, data: project } = useQuery({
    queryKey: [`/projects/${pid}`],
    queryFn: async (): Promise<IProject> => {
      const data = await api.get(`/projects/${pid}`);
      return data.data.data;
    },
    staleTime: 5000,
  });

  return (
    <div>
      <h1 className="text-5xl">Details</h1>
      {status === "pending" ? (
        <p>Loading...</p>
      ) : status === "error" ? (
        <p>Error loading project details.</p>
      ) : (
        <div className="mt-4">
          <h2 className="text-3xl">{project.name}</h2>
          <p className="text-lg">{project.description}</p>
          <p className="text-sm text-gray-500">
            Created at: {new Date(project.createdAt).toLocaleDateString()}
          </p>
        </div>
      )}
      <div className="mt-8">
        <h2 className="text-2xl">Teams</h2>
        <ul className="list-disc pl-5">
          {project?.teamMembers.map((team: ITeam) => (
            <li key={team._id} className="mt-2">
              {team.name}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default Projects;
