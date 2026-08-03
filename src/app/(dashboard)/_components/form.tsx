"use client"

import { create, State } from "@/actions/create-board";
import { useFormState } from "react-dom";
import FormInput from "./form-input";
import { FormSubmit } from "./form-button";

export function Form() {
    const initialState: State = { message: null, errors: {} }
    const [state, dispatch] = useFormState(create, initialState)

    return (
        <form action={dispatch} className="flex flex-col gap-y-2">
            <div className="flex flex-col space-y-2">
                <FormInput errors={state?.errors}/>
            </div>
            <FormSubmit/>
        </form>
    )
}