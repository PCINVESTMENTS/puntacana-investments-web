"use client";

import dynamic from "next/dynamic";

const PropertyComparator = dynamic(() => import("./PropertyComparator"), { ssr: false });

export default function PropertyComparatorWrapper({ lang }: { lang: string }) {
  return <PropertyComparator lang={lang} />;
}
