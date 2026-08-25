"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useAction } from "@/hooks/use-action";
import { importBoard } from "@/actions/import-board";
import { pages } from "@/config/routing/pages.route";
import toast from "react-hot-toast";
import { FileJson, AlertCircle } from "lucide-react";
import type { BoardImportModalProps, ParsedBoardData } from "@/config/types/modals.types";
import { parseBoardFile } from "./parse-board-file";
import { Dropzone } from "./dropzone";
import { BoardImportPreview } from "./preview";

export type { BoardImportModalProps } from "@/config/types/modals.types";

export function BoardImportModal({ isOpen, onClose }: BoardImportModalProps) {
  const router = useRouter();

  const [file, setFile] = useState<File | null>(null);
  const [boardTitle, setBoardTitle] = useState("");
  const [parsedData, setParsedData] = useState<ParsedBoardData | null>(null);
  const [parseError, setParseError] = useState<string | null>(null);

  const { execute, isLoading } = useAction(importBoard, {
    onSuccess: (data) => {
      toast.success("Доска успешно импортирована!");
      handleClose();
      router.push(pages.BOARD(data.id));
    },
    onError: (error) => {
      toast.error(
        typeof error === "string" ? error : "Не удалось импортировать доску"
      );
    },
  });

  const resetState = () => {
    setFile(null);
    setBoardTitle("");
    setParsedData(null);
    setParseError(null);
  };

  const handleClose = () => {
    if (isLoading) return;
    resetState();
    onClose();
  };

  const handleFileSelect = async (selectedFile: File) => {
    try {
      const parsed = await parseBoardFile(selectedFile);
      setFile(selectedFile);
      setParsedData(parsed);
      setBoardTitle(parsed.title);
      setParseError(null);
    } catch (err: unknown) {
      setParseError(
        err instanceof Error ? err.message : "Ошибка при чтении JSON файла"
      );
      setFile(null);
      setParsedData(null);
    }
  };

  const handleImport = () => {
    if (!parsedData) return;

    const trimmedTitle = boardTitle.trim();
    if (trimmedTitle.length < 3) {
      toast.error("Название доски должно содержать не менее 3 символов");
      return;
    }

    execute({
      title: trimmedTitle,
      image: parsedData.image,
      lists: parsedData.lists,
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && handleClose()}>
      <DialogContent className="max-w-md w-full p-6 gap-5 rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-2xl bg-white dark:bg-zinc-950">
        <DialogHeader className="space-y-1.5 text-left">
          <DialogTitle className="text-xl font-bold flex items-center gap-2">
            <FileJson className="h-5 w-5 text-yellow-500" />
            Импорт доски из JSON
          </DialogTitle>
          <DialogDescription className="text-xs sm:text-sm text-muted-foreground">
            Загрузите JSON-файл доски, экспортированный из Notter ToDo
          </DialogDescription>
        </DialogHeader>

        {!parsedData ? (
          <Dropzone onFileSelect={handleFileSelect} />
        ) : (
          <BoardImportPreview
            file={file}
            boardTitle={boardTitle}
            onTitleChange={setBoardTitle}
            parsedData={parsedData}
            onReset={resetState}
            isLoading={isLoading}
          />
        )}

        {parseError && (
          <div className="flex items-center gap-2 p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-600 dark:text-rose-400 text-xs">
            <AlertCircle className="h-4 w-4 shrink-0" />
            <span>{parseError}</span>
          </div>
        )}

        <DialogFooter className="flex flex-row justify-end gap-2 pt-2">
          <Button
            type="button"
            variant="outline"
            onClick={handleClose}
            disabled={isLoading}
            className="rounded-xl text-xs font-medium"
          >
            Отмена
          </Button>
          <Button
            type="button"
            onClick={handleImport}
            disabled={!parsedData || isLoading || boardTitle.trim().length < 3}
            className="rounded-xl text-xs font-semibold bg-yellow-600 hover:bg-yellow-700 text-white"
          >
            {isLoading ? "Импорт..." : "Импортировать доску"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
