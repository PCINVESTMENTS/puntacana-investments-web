"use client";

import React, { createContext, useContext, useEffect, useState, useCallback, useMemo } from "react";

export interface FavoritePropertySnapshot {
  id: number | string;
  slug: string;
  title: string;
  titleEs?: string;
  titleEn?: string;
  titleFr?: string;
  price: number;
  currency?: string;
  status: string;
  locationLabel?: string;
  image?: string;
  beds?: number;
  baths?: number;
  area?: number;
  is_rental_active?: boolean;
  rental_price_night?: number | null;
  rental_monthly_active?: boolean;
  rental_nightly_active?: boolean;
  savedAt: string;
}

interface FavoritesContextType {
  favorites: FavoritePropertySnapshot[];
  count: number;
  hydrated: boolean;
  drawerOpen: boolean;
  setDrawerOpen: (open: boolean) => void;
  isFavorite: (slugOrId: string | number) => boolean;
  toggleFavorite: (property: any) => void;
  removeFavorite: (slugOrId: string | number) => void;
  clearFavorites: () => void;
}

const STORAGE_KEY = "pci_favorite_properties_v1";
const FavoritesContext = createContext<FavoritesContextType | undefined>(undefined);

function extractSlug(prop: any): string {
  if (!prop) return "";
  if (typeof prop === "string") return prop.trim().toLowerCase();
  const s = typeof prop.slug === "object" && prop.slug !== null ? prop.slug.current : prop.slug;
  return String(s || prop.id || "").trim().toLowerCase();
}

export function FavoritesProvider({
  children,
  availableSlugs = null,
}: {
  children: React.ReactNode;
  availableSlugs?: string[] | null;
}) {
  const [storedFavorites, setStoredFavorites] = useState<FavoritePropertySnapshot[]>([]);
  const [hydrated, setHydrated] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);

  const allowedSlugSet = useMemo(() => {
    if (!Array.isArray(availableSlugs)) return null;
    return new Set(
      availableSlugs
        .map((s) => String(s || "").trim().toLowerCase())
        .filter(Boolean)
    );
  }, [availableSlugs]);

  const visibleFavorites = useMemo(() => {
    if (!allowedSlugSet) return storedFavorites;
    return storedFavorites.filter((item) =>
      allowedSlugSet.has(String(item.slug || "").trim().toLowerCase())
    );
  }, [storedFavorites, allowedSlugSet]);

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed)) {
          setStoredFavorites(parsed.filter((item) => item && item.slug));
        }
      }
    } catch {
      // Ignore malformed storage
    } finally {
      setHydrated(true);
    }

    const onStorage = (e: StorageEvent) => {
      if (e.key !== STORAGE_KEY) return;
      try {
        const parsed = e.newValue ? JSON.parse(e.newValue) : [];
        if (Array.isArray(parsed)) {
          setStoredFavorites(parsed.filter((item) => item && item.slug));
        }
      } catch {
        // Ignore
      }
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  const persist = useCallback((next: FavoritePropertySnapshot[]) => {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    } catch {
      // Ignore storage quota errors
    }
  }, []);

  const isFavorite = useCallback(
    (slugOrId: string | number) => {
      const key = String(slugOrId || "").trim().toLowerCase();
      if (!key) return false;
      return visibleFavorites.some((f) => f.slug.toLowerCase() === key || String(f.id) === key);
    },
    [visibleFavorites]
  );

  const toggleFavorite = useCallback(
    (property: any) => {
      const slug = extractSlug(property);
      if (!slug) return;
      setStoredFavorites((prev) => {
        const exists = prev.some((f) => f.slug.toLowerCase() === slug || (property.id != null && String(f.id) === String(property.id)));
        let next: FavoritePropertySnapshot[];
        if (exists) {
          next = prev.filter((f) => f.slug.toLowerCase() !== slug && !(property.id != null && String(f.id) === String(property.id)));
        } else {
          const snap: FavoritePropertySnapshot = {
            id: property.id ?? slug,
            slug,
            title: String(property.title || property.titleEs || slug),
            titleEs: property.titleEs || property.title || "",
            titleEn: property.titleEn || "",
            titleFr: property.titleFr || "",
            price: Number(property.price || 0),
            currency: property.currency || "USD",
            status: property.status || "sale",
            locationLabel: property.locationLabel || "Punta Cana",
            image: property.image || (Array.isArray(property.gallery) ? property.gallery[0] : "") || "/images/og-home-luxury.webp",
            beds: property.beds,
            baths: property.baths,
            area: property.area,
            is_rental_active: Boolean(property.is_rental_active),
            rental_price_night: property.rental_price_night ?? null,
            rental_monthly_active: Boolean(property.rental_monthly_active),
            rental_nightly_active: Boolean(property.rental_nightly_active),
            savedAt: new Date().toISOString(),
          };
          next = [snap, ...prev];
        }
        persist(next);
        return next;
      });
    },
    [persist]
  );

  const removeFavorite = useCallback(
    (slugOrId: string | number) => {
      const key = String(slugOrId || "").trim().toLowerCase();
      setStoredFavorites((prev) => {
        const next = prev.filter((f) => f.slug.toLowerCase() !== key && String(f.id) !== key);
        persist(next);
        return next;
      });
    },
    [persist]
  );

  const clearFavorites = useCallback(() => {
    setStoredFavorites((prev) => {
      const next = allowedSlugSet
        ? prev.filter((f) => !allowedSlugSet.has(String(f.slug || "").trim().toLowerCase()))
        : [];
      persist(next);
      return next;
    });
  }, [persist, allowedSlugSet]);

  return (
    <FavoritesContext.Provider
      value={{
        favorites: visibleFavorites,
        count: visibleFavorites.length,
        hydrated,
        drawerOpen,
        setDrawerOpen,
        isFavorite,
        toggleFavorite,
        removeFavorite,
        clearFavorites,
      }}
    >
      {children}
    </FavoritesContext.Provider>
  );
}

export function useFavorites() {
  const ctx = useContext(FavoritesContext);
  if (!ctx) {
    throw new Error("useFavorites must be used within a FavoritesProvider");
  }
  return ctx;
}
