import type { ListWrapperProps } from "@/config/types/main.types";
import { cn } from "@/lib/utils";

export function ListWrapper({
    children,
    isWrapped = false
}: ListWrapperProps) {
    return (
        <li className={cn("shrink-0 w-[272px] select-none", !isWrapped && "h-full")}>
            {children}
        </li>
    )
}