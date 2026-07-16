const GEOAPIFY_STYLE = "positron";

export const GEOAPIFY_API_KEY = process.env.NEXT_PUBLIC_GEOAPIFY_API_KEY || undefined;

export const DEFAULT_MAP_VIEW = {
    // [longitude, latitude] — Copenhagen
    center: [12.5683, 55.6761] as [number, number],
    zoom: 12,
};

export function getMapStyleUrl(apiKey: string): string {
    return `https://maps.geoapify.com/v1/styles/${GEOAPIFY_STYLE}/style.json?apiKey=${apiKey}`;
}
