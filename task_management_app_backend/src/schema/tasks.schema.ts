import { z } from "zod";
import { isValidObjectId } from "mongoose";

const payload = {
  body: z.object({
    title: z.string({
      required_error: "Title is required",
    }),
    description: z.string({
      required_error: "Description is required",
    }),
    deadline: z.preprocess(
      (val) => new Date(val as string),
      z.date({
        required_error: "Deadline is required",
      })
    ),
    project: z.string().refine((id) => isValidObjectId(id), {
      message: "Invalid projectId",
    }),
    assignedMembers: z.array(
      z.string().refine((id) => isValidObjectId(id), {
        message: "Invalid memeber id",
      })
    ),
    status: z.enum(["to-do", "in-progress", "done", "cancelled"], {
      required_error: "Status is required",
    }),
  }),
};

const params = {
  params: z.object({
    taskId: z
      .string({
        required_error: "taskId is required",
      })
      .refine((id) => isValidObjectId(id), {
        message: "Invalid taskId",
      }),
  }),
};

export const createTaskSchema = z.object({
  body: payload.body,
});

export const updateTaskSchema = z.object({
  body: payload.body,
  params: params.params,
});

export const deleteTaskSchema = z.object({
  params: params.params,
});

export const getTaskSchema = z.object({
  params: params.params,
});

export const getAllTaskSchema = z.object({
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
      projectId: z
        .string()
        .refine((id) => isValidObjectId(id), {
          message: "Invalid projectId",
        })
        .optional(),
      memberId: z
        .string()
        .refine((id) => isValidObjectId(id), {
          message: "Invalid memberId",
        })
        .optional(),
      status: z.enum(["to-do", "in-progress", "done", "cancelled"]).optional(),
      search: z.string().optional(),
      startDate: z
        .string()
        .optional()
        .refine((val) => !val || !isNaN(Date.parse(val)), {
          message: "Invalid startDate",
        }),

      endDate: z
        .string()
        .optional()
        .refine((val) => !val || !isNaN(Date.parse(val)), {
          message: "Invalid endDate",
        }),
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
    )
    .refine(
      (data) =>
        !data.startDate ||
        !data.endDate ||
        new Date(data.startDate) <= new Date(data.endDate),
      {
        message: "startDate must be before or equal to endDate",
        path: ["startDate"],
      }
    ),
});

// Type extraction
export type CreateTaskInput = z.infer<typeof createTaskSchema>;
export type UpdateTaskInput = z.infer<typeof updateTaskSchema>;
export type ReadTaskInput = z.infer<typeof getTaskSchema>;
export type ReadAllTaskInput = z.infer<typeof getAllTaskSchema>;
export type DeleteTaskInput = z.infer<typeof deleteTaskSchema>;
