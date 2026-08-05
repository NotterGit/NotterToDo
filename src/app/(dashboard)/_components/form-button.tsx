"use client"

import { Button } from "@/components/ui/button";
import { useFormStatus } from "react-dom";

export function FormDelete() {
    const { pending } = useFormStatus()

    return (
        <Button className="bg-red-500 hover:bg-red-600" type="submit" disabled={pending}>
            Delete
        </Button>
    )
}


