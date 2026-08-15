const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3001";

export class ApiError extends Error {
    constructor(
        public readonly status: number,
        message: string,
    ) {
        super(message);
        this.name = "ApiError";
    }
}

export async function apiFetch(path: string, init?: RequestInit): Promise<unknown> {
    const headers = new Headers(init?.headers);

    if (!headers.has("Accept")) {
        headers.set("Accept", "application/json");
    }

    const response = await fetch(`${API_BASE_URL}${path}`, {
        ...init,
        headers,
    });

    if (!response.ok) {
        throw new ApiError(response.status, await readErrorMessage(response));
    }

    if (response.status === 204) {
        return undefined;
    }

    const text = await response.text();
    return text ? JSON.parse(text) : undefined;
}

export type MutationMethod = "POST" | "PUT" | "PATCH" | "DELETE";

export function apiMutate(path: string, method: MutationMethod, body?: unknown): Promise<unknown> {
    return apiFetch(path, {
        method,
        headers: body !== undefined ? { "Content-Type": "application/json" } : undefined,
        body: body !== undefined ? JSON.stringify(body) : undefined,
    });
}

async function readErrorMessage(response: Response): Promise<string> {
    const text = await response.text().catch(() => "");

    if (!text) {
        return response.statusText;
    }

    try {
        const parsed = JSON.parse(text) as { message?: unknown; error?: unknown };
        const message = parsed.message ?? parsed.error;

        if (typeof message === "string") {
            return message;
        }

        if (message) {
            return JSON.stringify(message);
        }
    } catch {
        return text;
    }

    return text;
}
