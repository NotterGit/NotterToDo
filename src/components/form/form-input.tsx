"use client"

import { forwardRef } from "react"
import { useFormStatus } from "react-dom"
import { Label } from "../ui/label"
import { cn } from "@/lib/utils"
import { FormErrors } from "./form-errors"
import { Input } from "../ui/input"
import type { FormInputProps } from "@/config/types/components.types"

export const FormInput = forwardRef<HTMLInputElement, FormInputProps>(({
    id, label, type, placeholder, required, disabled, errors, className, defaultValue = "", onBlur
}, ref) => {
    const { pending } = useFormStatus()

    return (
        <div className="space-y-2">
            <div className="space-y-1">
                {label ? (
                    <Label 
                        htmlFor={id} 
                        className="text-xs font-semibold text-neutral-700 dark:text-neutral-300"
                    >
                        {label}
                    </Label>
                ) : null}
                <Input
                    onBlur={onBlur}
                    defaultValue={defaultValue}
                    ref={ref}
                    required={required}
                    name={id}
                    placeholder={placeholder}
                    type={type}
                    disabled={pending || disabled}
                    className={cn(
                        "text-sm px-2 py-1 h-7",
                        className
                    )}
                    aria-describedby={`${id}-error`}
                />
            </div>
            <FormErrors
                id={id}
                errors={errors}
            />
        </div>
    )
})

FormInput.displayName = "FormInput"