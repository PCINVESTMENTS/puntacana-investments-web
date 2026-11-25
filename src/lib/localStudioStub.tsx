'use client';

import React from 'react';

export const metadata = {
  title: 'Local Sandbox — Punta Cana Investments',
};

export const viewport = {
  width: 'device-width',
  initialScale: 1,
};

export function NextStudio() {
  return (
    <div style={{ padding: 32, background: '#000', color: '#E4CA7C', minHeight: '100vh', fontFamily: 'sans-serif' }}>
      <h1>Sanity Studio deshabilitado en modo Sandbox Local</h1>
      <p style={{ color: '#ccc' }}>Utilice el Dashboard Local en http://127.0.0.1:3110 para gestionar propiedades, blog e inversiones.</p>
    </div>
  );
}

export const defineConfig = (cfg: any) => cfg;
export const defineType = (cfg: any) => cfg;
export const defineField = (cfg: any) => cfg;
export const structureTool = () => ({});
export const visionTool = () => ({});
