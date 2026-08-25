"use client";

import { CheckCircle2, X, Layers, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { ParsedBoardData } from "@/config/types/modals.types";

interface BoardImportPreviewProps {
  file: File | null;
  boardTitle: string;
  onTitleChange: (title: string) => void;
  parsedData: ParsedBoardData;
  onReset: () => void;
  isLoading: boolean;
}

export function BoardImportPreview({
  file,
  boardTitle,
  onTitleChange,
  parsedData,
  onReset,
  isLoading,
}: BoardImportPreviewProps) {
  const listCount = parsedData.lists.length;
  const cardCount = parsedData.lists.reduce(
    (acc, l) => acc + (l.cards?.length || 0),
    0
  );

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between p-3 rounded-xl bg-muted/50 border border-border">
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="p-2 rounded-lg bg-yellow-500/10 text-yellow-500 shrink-0">
            <CheckCircle2 className="h-4 w-4" />
          </div>
          <div className="min-w-0">
            <p className="text-xs font-medium truncate max-w-[220px]">
              {file?.name}
            </p>
            <p className="text-[11px] text-muted-foreground">
              {file ? `${(file.size / 1024).toFixed(1)} KB` : ""}
            </p>
          </div>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={onReset}
          disabled={isLoading}
          className="h-7 w-7 p-0 rounded-lg text-muted-foreground hover:text-foreground"
        >
          <X className="h-4 w-4" />
        </Button>
      </div>

      <div className="space-y-2">
        <Label htmlFor="board-title" className="text-xs font-semibold">
          Название создаваемой доски
        </Label>
        <Input
          id="board-title"
          value={boardTitle}
          onChange={(e) => onTitleChange(e.target.value)}
          disabled={isLoading}
          placeholder="Введите название доски"
          className="h-9 rounded-xl"
        />
      </div>

      <div className="grid grid-cols-2 gap-3 pt-1">
        <div className="flex items-center gap-2 p-2.5 rounded-xl bg-muted/40 border border-border/50 text-xs">
          <Layers className="h-4 w-4 text-muted-foreground shrink-0" />
          <div>
            <span className="text-muted-foreground">Списков: </span>
            <span className="font-semibold text-foreground">{listCount}</span>
          </div>
        </div>
        <div className="flex items-center gap-2 p-2.5 rounded-xl bg-muted/40 border border-border/50 text-xs">
          <FileText className="h-4 w-4 text-muted-foreground shrink-0" />
          <div>
            <span className="text-muted-foreground">Карточек: </span>
            <span className="font-semibold text-foreground">{cardCount}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
