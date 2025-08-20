import z from "zod";

export const createRequestSchema = z.object({

})

export type CreateRequest = z.infer<typeof createRequestSchema>