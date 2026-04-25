"use client";

import { useCallback, useEffect, useState } from "react";
import { DEFAULT_AVATAR_ID, getAvatarById, type Avatar } from "@/lib/avatars";

const STORAGE_KEY = "europlanner-avatar";
const CHANGE_EVENT = "europlanner:avatar-changed";
const CACHE_TTL_MS = 60_000;

function readLocalStorage(): string | null {
  if (typeof window === "undefined") return null;
  try {
    return window.localStorage.getItem(STORAGE_KEY);
  } catch {
    return null;
  }
}

function writeLocalStorage(value: string): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(STORAGE_KEY, value);
  } catch {
  }
}

let inFlightRequest: Promise<string | null> | null = null;
let cachedServerAvatarId: string | null = null;
let cacheExpiresAt = 0;

function fetchServerAvatarId(): Promise<string | null> {
  if (typeof window === "undefined") return Promise.resolve(null);

  const now = Date.now();
  if (cachedServerAvatarId !== null && now < cacheExpiresAt) {
    return Promise.resolve(cachedServerAvatarId);
  }
  if (inFlightRequest) {
    return inFlightRequest;
  }

  inFlightRequest = fetch("/api/auth/me", { credentials: "include" })
    .then((response) => (response.ok ? response.json() : null))
    .then((payload) => {
      const id = payload?.user?.avatar_id;
      if (typeof id === "string" && id.length > 0) {
        cachedServerAvatarId = id;
        cacheExpiresAt = Date.now() + CACHE_TTL_MS;
        return id;
      }
      return null;
    })
    .catch(() => null)
    .finally(() => {
      inFlightRequest = null;
    });

  return inFlightRequest;
}

export function invalidateAvatarCache(newId: string): void {
  cachedServerAvatarId = newId;
  cacheExpiresAt = Date.now() + CACHE_TTL_MS;
}

export function useAvatar(initialId?: string | null): { avatar: Avatar; setAvatarId: (id: string) => void } {
  const seedId = initialId && initialId.length > 0 ? initialId : DEFAULT_AVATAR_ID;
  const [avatarId, setAvatarIdState] = useState<string>(seedId);

  if (initialId && cachedServerAvatarId === null) {
    cachedServerAvatarId = initialId;
    cacheExpiresAt = Date.now() + CACHE_TTL_MS;
  }

  useEffect(() => {
    if (!initialId) {
      const cachedId = readLocalStorage();
      if (cachedId) setAvatarIdState(cachedId);
    } else {
      writeLocalStorage(initialId);
    }

    let cancelled = false;

    fetchServerAvatarId().then((serverId) => {
      if (cancelled) return;
      if (serverId) {
        setAvatarIdState(serverId);
        writeLocalStorage(serverId);
      }
    });

    const onAvatarChanged = (event: Event) => {
      const detail = (event as CustomEvent<string>).detail;
      if (typeof detail === "string" && detail.length > 0) {
        setAvatarIdState(detail);
      }
    };
    window.addEventListener(CHANGE_EVENT, onAvatarChanged);

    return () => {
      cancelled = true;
      window.removeEventListener(CHANGE_EVENT, onAvatarChanged);
    };
  }, [initialId]);

  const setAvatarId = useCallback((id: string) => {
    setAvatarIdState(id);
    writeLocalStorage(id);
    invalidateAvatarCache(id);

    if (typeof window !== "undefined") {
      window.dispatchEvent(new CustomEvent(CHANGE_EVENT, { detail: id }));
    }

    void fetch("/api/auth/avatar", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ avatar_id: id }),
    }).catch(() => {
    });
  }, []);

  return {
    avatar: getAvatarById(avatarId),
    setAvatarId,
  };
}
