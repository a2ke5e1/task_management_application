import { useParams } from "react-router";
import { useQuery } from "@tanstack/react-query";
import api from "./api";

function Projects() {
  const { pid } = useParams<{ pid: string }>();

  const { status, data: project } = useQuery({
    queryKey: [`/projects/${pid}`],
    queryFn: async () => {
      const data = await api.get(`/projects/${pid}`);
      return data.data.data;
    },
    staleTime: 5000,
  });

  return (
    <div>
      Test {pid}
      <div>{JSON.stringify(project, null, 2)}</div>
    </div>
  );
}

export default Projects;
