import api from "../api";
import { type ITeam } from "../components/teams/team-card";
import { useParams } from "react-router";
import { Fragment } from "react/jsx-runtime";
import { Divider } from "../components/divider/divider";
import { List, ListItem } from "../components/lists/list";
import type { ITask } from "../Tasks";
import { useQuery } from "@tanstack/react-query";
import { IconButton } from "../components/button/button";
import { Icon } from "../components/icon/icon";

export default function ViewTasks() {
  const { taskId } = useParams<{ taskId: string }>();

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
      <div className="flex flex-row items-center justify-between">
        <h1 className="text-display-large mb-8">Task</h1>
        <IconButton href={`/tasks/${taskId}/edit`}>
          <Icon>edit</Icon>
        </IconButton>
      </div>

      <div>
        <div className="text-headline-large">{tasks?.title}</div>
        <div className="text-body-large text-on-surface-variant">
          {tasks?.description}
        </div>
      </div>

      <div className="my-8">
        <div className="text-label-large">Project Details</div>
        <div className="text-body-large mt-2">{tasks?.project?.name}</div>
        <div className="text-body-medium text-on-surface-variant">
          {tasks?.project?.description}
        </div>
        <div className="text-label-small my-4 flex flex-row items-center gap-2">
          <span className="material-symbols-rounded text-[1rem]">schedule</span>
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

      <div className="text-label-large">Assign team members</div>
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
