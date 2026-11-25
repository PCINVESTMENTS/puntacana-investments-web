"use client";

import React from "react";
import { FaHeart, FaRegHeart } from "react-icons/fa";
import { useFavorites } from "./FavoritesContext";

interface FavoriteButtonProps {
  property: any;
  lang: string;
  variant?: "card" | "detail";
}

export default function FavoriteButton({ property, lang, variant = "card" }: FavoriteButtonProps) {
  const { isFavorite, toggleFavorite } = useFavorites();
  const slug =
    typeof property?.slug === "object" && property?.slug !== null
      ? String(property.slug.current || "")
      : String(property?.slug || property?.id || "");
  const active = isFavorite(slug);

  const labelAdd =
    lang === "en"
      ? "Save to favorites"
      : lang === "fr"
      ? "Ajouter aux favoris"
      : "Guardar en favoritas";
  const labelRemove =
    lang === "en"
      ? "Remove from favorites"
      : lang === "fr"
      ? "Retirer des favoris"
      : "Quitar de favoritas";

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();
    toggleFavorite(property);
  };

  if (variant === "detail") {
    return (
      <button
        type="button"
        onClick={handleClick}
        aria-pressed={active}
        aria-label={active ? labelRemove : labelAdd}
        data-favorite-detail-toggle={slug}
        data-favorite-active={active ? "true" : "false"}
        className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-full border text-xs font-bold uppercase tracking-wider transition-all cursor-pointer shadow-lg ${
          active
            ? "bg-rose-600 border-rose-400 text-white hover:bg-rose-700"
            : "bg-black/75 border-luxury-gold/60 text-white hover:border-luxury-gold hover:text-luxury-gold"
        }`}
      >
        {active ? (
          <FaHeart aria-hidden="true" className="text-sm text-white" />
        ) : (
          <FaRegHeart aria-hidden="true" className="text-sm text-luxury-gold" />
        )}
        <span>
          {active
            ? lang === "en"
              ? "Saved in Favorites"
              : lang === "fr"
              ? "Dans vos Favoris"
              : "Guardada en Favoritas"
            : lang === "en"
            ? "Save Favorite"
            : lang === "fr"
            ? "J'aime / Favori"
            : "Me gusta"}
        </span>
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      aria-pressed={active}
      aria-label={active ? labelRemove : labelAdd}
      title={active ? labelRemove : labelAdd}
      data-favorite-toggle={slug}
      data-favorite-active={active ? "true" : "false"}
      className={`absolute bottom-4 right-4 z-20 p-3.5 rounded-full transition-all duration-300 shadow-lg cursor-pointer ${
        active
          ? "bg-rose-600 text-white scale-110 ring-2 ring-white/50"
          : "bg-black/65 text-white hover:bg-rose-600 hover:text-white"
      }`}
    >
      {active ? (
        <FaHeart aria-hidden="true" className="text-base" />
      ) : (
        <FaRegHeart aria-hidden="true" className="text-base" />
      )}
    </button>
  );
}
