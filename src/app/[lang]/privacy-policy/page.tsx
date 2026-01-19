import { getDictionary } from '@/dictionaries/get-dictionary';
import Navbar from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { properties } from '@/data/properties';
import { investmentModels } from '@/data/investment-models';

export default async function PrivacyPolicyPage({ params }: { params: Promise<{ lang: 'es' | 'en' }> }) {
    const { lang } = await params;
    const dict = await getDictionary(lang);

    return (
        <main className="bg-neutral-900 min-h-screen">
            <Navbar
                lang={lang}
                dict={dict.nav}
                servicesList={investmentModels.map(m => ({ title: m.title[lang], slug: m.slug }))}
                propertyTypes={dict.properties.types}
            />

            <div className="pt-32 pb-24 max-w-4xl mx-auto px-6 text-gray-300">
                <h1 className="text-4xl md:text-5xl font-serif text-white mb-8">
                    {lang === 'en' ? 'Privacy Policy' : 'Política de Privacidad'}
                </h1>

                <div className="space-y-6 text-lg leading-relaxed">
                    <p>
                        {lang === 'en'
                            ? 'At Punta Cana Investments, we value your privacy and are committed to protecting your personal information. This Privacy Policy outlines how we collect, use, and safeguard your data.'
                            : 'En Punta Cana Investments, valoramos su privacidad y nos comprometemos a proteger su información personal. Esta Política de Privacidad describe cómo recopilamos, utilizamos y salvaguardamos sus datos.'}
                    </p>

                    <h2 className="text-2xl text-luxury-gold mt-8 mb-4 font-serif">
                        {lang === 'en' ? '1. Information We Collect' : '1. Información que Recopilamos'}
                    </h2>
                    <p>
                        {lang === 'en'
                            ? 'We may collect personal information such as your name, email address, phone number, and investment preferences when you fill out forms on our website or contact us directly.'
                            : 'Podemos recopilar información personal como su nombre, dirección de correo electrónico, número de teléfono y preferencias de inversión cuando completa formularios en nuestro sitio web o se comunica con nosotros directamente.'}
                    </p>

                    <h2 className="text-2xl text-luxury-gold mt-8 mb-4 font-serif">
                        {lang === 'en' ? '2. How We Use Your Information' : '2. Cómo Utilizamos su Información'}
                    </h2>
                    <ul className="list-disc pl-6 space-y-2">
                        <li>
                            {lang === 'en'
                                ? 'To provide you with personalized real estate investment opportunities.'
                                : 'Para brindarle oportunidades de inversión inmobiliaria personalizadas.'}
                        </li>
                        <li>
                            {lang === 'en'
                                ? 'To communicate with you regarding your inquiries.'
                                : 'Para comunicarnos con usted respecto a sus consultas.'}
                        </li>
                        <li>
                            {lang === 'en'
                                ? 'To send newsletters and market updates (you may unsubscribe at any time).'
                                : 'Para enviar boletines y actualizaciones del mercado (puede darse de baja en cualquier momento).'}
                        </li>
                    </ul>

                    <h2 className="text-2xl text-luxury-gold mt-8 mb-4 font-serif">
                        {lang === 'en' ? '3. Data Security' : '3. Seguridad de los Datos'}
                    </h2>
                    <p>
                        {lang === 'en'
                            ? 'We implement industry-standard security measures to protect your personal information from unauthorized access, alteration, disclosure, or destruction.'
                            : 'Implementamos medidas de seguridad estándar de la industria para proteger su información personal contra el acceso no autorizado, alteración, divulgación o destrucción.'}
                    </p>

                    <h2 className="text-2xl text-luxury-gold mt-8 mb-4 font-serif">
                        {lang === 'en' ? '4. Contact Us' : '4. Contáctenos'}
                    </h2>
                    <p>
                        {lang === 'en'
                            ? 'If you have any questions about this Privacy Policy, please contact us at info@puntacanainvesment.com.'
                            : 'Si tiene alguna pregunta sobre esta Política de Privacidad, contáctenos en info@puntacanainvesment.com.'}
                    </p>
                </div>
            </div>

            <Footer dict={dict} lang={lang} />
        </main>
    );
}
