"use client"

import { cn } from "@/lib/utils"
import { Button } from "../ui/button"
import { useFormStatus } from "react-dom"
import type { FormSubmitProps } from "@/config/types/components.types"

export const FormSubmit = ({
    children, disabled, className, variant
}: FormSubmitProps) => {
    const { pending } = useFormStatus()

    return (
        <Button
            disabled={pending || disabled}
            className={cn(className)}
            variant={variant}
            type="submit"
        >
            {children}
        </Button>
    )
}