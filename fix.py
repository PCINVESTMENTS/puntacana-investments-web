with open("src/components/investments/OffMarketForm.tsx", "r") as f:
    c = f.read()
c = c.replace(
    'export default function OffMarketForm({ lang }: { lang: string }) {',
    'import { offMarketDict } from "@/dictionaries/offMarket";\n\nexport default function OffMarketForm({ lang }: { lang: string }) {\n    const t = offMarketDict[lang as "es" | "en" | "fr"].form;'
)
with open("src/components/investments/OffMarketForm.tsx", "w") as f:
    f.write(c)
