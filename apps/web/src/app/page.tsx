type HealthResponse = {
    status: string;
    database: string;
    timestamp: string;
};

async function getApiHealth(): Promise<HealthResponse | { error: string }> {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3001";

    try {
        const res = await fetch(`${apiUrl}/health`, { cache: "no-store" });
        if (!res.ok) {
            return { error: `API responded with ${res.status}` };
        }
        return (await res.json()) as HealthResponse;
    } catch {
        return { error: `Could not reach API at ${apiUrl}` };
    }
}

export default async function Home() {
    const health = await getApiHealth();
    const isHealthy = "status" in health && health.status === "ok";

    return (
        <div className="flex min-h-screen flex-col items-center justify-center gap-6 bg-zinc-50 dark:bg-black">
            <h1 className="text-3xl font-semibold tracking-tight text-black dark:text-zinc-50">ParkOps</h1>

            <div className="flex items-center gap-3 rounded-full border border-black/[.08] px-5 py-2 dark:border-white/[.145]">
                <span className={`h-2.5 w-2.5 rounded-full ${isHealthy ? "bg-green-500" : "bg-red-500"}`} />
                <span className="text-sm text-zinc-600 dark:text-zinc-400">
                    {"error" in health ? health.error : `api: ${health.status} · db: ${health.database}`}
                </span>
            </div>
        </div>
    );
}
