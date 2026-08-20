"use client"

import { X } from "lucide-react";
import { Button } from "../ui/button";
import { Popover, PopoverClose, PopoverContent, PopoverTrigger } from "../ui/popover";
import { FormInput } from "./form-input";
import { FormSubmit } from "./form-button";
import { useAction } from "@/hooks/use-action";
import { createBoard } from "@/actions/create-board";
import toast from "react-hot-toast";
import { FormPicker } from "./form-picker";
import { ElementRef, useRef } from "react";
import { useRouter } from "next/navigation";
import { pages } from "@/config/routing/pages.route";
import type { FormPopoverProps } from "@/config/types/components.types";

export const FormPopover = ({
  children, side = "bottom", align, sideOffset = 0
}: FormPopoverProps) => {
    const router = useRouter()
    const closeRef = useRef<ElementRef<"button">>(null)

    const { execute, fieldErrors } = useAction(createBoard, {
        onSuccess: (data) => {
            closeRef.current?.click()
            router.push(pages.BOARD(data.id))
        }
    })

    const onSubmit = (formData: FormData) => {
        const title = formData.get("title") as string
        const image = formData.get("image") as string

        toast.promise(execute({title, image}), {
            loading: "Creating board...",
            success: "Board created!",
            error: (err) => err
        })
    }

    return (
        <Popover>
            <PopoverTrigger>
                {children}
            </PopoverTrigger>
            <PopoverContent
                align={align}
                className="w-80 pt-3"
                side={side}
                sideOffset={sideOffset}
            >
                <div className="text-sm font-medium text-center text-neutral-600 dark:text-neutral-300">
                    Create board
                </div>
                <PopoverClose ref={closeRef}>
                    <Button className="h-auto w-auto p-2 absolute top-2 right-2 text-neutral-600 dark:text-neutral-300" variant="ghost">
                        <X className="w-4 h-4"/>
                    </Button>
                </PopoverClose>
                <form className="space-y-4" action={onSubmit}>
                    <div className="space-y-4">
                        <FormPicker
                            id="image"
                            errors={fieldErrors}
                        />
                        <FormInput
                            id="title"
                            label="Board title"
                            type="text"
                            errors={fieldErrors}
                        />
                    </div>
                    <FormSubmit className="w-full">
                        Create
                    </FormSubmit>
                </form>
            </PopoverContent>
        </Popover>
    )
}