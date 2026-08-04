"use client"

import { createBoard } from "@/actions/create-board";
import FormInput from "./form-input";
import { FormSubmit } from "./form-button";
import { useAction } from "@/hooks/use-action";

export function Form() {
    const { execute, fieldErrors } = useAction(createBoard, {
        onSuccess: (data) => {
            console.log(data, "SUCCESS!")
        },
        onError: (err) => {
            console.error(err)
        }
    })

    const onSubmit = (formData: FormData) => {
        const title = formData.get("title") as string
        execute({ title })
    }

    return (
        <form action={onSubmit} className="flex flex-col gap-y-2">
            <div className="flex flex-col space-y-2">
                <FormInput errors={fieldErrors}/>
            </div>
            <FormSubmit/>
        </form>
    )
}