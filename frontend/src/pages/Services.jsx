export default function Services() {
  return (
    <div className="min-h-screen flex flex-col bg-rose-100">
      {/* Header */}
      <header className="p-6 bg-white shadow-md">
        <h1 className="text-3xl font-bold text-center text-rose-500">
          Nuestros Servicios
        </h1>
      </header>

      {/* Contenido */}
      <main className="flex-grow py-12 px-6 max-w-5xl mx-auto">
        <p className="text-center text-gray-700 text-lg">
          Aquí encontrarás todos los servicios que ofrecemos para tu bienestar.
        </p>
      </main>

      {/* Footer */}
      <footer className="text-center py-6 bg-rose-200">
        <p className="text-sm text-gray-700">
          © {new Date().getFullYear()} Shirly Rose · Estética & Spa
        </p>
      </footer>
    </div>
  );
}
