import { Form, Formik } from "formik";
import { updateProjectValidationSchema } from "../schemas/projects";
import { FormikOutlinedTextField } from "../components/textfield/textfield";
import { FilledButton, TextButton } from "../components/button/button";
import api from "../api";
import { useMutation, useQuery } from "@tanstack/react-query";
import { type ITeam } from "../components/teams/team-card";
import { useNavigate, useParams } from "react-router";
import { Fragment } from "react/jsx-runtime";
import { Divider } from "../components/divider/divider";
import { List, ListItem } from "../components/lists/list";
import { FormikCheckbox } from "../components/checkbox/checkbox";

export default function UpdateProjects() {
  const navigate = useNavigate();
  const { pid } = useParams<{ pid: string }>();

  const { isLoading, data: project } = useQuery({
    queryKey: ["projects", pid],
    queryFn: async () => {
      const data = await api.get(`/projects/${pid}`);
      return data.data.data;
    },
    staleTime: 5000,
  });

  const initialValues = {
    _id: project?._id || "",
    name: project?.name || "",
    description: project?.description || "",
    teamMembers: project?.teamMembers.map((member: ITeam) => member._id) || [],
  };

  const updateProjectMutation = useMutation({
    mutationFn: async (values: typeof initialValues) => {
      const response = await api.put(`/projects/${values._id}`, {
        name: values.name,
        description: values.description,
        teamMembers: values.teamMembers,
      });
      return response.data;
    },
    onSuccess: () => {
      navigate("/projects/" + pid);
    },
    onError: (error: Error) => {
      console.error("Failed to update project", error);
    },
  });

  const handleSubmit = async (values: typeof initialValues) => {
    try {
      await updateProjectMutation.mutateAsync(values);
      console.log("Project updated successfully");
    } catch (error) {
      console.error("Error updating project:", error);
    }
  };

  const { data: teams } = useQuery({
    queryKey: ["/teams"],
    queryFn: async () => {
      const data = await api.get("/teams");
      return data.data;
    },
  });

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="flex flex-col gap-4 p-4">
      <h1 className="text-display-large">Update Project</h1>
      <Formik
        initialValues={initialValues}
        validationSchema={updateProjectValidationSchema}
        onSubmit={handleSubmit}
      >
        {({ isSubmitting, errors }) => (
          <>
            <Form className="flex max-w-lg flex-col gap-4">
              <FormikOutlinedTextField
                label="Name"
                name="name"
                required
                autoFocus
              />
              <FormikOutlinedTextField
                label="Description"
                name="description"
                type="textarea"
                rows={4}
                required
              />
              <div className="text-label-large">Choose team members</div>
              {teams?.data.length > 0 && (
                <List className="rounded-3xl">
                  {teams?.data.map((team: ITeam, index: number) => (
                    <Fragment key={team._id}>
                      <ListItem key={team._id}>
                        <FormikCheckbox
                          slot="start"
                          value={team._id}
                          name="teamMembers"
                          label={team.name}
                        ></FormikCheckbox>
                        <div slot="headline">{team.name}</div>
                        <div slot="supporting-text">{team.designation}</div>
                        <div slot="trailing-supporting-text">{team.email}</div>
                      </ListItem>
                      {index < teams.data.length - 1 && <Divider />}
                    </Fragment>
                  ))}
                </List>
              )}
              {errors.teamMembers && (
                <div className="text-red-500">
                  {errors.teamMembers.toString()}
                </div>
              )}
              <div className="mt-4 flex justify-start gap-4">
                <TextButton
                  type="button"
                  onClick={() => navigate("/projects/" + pid)}
                >
                  Cancel
                </TextButton>
                <FilledButton type="submit" disabled={isSubmitting}>
                  Update
                </FilledButton>
              </div>
            </Form>
          </>
        )}
      </Formik>
    </div>
  );
}
