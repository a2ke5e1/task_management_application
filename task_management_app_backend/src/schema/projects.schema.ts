import { z } from "zod";
import { isValidObjectId } from "mongoose";

const payload = {
  body: z.object({
    name: z.string({
      required_error: "Name is required",
    }),
    description: z.string({
      required_error: "Description is required",
    }),
    teamMembers: z.array(
      z.string().refine((id) => isValidObjectId(id), {
        message: "Invalid teamId in teamMembers",
      })
    ),
  }),
};

const params = {
  params: z.object({
    projectId: z
      .string({
        required_error: "projectId is required",
      })
      .refine((id) => isValidObjectId(id), {
        message: "Invalid projectId",
      }),
  }),
};

export const createProjectSchema = z.object({
  body: payload.body,
});

export const updateProjectSchema = z.object({
  body: payload.body,
  params: params.params,
});

export const deleteProjectSchema = z.object({
  params: params.params,
});

export const getProjectSchema = z.object({
  params: params.params,
});

export const getAllProjectSchema = z.object({
  query: z
    .object({
      page: z.coerce
        .number()
        .min(1, { message: "Page cannot be less than 1" })
        .optional(),
      limit: z.coerce
        .number()
        .min(1, { message: "Limit can't be less than 1" })
        .optional(),
    })
    .refine(
      (data) => {
        const pageDefined = data.page !== undefined;
        const limitDefined = data.limit !== undefined;
        return pageDefined === limitDefined;
      },
      {
        message: "Both 'page' and 'limit' must be provided together",
        path: ["page"],
      }
    ),
});

export const getPageNumberSchema = z.object({
  query: z.object({
    limit: z.coerce.number().min(1, { message: "Limit can't be less than 1" }),
  }),
  params: params.params,
});

// Type extraction
export type CreateProjectInput = z.infer<typeof createProjectSchema>;
export type UpdateProjectInput = z.infer<typeof updateProjectSchema>;
export type ReadProjectInput = z.infer<typeof getProjectSchema>;
export type ReadAllProjectInput = z.infer<typeof getAllProjectSchema>;
export type DeleteProjectInput = z.infer<typeof deleteProjectSchema>;
export type GetProjectPageNumberInput = z.infer<typeof getPageNumberSchema>;
