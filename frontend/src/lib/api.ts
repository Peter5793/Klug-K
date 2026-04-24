const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? "http://localhost:8000/api";

async function buildRequestError(response: Response): Promise<Error> {
  const contentType = response.headers.get("Content-Type") ?? "";
  let detail = "";

  if (contentType.includes("application/json")) {
    const payload = (await response.json()) as { detail?: string; message?: string };
    detail = payload.detail ?? payload.message ?? "";
  } else {
    detail = (await response.text()).trim();
  }

  return new Error(
    detail ? `Request failed with status ${response.status}: ${detail}` : `Request failed with status ${response.status}`,
  );
}

export async function fetchJson<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...(init?.headers ?? {}),
    },
  });

  if (!response.ok) {
    throw await buildRequestError(response);
  }

  return (await response.json()) as T;
}

type AuthenticatedRequestOptions = {
  accessToken?: string;
  restaurantId?: string | null;
  init?: RequestInit;
};

export async function authenticatedFetchJson<T>(
  path: string,
  { accessToken, restaurantId, init }: AuthenticatedRequestOptions,
): Promise<T> {
  const headers = new Headers(init?.headers ?? {});
  headers.set("Content-Type", "application/json");

  if (accessToken) {
    headers.set("Authorization", `Bearer ${accessToken}`);
  }

  if (restaurantId) {
    headers.set("X-Restaurant-Id", restaurantId);
  }

  return fetchJson<T>(path, {
    ...init,
    headers,
  });
}
