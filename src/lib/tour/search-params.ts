import { ROUTES } from "@/constants";

export type TourSearchParams = {
  destination?: string;
  q?: string;
  from?: string;
  to?: string;
  type?: string;
};

function pickParam(
  raw: Record<string, string | string[] | undefined>,
  key: string,
): string | undefined {
  const value = raw[key];

  return typeof value === "string" && value.trim() ? value.trim() : undefined;
}

export function parseTourSearchParams(
  raw: Record<string, string | string[] | undefined>,
): TourSearchParams {
  return {
    destination: pickParam(raw, "destination"),
    q: pickParam(raw, "q"),
    from: pickParam(raw, "from"),
    to: pickParam(raw, "to"),
    type: pickParam(raw, "type"),
  };
}

export function buildTourSearchUrl(params: TourSearchParams): string {
  const sp = new URLSearchParams();

  if (params.destination) sp.set("destination", params.destination);
  if (params.q) sp.set("q", params.q);
  if (params.from) sp.set("from", params.from);
  if (params.to) sp.set("to", params.to);
  if (params.type) sp.set("type", params.type);

  const qs = sp.toString();

  return qs ? `${ROUTES.TOURS}?${qs}` : ROUTES.TOURS;
}
