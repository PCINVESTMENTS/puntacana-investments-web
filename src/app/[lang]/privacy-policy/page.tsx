import { getDictionary } from '@/dictionaries/get-dictionary';
import Navbar from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { properties } from '@/data/properties';
import { investmentModels } from '@/data/investment-models';

export default async function PrivacyPolicyPage({ params }: { params: Promise<{ lang: 'es' | 'en' | 'fr' }> }) {
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
                    {lang === 'en' ? 'Privacy Policy' : lang === 'fr' ? 'Politique de Confidentialité' : 'Política de Privacidad'}
                </h1>

                <div className="space-y-6 text-lg leading-relaxed">
                    <p>
                        {lang === 'en'
                            ? 'At Punta Cana Investments, we value your privacy and are committed to protecting your personal information. This Privacy Policy outlines how we collect, use, and safeguard your data.'
                            : lang === 'fr'
                            ? 'Chez Punta Cana Investments, nous apprécions votre vie privée et nous nous engageons à protéger vos informations personnelles. Cette politique de confidentialité décrit comment nous collectons, utilisons et protégeons vos données.'
                            : 'En Punta Cana Investments, valoramos su privacidad y nos comprometemos a proteger su información personal. Esta Política de Privacidad describe cómo recopilamos, utilizamos y salvaguardamos sus datos.'}
                    </p>

                    <h2 className="text-2xl text-luxury-gold mt-8 mb-4 font-serif">
                        {lang === 'en' ? '1. Information We Collect' : lang === 'fr' ? '1. Informations que Nous Collectons' : '1. Información que Recopilamos'}
                    </h2>
                    <p>
                        {lang === 'en'
                            ? 'We may collect personal information such as your name, email address, phone number, and investment preferences when you fill out forms on our website or contact us directly.'
                            : lang === 'fr'
                            ? 'Nous pouvons collecter des informations personnelles telles que votre nom, votre adresse e-mail, votre numéro de téléphone et vos préférences d\'investissement lorsque vous remplissez des formulaires sur notre site Web ou que vous nous contactez directement.'
                            : 'Podemos recopilar información personal como su nombre, dirección de correo electrónico, número de teléfono y preferencias de inversión cuando completa formularios en nuestro sitio web o se comunica con nosotros directamente.'}
                    </p>

                    <h2 className="text-2xl text-luxury-gold mt-8 mb-4 font-serif">
                        {lang === 'en' ? '2. How We Use Your Information' : lang === 'fr' ? '2. Comment Nous Utilisons vos Informations' : '2. Cómo Utilizamos su Información'}
                    </h2>
                    <ul className="list-disc pl-6 space-y-2">
                        <li>
                            {lang === 'en'
                                ? 'To provide you with personalized real estate investment opportunities.'
                                : lang === 'fr'
                                ? 'Pour vous fournir des opportunités d\'investissement immobilier personnalisées.'
                                : 'Para brindarle oportunidades de inversión inmobiliaria personalizadas.'}
                        </li>
                        <li>
                            {lang === 'en'
                                ? 'To communicate with you regarding your inquiries.'
                                : lang === 'fr'
                                ? 'Pour communiquer avec vous concernant vos demandes.'
                                : 'Para comunicarnos con usted respecto a sus consultas.'}
                        </li>
                        <li>
                            {lang === 'en'
                                ? 'To send newsletters and market updates (you may unsubscribe at any time).'
                                : lang === 'fr'
                                ? 'Pour envoyer des infolettres et des mises à jour du marché (vous pouvez vous désabonner à tout moment).'
                                : 'Para enviar boletines y actualizaciones del mercado (puede darse de baja en cualquier momento).'}
                        </li>
                    </ul>

                    <h2 className="text-2xl text-luxury-gold mt-8 mb-4 font-serif">
                        {lang === 'en' ? '3. Data Security' : lang === 'fr' ? '3. Sécurité des Données' : '3. Seguridad de los Datos'}
                    </h2>
                    <p>
                        {lang === 'en'
                            ? 'We implement industry-standard security measures to protect your personal information from unauthorized access, alteration, disclosure, or destruction.'
                            : lang === 'fr'
                            ? 'Nous mettons en œuvre des mesures de sécurité conformes aux normes de l\'industrie pour protéger vos informations personnelles contre tout accès, modification, divulgation ou destruction non autorisés.'
                            : 'Implementamos medidas de seguridad estándar de la industria para proteger su información personal contra el acceso no autorizado, alteración, divulgación o destrucción.'}
                    </p>

                    <h2 className="text-2xl text-luxury-gold mt-8 mb-4 font-serif">
                        {lang === 'en' ? '4. Contact Us' : lang === 'fr' ? '4. Contactez-nous' : '4. Contáctenos'}
                    </h2>
                    <p>
                        {lang === 'en'
                            ? 'If you have any questions about this Privacy Policy, please contact us at info@puntacanainvestmentsrd.com.'
                            : lang === 'fr'
                            ? 'Si vous avez des questions concernant cette politique de confidentialité, veuillez nous contacter à l\'adresse info@puntacanainvestmentsrd.com.'
                            : 'Si tiene alguna pregunta sobre esta Política de Privacidad, contáctenos en info@puntacanainvestmentsrd.com.'}
                    </p>
                </div>
            </div>

            <Footer dict={dict} lang={lang} />
        </main>
    );
}
