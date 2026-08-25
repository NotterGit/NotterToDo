import { ParsedBoardData, ParsedList } from "@/config/types/modals.types";

export async function parseBoardFile(selectedFile: File): Promise<ParsedBoardData> {
  if (!selectedFile.name.endsWith(".json")) {
    throw new Error("Пожалуйста, выберите файл в формате .json");
  }

  const text = await selectedFile.text();
  let rawJson: unknown;
  try {
    rawJson = JSON.parse(text);
  } catch {
    throw new Error("Ошибка при чтении JSON файла");
  }

  const recordJson = rawJson && typeof rawJson === "object" ? (rawJson as Record<string, unknown>) : null;

  const boardObj =
    recordJson && recordJson.type === "notter_todo_board_export" && recordJson.board && typeof recordJson.board === "object"
      ? (recordJson.board as Record<string, unknown>)
      : recordJson;

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

  return {
    title: boardObj.title,
    image: typeof boardObj.image === "string" ? boardObj.image : undefined,
    lists,
  };
}
