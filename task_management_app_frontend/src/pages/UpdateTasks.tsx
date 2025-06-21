import { Field, Form, Formik } from "formik";
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
import type { IProject } from "../layouts/project-layout";
import { createTasksValidationSchema } from "../schemas/tasks";
import { FormikRadio } from "../components/radio/radio";
import type { ITask } from "./Tasks";
import { FormikSingleSelect } from "../components/select/select";

function formatDateToLocalISO(date: Date): string {
  const pad = (num: number) => String(num).padStart(2, "0");

  const year = date.getFullYear();
  const month = pad(date.getMonth() + 1); // Months are 0-based
  const day = pad(date.getDate());
  const hours = pad(date.getHours());
  const minutes = pad(date.getMinutes());

  return `${year}-${month}-${day}T${hours}:${minutes}`;
}

export default function UpdateTasks() {
  const { taskId } = useParams<{ taskId: string }>();

  const { isLoading, data: tasks } = useQuery({
    queryKey: ["tasks", taskId],
    queryFn: async (): Promise<ITask> => {
      const data = await api.get(`/tasks/${taskId}`);
      return data.data.data;
    },
    staleTime: 5000,
  });

  const initialValues = {
    title: tasks?.title || "",
    description: tasks?.description || "",
    deadline: tasks?.deadline
      ? formatDateToLocalISO(new Date(tasks.deadline))
      : "",
    project: tasks?.project._id || "",
    status: tasks?.status || "to-do",
    assignedMembers: tasks?.assignedMembers.map((member) => member._id) || [],
  };

  const navigate = useNavigate();

  const updateTasksMutation = useMutation({
    mutationFn: async (values: typeof initialValues) => {
      const response = await api.put(`/tasks/${taskId}`, {
        title: values.title,
        description: values.description,
        deadline: new Date(values.deadline),
        project: values.project,
        assignedMembers: values.assignedMembers,
        status: values.status,
      });
      return response.data;
    },
    onSuccess: () => {
      navigate("/tasks/" + taskId);
    },
    onError: (error: Error) => {
      console.error("Failed to update task", error);
    },
  });

  const handleSubmit = async (values: typeof initialValues) => {
    try {
      await updateTasksMutation.mutateAsync(values);
      console.log("Tasks updated successfully");
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

  const { data: projects } = useQuery({
    queryKey: ["/projects"],
    queryFn: async () => {
      const data = await api.get("/projects");
      return data.data;
    },
  });

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="flex flex-col gap-4 p-4">
      <h1 className="text-display-large mb-8">Update Task</h1>
      <Formik
        initialValues={initialValues}
        validationSchema={createTasksValidationSchema}
        onSubmit={handleSubmit}
      >
        {({ isSubmitting, errors, touched }) => (
          <>
            <Form className="flex max-w-lg flex-col gap-4">
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
              <div className="relative flex flex-col gap-2">
                <div className="bg-surface-container-lowest focus:text-primary absolute -top-2 left-2 px-2 text-[0.75rem]">
                  Deadline
                </div>
                <Field
                  label="Deadline"
                  name="deadline"
                  required
                  className="focus:outline-primary border-outline rounded border bg-transparent p-2 py-4 focus:outline-[0.15rem] dark:[color-scheme:dark]"
                  type="datetime-local"
                />
                {errors.deadline && touched.deadline && (
                  <div className="text-error">{errors.deadline}</div>
                )}
              </div>
              <FormikSingleSelect
                name="status"
                label="Status"
                supportingText="Select one"
                options={[
                  { label: "To do", value: "to-do" },
                  { label: "In Progress", value: "in-progress" },
                  { label: "Done", value: "done" },
                  { label: "Cancelled", value: "cancelled" },
                ]}
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
                <div className="text-red-500">
                  {errors.assignedMembers.toString()}
                </div>
              )}

              <div className="mt-4 flex justify-start gap-4">
                <TextButton
                  type="button"
                  onClick={() => navigate("/tasks/" + taskId)}
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
