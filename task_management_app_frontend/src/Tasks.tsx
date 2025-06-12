import { useQuery, keepPreviousData } from "@tanstack/react-query";
import api from "./api";
import { useState } from "react";

function Tasks() {
  const [page, setPage] = useState(1);
  const { status, data: tasks } = useQuery({
    queryKey: ["/tasks", page],
    queryFn: async () => {
      const data = await api.get("/tasks", {
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
    setPage((old) => (tasks?.hasMore ? old + 1 : old));
  };

  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-5xl">Tasks</h1>
      <div className="font-mono">
        {status === "pending" ? "Loading..." : ""}
        {JSON.stringify(tasks, null, 2)}
      </div>
      <div className="flex flex-row gap-2 items-center">
        <button
          className="bg-blue-200 p-4 rounded-full"
          onClick={handlePrevButton}
        >
          prev
        </button>
        {page}/{tasks?.totalPages}
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

export default Tasks;
