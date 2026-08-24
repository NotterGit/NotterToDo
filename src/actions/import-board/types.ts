import { z } from "zod";
import { ImportBoard } from "./schema";
import { ActionState } from "@/lib/create-safe-action";
import { Board } from "@prisma/client";

export type InputType = z.infer<typeof ImportBoard>;
export type ReturnType = ActionState<InputType, Board>;
