import { z } from "zod"

export const UpdateBoardPublic = z.object({
    public: z.boolean(),
    id: z.string()
})