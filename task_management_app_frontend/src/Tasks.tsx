import { useQuery, keepPreviousData } from "@tanstack/react-query";
import api from "./api";
import { Fragment } from "react";
import type { IProject } from "./layouts/project-layout";
import type { ITeam } from "./components/teams/team-card";
import { OutlinedSelect, SelectOption } from "./components/select/select";
import type { MdOutlinedSelect } from "@material/web/select/outlined-select";
import { OutlinedTextField } from "./components/textfield/textfield";
import type { MdOutlinedTextField } from "@material/web/textfield/outlined-text-field";
import { Icon } from "./components/icon/icon";
import { List, ListItem } from "./components/lists/list";
import { Divider } from "./components/divider/divider";
import { Link, useNavigate, useSearchParams } from "react-router";
import { PaginationControls } from "./components/pagination-button/pagination-button";
import { FilledButton, TextButton } from "./components/button/button";
import { Fab } from "./components/fab/fab";

function Tasks() {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();

  const search = searchParams.get("search") ?? "";
  const statusFilter = searchParams.get("status") ?? "";
  const memberFilter = searchParams.get("memberId") ?? "";
  const startDate = searchParams.get("startDate") ?? "";
  const endDate = searchParams.get("endDate") ?? "";
  const page = Number(searchParams.get("page") ?? 1);

  const updateFilters = (updates: Record<string, string>) => {
    const newParams = new URLSearchParams(searchParams);
    Object.entries(updates).forEach(([key, value]) => {
      if (value) newParams.set(key, value);
      else newParams.delete(key);
    });
    setSearchParams(newParams);
  };

  const { data: teamData } = useQuery({
    queryKey: ["/teams"],
    queryFn: async () => {
      const res = await api.get("/teams");
      return res.data;
    },
  });

  const { status, data: tasks } = useQuery({
    queryKey: [
      "/tasks",
      page,
      search,
      statusFilter,
      memberFilter,
      startDate,
      endDate,
    ],
    queryFn: async () => {
      const params: {
        page: number;
        limit: number;
        search?: string;
        status?: string;
        memberId?: string;
        startDate?: string;
        endDate?: string;
      } = {
        page,
        limit: 10,
      };
      if (search.trim()) params.search = search;
      if (statusFilter) params.status = statusFilter;
      if (memberFilter) params.memberId = memberFilter;
      if (startDate) params.startDate = new Date(startDate).toISOString();
      if (endDate) params.endDate = new Date(endDate).toISOString();

      const response = await api.get("/tasks", { params });
      return response.data;
    },
    placeholderData: keepPreviousData,
    staleTime: 5000,
  });

  const handlePrevButton = () =>
    updateFilters({ page: String(Math.max(page - 1, 1)) });
  const handleNextButton = () => updateFilters({ page: String(page + 1) });

  return (
    <div className="flex flex-col gap-6 p-6">
      <h1 className="text-5xl">Tasks</h1>
      <Fab
        label="Add"
        onClick={() => navigate("/tasks/create")}
        variant="primary"
      >
        <Icon slot="icon">add</Icon> Create
      </Fab>

      {/* Filters */}
      <div className="flex flex-row justify-between">
        <div className="flex flex-wrap gap-4">
          <OutlinedTextField
            className="h-[3.5rem]"
            placeholder="Search tasks"
            value={search}
            onChange={(e: React.FormEvent<MdOutlinedTextField>) =>
              updateFilters({
                page: "1",
                search: (e.target as MdOutlinedTextField).value,
              })
            }
          >
            <Icon slot="trailing-icon">search</Icon>
          </OutlinedTextField>

          <OutlinedSelect
            value={statusFilter}
            onChange={(e: React.FormEvent<MdOutlinedSelect>) =>
              updateFilters({
                page: "1",
                status: (e.target as MdOutlinedSelect).value,
              })
            }
          >
            <SelectOption value="">All Status</SelectOption>
            <SelectOption value="to-do">To Do</SelectOption>
            <SelectOption value="in-progress">In Progress</SelectOption>
            <SelectOption value="done">Done</SelectOption>
            <SelectOption value="cancelled">Cancelled</SelectOption>
          </OutlinedSelect>

          <OutlinedSelect
            value={memberFilter}
            onChange={(e: React.FormEvent<MdOutlinedSelect>) =>
              updateFilters({
                page: "1",
                memberId: (e.target as MdOutlinedSelect).value,
              })
            }
          >
            <SelectOption value="">All Members</SelectOption>
            {teamData?.data?.map((team: ITeam) => (
              <SelectOption key={team._id} value={team._id}>
                {team.name}
              </SelectOption>
            ))}
          </OutlinedSelect>

          <div className="flex flex-row items-center gap-4">
            <FilledButton onClick={() => updateFilters({ page: "1" })}>
              Apply Filters
            </FilledButton>
            <TextButton
              onClick={() => {
                updateFilters({
                  page: "1",
                  search: "",
                  status: "",
                  memberId: "",
                  startDate: "",
                  endDate: "",
                });
              }}
            >
              Clear Filters
            </TextButton>
          </div>
        </div>

        <div className="flex flex-wrap gap-4">
          <div className="relative flex flex-col gap-2">
            <div className="bg-surface-container-lowest focus:text-primary absolute -top-2 left-2 px-2 text-[0.75rem]">
              From
            </div>
            <input
              type="datetime-local"
              className="focus:outline-primary border-outline rounded border bg-transparent p-4 focus:outline-[0.2rem] dark:[color-scheme:dark]"
              value={startDate}
              onChange={(e) =>
                updateFilters({ page: "1", startDate: e.target.value })
              }
            />
          </div>

          <div className="relative flex flex-col gap-2">
            <div className="bg-surface-container-lowest focus:text-primary absolute -top-2 left-2 px-2 text-[0.75rem]">
              To
            </div>
            <input
              type="datetime-local"
              className="focus:outline-primary border-outline rounded border bg-transparent p-4 focus:outline-[0.2rem] dark:[color-scheme:dark]"
              value={endDate}
              onChange={(e) =>
                updateFilters({ page: "1", endDate: e.target.value })
              }
            />
          </div>
        </div>
      </div>

      {/* Task List */}
      <div className="flex flex-col gap-4">
        {status === "pending" && <p>Loading...</p>}

        <List className="rounded-3xl">
          {tasks?.data.map((task: ITask, index: number) => (
            <Fragment key={task._id}>
              <TaskCard key={task._id} {...task} />
              {index < tasks.data.length - 1 && <Divider />}
            </Fragment>
          ))}
        </List>
      </div>

      {/* Pagination Controls */}
      <PaginationControls
        page={page}
        totalPages={tasks?.totalPages}
        hasMore={tasks?.hasMore}
        handlePrevButton={handlePrevButton}
        handleNextButton={handleNextButton}
      />
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
  _id,
  title,
  description,
  deadline,
  project,
  assignedMembers,
  status,
}: ITask) {
  return (
    <Link to={`/tasks/${_id}/`}>
      <ListItem key={_id}>
        <div slot="headline" className="text-headline-large">
          {title}
        </div>
        <div slot="supporting-text" className="text-body-large">
          <div>{description}</div>
          <div className="my-4">
            <div>{project?.name}</div>
            <div>{project?.description}</div>
          </div>
          <div className="text-label-small my-4 flex flex-row items-center gap-2">
            <span className="material-symbols-rounded text-[1rem]">
              schedule
            </span>
            {new Date(deadline).toLocaleDateString("en-IN", {
              year: "numeric",
              month: "2-digit",
              day: "2-digit",
              hour: "2-digit",
              minute: "2-digit",
              hour12: true,
            })}
          </div>
          <div className="flex flex-col gap-2">
            {assignedMembers.length > 0 && (
              <div className="text-label-large">Assigned Members</div>
            )}
            <div className="flex flex-wrap gap-2">
              {assignedMembers.map((team) => (
                <span
                  key={team._id}
                  className="bg-secondary-container text-on-secondary-container rounded px-2 py-1 text-sm"
                >
                  {team.name}
                </span>
              ))}
            </div>
          </div>
        </div>
        <div slot="trailing-supporting-text">{status}</div>
      </ListItem>
    </Link>
  );
}

export default Tasks;
