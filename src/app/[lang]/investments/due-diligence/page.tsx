import { getDictionary } from "@/dictionaries/get-dictionary";
import Navbar from "@/components/layout/Navbar";
import DueDiligenceContent from "./DueDiligenceContent";
import { Metadata } from 'next';

export async function generateMetadata({ params }: { params: Promise<{ lang: 'es' | 'en' | 'fr' }> }): Promise<Metadata> {
    const { lang } = await params;
    return {
        title: lang === 'es' 
            ? "Debida Diligencia | Punta Cana Investments" 
            : lang === 'fr' 
            ? "Diligence Raisonnable | Punta Cana Investments" 
            : "Due Diligence | Punta Cana Investments",
        description: lang === 'es'
            ? "Complete los formularios de debida diligencia para Personas Físicas y Jurídicas."
            : lang === 'fr'
            ? "Remplissez les formulaires de diligence raisonnable pour les personnes physiques et morales."
            : "Complete due diligence forms for Individuals and Legal Entities.",
    }
}

export default async function DueDiligencePage({ params }: { params: Promise<{ lang: 'es' | 'en' | 'fr' }> }) {
    const { lang } = await params;
    const dict = await getDictionary(lang);

    return (
        <main className="min-h-screen bg-black">
            <Navbar
                dict={dict.nav}
                lang={lang}
                servicesList={dict.sections.services.items}
                propertyTypes={dict.properties.types}
                variant="solid"
            />
            <DueDiligenceContent />
        </main>
    );
}
