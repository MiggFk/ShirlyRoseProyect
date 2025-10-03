import { motion } from "framer-motion";
import SidebarPublic from "../../components/SidebarPublic";
import Footer from "../../components/Footer";
import bgImage from "../../assets/images/paloRosa.png";

export default function Privacy() {
  return (
    <motion.div
      className="min-h-screen bg-rose-50"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1, transition: { duration: 0.8 } }}
    >
      <SidebarPublic />

      {/* Contenido */}
      <motion.main
        className="pt-24 px-6 pb-12"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 0.5 }}
      >
        <div className="max-w-4xl mx-auto">
          {/* Header con imagen de fondo */}
          <motion.div
            className="relative h-64 rounded-2xl overflow-hidden mb-12"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.7 }}
          >
            <div
              className="absolute inset-0 bg-cover bg-center"
              style={{ backgroundImage: `url(${bgImage})` }}
            >
              <div className="absolute inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center">
                <h1 className="text-5xl font-bold text-white drop-shadow-lg">
                  Política de Privacidad
                </h1>
              </div>
            </div>
          </motion.div>

          {/* Contenido */}
          <motion.div
            className="bg-white rounded-2xl shadow-lg p-8 md:p-12 space-y-6"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.9 }}
          >
            <section>
              <h2 className="text-2xl font-bold text-rose-600 mb-3">
                1. Información que Recopilamos
              </h2>
              <p className="text-gray-700 leading-relaxed">
                Recopilamos información personal como nombre, correo electrónico, número de
                teléfono y datos de citas cuando te registras en nuestra plataforma o agendas
                un servicio.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-rose-600 mb-3">
                2. Uso de la Información
              </h2>
              <p className="text-gray-700 leading-relaxed">
                Utilizamos tu información para:
              </p>
              <ul className="list-disc list-inside text-gray-700 mt-2 space-y-1 ml-4">
                <li>Gestionar tus citas y servicios</li>
                <li>Enviar confirmaciones y recordatorios</li>
                <li>Mejorar nuestros servicios</li>
                <li>Comunicarnos contigo sobre promociones (con tu consentimiento)</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-rose-600 mb-3">
                3. Protección de Datos
              </h2>
              <p className="text-gray-700 leading-relaxed">
                Implementamos medidas de seguridad técnicas y organizativas para proteger
                tu información personal contra acceso no autorizado, pérdida o destrucción.
                Tus datos están encriptados y almacenados de forma segura.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-rose-600 mb-3">
                4. Compartir Información
              </h2>
              <p className="text-gray-700 leading-relaxed">
                No vendemos ni compartimos tu información personal con terceros, excepto
                cuando sea necesario para procesar pagos o cumplir con obligaciones legales.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-rose-600 mb-3">
                5. Tus Derechos
              </h2>
              <p className="text-gray-700 leading-relaxed">
                Tienes derecho a acceder, corregir o eliminar tu información personal en
                cualquier momento. Puedes gestionar tus datos desde tu perfil o contactándonos
                directamente.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-rose-600 mb-3">
                6. Cookies
              </h2>
              <p className="text-gray-700 leading-relaxed">
                Utilizamos cookies para mejorar tu experiencia en nuestro sitio web. Puedes
                desactivarlas desde la configuración de tu navegador, aunque esto puede
                afectar algunas funcionalidades.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-rose-600 mb-3">
                7. Cambios a esta Política
              </h2>
              <p className="text-gray-700 leading-relaxed">
                Nos reservamos el derecho de actualizar esta política en cualquier momento.
                Te notificaremos sobre cambios importantes a través de nuestro sitio web
                o por correo electrónico.
              </p>
            </section>

            <div className="pt-6 border-t border-rose-100">
              <p className="text-gray-500 text-sm text-center">
                Última actualización: Octubre 2025
              </p>
              <p className="text-gray-600 text-sm text-center mt-2">
                Si tienes preguntas sobre nuestra política de privacidad, contáctanos.
              </p>
            </div>
          </motion.div>
        </div>
      </motion.main>

      {/* Footer */}
      <motion.footer
        className="text-center py-6 bg-rose-200 mt-10"
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1, transition: { duration: 0.5, delay: 1.1 } }}
      >
        <Footer />
      </motion.footer>
    </motion.div>
  );
}