"use client";

import dynamic from "next/dynamic";
import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, MapPin, MoreVertical, Pencil, Plus, Trash2, X } from "lucide-react";
import { useTripUi } from "../TripContext";

import { compareRoutePointsForDisplay } from "@/lib/routePointSort";
import type {
  RouteAlternativeDto,
  RoutePointDto,
  RoutePreviewDto,
  RoutePreviewResponseDto,
} from "@/lib/routePointTypes";
import {
  addRoutePointAction,
  deleteRoutePointAction,
  updateRoutePointAction,
} from "./actions";

const RouteMap = dynamic(() => import("./RouteMap"), { ssr: false });

type RoutePointFormFields = {
  country: string;
  city: string;
  arrivalDate: string;
  arrivalTime: string;
  departureDate: string;
  departureTime: string;
};

function emptyRouteForm(): RoutePointFormFields {
  return {
    country: "",
    city: "",
    arrivalDate: "",
    arrivalTime: "",
    departureDate: "",
    departureTime: "",
  };
}

function splitDateTime(isoLocal: string) {
  if (!isoLocal) return { date: "", time: "" };
  return {
    date: isoLocal.slice(0, 10),
    time: isoLocal.slice(11, 16),
  };
}

function routePointToFormFields(point: RoutePointDto): RoutePointFormFields {
  const arrival = splitDateTime(point.arrival_date);
  const departure = splitDateTime(point.departure_date);

  return {
    country: point.country,
    city: point.city,
    arrivalDate: arrival.date,
    arrivalTime: arrival.time,
    departureDate: departure.date,
    departureTime: departure.time,
  };
}

function combineDateTime(date: string, time: string) {
  if (!date) return "";
  return `${date}T${time || "00:00"}`;
}

function formFieldsToApiPayload(form: RoutePointFormFields) {
  return {
    country: form.country.trim(),
    city: form.city.trim(),
    arrival_date: combineDateTime(form.arrivalDate, form.arrivalTime),
    departure_date: combineDateTime(form.departureDate, form.departureTime),
  };
}

function formatDisplayDate(isoLocal: string) {
  if (!isoLocal) return "Brak daty";
  const dt = new Date(isoLocal);
  if (Number.isNaN(dt.getTime())) return isoLocal;
  return new Intl.DateTimeFormat("pl-PL", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).format(dt);
}

function formatDriveTime(totalSeconds: number) {
  const minutes = Math.round(totalSeconds / 60);
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  if (hours <= 0) return `${mins} min`;
  if (mins === 0) return `${hours} godz.`;
  return `${hours} godz. ${mins} min`;
}

function formatDistance(distanceMeters: number) {
  if (distanceMeters < 1000) return `${distanceMeters} m`;
  return `${(distanceMeters / 1000).toFixed(1)} km`;
}

