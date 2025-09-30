import { motion } from "framer-motion";
import {
  FaWhatsapp,
  FaFacebookF,
  FaInstagram,
  FaEnvelope,
} from "react-icons/fa";

import logo from "../assets/logos/Logo-ShirlyRose.png";

export default function Footer() {
  return (
    <motion.footer
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      className="bg-rose-200 text-rose-700 py-10 px-6"
    >
      {/* Contenedor principal */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-14 text-center md:text-left">
        {/* Columna 1: Logo */}
        <div className="flex flex-col items-center md:items-start gap-5">
          <h2 className="text-xl font-bold uppercase tracking-wide">
            Shirly Rose
          </h2>
          <img
            src={logo}
            alt="Logo Shirly Rose"
            className="w-20 h-20"
          />
          <p className="text-sm">cr23 #10-19   Caucasia - Antioquia  Colombia</p>
        </div>

        {/* Columna 2: Servicios */}
        <div>
          <h3 className="text-lg font-bold uppercase tracking-wide mb-4">
            Servicios
          </h3>
          <ul className="space-y-2">
            {["Spa", "Peluquería", "Manicure/Pedicure", "Estética Facial"].map(
              (item, i) => (
                <motion.li
                  key={i}
                  whileHover={{ x: 5, scale: 1.05 }}
                  className="cursor-pointer hover:text-rose-500 transition-colors"
                >
                  {item}
                </motion.li>
              )
            )}
          </ul>
        </div>

        {/* Columna 3: Información */}
        <div>
          <h3 className="text-lg font-bold uppercase tracking-wide mb-4">
            Información
          </h3>
          <ul className="space-y-2">
            {[
              "Sobre Nosotros",
              "Política de Privacidad",
              "Términos de Uso",
              "Preguntas Frecuentes",
            ].map((item, i) => (
              <motion.li
                key={i}
                whileHover={{ x: 5, scale: 1.05 }}
                className="cursor-pointer hover:text-rose-500 transition-colors"
              >
                {item}
              </motion.li>
            ))}
          </ul>
        </div>

        {/* Columna 4: Contacto */}
        <div className="flex flex-col items-center md:items-start gap-4">
          <h3 className="text-lg font-bold uppercase tracking-wide">
            Contáctanos
          </h3>
          <div className="flex gap-4 text-3xl">
            {[
              { Icon: FaWhatsapp, link: "https://wa.me/573108317548" },
              { Icon: FaFacebookF, link: "https://www.facebook.com/share/14JHmkL5x58/?mibextid=wwXIfr" },
              { Icon: FaInstagram, link: "https://www.instagram.com/Shirly_montalvo" },
              { Icon: FaEnvelope, link: "mailto:correo@gmail.com" },
            ].map(({ Icon, link }, i) => (
              <motion.a
                key={i}
                href={link}
                whileHover={{ scale: 1.2 }}
                whileTap={{ scale: 0.9 }}
                className="text-rose hover:text-white transition-colors"
              >
                <Icon />
              </motion.a>
            ))}
          </div>
        </div>
      </div>

      {/* Línea separadora */}
      <div className="border-t border-rose-700 mt-8 pt-4 text-center text-sm text-rose-600">
        © {new Date().getFullYear()} Shirly Rose · Estética & Spa. Todos los derechos reservados.
      </div>
    </motion.footer>
  );
}