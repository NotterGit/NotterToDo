import { z } from "zod"

export const UpdateBoardBackground = z.object({
    image: z.string({
        message: "Изображение обязательно"
    }),
    id: z.string()
})
