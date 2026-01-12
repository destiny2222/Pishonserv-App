import * as SecureStore from "expo-secure-store";

const BASE_URL = process.env.EXPO_PUBLIC_API_BASE_URL;

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
  auth?: boolean; // default true
  signal?: AbortSignal;
};

async function getAccessToken() {
  return SecureStore.getItemAsync("access_token");
}

// export async function apiRequest<T>(path: string, options: RequestOptions = {}): Promise<T> {
//   const url = `${BASE_URL}${path.startsWith("/") ? path : `/${path}`}`;

//   const headers: Record<string, string> = {
//     Accept: "application/json",
//     "Content-Type": "application/json",
//     ...options.headers,
//   };

//   const useAuth = options.auth !== false;
//   if (useAuth) {
//     const token = await getAccessToken();
//     if (token) headers.Authorization = `Bearer ${token}`;
//   }

//   const res = await fetch(url, {
//     method: options.method ?? "GET",
//     headers,
//     body: options.body === undefined ? undefined : JSON.stringify(options.body),
//     signal: options.signal,
//   });

  
//   let data: unknown = null;
//   const text = await res.text();
//   if (text) {
//     try {
//       data = JSON.parse(text);
//     } catch {
//       data = text;
//     }
//   }

//   if (!res.ok) {
//     const message =
//       typeof data === "object" && data && "message" in (data as any)
//         ? String((data as any).message)
//         : `Request failed (${res.status})`;

//     throw new ApiError(message, res.status, data);
//   }

//   return data as T;
// }

export async function apiRequest<T>(path: string, options: RequestOptions = {}): Promise<T> {
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
  }

  const hasBody = options.body !== undefined && method !== "GET" && method !== "HEAD";
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
    const message =
      data && typeof data === "object" && "message" in data
        ? String(data.message)
        : `Request failed (${res.status})`;

    throw new ApiError(message, res.status, data);
  }

  return data as T;
}



export const apiEndpoint = apiRequest;