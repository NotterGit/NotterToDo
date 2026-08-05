"use client"

import { cn } from "@/lib/utils"
import { Button } from "../ui/button"
import { useFormStatus } from "react-dom"

interface FormSubmitProps {
    children: React.ReactNode
    disabled?: boolean
    className?: string
    variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link"
}

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