"use client"

import { createBoard } from "@/actions/create-board";
import { useAction } from "@/hooks/use-action";
import { FormInput } from "@/components/form/form-input";
import { FormSubmit } from "@/components/form/form-button";

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
                <FormInput errors={fieldErrors} id="title" label="Board title"/>
            </div>
            <FormSubmit>Save</FormSubmit>
        </form>
    )
}