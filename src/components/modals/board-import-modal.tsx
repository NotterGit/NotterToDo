"use client";

import { useState, useRef } from "react";
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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAction } from "@/hooks/use-action";
import { importBoard } from "@/actions/import-board";
import { pages } from "@/config/routing/pages.route";
import toast from "react-hot-toast";
import {
  Upload,
  FileJson,
  CheckCircle2,
  AlertCircle,
  X,
  Layers,
  FileText,
} from "lucide-react";

interface BoardImportModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface ParsedCard {
  title: string;
  order?: number;
  description?: string;
}

interface ParsedList {
  title: string;
  order?: number;
  cards?: ParsedCard[];
}

interface ParsedBoardData {
  title: string;
  image?: string;
  lists: ParsedList[];
}

export function BoardImportModal({ isOpen, onClose }: BoardImportModalProps) {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [file, setFile] = useState<File | null>(null);
  const [boardTitle, setBoardTitle] = useState("");
  const [parsedData, setParsedData] = useState<ParsedBoardData | null>(null);
  const [parseError, setParseError] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);

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
    setIsDragging(false);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleClose = () => {
    if (isLoading) return;
    resetState();
    onClose();
  };

  const processFile = async (selectedFile: File) => {
    if (!selectedFile.name.endsWith(".json")) {
      setParseError("Пожалуйста, выберите файл в формате .json");
      setFile(null);
      setParsedData(null);
      return;
    }

    try {
      const text = await selectedFile.text();
      const rawJson = JSON.parse(text);

      const boardObj =
        rawJson.type === "notter_todo_board_export" && rawJson.board
          ? rawJson.board
          : rawJson;

      if (!boardObj || typeof boardObj !== "object") {
        throw new Error("Некорректная структура JSON файла");
      }

      if (!boardObj.title || typeof boardObj.title !== "string") {
        throw new Error("Файл не содержит корректного названия доски");
      }

      const lists: ParsedList[] = Array.isArray(boardObj.lists)
        ? boardObj.lists.map((l: unknown, lIdx: number) => {
            const listObj = l && typeof l === "object" ? (l as Record<string, unknown>) : {};
            const cardsRaw = Array.isArray(listObj.cards) ? listObj.cards : [];
            return {
              title: typeof listObj.title === "string" ? listObj.title : `Список ${lIdx + 1}`,
              order: typeof listObj.order === "number" ? listObj.order : lIdx + 1,
              cards: cardsRaw.map((c: unknown, cIdx: number) => {
                const cardObj = c && typeof c === "object" ? (c as Record<string, unknown>) : {};
                return {
                  title: typeof cardObj.title === "string" ? cardObj.title : `Карточка ${cIdx + 1}`,
                  order: typeof cardObj.order === "number" ? cardObj.order : cIdx + 1,
                  description: typeof cardObj.description === "string" ? cardObj.description : "",
                };
              }),
            };
          })
        : [];

      const parsed: ParsedBoardData = {
        title: boardObj.title,
        image: typeof boardObj.image === "string" ? boardObj.image : undefined,
        lists,
      };

      setFile(selectedFile);
      setParsedData(parsed);
      setBoardTitle(parsed.title);
      setParseError(null);
    } catch (err: unknown) {
      setParseError(err instanceof Error ? err.message : "Ошибка при чтении JSON файла");
      setFile(null);
      setParsedData(null);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      processFile(selectedFile);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const droppedFile = e.dataTransfer.files?.[0];
    if (droppedFile) {
      processFile(droppedFile);
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

  const listCount = parsedData?.lists.length || 0;
  const cardCount =
    parsedData?.lists.reduce((acc, l) => acc + (l.cards?.length || 0), 0) || 0;

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
          <div
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            className={`cursor-pointer border-2 border-dashed rounded-2xl p-8 flex flex-col items-center justify-center text-center transition-all ${
              isDragging
                ? "border-yellow-500 bg-yellow-500/10 scale-[1.01]"
                : "border-border hover:border-yellow-500/60 hover:bg-muted/40"
            }`}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept=".json,application/json"
              className="hidden"
              onChange={handleFileChange}
            />
            <div className="w-12 h-12 rounded-2xl bg-yellow-500/10 text-yellow-500 flex items-center justify-center mb-3">
              <Upload className="h-6 w-6" />
            </div>
            <p className="text-sm font-semibold text-foreground">
              Нажмите для выбора файла или перетащите сюда
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              Поддерживаются файлы в формате .json
            </p>
          </div>
        ) : (
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
                onClick={resetState}
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
                onChange={(e) => setBoardTitle(e.target.value)}
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
                  <span className="font-semibold text-foreground">
                    {listCount}
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-2 p-2.5 rounded-xl bg-muted/40 border border-border/50 text-xs">
                <FileText className="h-4 w-4 text-muted-foreground shrink-0" />
                <div>
                  <span className="text-muted-foreground">Карточек: </span>
                  <span className="font-semibold text-foreground">
                    {cardCount}
                  </span>
                </div>
              </div>
            </div>
          </div>
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
