import React, { createContext, useContext } from "react";

type TripUiContextValue = {
  tripCode: string;
  status: string;
  isArchived: boolean;
};

const TripUiContext = createContext<TripUiContextValue | null>(null);

export function TripUiProvider({
  value,
  children,
}: {
  value: TripUiContextValue;
  children: React.ReactNode;
}) {
  return <TripUiContext.Provider value={value}>{children}</TripUiContext.Provider>;
}

export function useTripUi() {
  const ctx = useContext(TripUiContext);
  if (!ctx) {
    throw new Error("useTripUi must be used inside TripUiProvider");
  }
  return ctx;
}

