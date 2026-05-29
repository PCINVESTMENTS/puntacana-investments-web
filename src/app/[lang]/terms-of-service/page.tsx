import { getDictionary } from '@/dictionaries/get-dictionary';
import Navbar from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { properties } from '@/data/properties';
import { investmentModels } from '@/data/investment-models';

export default async function TermsPage({ params }: { params: Promise<{ lang: 'es' | 'en' | 'fr' }> }) {
    const { lang } = await params;
    const dict = await getDictionary(lang);

    return (
        <main className="bg-neutral-900 min-h-screen">
            <Navbar
                lang={lang}
                dict={dict.nav}
                servicesList={investmentModels.map(m => ({ title: (m.title as any)[lang] || m.title['en'] || m.title['es'], slug: m.slug }))}
                propertyTypes={dict.properties.types}
            />

            <div className="pt-32 pb-24 max-w-4xl mx-auto px-6 text-gray-300">
                <h1 className="text-4xl md:text-5xl font-serif text-white mb-8">
                    {lang === 'en' ? 'Terms of Service' : lang === 'fr' ? "Conditions d'Utilisation" : 'Términos de Servicio'}
                </h1>

                <div className="space-y-6 text-lg leading-relaxed">
                    <p>
                        {lang === 'en'
                            ? 'Welcome to Punta Cana Investments. By accessing our website, you agree to comply with and be bound by the following terms and conditions of use.'
                            : lang === 'fr'
                            ? 'Bienvenue sur Punta Cana Investments. En accédant à notre site Web, vous acceptez de respecter et d\'être lié par les conditions d\'utilisation suivantes.'
                            : 'Bienvenido a Punta Cana Investments. Al acceder a nuestro sitio web, usted acepta cumplir y estar sujeto a los siguientes términos y condiciones de uso.'}
                    </p>

                    <h2 className="text-2xl text-luxury-gold mt-8 mb-4 font-serif">
                        {lang === 'en' ? '1. Use of Website' : lang === 'fr' ? '1. Utilisation du Site Web' : '1. Uso del Sitio Web'}
                    </h2>
                    <p>
                        {lang === 'en'
                            ? 'The content of the pages of this website is for your general information and use only. It is subject to change without notice.'
                            : lang === 'fr'
                            ? 'Le contenu des pages de ce site Web est destiné à votre information générale et à votre utilisation uniquement. Il est sujet à modification sans préavis.'
                            : 'El contenido de las páginas de este sitio web es solo para su información y uso general. Está sujeto a cambios sin previo aviso.'}
                    </p>

                    <h2 className="text-2xl text-luxury-gold mt-8 mb-4 font-serif">
                        {lang === 'en' ? '2. Disclaimer' : lang === 'fr' ? '2. Clause de Non-responsabilité' : '2. Descargo de Responsabilidad'}
                    </h2>
                    <p>
                        {lang === 'en'
                            ? 'While we strive to provide accurate information, we make no representations or warranties of any kind, express or implied, about the completeness, accuracy, reliability, suitability, or availability with respect to the website or the information, products, services, or related graphics contained on the website.'
                            : lang === 'fr'
                            ? 'Bien que nous nous efforcions de fournir des informations précises, nous ne faisons aucune déclaration ou garantie de quelque nature que ce soit, expresse ou implicite, concernant l\'exhaustivité, l\'exactitude, la fiabilité, l\'adéquation ou la disponibilité du site Web ou des informations, produits, services ou graphiques associés contenus sur le site Web.'
                            : 'Si bien nos esforzamos por proporcionar información precisa, no hacemos declaraciones ni garantías de ningún tipo, expresas o implícitas, sobre la integridad, precisión, confiabilidad, idoneidad o disponibilidad con respecto al sitio web o la información, productos, servicios o gráficos relacionados contenidos en el sitio web.'}
                    </p>

                    <h2 className="text-2xl text-luxury-gold mt-8 mb-4 font-serif">
                        {lang === 'en' ? '3. Intellectual Property' : lang === 'fr' ? '3. Propriété Intellectuelle' : '3. Propiedad Intelectual'}
                    </h2>
                    <p>
                        {lang === 'en'
                            ? 'This website contains material which is owned by or licensed to us. This material includes, but is not limited to, the design, layout, look, appearance, and graphics. Reproduction is prohibited other than in accordance with the copyright notice.'
                            : lang === 'fr'
                            ? 'Ce site Web contient des éléments qui nous appartiennent ou pour lesquels nous détenons une licence. Ces éléments incluent, mais ne se limitent pas à, la conception, la mise en page, l\'aspect, l\'apparence et les graphiques. Toute reproduction est interdite sauf conformément à l\'avis de droit d\'auteur.'
                            : 'Este sitio web contiene material que es propiedad nuestra o de nuestros licenciantes. Este material incluye, pero no se limita a, el diseño, la disposición, la apariencia y los gráficos. Queda prohibida la reproducción salvo de conformidad con el aviso de derechos de autor.'}
                    </p>

                    <h2 className="text-2xl text-luxury-gold mt-8 mb-4 font-serif">
                        {lang === 'en' ? '4. Governing Law' : lang === 'fr' ? '4. Loi Applicable' : '4. Ley Aplicable'}
                    </h2>
                    <p>
                        {lang === 'en'
                            ? 'Your use of this website and any dispute arising out of such use of the website is subject to the laws of the Dominican Republic.'
                            : lang === 'fr'
                            ? 'Votre utilisation de ce site Web et tout litige découlant de cette utilisation sont soumis aux lois de la République Dominicaine.'
                            : 'Su uso de este sitio web y cualquier disputa que surja de dicho uso del sitio web está sujeto a las leyes de la República Dominicana.'}
                    </p>
                </div>
            </div>

            <Footer dict={dict} lang={lang} />
        </main>
    );
}
