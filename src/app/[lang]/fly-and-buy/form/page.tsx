
import { getDictionary } from "@/dictionaries/get-dictionary";
import Navbar from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import FlyAndBuyForm from "@/components/fly-and-buy/FlyAndBuyForm";
import { fetchLocalSandboxPhase8 } from "@/lib/localSandbox";
import Link from "next/link";
import { Metadata } from "next";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: { params: Promise<{ lang: 'es' | 'en' | 'fr' }> }): Promise<Metadata> {
    const { lang } = await params;
    const dict = await getDictionary(lang);

    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://www.puntacanainvestmentsrd.com";
    const canonicalUrl = `${baseUrl}/${lang}/fly-and-buy/form`;

    return {
        title: dict.flyAndBuyForm.title,
        description: dict.flyAndBuyForm.subtitle,
        robots: {
            index: true,
            follow: true,
        },
        alternates: {
            canonical: canonicalUrl,
            languages: {
                es: `${baseUrl}/es/fly-and-buy/form`,
                en: `${baseUrl}/en/fly-and-buy/form`,
                fr: `${baseUrl}/fr/fly-and-buy/form`,
                "x-default": `${baseUrl}/en/fly-and-buy/form`,
            }
        },
        openGraph: {
            title: `${dict.flyAndBuyForm.title} | Punta Cana Investments`,
            description: dict.flyAndBuyForm.subtitle,
            url: canonicalUrl,
            images: [`${baseUrl}/images/fly-and-buy/premium.jpg`],
        }
    };
}

export default async function FlyAndBuyFormPage({ params }: { params: Promise<{ lang: 'es' | 'en' | 'fr' }> }) {
    const { lang } = await params;
    const dict = await getDictionary(lang);
    const phase8 = fetchLocalSandboxPhase8();
    const isFormOpen = phase8?.fly_and_buy?.show_form !== false;

    const closedCopy =
        lang === "en"
            ? {
                  badge: "Intake Temporarily Closed",
                  title: "Fly & Buy Submissions Are Currently Closed",
                  body: "We are not accepting new Fly & Buy form applications at this moment. You may review the official program details or reach our advisory team through our main contact page.",
                  backProgram: "Back to Fly & Buy",
                  contactCta: "Contact an Advisor",
              }
            : lang === "fr"
            ? {
                  badge: "Réception Temporairement Fermée",
                  title: "La réception Fly & Buy est actuellement fermée",
                  body: "La réception de nouvelles demandes pour le programme Fly & Buy est momentanément fermée. Vous pouvez consulter les modalités du programme ou écrire à notre équipe depuis la page de contact.",
                  backProgram: "Retour à Fly & Buy",
                  contactCta: "Contacter un Conseiller",
              }
            : {
                  badge: "Recepción Cerrada Temporalmente",
                  title: "La recepción de solicitudes Fly & Buy está cerrada",
                  body: "En este momento no estamos recibiendo nuevas solicitudes mediante el formulario Fly & Buy. Puedes consultar las modalidades del programa o escribir a nuestro equipo desde la página de contacto.",
                  backProgram: "Volver a Fly & Buy",
                  contactCta: "Ir a Contacto",
              };

    return (
        <main className="min-h-screen bg-primary-black text-white">
            <Navbar dict={dict.nav} lang={lang} servicesList={dict.sections.services.items} propertyTypes={dict.properties.types} variant="solid" />

            <div className="pt-32 pb-20 px-4 sm:px-6 lg:px-8">
                <div className="max-w-4xl mx-auto text-center mb-12">
                    <h1 className="text-4xl md:text-5xl font-serif font-bold text-luxury-gold mb-4">
                        {dict.flyAndBuyForm.title}
                    </h1>
                    <p className="text-xl text-gray-300 font-light">
                        {dict.flyAndBuyForm.subtitle}
                    </p>
                </div>

                {isFormOpen ? (
                    <FlyAndBuyForm dict={dict.flyAndBuyForm} lang={lang} />
                ) : (
                    <section
                        data-flybuy-form-closed="true"
                        role="status"
                        className="max-w-2xl mx-auto bg-zinc-900/90 border border-luxury-gold/50 p-10 md:p-12 rounded-sm text-center shadow-2xl space-y-6"
                    >
                        <span className="inline-block px-4 py-1.5 rounded-full bg-amber-500/15 border border-amber-400/50 text-amber-200 text-xs font-bold uppercase tracking-widest">
                            {closedCopy.badge}
                        </span>
                        <h2 className="text-2xl md:text-3xl font-serif font-bold text-white">
                            {closedCopy.title}
                        </h2>
                        <p className="text-gray-300 text-base leading-relaxed">
                            {closedCopy.body}
                        </p>
                        <div className="flex flex-wrap justify-center gap-4 pt-2">
                            <Link
                                href={`/${lang}/fly-and-buy`}
                                className="px-6 py-3 border border-luxury-gold text-luxury-gold hover:bg-luxury-gold hover:text-black transition-colors text-xs font-bold uppercase tracking-widest"
                            >
                                {closedCopy.backProgram}
                            </Link>
                            <Link
                                href={`/${lang}/contact`}
                                className="px-6 py-3 bg-luxury-gold text-black hover:bg-white transition-colors text-xs font-bold uppercase tracking-widest"
                            >
                                {closedCopy.contactCta}
                            </Link>
                        </div>
                    </section>
                )}
            </div>

            <Footer dict={dict} lang={lang} />
        </main>
    );
}
