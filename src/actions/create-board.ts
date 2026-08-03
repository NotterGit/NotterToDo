"use server";

import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { z } from "zod"

export type State = {
    errors?: {
        title?: string[]
    },
    message?: string | null
}

const CreateBoard = z.object({
    title: z.string().min(3, {
        message: "Min length of 3 letter"
    })
})

export async function create(prevState: State | undefined, formData: FormData) {
    const validateFields = CreateBoard.safeParse({
        title: formData.get("title")
    })

    if(!validateFields.success) {
        return {
            errors: validateFields.error.flatten().fieldErrors,
            message: "Missing field"
        }
    }

    const { title } = validateFields.data

    try {
        await db.board.create({
            data: {
                title,
            },
        });
    } catch (err) {
        return {
            message: "Database Error"
        }
    }

    revalidatePath("/organization/[orgId]");
}