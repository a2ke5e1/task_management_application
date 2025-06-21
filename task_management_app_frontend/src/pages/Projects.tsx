import { useNavigate, useOutletContext, useParams } from "react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import api from "../api";
import type { ITeam } from "../components/teams/team-card";
import type { IProject } from "../layouts/project-layout";
import { IconButton, TextButton } from "../components/button/button";
import { Icon } from "../components/icon/icon";
import type { MdDialog } from "@material/web/dialog/dialog";
import { Fragment, useEffect, useRef } from "react";
import { Dialog } from "../components/dialog/dialog";
import { Field, Form, Formik, type FormikHelpers } from "formik";
import { List, ListItem } from "../components/lists/list";
import { Divider } from "../components/divider/divider";

type ContextType = {
  setPage: React.Dispatch<React.SetStateAction<number>>;
  LIMIT: number;
};

function Projects() {
  const { pid } = useParams<{ pid: string }>();
  const { setPage, LIMIT } = useOutletContext<ContextType>();

  // Fetch page number for the project list
  // This is used to determine the current page of the project list
  // when navigating to a specific project
  // It helps in maintaining the pagination state when returning to the project list
  const { status: pageDataStatus, data: pageData } = useQuery({
    queryKey: ["projects", "find-page", pid],
    queryFn: async (): Promise<{
      page: number;
    }> => {
      const res = await api.get(`/projects/find-page/${pid}`, {
        params: { limit: LIMIT },
      });
      if (res.status !== 200) {
        return {
          page: 1,
        };
      }
      return res.data.data;
    },
  });

  const { status, data: project } = useQuery({
    queryKey: ["projects", pid],
    queryFn: async (): Promise<IProject> => {
      const data = await api.get(`/projects/${pid}`);
      return data.data.data;
    },
    staleTime: 5000,
  });

  const deleteDailogBoxRef = useRef<MdDialog>(null);

  const openDeleteDialog = () => {
    deleteDailogBoxRef.current?.show();
  };

  const closeDeleteDialog = () => {
    deleteDailogBoxRef.current?.close();
  };

  const initialValues = {
    _id: pid,
  };

  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const deleteMutation = useMutation({
    mutationFn: async (values: typeof initialValues) => {
      const response = await api.delete(`/projects/${values._id}`);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["projects"] });
      queryClient.invalidateQueries({ queryKey: ["projects", pid] });
      navigate("/projects");
      closeDeleteDialog();
    },
    onError: (error: Error) => {
      console.error("Failed to delete project", error);
    },
  });

  const handleOnDeleteProject = async (
    values: typeof initialValues,
    { setSubmitting }: FormikHelpers<typeof initialValues>,
  ) => {
    try {
      setSubmitting(true);
      await deleteMutation.mutateAsync(values);
      console.log("Project deleted successfully");
      closeDeleteDialog();
    } catch (error) {
      console.error("Failed to delete project", error);
    } finally {
      setSubmitting(false);
    }
  };

  // Set the page number in the parent component when the project data is successfully fetched
  // This is useful for maintaining the pagination state when navigating back to the project list
  // It ensures that the page number is set to the correct value based on the project being viewed
  useEffect(() => {
    if (pageDataStatus === "success" && pageData?.page) {
      setPage(pageData.page);
    }
  }, [pageDataStatus, pageData, setPage]);

  return (
    <>
      <Dialog ref={deleteDailogBoxRef}>
        <div slot="headline">Delete</div>
        <Formik
          initialValues={initialValues}
          enableReinitialize
          onSubmit={handleOnDeleteProject}
        >
          {({ isSubmitting }) => (
            <>
              <Form slot="content" className="flex flex-col gap-4">
                <p>
                  Are you sure you want to delete this project? This action
                  cannot be undone.
                </p>
                <Field name="_id" type="hidden" />

                <div slot="actions" className="mt-4 flex justify-end gap-2">
                  <TextButton
                    type="button"
                    onClick={closeDeleteDialog}
                    value="cancel"
                  >
                    Cancel
                  </TextButton>
                  <TextButton type="submit" value="ok" disabled={isSubmitting}>
                    Delete
                  </TextButton>
                </div>
              </Form>
            </>
          )}
        </Formik>
      </Dialog>

      <div className="flex flex-row items-center justify-between">
        <h1 className="text-display-large"></h1>
        <div className="flex flex-row items-center justify-between gap-4 py-3">
          <IconButton onClick={() => navigate(`/projects/${pid}/edit`)}>
            <Icon>edit</Icon>
          </IconButton>
          <IconButton onClick={openDeleteDialog}>
            <Icon>delete</Icon>
          </IconButton>
        </div>
      </div>
      {status === "pending" ? (
        <p>Loading...</p>
      ) : status === "error" ? (
        <p>Error loading project details.</p>
      ) : (
        <div className="mt-22">
          <h1 className="text-label-large text-primary mb-4">
            Project Details
          </h1>
          <h2 className="text-headline-large text-on-surface">
            {project.name}
          </h2>
          <p className="text-title-large text-on-surface-variant">
            {project.description}
          </p>
          <p className="text-body-large text-gray-500">
            Created at:{" "}
            {new Date(project.createdAt).toLocaleDateString("en-US", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </p>
        </div>
      )}
      <div className="mt-8">
        <h2 className="text-2xl">Teams</h2>
        {Array.isArray(project?.teamMembers) &&
          project.teamMembers.length > 0 && (
            <List className="my-4 rounded-3xl">
              {project.teamMembers.map((team: ITeam, index: number) => (
                <Fragment key={team._id}>
                  <ListItem key={team._id}>
                    <div slot="headline">{team.name}</div>
                    <div slot="supporting-text">{team.designation}</div>
                    <div slot="trailing-supporting-text">{team.email}</div>
                  </ListItem>
                  {index < project.teamMembers.length - 1 && <Divider />}
                </Fragment>
              ))}
            </List>
          )}
      </div>
    </>
  );
}

export default Projects;
