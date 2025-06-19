import { Form, Formik } from "formik";
import { createProjectValidationSchema } from "../schemas/projects";
import { FormikOutlinedTextField } from "../components/textfield/textfield";
import { FilledButton, TextButton } from "../components/button/button";
import api from "../api";
import { useQuery } from "@tanstack/react-query";
import { type ITeam } from "../components/teams/team-card";
import { useNavigate } from "react-router";
import { Fragment } from "react/jsx-runtime";
import { Divider } from "../components/divider/divider";
import { List, ListItem } from "../components/lists/list";
import { FormikCheckbox } from "../components/checkbox/checkbox";

const initialValues = {
  name: "",
  description: "",
  teamMembers: [] as string[],
};
export default function CreateProjects() {
  const navigate = useNavigate();
  const handleSubmit = async (values: typeof initialValues) => {
    try {
      const response = await api.post("/projects", {
        name: values.name,
        description: values.description,
        teamMembers: values.teamMembers,
      });
      console.log("Project created successfully:", response.data);

      // Optionally, you can redirect or show a success message here
      navigate("/projects/" + response.data.data._id);
    } catch (error) {
      console.error("Error creating project:", error);
    }
  };
  const { data: teams } = useQuery({
    queryKey: ["/teams"],
    queryFn: async () => {
      const data = await api.get("/teams");
      return data.data;
    },
  });

  return (
    <div className="flex flex-col gap-4 p-4">
      <h1 className="text-display-large mb-8">Create Project</h1>
      <Formik
        initialValues={initialValues}
        validationSchema={createProjectValidationSchema}
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
                <div className="text-red-500">{errors.teamMembers}</div>
              )}

              <div className="mt-4 flex justify-start gap-4">
                <TextButton type="reset" value="cancel">
                  Cancel
                </TextButton>
                <FilledButton type="submit" disabled={isSubmitting}>
                  Create
                </FilledButton>
              </div>
            </Form>
          </>
        )}
      </Formik>
    </div>
  );
}
