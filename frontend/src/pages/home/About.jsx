import { motion } from "framer-motion";
// 🚨 REESTAURADO: El Navbar Público es necesario para el menú desplegable
import PublicNavbar from "../../components/PublicNavbar"; 
import Footer from "../../components/Footer";
import LogoShirly from "../../components/LogoShirly"; // Para el logo grande en el Hero Section

// Imágenes
import founderImg from "../../assets/images/Fundadora.jpg";
import trayectoriaImg from "../../assets/images/Girl.jpg";
import empresaImg from "../../assets/images/manos.jpg";
import ValoresImg from "../../assets/images/Fondo-Mujer.png";
import VisionImg from "../../assets/images/fondo-rosas-claras.png";

// Componente reutilizable para las secciones (se mantiene sin cambios)
const AboutSection = ({ title, text, image, side, fadeIn }) => (
    <motion.div
      className={`flex flex-col md:flex-row ${
        side === "left" ? "" : "md:flex-row-reverse"
      } items-center gap-10 lg:gap-16`} 
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.2 }}
      variants={fadeIn}
    >
      {/* 1. Imagen con Marco Decorativo */}
      <div className="w-full md:w-1/2 relative py-4 px-4 md:px-0">
          <div className={`hidden md:block absolute w-full h-full rounded-2xl border-4 border-rose-200/50 ${
            side === "left" ? "-right-3 top-3" : "-left-3 top-3"
          } transition-all duration-500 hover:border-rose-300/70`} />
          
          <div className="relative z-10 h-[480px]">
              <img
                  src={image}
                  alt={title}
                  className="w-full h-full object-cover rounded-2xl shadow-2xl shadow-rose-200/50 transition-transform duration-500 hover:scale-[1.01]"
              />
          </div>
      </div>

      {/* 2. Bloque de Texto Estilizado */}
      <div className="w-full md:w-1/2 p-6 md:p-8 bg-white/70 rounded-xl shadow-lg backdrop-blur-sm"> 
        <h2 className="text-3xl font-extrabold text-rose-600 mb-4 border-b-2 border-rose-200/80 pb-2">
          {title}
        </h2>
        <p className="text-gray-700 text-lg leading-relaxed">
          {text}
        </p>
      </div>
    </motion.div>
);


export default function About() {
  const sections = [
    {
      title: "Nuestra Fundadora",
      text: "Shirly Paola, con más de 10 años de experiencia en estética y spa, fundó este espacio con la visión de transformar el cuidado personal en un momento de conexión y bienestar.",
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

  const fadeIn = {
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8 } },
  };
  
  const heroText = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: { opacity: 1, scale: 1, transition: { type: "spring", stiffness: 80, delay: 0.9 } }
  };
    
  const logoAnimate = {
    hidden: { opacity: 0, y: -20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, delay: 0.6 } }
  }


  return (
    <motion.div
      className="min-h-screen bg-rose-50"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1, transition: { duration: 0.8 } }}
    >
      {/* 1. Navbar (Con el logo ahora bien centrado gracias al ajuste en PublicNavbar.jsx) */}
      <PublicNavbar />

      {/* 2. Contenido Principal */}
      <motion.main
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 0.5 }}
        className="pt-20" 
      >
        {/* Hero Section */}
        <div className="w-full pt-16 pb-20 bg-gradient-to-r from-rose-50 to-pink-100 shadow-inner flex flex-col items-center justify-center">
            
            {/* Logo */}
            <motion.div
                variants={logoAnimate}
                initial="hidden"
                animate="visible"
                className="mb-4"
            >
                {/* Usamos el Logo grande para esta sección principal */}
                <LogoShirly size="h-16 w-16" /> 
            </motion.div>

            {/* Título */}
            <motion.h1
              variants={heroText}
              initial="hidden"
              animate="visible"
              className="text-6xl md:text-7xl font-extrabold text-rose-700 text-center tracking-wide italic"
              style={{ fontFamily: "'Great Vibes', cursive" }}
            >
              Sobre Shirly Rose
            </motion.h1>

            <motion.p 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.5, duration: 0.8 }}
                className="text-center text-xl text-gray-600 mt-4 max-w-2xl mx-auto px-4"
            >
                Conoce la visión, la trayectoria y los valores que nos impulsan a ofrecer el mejor cuidado estético y bienestar.
            </motion.p>
        </div>


        {/* 3. Contenedor de Secciones */}
        <div className="space-y-32 max-w-7xl mx-auto px-6 py-16">
          {sections.map((section, index) => (
            <AboutSection key={index} {...section} fadeIn={fadeIn} />
          ))}
        </div>
      </motion.main>

      {/* 4. Footer */}
      <motion.footer
        className="w-full text-center py-6 bg-rose-200 mt-auto" 
        initial={{ y: 50, opacity: 0 }}
        whileInView={{ y: 0, opacity: 1, transition: { duration: 0.5 } }}
        viewport={{ once: true, amount: 0.2 }}
      >
        <Footer />
      </motion.footer>
    </motion.div>
  );
}