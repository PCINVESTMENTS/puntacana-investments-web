
import { getDictionary } from "@/dictionaries/get-dictionary";
import Navbar from "@/components/layout/Navbar";
import { Footer } from "@/components/home/PageSections";
import FlyAndBuyForm from "@/components/fly-and-buy/FlyAndBuyForm";

export default async function FlyAndBuyFormPage({ params }: { params: Promise<{ lang: 'es' | 'en' }> }) {
    const { lang } = await params;
    const dict = await getDictionary(lang);

    return (
        <main className="min-h-screen bg-primary-black text-white">
            <Navbar dict={dict.nav} lang={lang} servicesList={dict.sections.services.items} propertyTypes={dict.properties.types} variant="solid" />

            <div className="pt-32 pb-20 px-4 sm:px-6 lg:px-8">
                <div className="max-w-4xl mx-auto text-center mb-16">
                    <h1 className="text-4xl md:text-5xl font-serif font-bold text-luxury-gold mb-4">
                        {dict.flyAndBuyForm.title}
                    </h1>
                    <p className="text-xl text-gray-300 font-light">
                        {dict.flyAndBuyForm.subtitle}
                    </p>
                </div>

                <FlyAndBuyForm dict={dict.flyAndBuyForm} lang={lang} />
            </div>

            <Footer dict={dict} lang={lang} />
        </main>
    );
}
