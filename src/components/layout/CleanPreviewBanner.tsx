"use client";

import { usePathname } from "next/navigation";

export default function CleanPreviewBanner({
  lang,
  includeCabezaDeToro,
}: {
  lang: string;
  includeCabezaDeToro: boolean;
}) {
  const pathname = usePathname() || `/${lang}`;
  const l = lang === "en" || lang === "fr" ? lang : "es";
  const nextEncoded = encodeURIComponent(pathname);

  const toggleCdtHref = `/preview-clean/${l}?cabezadetoro=${
    includeCabezaDeToro ? "exclude" : "include"
  }&next=${nextEncoded}`;
  const exitHref = `/preview-clean/exit?next=${nextEncoded}`;

  const cdtText = includeCabezaDeToro
    ? "Cabeza de Toro: incluida temporalmente (pendiente de decisión)"
    : "Cabeza de Toro: excluida (pendiente de decisión de Ulises)";

  return (
    <aside
      data-clean-preview-banner="true"
      data-clean-cabezadetoro={includeCabezaDeToro ? "included" : "excluded"}
      className="fixed bottom-3 inset-x-3 md:inset-x-auto md:left-1/2 md:-translate-x-1/2 z-[95] max-w-5xl rounded-xl border border-emerald-400/60 bg-zinc-950/95 backdrop-blur-md shadow-[0_10px_35px_rgba(0,0,0,0.75)] px-3.5 py-2.5 text-[11px] text-gray-200"
    >
      <div className="flex flex-wrap items-center justify-between gap-2.5">
        <div className="flex flex-wrap items-center gap-2 min-w-0">
          <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded bg-emerald-500/20 border border-emerald-400/50 text-emerald-300 font-bold uppercase tracking-wider text-[10px]">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            Vista Previa Limpia · Pre-Publicación
          </span>
          <span className="text-gray-300">
            <strong className="text-white">39 propiedades base</strong> ·{" "}
            <strong className="text-white">4 artículos publicados</strong> · Excluye #40/#41, borrador #5, partner/asesora/medios demo
          </span>
          <span className="px-2 py-0.5 rounded bg-amber-500/15 border border-amber-400/40 text-amber-200 font-medium">
            {cdtText}
          </span>
        </div>
        <div className="flex flex-wrap items-center gap-1.5 shrink-0">
          <a
            href={toggleCdtHref}
            data-clean-toggle-cdt="true"
            className="px-2.5 py-1 rounded border border-amber-400/50 bg-amber-500/10 text-amber-200 hover:bg-amber-500/25 font-semibold transition-colors"
          >
            {includeCabezaDeToro ? "Excluir Cabeza de Toro" : "Probar con Cabeza de Toro"}
          </a>
          <a
            href={exitHref}
            data-clean-exit-btn="true"
            className="px-2.5 py-1 rounded border border-white/25 bg-white/10 text-white hover:bg-white hover:text-black font-semibold transition-colors"
          >
            Salir a Sandbox Completo
          </a>
        </div>
      </div>
    </aside>
  );
}
