"use client"

import { Input } from "@/components/ui/input"
import { useFormStatus } from "react-dom"

interface FormInputProps {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    errors?: {
        title?: string[]
    }
}

export default function FormInput({errors}: FormInputProps) {
    const { pending } = useFormStatus()

    return (
        <div>
            <Input 
                id="title" 
                name="title" 
                required 
                placeholder="Enter a board title"
                className="border-black border p-1"
                disabled={pending}
            />
            {errors?.title ? (
                <div>
                    {errors.title.map((err: string) => (
                        <p key={err} className="text-rose-500">
                            {err}
                        </p>
                    ))}
                </div>
            ) : null}
        </div>
    )
}
