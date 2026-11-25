"use client";

import React, { createContext, useContext } from "react";

const SiteConfigContext = createContext<Record<string, any> | null>(null);

export function SiteConfigProvider({
  config,
  children,
}: {
  config: Record<string, any> | null;
  children: React.ReactNode;
}) {
  return <SiteConfigContext.Provider value={config}>{children}</SiteConfigContext.Provider>;
}

export function useSiteConfig() {
  return useContext(SiteConfigContext);
}
