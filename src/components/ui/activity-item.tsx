import { Avatar, AvatarImage } from "./avatar"
import { generateLogMessage } from "@/lib/generate-log"
import { format } from "date-fns"
import { ru } from "date-fns/locale"
import type { ActivityItemProps } from "@/config/types/components.types"

export const ActivityItem = ({
  data,
}: ActivityItemProps) => {
  return (
    <li className="flex items-center gap-x-2">
        <Avatar className="h-8 w-8">
            <AvatarImage src={data.userImage} />
        </Avatar>
        <div className="flex flex-col space-y-0.5">
            <p className="text-sm text-muted-foreground">
            <span className="font-semibold lowercase text-neutral-700 dark:text-neutral-200">
                {data.userName}
            </span> {generateLogMessage(data)}
            </p>
            <p className="text-xs text-muted-foreground">
                {format(new Date(data.createdAt), "d MMM yyyy 'в' HH:mm", { locale: ru })}
            </p>
        </div>
    </li>
  )
}