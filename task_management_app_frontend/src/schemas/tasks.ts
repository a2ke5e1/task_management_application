import * as Yup from "yup";

export const createTasksValidationSchema = Yup.object({
  title: Yup.string().required("Title is required"),
  description: Yup.string().required("Description is required"),
  deadline: Yup.date().required("Deadline is required"),
  project: Yup.string().required("Project ID is required"),
  assignedMembers: Yup.array().of(
    Yup.string().required("Member ID is required"),
  ),
  status: Yup.string()
    .oneOf(["to-do", "in-progress", "done", "cancelled"], "Invalid status")
    .required("Status is required"),
});

export const updateTasksValidationSchema = createTasksValidationSchema.concat(
  Yup.object({
    _id: Yup.string().required("Task ID is required"),
  }),
);
