import api from "../api";
import { type ITeam } from "../components/teams/team-card";
import { useNavigate, useParams } from "react-router";
import { Fragment } from "react/jsx-runtime";
import { Divider } from "../components/divider/divider";
import { List, ListItem } from "../components/lists/list";
import type { ITask } from "../Tasks";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { IconButton } from "../components/button/button";
import { Icon } from "../components/icon/icon";
import DeleteConfirmDialog from "../components/dialog/delete-confirm-dialog";
import { useRef } from "react";
import type { MdDialog } from "@material/web/dialog/dialog";
import { formatStatus } from "../lib/utils";

export default function ViewTasks() {
  const { taskId } = useParams<{ taskId: string }>();
  const initialValues = {
    _id: taskId || "",
  };
  const navigate = useNavigate();

  const queryClient = useQueryClient();
  const deleteDialogBoxRef = useRef<MdDialog>(null);
  const openDeleteDialog = () => {
    deleteDialogBoxRef.current?.show();
  };
  const deleteMutation = useMutation({
    mutationFn: async (values: typeof initialValues) => {
      const response = await api.delete(`/tasks/${values._id}`);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
      queryClient.invalidateQueries({ queryKey: ["tasks", taskId] });
      navigate("/tasks");
    },
    onError: (error: Error) => {
      console.error("Failed to delete tasks", error);
    },
  });

  const { isLoading, data: tasks } = useQuery({
    queryKey: ["tasks", taskId],
    queryFn: async (): Promise<ITask> => {
      const data = await api.get(`/tasks/${taskId}`);
      return data.data.data;
    },
    staleTime: 5000,
  });

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="flex flex-col gap-4 p-4">
      <DeleteConfirmDialog
        ref={deleteDialogBoxRef}
        title="Delete?"
        message={`Are you sure you want to delete ${tasks?.title}? This action cannot be undone.`}
        initialValues={initialValues}
        handleOnDelete={(values) => deleteMutation.mutateAsync(values)}
        onClose={() => deleteDialogBoxRef.current?.close()}
      />

      <div className="flex flex-row items-center justify-between">
        <h1 className="text-display-large mb-8">{tasks?.title}</h1>
        <div className="flex flex-row items-center gap-2">
          <IconButton href={`/tasks/${taskId}/edit`}>
            <Icon>edit</Icon>
          </IconButton>
          <IconButton onClick={openDeleteDialog}>
            <Icon>delete</Icon>
          </IconButton>
        </div>
      </div>

      <div className="ml-4">
        <div className="text-label-large text-primary mb-4">About Task</div>
        <div className="flex flex-row items-center justify-between">
          <div className="max-w-[100ch]">
            <div className="text-headline-large">{tasks?.title}</div>
            <div className="text-body-large text-on-surface-variant">
              {tasks?.description}
            </div>
          </div>
          <div className="flex flex-col items-end">
            <div className="text-label-small">Status</div>
            <div className="text-title-large text-tertiary font-mono font-bold">
              {formatStatus(tasks?.status)}
            </div>
          </div>
        </div>
      </div>

      <div className="my-4">
        <div className="text-label-large text-primary ml-4">
          Project Details
        </div>
        <div className="bg-surface my-4 rounded-3xl p-4">
          <div className="ml-6 flex flex-col">
            <div className="text-title-large mt-2">{tasks?.project?.name}</div>
            <div className="text-body-large text-on-surface-variant">
              {tasks?.project?.description}
            </div>
          </div>
          <div className="my-4 flex flex-row items-center gap-2">
            <span className="material-symbols-rounded text-[1rem]">
              schedule
            </span>
            <div className="flex flex-col">
              <div className="text-label-small">Deadline</div>
              <div className="text-body-large text-on-surface-variant">
                {tasks?.deadline
                  ? new Date(tasks.deadline).toLocaleDateString("en-IN", {
                      year: "numeric",
                      month: "2-digit",
                      day: "2-digit",
                      hour: "2-digit",
                      minute: "2-digit",
                      hour12: true,
                    })
                  : "No deadline"}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="text-label-large text-primary ml-4">
        Assigned team members
      </div>
      {Array.isArray(tasks?.assignedMembers) &&
        tasks.assignedMembers.length > 0 && (
          <List className="rounded-3xl">
            {tasks.assignedMembers.map((team: ITeam, index: number) => (
              <Fragment key={team._id}>
                <ListItem key={team._id}>
                  <div slot="headline">{team.name}</div>
                  <div slot="supporting-text">{team.designation}</div>
                  <div slot="trailing-supporting-text">{team.email}</div>
                </ListItem>
                {index < tasks.assignedMembers.length - 1 && <Divider />}
              </Fragment>
            ))}
          </List>
        )}
    </div>
  );
}
