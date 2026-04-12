import { getDictionary } from '@/dictionaries/get-dictionary';
import ContactForm from '@/components/contact/ContactForm';
import Navbar from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import Hero from '@/components/home/Hero';
import { FaPhone, FaEnvelope, FaMapMarkerAlt, FaWhatsapp, FaInstagram, FaLinkedin } from 'react-icons/fa';

export default async function ContactPage({
    params,
    searchParams
}: {
    params: Promise<{ lang: 'es' | 'en' }>,
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
    const { lang } = await params;
    const { subject } = await searchParams;
    const dict = await getDictionary(lang);

    return (
        <main className="min-h-screen bg-primary-black">
            <Navbar
                dict={dict.nav}
                lang={lang}
                servicesList={dict.sections.services.items}
                propertyTypes={dict.properties.types}
            />

            {/* Short Hero for Context - Reusing generic style but simpler */}
            <section className="relative h-[40vh] min-h-[400px] flex items-center justify-center overflow-hidden">
                <div
                    className="absolute inset-0 z-0 bg-cover bg-center bg-[url('/images/og-home-luxury.webp')] brightness-[0.4]"
                />
                <div className="relative z-10 text-center px-4 max-w-4xl mx-auto mt-20">
                    <h1 className="text-5xl md:text-6xl font-playfair text-white mb-6">
                        {dict.contact.title}
                    </h1>
                    <p className="text-xl text-gray-200 font-light max-w-2xl mx-auto">
                        {dict.contact.subtitle}
                    </p>
                </div>
            </section>

            <div className="bg-primary-black py-20 px-4 md:px-8">
                <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16">

                    {/* Contact Information */}
                    <div className="space-y-12">
                        <div>
                            <h2 className="text-4xl font-playfair text-white mb-2">
                                {dict.contact.info.title}
                            </h2>
                            <div className="h-1 w-20 bg-luxury-gold"></div>
                        </div>

                        <div className="space-y-8">
                            <div className="flex items-start gap-6 group">
                                <div className="p-4 bg-zinc-900 rounded-full border border-zinc-800 text-luxury-gold group-hover:border-luxury-gold transition-colors">
                                    <FaPhone aria-hidden="true" size={24} />
                                </div>
                                <div>
                                    <h3 className="text-gray-400 text-sm uppercase tracking-wide mb-1">{dict.contact.info.phone}</h3>
                                    <a href={`tel:${dict.footer.phone1.replace(/\s/g, '')}`} className="text-2xl text-white font-playfair hover:text-luxury-gold transition-colors block">
                                        {dict.footer.phone1}
                                    </a>
                                    <a href={`tel:${dict.footer.phone2.replace(/\s/g, '')}`} className="text-xl text-gray-300 font-playfair hover:text-luxury-gold transition-colors block mt-1">
                                        {dict.footer.phone2}
                                    </a>
                                </div>
                            </div>

                            <div className="flex items-start gap-6 group">
                                <div className="p-4 bg-zinc-900 rounded-full border border-zinc-800 text-luxury-gold group-hover:border-luxury-gold transition-colors">
                                    <FaEnvelope aria-hidden="true" size={24} />
                                </div>
                                <div>
                                    <h3 className="text-gray-400 text-sm uppercase tracking-wide mb-1">{dict.contact.info.email}</h3>
                                    <a href="mailto:ventas@puntacanainvestmentsrd.com" className="text-2xl text-white font-playfair hover:text-luxury-gold transition-colors">
                                        ventas@puntacanainvestmentsrd.com
                                    </a>
                                </div>
                            </div>

                            <div className="flex items-start gap-6 group">
                                <div className="p-4 bg-zinc-900 rounded-full border border-zinc-800 text-luxury-gold group-hover:border-luxury-gold transition-colors">
                                    <FaMapMarkerAlt aria-hidden="true" size={24} />
                                </div>
                                <div>
                                    <h3 className="text-gray-400 text-sm uppercase tracking-wide mb-1">{dict.contact.info.office}</h3>
                                    <p className="text-xl text-gray-300 font-playfair max-w-xs">
                                        {dict.footer.address}
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Quick Actions */}
                        <div className="pt-8 border-t border-zinc-800 flex flex-wrap gap-4">
                            <a
                                href="https://wa.me/18294084322"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-3 bg-green-600/10 text-green-500 px-6 py-3 rounded-full border border-green-500/20 hover:bg-green-600 hover:text-white transition-all"
                            >
                                <FaWhatsapp aria-hidden="true" size={20} />
                                <span className="font-semibold">Chat en WhatsApp</span>
                            </a>
                            <a
                                href="https://www.instagram.com/puntacanainvestmentsrd/"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-3 bg-pink-600/10 text-pink-500 px-6 py-3 rounded-full border border-pink-500/20 hover:bg-pink-600 hover:text-white transition-all"
                            >
                                <FaInstagram aria-hidden="true" size={20} />
                                <span className="font-semibold">Instagram</span>
                            </a>
                            <a
                                href="https://www.linkedin.com/in/ulises-ubiera-b442b685"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-3 bg-blue-600/10 text-blue-500 px-6 py-3 rounded-full border border-blue-500/20 hover:bg-blue-600 hover:text-white transition-all"
                            >
                                <FaLinkedin aria-hidden="true" size={20} />
                                <span className="font-semibold">LinkedIn</span>
                            </a>
                        </div>
                    </div>

                    {/* Form */}
                    <div className="bg-zinc-950 p-8 md:p-10 rounded-2xl border border-zinc-800 shadow-2xl">
                        <h3 className="text-2xl font-playfair text-white mb-6">Envia un mensaje</h3>
                        <ContactForm dict={dict.contact.form} subject={typeof subject === 'string' ? subject : undefined} lang={lang} />
                    </div>

                </div>
            </div>

            <Footer dict={dict} lang={lang} />
        </main>
    );
}
