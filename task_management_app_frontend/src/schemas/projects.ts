import * as Yup from "yup";

export const createProjectValidationSchema = Yup.object({
  name: Yup.string().required("Project name is required"),
  description: Yup.string().required("Project description is required"),
  teamMembers: Yup.array()
    .of(Yup.string().required("Team member ID is required"))
    .min(1, "At least one team member is required"),
});

export const updateProjectValidationSchema =
  createProjectValidationSchema.concat(
    Yup.object({
      _id: Yup.string().required("Project ID is required"),
    }),
  );
