export type RoutePointDto = {
  destination_id: string;
  country: string;
  city: string;
  arrival_date: string;
  departure_date: string;
  lat: number | null;
  lng: number | null;
  visit_order: number | null;
};

export type RouteLegDto = {
  from_destination_id: string;
  to_destination_id: string;
  duration_seconds: number;
  distance_meters: number;
};

export type RoutePreviewDto = {
  geometry: [number, number][];
  total_duration_seconds: number;
  total_distance_meters: number;
  legs: RouteLegDto[];
};

export type RouteAlternativeDto = {
  id: string;
  preview: RoutePreviewDto;
};

export type RoutePreviewResponseDto = {
  preview: RoutePreviewDto | null;
  alternatives?: RouteAlternativeDto[];
};
