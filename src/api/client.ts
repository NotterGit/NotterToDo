import { API_BASE_URL, API_TIMEOUT } from "@/config/const/api.const";
import ky, { HTTPError, Options } from "ky";

let clerkTokenGetter: (() => Promise<string | null>) | null = null;

export const setClerkTokenGetter = (
  getter: (() => Promise<string | null>) | null
) => {
  clerkTokenGetter = getter;
};

const normalizePath = (path: string): string => {
  return path.replace(/^\/+/, "");
};

export const Client = ky.create({
  prefix: API_BASE_URL,
  timeout: API_TIMEOUT,
  retry: {
    limit: 1,
    methods: ["get"],
    statusCodes: [408, 500, 502, 503, 504],
  },
  hooks: {
    beforeRequest: [
      async ({ request }) => {
        if (clerkTokenGetter && !request.headers.get("Authorization")) {
          try {
            const token = await clerkTokenGetter();
            if (token) {
              request.headers.set("Authorization", `Bearer ${token}`);
            }
          } catch {
            // Unauthenticated request fallback
          }
        }
      },
    ],
  },
});

export const removeNullish = <T extends Record<string, unknown>>(
  payload: T
): Partial<T> => {
  return Object.fromEntries(
    Object.entries(payload).filter(
      ([, value]) => value !== null && value !== undefined
    )
  ) as Partial<T>;
};

export const Get = async <T>(
  url: string,
  options?: Options
): Promise<T | null> => {
  try {
    const res = await Client.get(normalizePath(url), options).json<T>();
    return res;
  } catch (error) {
    if (error instanceof HTTPError && error.response.status === 404) {
      return null;
    }
    console.error(`[API] GET ${url} failed:`, error);
    return null;
  }
};

export const Post = async <T>(
  url: string,
  data?: unknown,
  options?: Options
): Promise<T | null> => {
  try {
    const res = await Client
      .post(normalizePath(url), {
        ...options,
        json: data ? removeNullish(data as Record<string, unknown>) : undefined,
      })
      .json<T>();
    return res;
  } catch (error) {
    console.error(`[API] POST ${url} failed:`, error);
    return null;
  }
};

export const Put = async <T>(
  url: string,
  data?: unknown,
  options?: Options
): Promise<T | null> => {
  try {
    const res = await Client
      .put(normalizePath(url), {
        ...options,
        json: data ? removeNullish(data as Record<string, unknown>) : undefined,
      })
      .json<T>();
    return res;
  } catch (error) {
    console.error(`[API] PUT ${url} failed:`, error);
    return null;
  }
};

export const Delete = async <T>(
  url: string,
  options?: Options
): Promise<T | null> => {
  try {
    const res = await Client.delete(normalizePath(url), options).json<T>();
    return res;
  } catch (error) {
    console.error(`[API] DELETE ${url} failed:`, error);
    return null;
  }
};
