import { Link, Outlet, useParams } from "react-router";
import type { ITeam } from "../components/teams/team-card";
import React, { useState } from "react";
import { useQuery, keepPreviousData } from "@tanstack/react-query";
import api from "../api";
import { Icon } from "../components/icon/icon";
import { IconButton } from "../components/button/button";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "../lib/utils";

const ProjectsLayout = () => {
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

  const { pid } = useParams<{ pid: string }>();

  return (
    <div className="flex flex-col items-start gap-8 sm:flex-row">
      <div className="flex min-w-sm flex-col gap-4">
        <h1 className="text-5xl">Projects</h1>
        <div className="flex h-[80vh] flex-col overflow-auto rounded-xl">
          {status === "pending" ? "Loading..." : ""}
          {projects?.data.map((project: IProject) => (
            <ProjectCard
              key={project._id}
              _id={project._id}
              name={project.name}
              description={project.description}
              createdAt={project.createdAt}
              selected={project._id === pid}
            />
          ))}
        </div>
        <div className="flex flex-row items-center gap-2">
          <IconButton onClick={handlePrevButton} disabled={page === 1}>
            <Icon>chevron_left</Icon>
          </IconButton>
          <div className="text-label-large">
            {page}/{projects?.totalPages}
          </div>
          <IconButton onClick={handleNextButton} disabled={!projects?.hasMore}>
            <Icon>chevron_right</Icon>
          </IconButton>
        </div>
      </div>

      <div className="">
        <Outlet />
      </div>
    </div>
  );
};

const projectCardSelectedVaraint = cva("py-4 px-2", {
  variants: {
    selected: {
      true: "bg-primary-container text-on-primary-container",
      false: "bg-surface text-on-surface",
    },
  },
});

export interface IProject {
  _id: string;
  name: string;
  description: string;
  teamMembers: ITeam[];
  updatedAt: string;
  createdAt: string;
}

export interface IProjectCardProps
  extends Omit<IProject, "teamMembers" | "updatedAt">,
    React.HTMLAttributes<HTMLAnchorElement>,
    VariantProps<typeof projectCardSelectedVaraint> {}

const ProjectCard = React.forwardRef<HTMLAnchorElement, IProjectCardProps>(
  ({ _id, name, description, selected, createdAt, ...props }, ref) => {
    return (
      <Link
        to={`/projects/${_id}`}
        className={cn(projectCardSelectedVaraint({ selected }))}
        ref={ref}
        {...props}
      >
        <div className="text-headline-large">{name}</div>
        <div className="text-body-medium text-gray-800">{description}</div>
        <div className="text-label-medium mt-4">
          {new Date(createdAt).toLocaleDateString()}
        </div>
      </Link>
    );
  },
);

ProjectCard.displayName = "ProjectCard";

export default ProjectsLayout;
