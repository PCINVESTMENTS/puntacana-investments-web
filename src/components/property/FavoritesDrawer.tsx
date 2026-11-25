"use client";

import React, { useEffect } from "react";
import Link from "next/link";
import { FaHeart, FaTimes, FaMapMarkerAlt, FaArrowRight } from "react-icons/fa";
import { useFavorites } from "./FavoritesContext";
import { getRentalPricingSummary } from "@/lib/propertyPricing";

export default function FavoritesDrawer({ lang }: { lang: string }) {
  const { favorites, count, drawerOpen, setDrawerOpen, removeFavorite } = useFavorites();

  useEffect(() => {
    if (!drawerOpen) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setDrawerOpen(false);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [drawerOpen, setDrawerOpen]);

  if (!drawerOpen) return null;

  const isEn = lang === "en";
  const isFr = lang === "fr";

  const getTitle = (item: any) => {
    if (isEn) return item.titleEn || item.title;
    if (isFr) return item.titleFr || item.title;
    return item.titleEs || item.title;
  };

  return (
    <div
      className="fixed inset-0 z-[90] flex justify-end bg-black/75 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-label={isEn ? "Saved Favorite Properties" : isFr ? "Propriétés Favorites" : "Propiedades Favoritas"}
      data-favorites-drawer="true"
      onClick={() => setDrawerOpen(false)}
    >
      <div
        className="w-full max-w-md bg-zinc-950 border-l border-luxury-gold/35 h-full flex flex-col shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="px-6 py-5 border-b border-white/10 flex items-center justify-between bg-black">
          <div className="flex items-center gap-2.5">
            <FaHeart aria-hidden="true" className="text-rose-500 text-lg" />
            <div>
              <h2 className="text-base font-serif font-bold text-white uppercase tracking-wider">
                {isEn ? "My Favorites" : isFr ? "Mes Favoris" : "Mis Favoritas"} ({count})
              </h2>
              <p className="text-[11px] text-gray-400">
                {isEn
                  ? "Saved in this browser across languages"
                  : isFr
                  ? "Enregistrées dans ce navigateur dans toutes les langues"
                  : "Guardadas en este navegador en todos los idiomas"}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setDrawerOpen(false)}
            aria-label={isEn ? "Close favorites" : isFr ? "Fermer les favoris" : "Cerrar favoritas"}
            data-favorites-close="true"
            className="p-2 rounded-full text-gray-400 hover:text-white hover:bg-white/10 cursor-pointer"
          >
            <FaTimes aria-hidden="true" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-5 space-y-3">
          {favorites.length === 0 ? (
            <div className="text-center py-16 space-y-3" data-favorites-empty="true">
              <FaHeart aria-hidden="true" className="text-4xl text-white/15 mx-auto" />
              <p className="text-sm text-gray-300 font-medium">
                {isEn
                  ? "You haven't saved any favorite properties yet."
                  : isFr
                  ? "Vous n'avez encore enregistré aucune propriété favorite."
                  : "Todavía no has guardado propiedades favoritas."}
              </p>
              <p className="text-xs text-gray-500 max-w-xs mx-auto">
                {isEn
                  ? "Tap the heart on any property card or detail page to keep it here."
                  : isFr
                  ? "Cliquez sur le cœur sur n'importe quelle propriété pour la retrouver ici."
                  : "Pulsa el corazón en cualquier propiedad del catálogo o su ficha para guardarla aquí."}
              </p>
              <Link
                href={`/${lang}/properties`}
                onClick={() => setDrawerOpen(false)}
                className="inline-flex items-center gap-2 mt-2 px-5 py-2.5 bg-luxury-gold text-black font-bold text-xs uppercase tracking-wider hover:bg-white transition-colors"
              >
                {isEn ? "Browse Catalog" : isFr ? "Voir le Catalogue" : "Explorar Catálogo"} <FaArrowRight aria-hidden="true" />
              </Link>
            </div>
          ) : (
            favorites.map((item) => {
              const pricing = getRentalPricingSummary(item as any, lang);
              return (
                <div
                  key={item.slug}
                  data-favorite-drawer-item={item.slug}
                  className="rounded-lg bg-zinc-900 border border-white/10 hover:border-luxury-gold/40 overflow-hidden flex gap-3 p-3 transition-colors"
                >
                  <Link
                    href={`/${lang}/properties/${item.slug}`}
                    onClick={() => setDrawerOpen(false)}
                    className="w-24 h-20 rounded overflow-hidden shrink-0 bg-black block"
                  >
                    <img
                      src={item.image || "/images/og-home-luxury.webp"}
                      alt={getTitle(item)}
                      className="w-full h-full object-cover"
                    />
                  </Link>
                  <div className="flex-1 min-w-0 flex flex-col justify-between">
                    <div className="flex items-start justify-between gap-2">
                      <Link
                        href={`/${lang}/properties/${item.slug}`}
                        onClick={() => setDrawerOpen(false)}
                        className="text-sm font-serif font-bold text-white hover:text-luxury-gold line-clamp-2 leading-snug"
                      >
                        {getTitle(item)}
                      </Link>
                      <button
                        type="button"
                        onClick={() => removeFavorite(item.slug)}
                        aria-pressed={true}
                        aria-label={isEn ? "Remove from favorites" : isFr ? "Retirer des favoris" : "Quitar de favoritas"}
                        data-favorite-drawer-remove={item.slug}
                        className="p-1.5 rounded-full bg-rose-600/20 text-rose-400 hover:bg-rose-600 hover:text-white transition-colors shrink-0 cursor-pointer"
                        title={isEn ? "Remove from favorites" : isFr ? "Retirer des favoris" : "Quitar de favoritas"}
                      >
                        <FaHeart aria-hidden="true" className="text-xs" />
                      </button>
                    </div>
                    <div className="flex items-center justify-between gap-2 text-xs mt-1">
                      <span className="text-gray-400 truncate inline-flex items-center gap-1">
                        <FaMapMarkerAlt aria-hidden="true" className="text-luxury-gold text-[10px]" />
                        {item.locationLabel || "Punta Cana"}
                      </span>
                      <span className="text-luxury-gold font-bold shrink-0">
                        {pricing.isRent ? pricing.cardPricePrimary : pricing.salePriceLabel}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        <div className="p-4 border-t border-white/10 bg-black">
          <Link
            href={`/${lang}/properties`}
            onClick={() => setDrawerOpen(false)}
            className="w-full inline-flex items-center justify-center gap-2 py-3 bg-luxury-gold text-black font-bold text-xs uppercase tracking-widest hover:bg-white transition-colors"
          >
            {isEn ? "View Full Catalog" : isFr ? "Voir Tout le Catalogue" : "Ver Catálogo Completo"}
          </Link>
        </div>
      </div>
    </div>
  );
}
