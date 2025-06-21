import { Link, Outlet, useParams } from "react-router";
import type { ITeam } from "../components/teams/team-card";
import React, { Fragment, useState } from "react";
import { useQuery, keepPreviousData } from "@tanstack/react-query";
import api from "../api";
import { Icon } from "../components/icon/icon";
import { FilledButton } from "../components/button/button";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "../lib/utils";
import { PaginationControls } from "../components/pagination-button/pagination-button";
import { Divider } from "../components/divider/divider";

const ProjectsLayout = () => {
  const LIMIT = 5; // Number of projects per page
  const [page, setPage] = useState(1);
  const { pid } = useParams<{ pid: string }>();

  const { status, data: projects } = useQuery({
    queryKey: ["projects", page],
    queryFn: async () => {
      const data = await api.get("/projects", {
        params: { page, limit: LIMIT },
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

  const projectList: IProject[] = projects?.data || [];

  return (
    <>
      <div className="flex h-full flex-col items-start gap-8 md:flex-row">
        <div className="flex h-full w-full flex-col justify-between gap-4 md:max-w-sm">
          <h1 className="text-display-large">Projects</h1>
          <FilledButton href="/projects/create" className="my-4">
            <Icon slot="icon">add</Icon> Create
          </FilledButton>
          <div className="bg-surface flex flex-1 flex-col overflow-auto rounded-xl">
            {status === "pending" ? "Loading..." : ""}
            {projectList.map((project: IProject, index: number) => (
              <Fragment key={project._id}>
                <ProjectCard
                  key={project._id}
                  _id={project._id}
                  name={project.name}
                  description={project.description}
                  createdAt={project.createdAt}
                  selected={project._id === pid}
                />
                {index < projectList.length - 1 && <Divider />}
              </Fragment>
            ))}
          </div>
          <PaginationControls
            page={page}
            totalPages={projects?.totalPages}
            hasMore={projects?.hasMore}
            handlePrevButton={handlePrevButton}
            handleNextButton={handleNextButton}
          />
        </div>
        <div className="flex w-full flex-col gap-4">
          <Outlet context={{ setPage, LIMIT }} />
        </div>
      </div>
    </>
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
        <div className="text-headline-large line-clamp-1">{name}</div>
        <div className="text-body-medium text-on-surface-variant line-clamp-2">
          {description}
        </div>
        <div className="text-label-medium mt-4">
          {new Date(createdAt).toLocaleDateString()}
        </div>
      </Link>
    );
  },
);

ProjectCard.displayName = "ProjectCard";

export default ProjectsLayout;
