import "server-only";

import { resolveCountryCodesParam } from "./countryIso";

const NOMINATIM_SEARCH = "https://nominatim.openstreetmap.org/search";

export type GeocodeHit = {
  lat: number;
  lon: number;
  displayName: string;
};

export async function geocodeCityCountry(
  city: string,
  country: string
): Promise<GeocodeHit | null> {
  const cityTrim = city.trim();
  const countryTrim = country.trim();
  if (!cityTrim) return null;

  const contact = process.env.NOMINATIM_CONTACT_EMAIL?.trim();
  if (!contact) {
    throw new Error(
      "Brak NOMINATIM_CONTACT_EMAIL w pliku .env.local. Dodaj prawdziwy email kontaktowy i zrestartuj dev server."
    );
  }

  const params = new URLSearchParams({
    format: "json",
    limit: "1",
    q: countryTrim ? `${cityTrim}, ${countryTrim}` : cityTrim,
  });
  const cc = resolveCountryCodesParam(countryTrim);
  if (cc) params.set("countrycodes", cc);

  const res = await fetch(`${NOMINATIM_SEARCH}?${params.toString()}`, {
    headers: {
      Accept: "application/json",
      "Accept-Language": "pl,en;q=0.9",
      "User-Agent": `EuroPlanner/1.0 (${contact})`,
    },
    cache: "no-store",
    signal: AbortSignal.timeout(12_000),
  });

  if (!res.ok) {
    const body = await res.text().catch(() => "");
    console.error("Nominatim HTTP", res.status, body);
    if (res.status === 403) {
      throw new Error(
        "OpenStreetMap Nominatim odrzucil zapytanie (HTTP 403). Sprawdz NOMINATIM_CONTACT_EMAIL albo limity uslugi."
      );
    }
    if (res.status === 429) {
      throw new Error(
        "Zbyt wiele zapytan do Nominatim (HTTP 429). Odczekaj chwile i sprobuj ponownie."
      );
    }
    throw new Error(`Geokoder Nominatim zwrocil blad HTTP ${res.status}.`);
  }

  const json = (await res.json()) as Array<{
    lat: string;
    lon: string;
    display_name?: string;
  }>;

  const first = json[0];
  if (!first) return null;

  const lat = Number(first.lat);
  const lon = Number(first.lon);
  if (!Number.isFinite(lat) || !Number.isFinite(lon)) return null;

  return {
    lat,
    lon,
    displayName: first.display_name ?? `${cityTrim}, ${countryTrim}`,
  };
}
