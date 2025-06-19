import { Field, Form, Formik } from "formik";
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
import type { IProject } from "../layouts/project-layout";
import { createTasksValidationSchema } from "../schemas/tasks";
import { FormikRadio } from "../components/radio/radio";

const initialValues = {
  title: "",
  description: "",
  deadline: "",
  project: "",
  status: "to-do",
  assignedMembers: [] as string[],
};
export default function CreateTasks() {
  const navigate = useNavigate();
  const handleSubmit = async (values: typeof initialValues) => {
    try {
      const response = await api.post("/tasks", {
        title: values.title,
        description: values.description,
        deadline: new Date(values.deadline),
        project: values.project,
        assignedMembers: values.assignedMembers,
        status: values.status,
      });
      console.log("Tasks created successfully:", response.data);

      // Optionally, you can redirect or show a success message here
      navigate("/tasks/" + response.data.data._id);
    } catch (error) {
      console.error("Error creating task:", error);
    }

    console.log("Form submitted with values:", values);
  };
  const { data: teams } = useQuery({
    queryKey: ["/teams"],
    queryFn: async () => {
      const data = await api.get("/teams");
      return data.data;
    },
  });

  const { data: projects } = useQuery({
    queryKey: ["/projects"],
    queryFn: async () => {
      const data = await api.get("/projects");
      return data.data;
    },
  });

  return (
    <div className="flex flex-col gap-4 p-4">
      <h1 className="text-display-large">Create Task</h1>
      <Formik
        initialValues={initialValues}
        validationSchema={createTasksValidationSchema}
        onSubmit={handleSubmit}
      >
        {({ isSubmitting, errors }) => (
          <>
            <Form className="flex max-w-lg flex-col gap-4">
              <Field name="status" type="hidden" value="to-do" />
              <FormikOutlinedTextField
                label="Title"
                name="title"
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
              <FormikOutlinedTextField
                label="Deadline"
                name="deadline"
                required
                type="datetime-local"
              />

              <div className="text-label-large">Select Project</div>
              {projects?.data.length > 0 && (
                <List className="rounded-3xl">
                  {projects?.data.map((project: IProject, index: number) => (
                    <Fragment key={project._id}>
                      <ListItem key={project._id}>
                        <FormikRadio
                          slot="start"
                          value={project._id}
                          name="project"
                          label={project.name}
                        />
                        <div slot="headline">{project.name}</div>
                        <div slot="supporting-text">{project.description}</div>
                      </ListItem>
                      {index < projects.data.length - 1 && <Divider />}
                    </Fragment>
                  ))}
                </List>
              )}
              {errors.project && (
                <div className="text-red-500">{errors.project}</div>
              )}

              <div className="text-label-large">Assign team members</div>
              {teams?.data.length > 0 && (
                <List className="rounded-3xl">
                  {teams?.data.map((team: ITeam, index: number) => (
                    <Fragment key={team._id}>
                      <ListItem key={team._id}>
                        <FormikCheckbox
                          slot="start"
                          value={team._id}
                          name="assignedMembers"
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
              {errors.assignedMembers && (
                <div className="text-red-500">{errors.assignedMembers}</div>
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
