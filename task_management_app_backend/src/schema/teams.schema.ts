import { z } from "zod";

const payload = {
  body: z.object({
    name: z.string({
      required_error: "Name is required",
    }),
    email: z
      .string({
        required_error: "Email is required",
      })
      .email(),
    designation: z.string({
      required_error: "Designation is required",
    }),
  }),
};

const params = {
  params: z.object({
    teamId: z.string({
      required_error: "teamId is required",
    }),
  }),
};

export const createTeamSchema = z.object({
  body: payload.body,
});

export const updateTeamSchema = z.object({
  body: payload.body,
  params: params.params,
});

export const deleteTeamSchema = z.object({
  params: params.params,
});

export const getTeamSchema = z.object({
  params: params.params,
});

export const getAllTeamSchema = z.object({
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

// Type extraction
export type CreateTeamInput = z.infer<typeof createTeamSchema>;
export type UpdateTeamInput = z.infer<typeof updateTeamSchema>;
export type ReadTeamInput = z.infer<typeof getTeamSchema>;
export type ReadAllTeamInput = z.infer<typeof getAllTeamSchema>;
export type DeleteTeamInput = z.infer<typeof deleteTeamSchema>;
