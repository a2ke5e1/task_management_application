import { useQuery, keepPreviousData } from "@tanstack/react-query";
import api from "./api";
import { useState } from "react";

function Projects() {
  const [page, setPage] = useState(1);
  const { status, data: projects } = useQuery({
    queryKey: ["/projects", page],
    queryFn: async () => {
      const data = await api.get("/projects", {
        params: { page, limit: 1 },
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
      <div className="font-mono">
        {status === "pending" ? "Loading..." : ""}
        {JSON.stringify(projects, null, 2)}
      </div>
      <div className="flex flex-row gap-2 items-center">
        <button
          className="bg-blue-200 p-4 rounded-full"
          onClick={handlePrevButton}
        >
          prev
        </button>
        {page}/{projects?.totalPages}
        <button
          className="bg-blue-200 p-4 rounded-full"
          onClick={handleNextButton}
        >
          next
        </button>
      </div>
    </div>
  );
}

export default Projects;
