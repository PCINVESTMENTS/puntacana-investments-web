import Link from "next/link";

export default function NotFound() {
    return (
        <div className="h-screen w-full flex flex-col items-center justify-center bg-primary-black text-white text-center px-4">
            <h2 className="text-6xl md:text-8xl font-serif text-luxury-gold mb-4">404</h2>
            <h3 className="text-2xl md:text-3xl font-light mb-8">Página No Encontrada / Page Not Found</h3>
            <p className="text-gray-400 max-w-md mb-12">
                La propiedad o página que buscas no existe o ha sido movida.
                <br />
                The property or page you are looking for does not exist or has been moved.
            </p>

            <Link
                href="/"
                className="px-8 py-3 bg-luxury-gold text-primary-black font-semibold uppercase tracking-wider hover:bg-white transition-colors duration-300"
            >
                Volver al Inicio / Back to Home
            </Link>
        </div>
    );
}
