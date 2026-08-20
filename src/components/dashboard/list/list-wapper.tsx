import type { ListWrapperProps } from "@/config/types/main.types";

export function ListWrapper({
    children
}: ListWrapperProps) {
    return (
        <li className="shrink-0 h-full w-[272px] select-none">
            {children}
        </li>
    )
}