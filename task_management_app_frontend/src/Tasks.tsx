import { useQuery, keepPreviousData } from "@tanstack/react-query";
import api from "./api";
import { Fragment, useState } from "react";
import type { IProject } from "./layouts/project-layout";
import type { ITeam } from "./components/teams/team-card";
import { OutlinedSelect, SelectOption } from "./components/select/select";
import type { MdOutlinedSelect } from "@material/web/select/outlined-select";
import { OutlinedTextField } from "./components/textfield/textfield";
import type { MdOutlinedTextField } from "@material/web/textfield/outlined-text-field";
import { Icon } from "./components/icon/icon";
import { List, ListItem } from "./components/lists/list";
import { Divider } from "./components/divider/divider";
import { Link } from "react-router";
import { PaginationControls } from "./components/pagination-button/pagination-button";

function Tasks() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [memberFilter, setMemberFilter] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  // Fetch team members for filtering
  const { data: teamData } = useQuery({
    queryKey: ["/teams"],
    queryFn: async () => {
      const res = await api.get("/teams");
      return res.data;
    },
  });

  const { status, data: tasks } = useQuery({
    queryKey: ["/tasks", page, search, statusFilter, memberFilter],
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

  const handlePrevButton = () => {
    setPage((old) => Math.max(old - 1, 1));
  };
  const handleNextButton = () => {
    setPage((old) => (tasks?.hasMore ? old + 1 : old));
  };

  return (
    <div className="flex flex-col gap-6 p-6">
      <h1 className="text-5xl">Tasks</h1>

      {/* Filters */}
      <div className="flex flex-row justify-between">
        <div className="flex flex-wrap gap-4">
          <OutlinedTextField
            className="h-[3.5rem]"
            placeholder="Search tasks"
            value={search}
            onChange={(e: React.FormEvent<MdOutlinedTextField>) => {
              setPage(1);
              setSearch((e.target as MdOutlinedTextField).value);
            }}
          >
            <Icon slot="trailing-icon">search</Icon>
          </OutlinedTextField>

          <OutlinedSelect
            value={statusFilter}
            onChange={(e: React.FormEvent<MdOutlinedSelect>) => {
              setPage(1);
              setStatusFilter((e.target as MdOutlinedSelect).value);
            }}
          >
            <SelectOption value="">All Status</SelectOption>
            <SelectOption value="to-do">To Do</SelectOption>
            <SelectOption value="in-progress">In Progress</SelectOption>
            <SelectOption value="done">Done</SelectOption>
            <SelectOption value="cancelled">Cancelled</SelectOption>
          </OutlinedSelect>

          <OutlinedSelect
            value={memberFilter}
            onChange={(e: React.FormEvent<MdOutlinedSelect>) => {
              setPage(1);
              setMemberFilter((e.target as MdOutlinedSelect).value);
            }}
          >
            <SelectOption value="">All Members</SelectOption>
            {teamData?.data?.map((team: ITeam) => (
              <SelectOption key={team._id} value={team._id}>
                {team.name}
              </SelectOption>
            ))}
          </OutlinedSelect>
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
              onChange={(e) => {
                setPage(1);
                setStartDate(e.target.value);
              }}
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
              onChange={(e) => {
                setPage(1);
                setEndDate(e.target.value);
              }}
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
