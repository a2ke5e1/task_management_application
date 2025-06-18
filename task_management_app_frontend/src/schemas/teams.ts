import * as Yup from "yup";

export const createTeamValidationSchema = Yup.object({
  name: Yup.string().required("Name is required"),
  email: Yup.string().email("Invalid email").required("Email is required"),
  designation: Yup.string().required("Designation is required"),
});

export const updateTeamValidationSchema = createTeamValidationSchema.concat(
  Yup.object({
    _id: Yup.string().required("Team ID is required"),
  }),
);
