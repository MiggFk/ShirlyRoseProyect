import { motion } from "framer-motion";

// Imágenes
import founderImg from "../../assets/images/Fundadora.jpg";
import trayectoriaImg from "../../assets/images/Girl.jpg";
import empresaImg from "../../assets/images/SobreEmpresa.jpg";
import ValoresImg from "../../assets/images/manos.jpg";
import VisionImg from "../../assets/images/Empleada.jpg";
import Footer from "../../components/Footer";
import PublicNavbar from "../../components/PublicNavbar";

export default function About() {
  const sections = [
    {
      title: "Nuestra Fundadora",
      text: "Shirly Paola Montalvo Atencio, con más de 10 años de experiencia en cosmetologia, Uñas, estética y spa, fundó Shirly Rose con la visión de transformar el cuidado personal en un momento de conexión y bienestar.",
      image: founderImg,
      side: "left",
    },
    {
      title: "Trayectoria",
      text: "Durante los últimos años, hemos crecido como empresa referente en estética, especializándonos en técnicas modernas de uñas, pestañas, cejas y tratamientos faciales.",
      image: trayectoriaImg,
      side: "right",
    },
    {
      title: "Sobre la Empresa",
      text: "Shirly Rose · Estética & Spa nace para ofrecer un servicio personalizado, donde cada detalle cuenta para brindar experiencias únicas de relajación y belleza.",
      image: empresaImg,
      side: "left",
    },
    {
      title: "Nuestros Valores",
      text: "Trabajamos con pasión, dedicación y un compromiso constante con la excelencia para que cada cliente viva una experiencia única y enriquecedora.",
      image: ValoresImg,
      side: "right",
    },
    {
      title: "Misión y Visión",
      text: "Nuestra misión es ofrecer bienestar y cuidado integral; nuestra visión es convertirnos en un referente nacional de servicios estéticos y spa.",
      image: VisionImg,
      side: "left",
    },
  ];

  return (
    <div className="min-h-screen bg-rose-50">
      {/* SideBar */}
      <PublicNavbar title="Shirly Rose" />

      {/* Contenido */}
      <main className="pt-32 pb-16 px-6">
        <div className="max-w-7xl mx-auto">
          {/* Título principal */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-20"
          >
            <h1 className="text-6xl font-bold text-gray-800 mb-4">
              Sobre Shirly Rose
            </h1>
            <div className="w-24 h-1 bg-rose-400 mx-auto rounded-full"></div>
          </motion.div>

          {/* Secciones */}
          <div className="space-y-32">
            {sections.map((section, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                viewport={{ once: true, amount: 0.3 }}
                className={`flex flex-col ${
                  section.side === "left" ? "md:flex-row" : "md:flex-row-reverse"
                } items-center gap-12`}
              >
                {/* Imagen con overlay - MÁS GRANDE */}
                <div className="w-full md:w-3/5 group relative overflow-hidden rounded-3xl shadow-2xl">
                  <div className="aspect-[4/3] overflow-hidden">
                    <img
                      src={section.image}
                      alt={section.title}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                  </div>
                  {/* Overlay sutil */}
                  <div className="absolute inset-0 bg-gradient-to-t from-rose-800/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                </div>

                {/* Texto */}
                <div className="w-full md:w-2/5 space-y-6">
                  {/* Número de sección */}
                  <div className="inline-flex items-center justify-center w-12 h-12 bg-rose-400 rounded-full text-white font-bold text-lg shadow-lg">
                    {index + 1}
                  </div>

                  <h2 className="text-4xl font-bold text-gray-800 leading-tight">
                    {section.title}
                  </h2>

                  <div className="w-16 h-1 bg-rose-500 rounded-full"></div>

                  <p className="text-gray-700 text-lg leading-relaxed">
                    {section.text}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Call to action final */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="mt-32 text-center bg-white rounded-3xl shadow-xl p-12 max-w-4xl mx-auto"
          >
            <h3 className="text-3xl font-bold text-gray-800 mb-4">
              ¿Lista para tu transformación?
            </h3>
            <p className="text-gray-600 text-lg mb-8 max-w-2xl mx-auto">
              Descubre la experiencia Shirly Rose y déjanos cuidar de ti con 
              nuestros servicios profesionales de belleza y bienestar.
            </p>
            <a
              href="/appointment"
              className="inline-block bg-rose-400 hover:bg-rose-600 text-white font-semibold px-10 py-4 rounded-full transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
            >
              Agenda tu Cita
            </a>
          </motion.div>
        </div>
      </main>

      {/* Footer */}
      <div className="mt-20">
        <Footer />
      </div>
    </div>
  );
}