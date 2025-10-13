import { motion } from "framer-motion";
import PublicNavbar from "../../components/PublicNavbar";
import Footer from "../../components/Footer";
import bgImage from "../../assets/images/paloRosa.png";

export default function Terms() {
  return (
    <motion.div
      className="min-h-screen bg-rose-50"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1, transition: { duration: 0.8 } }}
    >
      <PublicNavbar />

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
                  Términos y Condiciones
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
              <p className="text-gray-700 leading-relaxed mb-6">
                Bienvenido a nuestro sitio web. Al registrarte y utilizar nuestros
                servicios, aceptas los siguientes términos y condiciones. Por favor,
                léelos detenidamente antes de continuar.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-800 mb-3">
                1. Uso del Servicio
              </h2>
              <p className="text-gray-700 leading-relaxed">
                Solo podrás utilizar nuestra plataforma para fines legales y
                personales. No se permite el uso indebido ni actividades que puedan
                dañar el servicio o a otros usuarios.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-800 mb-3">
                2. Registro de Cuenta
              </h2>
              <p className="text-gray-700 leading-relaxed">
                Para acceder a ciertos servicios, deberás crear una cuenta proporcionando
                información precisa y actualizada. Eres responsable de mantener la
                confidencialidad de tu contraseña y de todas las actividades realizadas
                bajo tu cuenta.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-800 mb-3">
                3. Reservas y Cancelaciones
              </h2>
              <p className="text-gray-700 leading-relaxed">
                Las reservas de servicios están sujetas a disponibilidad. En caso de
                cancelación, te pedimos notificar con al menos 24 horas de anticipación.
                Las cancelaciones tardías pueden estar sujetas a cargos según nuestra
                política de cancelación.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-800 mb-3">
                4. Privacidad y Datos Personales
              </h2>
              <p className="text-gray-700 leading-relaxed">
                Nos comprometemos a proteger tu información personal. Consulta nuestra
                política de privacidad para conocer cómo recopilamos, usamos y protegemos
                tus datos.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-800 mb-3">
                5. Conducta del Usuario
              </h2>
              <p className="text-gray-700 leading-relaxed">
                Te comprometes a:
              </p>
              <ul className="list-disc list-inside text-gray-700 mt-2 space-y-1 ml-4">
                <li>No compartir tu cuenta con terceros</li>
                <li>No realizar actividades fraudulentas o ilegales</li>
                <li>Respetar a nuestro personal y otros usuarios</li>
                <li>Proporcionar información veraz al realizar reservas</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-800 mb-3">
                6. Propiedad Intelectual
              </h2>
              <p className="text-gray-700 leading-relaxed">
                Todo el contenido, diseño, logotipos y material presente en nuestro sitio
                web son propiedad de Shirly Rose y están protegidos por las leyes de
                propiedad intelectual. No está permitida su reproducción sin autorización.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-800 mb-3">
                7. Limitación de Responsabilidad
              </h2>
              <p className="text-gray-700 leading-relaxed">
                No nos hacemos responsables por daños indirectos, incidentales o
                consecuentes derivados del uso de nuestros servicios. Nuestro objetivo
                es proporcionar servicios de calidad, pero no garantizamos resultados
                específicos.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-800 mb-3">
                8. Modificaciones a los Términos
              </h2>
              <p className="text-gray-700 leading-relaxed">
                Nos reservamos el derecho de modificar estos términos en cualquier
                momento. Te notificaremos sobre cambios importantes a través del sitio
                web o por correo electrónico. El uso continuado de nuestros servicios
                después de las modificaciones implica la aceptación de los nuevos términos.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-800 mb-3">
                9. Terminación de Cuenta
              </h2>
              <p className="text-gray-700 leading-relaxed">
                Nos reservamos el derecho de suspender o cancelar tu cuenta si incumples
                estos términos o si detectamos actividades sospechosas. Puedes cancelar
                tu cuenta en cualquier momento desde la configuración de tu perfil.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-800 mb-3">
                10. Contacto
              </h2>
              <p className="text-gray-700 leading-relaxed">
                Si tienes preguntas o inquietudes sobre estos términos y condiciones,
                no dudes en contactarnos a través de nuestros canales oficiales de
                comunicación.
              </p>
            </section>

            <div className="pt-6 border-t border-rose-100">
              <p className="text-gray-500 text-sm text-center">
                Última actualización: Octubre 2025
              </p>
              <p className="text-gray-600 text-sm text-center mt-2">
                Al utilizar nuestros servicios, aceptas estos términos y condiciones.
              </p>
            </div>
          </motion.div>
        </div>
      </motion.main>

      {/* Footer */}
      <motion.footer
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1, transition: { duration: 0.5, delay: 1.1 } }}
      >
        <Footer />
      </motion.footer>
    </motion.div>
  );
}