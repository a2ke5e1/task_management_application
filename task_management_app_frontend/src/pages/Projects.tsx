import { useNavigate, useParams } from "react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import api from "../api";
import type { ITeam } from "../components/teams/team-card";
import type { IProject } from "../layouts/project-layout";
import { IconButton, TextButton } from "../components/button/button";
import { Icon } from "../components/icon/icon";
import type { MdDialog } from "@material/web/dialog/dialog";
import { useRef } from "react";
import { Dialog } from "../components/dialog/dialog";
import { Field, Form, Formik, type FormikHelpers } from "formik";

function Projects() {
  const { pid } = useParams<{ pid: string }>();

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

  return (
    <div>
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
        <h1 className="text-display-large">Project Details</h1>
        <div className="flex flex-row items-center justify-between gap-4">
          <IconButton>
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
        <div className="mt-4">
          <h2 className="text-3xl">{project.name}</h2>
          <p className="text-lg">{project.description}</p>
          <p className="text-sm text-gray-500">
            Created at: {new Date(project.createdAt).toLocaleDateString()}
          </p>
        </div>
      )}
      <div className="mt-8">
        <h2 className="text-2xl">Teams</h2>
        <ul className="list-disc pl-5">
          {project?.teamMembers.map((team: ITeam) => (
            <li key={team._id} className="mt-2">
              {team.name}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default Projects;
