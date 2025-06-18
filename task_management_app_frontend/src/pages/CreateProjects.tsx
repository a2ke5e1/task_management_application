import { Field, Form, Formik } from "formik";
import { createProjectValidationSchema } from "../schemas/projects";
import { FormikOutlinedTextField } from "../components/textfield/textfield";
import { TextButton } from "../components/button/button";
import { CustomSelect } from "../components/select/select";
import api from "../api";
import { useQuery } from "@tanstack/react-query";
import type { ITeam } from "../components/teams/team-card";
import { useNavigate } from "react-router";

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
    <div>
      <h1 className="text-5xl">Create Project</h1>
      <Formik
        initialValues={initialValues}
        validationSchema={createProjectValidationSchema}
        onSubmit={handleSubmit}
      >
        {({ handleSubmit }) => (
          <>
            <Form slot="content" className="flex flex-col gap-4">
              <FormikOutlinedTextField
                label="Name"
                name="name"
                required
                autoFocus
              />
              <FormikOutlinedTextField
                label="Description"
                name="description"
                required
              />
              <Field
                className="custom-select"
                name="teamMembers"
                options={teams?.data.map((team: ITeam) => ({
                  label: team.name,
                  value: team._id,
                }))}
                component={CustomSelect}
                placeholder="Select multi teams..."
                isMulti={true}
              />
            </Form>

            <div slot="actions" className="mt-4 flex justify-end gap-2">
              <TextButton value="cancel">Cancel</TextButton>
              <TextButton onClick={() => handleSubmit()} value="ok">
                Ok
              </TextButton>
            </div>
          </>
        )}
      </Formik>
    </div>
  );
}