export default function RouteClient({
  initialPoints,
  tripId,
  tripCode,
}: {
  initialPoints: RoutePointDto[];
  tripId: string;
  tripCode: string;
}) {
  const router = useRouter();
  const { isArchived } = useTripUi();

  const [points, setPoints] = useState<RoutePointDto[]>(() =>
    [...(initialPoints || [])].sort(compareRoutePointsForDisplay)
  );
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [menuOpenId, setMenuOpenId] = useState<string | null>(null);
  const [editingPointId, setEditingPointId] = useState<string | null>(null);
  const [addFormData, setAddFormData] = useState<RoutePointFormFields>(emptyRouteForm());
  const [editFormData, setEditFormData] = useState<RoutePointFormFields>(emptyRouteForm());
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [routePreview, setRoutePreview] = useState<RoutePreviewDto | null>(null);
  const [routePreviewError, setRoutePreviewError] = useState<string | null>(null);
  const [isLoadingPreview, setIsLoadingPreview] = useState(false);
  const [alternatives, setAlternatives] = useState<RouteAlternativeDto[]>([]);
  const [selectedAlternativeId, setSelectedAlternativeId] = useState<string | null>(null);

  useEffect(() => {
    setPoints([...(initialPoints || [])].sort(compareRoutePointsForDisplay));
  }, [tripId, initialPoints]);

  const pointsForRouting = useMemo(
    () =>
      [...points]
        .sort(compareRoutePointsForDisplay)
        .filter(
          (point) =>
            point.lat != null &&
            point.lng != null &&
            Number.isFinite(point.lat) &&
            Number.isFinite(point.lng)
        ),
    [points]
  );

  useEffect(() => {
    let cancelled = false;

    const loadPreview = async () => {
      if (pointsForRouting.length < 2) {
        setRoutePreview(null);
        setAlternatives([]);
        setSelectedAlternativeId(null);
        setRoutePreviewError(null);
        return;
      }

      setIsLoadingPreview(true);
      setRoutePreviewError(null);

      try {
        const response = await fetch("/api/route-preview", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({ points: pointsForRouting }),
        });
        const payload = (await response.json()) as
          | ({ success: boolean; message?: string } & RoutePreviewResponseDto)
          | null;

        if (!response.ok || !payload?.success) {
          throw new Error(payload?.message || "Nie udalo sie pobrac podgladu trasy.");
        }

        if (cancelled) return;

        const fetchedAlternatives = payload.alternatives ?? [];
        setAlternatives(fetchedAlternatives);
        setSelectedAlternativeId(fetchedAlternatives[0]?.id ?? null);
        setRoutePreview(payload.preview ?? fetchedAlternatives[0]?.preview ?? null);
      } catch (previewError) {
        if (cancelled) return;
        setAlternatives([]);
        setSelectedAlternativeId(null);
        setRoutePreview(null);
        setRoutePreviewError(
          previewError instanceof Error
            ? previewError.message
            : "Nie udalo sie pobrac podgladu trasy."
        );
      } finally {
        if (!cancelled) setIsLoadingPreview(false);
      }
    };

    void loadPreview();
    return () => {
      cancelled = true;
    };
  }, [pointsForRouting]);

  const openEdit = (point: RoutePointDto) => {
    if (isArchived) return;
    setEditingPointId(point.destination_id);
    setEditFormData(routePointToFormFields(point));
    setMenuOpenId(null);
    setError(null);
  };

  const closeEdit = () => {
    setEditingPointId(null);
    setEditFormData(emptyRouteForm());
  };

  const closeAdd = () => {
    setIsAddOpen(false);
    setAddFormData(emptyRouteForm());
  };

  const handleAddSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (isArchived) {
      setError("Ta podróż jest zarchiwizowana — nie można dodawać punktów trasy.");
      return;
    }
    setIsSubmitting(true);
    setError(null);

    try {
      const created = await addRoutePointAction(tripCode, {
        trip_id: tripId,
        ...formFieldsToApiPayload(addFormData),
      });

      setPoints((current) => [...current, created].sort(compareRoutePointsForDisplay));
      closeAdd();
      router.refresh();
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : "Nie udalo sie dodac punktu.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEditSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!editingPointId) return;
    if (isArchived) {
      setError("Ta podróż jest zarchiwizowana — nie można edytować punktów trasy.");
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      const updated = await updateRoutePointAction(
        tripCode,
        editingPointId,
        formFieldsToApiPayload(editFormData)
      );

      setPoints((current) =>
        current.map((point) => (point.destination_id === editingPointId ? updated : point)).sort(compareRoutePointsForDisplay)
      );
      closeEdit();
      router.refresh();
    } catch (submitError) {
      setError(
        submitError instanceof Error ? submitError.message : "Nie udalo sie zaktualizowac punktu."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (destinationId: string) => {
    if (isArchived) {
      setError("Ta podróż jest zarchiwizowana — nie można usuwać punktów trasy.");
      return;
    }
    setIsSubmitting(true);
    setError(null);

    try {
      await deleteRoutePointAction(tripCode, destinationId);
      setPoints((current) => current.filter((point) => point.destination_id !== destinationId));
      router.refresh();
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : "Nie udalo sie usunac punktu.");
    } finally {
      setIsSubmitting(false);
      setMenuOpenId(null);
    }
  };

  const timelinePoints = useMemo(
    () => [...points].sort(compareRoutePointsForDisplay),
    [points]
  );

  const formatDateOnly = (isoLocal: string) => {
    if (!isoLocal || !isoLocal.includes("T")) return "--.--.----";
    const d = isoLocal.slice(0, 10);
    const [yyyy, mm, dd] = d.split("-");
    if (!yyyy || !mm || !dd) return d;
    return `${dd}.${mm}.${yyyy}`;
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 bg-[#ffffff] p-8 rounded-[40px] border border-[#5b616e]/10 shadow-sm">
        <div>
          <h2 className="text-3xl font-bold text-[#0a0b0d] tracking-tight mb-2">Plan trasy</h2>
          <p className="text-[#5b616e]">
            Zarządzaj harmonogramem i punktami na mapie.
          </p>
        </div>
        <button
          type="button"
          onClick={() => {
            setError(null);
            setIsAddOpen(true);
          }}
          disabled={isArchived}
          className="w-full md:w-auto px-8 py-4 bg-[#0a2351] hover:bg-[#578bfa] text-white font-bold rounded-[56px] transition-colors flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
        >
          <Plus size={20} />
          Dodaj punkt trasy
        </button>
      </div>

      {error && (
        <div className="rounded-[24px] border border-red-100 bg-red-50 px-5 py-4 text-red-700 font-medium">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          {routePreview && (
            <div className="bg-[#ffffff] rounded-[40px] border border-[#5b616e]/10 shadow-sm p-5 md:p-6">
              <div className="grid grid-cols-2 gap-3 md:gap-4 w-full">
                <div className="rounded-[24px] bg-[#f8f9fa] border border-[#eef0f3] px-4 py-3">
                  <div className="text-[11px] font-bold uppercase tracking-wide text-[#5b616e]">
                    Czas przejazdu
                  </div>
                  <div className="mt-1 text-lg font-bold text-[#0a0b0d]">
                    {formatDriveTime(routePreview.total_duration_seconds)}
                  </div>
                </div>
                <div className="rounded-[24px] bg-[#f8f9fa] border border-[#eef0f3] px-4 py-3">
                  <div className="text-[11px] font-bold uppercase tracking-wide text-[#5b616e]">
                    Dystans
                  </div>
                  <div className="mt-1 text-lg font-bold text-[#0a0b0d]">
                    {formatDistance(routePreview.total_distance_meters)}
                  </div>
                </div>
              </div>
              {routePreviewError && (
                <div className="mt-3 rounded-2xl border border-red-100 bg-red-50 px-4 py-3 text-xs font-medium text-red-700">
                  {routePreviewError}
                </div>
              )}
            </div>
          )}

          <div className="bg-[#ffffff] rounded-[40px] border border-[#5b616e]/10 shadow-sm p-6 md:p-10 relative">
            <div className="absolute left-[54px] md:left-[78px] top-10 bottom-10 w-1 bg-[#eef0f3] rounded-full z-0" />

            {points.length === 0 ? (
              <div className="rounded-[32px] border border-dashed border-[#5b616e]/20 bg-[#f8f9fa] px-6 py-12 text-center text-[#5b616e] relative z-10">
                Brak punktów trasy. Dodaj pierwszy punkt, aby zobaczyć harmonogram i mapę.
              </div>
            ) : (
              <div className="space-y-8 relative z-10">
                {timelinePoints.map((point) => (
                  <div key={point.destination_id} className="flex gap-4 md:gap-8 group">
                    <div className="flex flex-col items-center gap-2 shrink-0 w-16 md:w-20 pt-1">
                      <span className="text-sm font-bold text-[#0a0b0d]">
                        {formatDateOnly(point.arrival_date)}
                      </span>
                      <div className="w-12 h-12 rounded-full text-white flex items-center justify-center shadow-md bg-[#3E67BF] group-hover:scale-110 transition-transform duration-300">
                        <MapPin size={20} />
                      </div>
                    </div>

                    <div className="flex-1 bg-[#f8f9fa] border border-transparent group-hover:border-[#0a2351]/10 group-hover:bg-[#ffffff] group-hover:shadow-sm transition-all rounded-[32px] p-6">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <h3 className="text-xl font-bold text-[#0a0b0d] tracking-tight group-hover:text-[#3E67BF] transition-colors">
                            {point.city}, {point.country}
                          </h3>
                          <div className="mt-2 text-sm text-[#5b616e] font-medium">
                            {formatDisplayDate(point.arrival_date)} {" → "} {formatDisplayDate(point.departure_date)}
                          </div>
                        </div>

                        <div className="relative">
                          <button
                            type="button"
                            onClick={() =>
                              setMenuOpenId((current) =>
                                current === point.destination_id ? null : point.destination_id
                              )
                            }
                            disabled={isArchived}
                            className="text-[#5b616e] hover:text-[#0a0b0d] hover:bg-[#eef0f3] p-2 rounded-full transition-colors -mt-2 -mr-2"
                          >
                            <MoreVertical size={20} />
                          </button>

                          {menuOpenId === point.destination_id && (
                            <div className="absolute right-0 top-11 z-20 min-w-[190px] overflow-hidden rounded-2xl border border-[#eef0f3] bg-white shadow-xl">
                              <button
                                type="button"
                                onClick={() => openEdit(point)}
                                disabled={isArchived}
                                className="flex w-full items-center gap-3 px-4 py-3 text-left text-sm font-medium text-[#0a0b0d] transition-colors hover:bg-[#f8f9fa]"
                              >
                                <Pencil size={16} className="text-[#5b616e]" />
                                Edytuj
                              </button>
                              <button
                                type="button"
                                onClick={() => void handleDelete(point.destination_id)}
                                disabled={isArchived}
                                className="flex w-full items-center gap-3 border-t border-[#eef0f3] px-4 py-3 text-left text-sm font-medium text-red-600 transition-colors hover:bg-red-50"
                              >
                                <Trash2 size={16} />
                                Usuń
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="lg:col-span-1">
          <div className="bg-[#ffffff] rounded-[40px] border border-[#5b616e]/10 shadow-sm p-4 h-[400px] lg:h-[calc(100%-2rem)] flex flex-col overflow-hidden">
            <div className="flex items-center justify-between gap-3 px-4 py-2 mb-3">
              <div>
                <h3 className="font-bold text-[#0a0b0d]">Podgląd mapy</h3>
                <p className="text-xs text-[#5b616e] mt-1">
                  {pointsForRouting.length < 2
                    ? "Dodaj minimum 2 punkty z lokalizacją."
                    : "Kliknij trasę, aby zmienić linię na mapie."}
                </p>
              </div>
              {isLoadingPreview && <Loader2 className="animate-spin text-[#5b616e]" size={18} />}
            </div>

            {alternatives.length > 0 && (
              <div className="px-4 mb-3 flex gap-2 overflow-x-auto no-scrollbar">
                {alternatives.map((alternative, index) => (
                  <button
                    key={alternative.id}
                    type="button"
                    onClick={() => {
                      setSelectedAlternativeId(alternative.id);
                      setRoutePreview(alternative.preview);
                    }}
                    className={`shrink-0 px-4 py-2 rounded-[56px] text-sm font-bold transition-all border ${
                      selectedAlternativeId === alternative.id
                        ? "bg-[#0a2351] text-white border-[#0a2351]"
                        : "bg-[#f8f9fa] text-[#0a0b0d] border-[#eef0f3] hover:border-[#0a2351]/20"
                    }`}
                    title={`${formatDriveTime(alternative.preview.total_duration_seconds)} • ${formatDistance(
                      alternative.preview.total_distance_meters
                    )}`}
                  >
                    Trasa {index + 1}
                  </button>
                ))}
              </div>
            )}

            <div className="flex-1 overflow-hidden rounded-[32px]">
              <RouteMap points={points} routePreview={routePreview} />
            </div>

            {routePreview?.legs?.length ? (
              <div className="mt-4 px-4 pb-2">
                <div className="text-sm font-bold text-[#0a0b0d] mb-2">Odcinki</div>
                <div className="space-y-2">
                  {routePreview.legs.map((leg, index) => {
                    const from = pointsForRouting[index];
                    const to = pointsForRouting[index + 1];
                    const labelLeft = from ? `${from.city}, ${from.country}` : "Punkt";
                    const labelRight = to ? `${to.city}, ${to.country}` : "Punkt";
                    return (
                      <div
                        key={`${leg.from_destination_id}-${leg.to_destination_id}-${index}`}
                        className="rounded-[24px] border border-[#eef0f3] bg-[#f8f9fa] px-4 py-3"
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div className="min-w-0">
                            <div className="text-sm font-bold text-[#0a0b0d] truncate">
                              {labelLeft} {"->"} {labelRight}
                            </div>
                            <div className="mt-1 text-xs text-[#5b616e] font-medium">
                              {formatDriveTime(leg.duration_seconds)} • {formatDistance(leg.distance_meters)}
                            </div>
                          </div>
                          <div className="text-xs font-bold text-[#5b616e] shrink-0">
                            {index + 1}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ) : null}
          </div>
        </div>
      </div>

      {isAddOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
          <div className="w-full max-w-2xl rounded-[32px] bg-white p-6 shadow-2xl md:p-8">
            <div className="mb-6 flex items-center justify-between gap-4">
              <div>
                <h2 className="text-2xl font-bold text-[#0a0b0d]">Dodaj punkt trasy</h2>
                <p className="mt-1 text-sm text-[#5b616e]">
                  Podaj kraj, miasto i daty. Wspolrzedne pobierzemy z OpenStreetMap.
                </p>
              </div>
              <button
                type="button"
                onClick={closeAdd}
                className="rounded-full p-2 text-[#5b616e] transition-colors hover:bg-[#f8f9fa] hover:text-[#0a0b0d]"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleAddSubmit} className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <input
                required
                value={addFormData.country}
                onChange={(e) => setAddFormData({ ...addFormData, country: e.target.value })}
                placeholder="Kraj"
                className="rounded-2xl border border-[#dfe3ea] px-4 py-3 text-[#0a0b0d] outline-none transition-colors focus:border-[#0a2351]"
              />
              <input
                required
                value={addFormData.city}
                onChange={(e) => setAddFormData({ ...addFormData, city: e.target.value })}
                placeholder="Miasto"
                className="rounded-2xl border border-[#dfe3ea] px-4 py-3 text-[#0a0b0d] outline-none transition-colors focus:border-[#0a2351]"
              />
              <input
                type="date"
                required
                value={addFormData.arrivalDate}
                onChange={(e) => setAddFormData({ ...addFormData, arrivalDate: e.target.value })}
                className="rounded-2xl border border-[#dfe3ea] px-4 py-3 text-[#0a0b0d] outline-none transition-colors focus:border-[#0a2351]"
              />
              <input
                type="time"
                required
                value={addFormData.arrivalTime}
                onChange={(e) => setAddFormData({ ...addFormData, arrivalTime: e.target.value })}
                className="rounded-2xl border border-[#dfe3ea] px-4 py-3 text-[#0a0b0d] outline-none transition-colors focus:border-[#0a2351]"
              />
              <input
                type="date"
                required
                value={addFormData.departureDate}
                onChange={(e) => setAddFormData({ ...addFormData, departureDate: e.target.value })}
                className="rounded-2xl border border-[#dfe3ea] px-4 py-3 text-[#0a0b0d] outline-none transition-colors focus:border-[#0a2351]"
              />
              <input
                type="time"
                required
                value={addFormData.departureTime}
                onChange={(e) => setAddFormData({ ...addFormData, departureTime: e.target.value })}
                className="rounded-2xl border border-[#dfe3ea] px-4 py-3 text-[#0a0b0d] outline-none transition-colors focus:border-[#0a2351]"
              />

              <div className="mt-2 flex items-center justify-end gap-3 md:col-span-2">
                <button
                  type="button"
                  onClick={closeAdd}
                  className="rounded-[56px] border border-[#dfe3ea] px-6 py-3 font-semibold text-[#0a0b0d] transition-colors hover:bg-[#f8f9fa]"
                >
                  Anuluj
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="inline-flex items-center gap-2 rounded-[56px] bg-[#0a2351] px-6 py-3 font-semibold text-white transition-colors hover:bg-[#578bfa] disabled:opacity-60"
                >
                  {isSubmitting && <Loader2 className="animate-spin" size={16} />}
                  Zapisz punkt
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {editingPointId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
          <div className="w-full max-w-2xl rounded-[32px] bg-white p-6 shadow-2xl md:p-8">
            <div className="mb-6 flex items-center justify-between gap-4">
              <div>
                <h2 className="text-2xl font-bold text-[#0a0b0d]">Edytuj punkt</h2>
                <p className="mt-1 text-sm text-[#5b616e]">
                  Zmiana miasta lub kraju od razu przeliczy wspolrzedne.
                </p>
              </div>
              <button
                type="button"
                onClick={closeEdit}
                className="rounded-full p-2 text-[#5b616e] transition-colors hover:bg-[#f8f9fa] hover:text-[#0a0b0d]"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleEditSubmit} className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <input
                required
                value={editFormData.country}
                onChange={(e) => setEditFormData({ ...editFormData, country: e.target.value })}
                placeholder="Kraj"
                className="rounded-2xl border border-[#dfe3ea] px-4 py-3 text-[#0a0b0d] outline-none transition-colors focus:border-[#0a2351]"
              />
              <input
                required
                value={editFormData.city}
                onChange={(e) => setEditFormData({ ...editFormData, city: e.target.value })}
                placeholder="Miasto"
                className="rounded-2xl border border-[#dfe3ea] px-4 py-3 text-[#0a0b0d] outline-none transition-colors focus:border-[#0a2351]"
              />
              <input
                type="date"
                required
                value={editFormData.arrivalDate}
                onChange={(e) => setEditFormData({ ...editFormData, arrivalDate: e.target.value })}
                className="rounded-2xl border border-[#dfe3ea] px-4 py-3 text-[#0a0b0d] outline-none transition-colors focus:border-[#0a2351]"
              />
              <input
                type="time"
                required
                value={editFormData.arrivalTime}
                onChange={(e) => setEditFormData({ ...editFormData, arrivalTime: e.target.value })}
                className="rounded-2xl border border-[#dfe3ea] px-4 py-3 text-[#0a0b0d] outline-none transition-colors focus:border-[#0a2351]"
              />
              <input
                type="date"
                required
                value={editFormData.departureDate}
                onChange={(e) =>
                  setEditFormData({ ...editFormData, departureDate: e.target.value })
                }
                className="rounded-2xl border border-[#dfe3ea] px-4 py-3 text-[#0a0b0d] outline-none transition-colors focus:border-[#0a2351]"
              />
              <input
                type="time"
                required
                value={editFormData.departureTime}
                onChange={(e) =>
                  setEditFormData({ ...editFormData, departureTime: e.target.value })
                }
                className="rounded-2xl border border-[#dfe3ea] px-4 py-3 text-[#0a0b0d] outline-none transition-colors focus:border-[#0a2351]"
              />

              <div className="mt-2 flex items-center justify-end gap-3 md:col-span-2">
                <button
                  type="button"
                  onClick={closeEdit}
                  className="rounded-[56px] border border-[#dfe3ea] px-6 py-3 font-semibold text-[#0a0b0d] transition-colors hover:bg-[#f8f9fa]"
                >
                  Anuluj
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="inline-flex items-center gap-2 rounded-[56px] bg-[#0a2351] px-6 py-3 font-semibold text-white transition-colors hover:bg-[#578bfa] disabled:opacity-60"
                >
                  {isSubmitting && <Loader2 className="animate-spin" size={16} />}
                  Zapisz zmiany
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
