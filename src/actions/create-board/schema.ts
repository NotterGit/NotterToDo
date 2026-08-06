import { z } from "zod"

export const CreateBoard = z.object({
    title: z.string({
        message: "Title is required",
    }).min(3, {
        message: "Title is too short"
    }),
    image: z.string({
        message: "Image is required"
    })
})