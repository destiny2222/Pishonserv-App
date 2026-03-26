import * as SecureStore from "expo-secure-store";
const BASE_URL = process.env.EXPO_PUBLIC_API_BASE_URL;
const API_ACCESS_TOKEN = process.env.EXPO_PUBLIC_API_ACCESS_TOKEN;

if (!BASE_URL) {
  throw new Error("Missing EXPO_PUBLIC_API_BASE_URL in your env");
}

type HttpMethod = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";

export class ApiError extends Error {
  status: number;
  data: unknown;

  constructor(message: string, status: number, data?: unknown) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.data = data;
  }
}

type RequestOptions = {
  method?: HttpMethod;
  body?: unknown;
  headers?: Record<string, string>;
  auth?: boolean;
  token?: string;
  noStaticToken?: boolean;
  signal?: AbortSignal;
};

async function getAccessToken() {
  try {
    return await SecureStore.getItemAsync("access_token");
  } catch {
    return null;
  }
}

export async function apiRequest<T>(
  path: string,
  options: RequestOptions = {},
): Promise<T> {
  const url = `${BASE_URL}${path.startsWith("/") ? path : `/${path}`}`;
  const method = options.method ?? "GET";

  const headers: Record<string, string> = {
    Accept: "application/json",
    ...(options.headers ?? {}),
  };

  const useAuth = options.auth !== false;
  if (useAuth) {
    const token = await getAccessToken();
    if (token) headers.Authorization = `Bearer ${token}`;
  } else if (API_ACCESS_TOKEN && !options.noStaticToken) {
    // respect noStaticToken
    headers.Authorization = `Bearer ${API_ACCESS_TOKEN}`;
  }

  // const useAuth = options.auth !== false;
  // if (useAuth) {
  //   const token = await getAccessToken();
  //   if (token) headers.Authorization = `Bearer ${token}`;
  // } else if (API_ACCESS_TOKEN) {
  //   // Use API access token for public endpoints that require it
  //   headers.Authorization = `Bearer ${API_ACCESS_TOKEN}`;
  // }

  const hasBody = options.body !== undefined && method !== "GET";
  if (hasBody) headers["Content-Type"] = "application/json";

  const res = await fetch(url, {
    method,
    headers,
    body: hasBody ? JSON.stringify(options.body) : undefined,
    signal: options.signal,
  });

  const text = await res.text();
  const contentType = res.headers.get("content-type") ?? "";

  let data: any = null;
  if (text) {
    try {
      data = contentType.includes("application/json") ? JSON.parse(text) : text;
    } catch {
      data = text;
    }
  }

  if (!res.ok) {
    let message = `Request failed (${res.status})`;

    if (data && typeof data === "object") {
      if ("message" in data) {
        message = String(data.message);
      } else if ("error" in data) {
        message = String(data.error);
      }

      // Extract more specific error from validation errors if present (Laravel-style)
      if (
        res.status === 422 &&
        "errors" in data &&
        data.errors &&
        typeof data.errors === "object"
      ) {
        const errors = data.errors as Record<string, string[]>;
        const firstErrorKey = Object.keys(errors)[0];
        if (
          firstErrorKey &&
          Array.isArray(errors[firstErrorKey]) &&
          errors[firstErrorKey].length > 0
        ) {
          message = errors[firstErrorKey][0];
        }
      }
    }

    if (res.status >= 500) {
      // console.error(`[API ERROR 500] URL: ${url}`);
      // console.error(`[API ERROR 500] Status: ${res.status}`);
      // console.error(`[API ERROR 500] Body:`, JSON.stringify(data, null, 2));
    }

    throw new ApiError(message, res.status, data);
  }

  return data as T;
}

export const apiEndpoint = apiRequest;
