import { S3Client } from "@/api/client";
import {
  ALLOWED_IMAGE_TYPES,
  MAX_UPLOAD_SIZE_BYTES,
  MAX_UPLOAD_SIZE_MB,
} from "@/config/const/limits.const";
import type { S3DeleteResponse, S3UploadResponse } from "@/config/types/api.types";
import { HTTPError } from "ky";
import toast from "react-hot-toast";

export function extractS3Key(url: string): string | null {
  if (!url) return null;
  try {
    const parsed = new URL(url);
    const keyParam = parsed.searchParams.get("key");
    if (keyParam) return decodeURIComponent(keyParam);

    const path = decodeURIComponent(parsed.pathname.replace(/^\/+/, ""));
    const segments = path.split("/").filter(Boolean);
    const ownerIndex = segments.findIndex((segment) =>
      /^(user_|org_)/.test(segment)
    );
    if (ownerIndex >= 0) {
      return segments.slice(ownerIndex).join("/");
    }
    const last = segments[segments.length - 1];
    return last || null;
  } catch {
    if (!url.startsWith("http://") && !url.startsWith("https://")) {
      return url.replace(/^\/+/, "");
    }
    return null;
  }
}

export async function uploadFileToS3(
  file: File
): Promise<S3UploadResponse | null> {
  if (!file) {
    toast.error("Файл не выбран");
    return null;
  }

  if (!ALLOWED_IMAGE_TYPES.includes(file.type as typeof ALLOWED_IMAGE_TYPES[number])) {
    toast.error("Неподдерживаемый формат файла. Разрешены JPG, PNG, WebP, GIF.");
    return null;
  }

  if (file.size > MAX_UPLOAD_SIZE_BYTES) {
    toast.error(`Файл превышает допустимый размер ${MAX_UPLOAD_SIZE_MB} МБ`);
    return null;
  }

  const formData = new FormData();
  formData.append("file", file);

  try {
    const res = await S3Client.post("upload", {
      body: formData,
    }).json<S3UploadResponse>();

    return res;
  } catch (error) {
    if (error instanceof HTTPError) {
      if (error.response.status === 413) {
        toast.error(`Файл превышает допустимый размер ${MAX_UPLOAD_SIZE_MB} МБ`);
        return null;
      }
      if (error.response.status === 415) {
        toast.error("Неподдерживаемый формат изображения");
        return null;
      }
      if (error.response.status === 401) {
        toast.error("Необходима авторизация для загрузки файлов");
        return null;
      }
    }
    console.error("[S3_UPLOAD_ERROR]", error);
    toast.error("Ошибка при загрузке изображения на сервер");
    return null;
  }
}

export async function deleteFileFromS3(urlOrKey: string): Promise<boolean> {
  const key = extractS3Key(urlOrKey);
  if (!key) return false;

  try {
    const res = await S3Client.delete("delete", {
      searchParams: { key },
    }).json<S3DeleteResponse>();

    return res?.deleted ?? false;
  } catch (error) {
    console.error("[S3_DELETE_ERROR]", error);
    return false;
  }
}
