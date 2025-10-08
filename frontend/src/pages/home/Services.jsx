import { useState } from "react";
import { FiSearch } from "react-icons/fi";
import { motion } from "framer-motion";
import Footer from "../../components/Footer";
import SideBarPublic from "../../components/SideBarPublic";


// Imágenes
import pressOn from "../../assets/images/services/Uñas/pressOn.jpg";
import RecubrimientoPoli from "../../assets/images/services/Uñas/Recubrimiento-Poligel.jpg";
import Hidralips from "../../assets/images/services/EsteticaFacial/Hidralips.jpg";
import Acrilico from "../../assets/images/services/Uñas/Acrilico.jpg";
import Pestañas from "../../assets/images/services/CejasyPestañas/Pestañas.jpg";
import Acriesculpido from "../../assets/images/services/Uñas/Acrilico-esculpido.jpg";
import PeloaPeloHibridas from "../../assets/images/services/CejasyPestañas/pelo-hibridas.jpg";
import Voltecnologico from "../../assets/images/services/CejasyPestañas/volumen-Tecnologico.jpg";
import SinNada from "../../assets/images/SinFoto.jpg";

// Servicios por categoria
const servicesByCategory = {
  "Uñas": [
    {
      title: "Acrilico Esculpido",
      description: "Descripcion",
      duration: "3 horas",
      price: "$60.000",
      image: Acriesculpido,
    },
    {
      title: "Press On",
      description:
        "uñas postizas pre-diseñadas que se adhieren a la uña natural de forma temporal, sin necesidad de luz UV/LED.",
      duration: "30 min",
      price: "$40.000",
      image: pressOn,
    },
    {
      title: "Recubrimiento Poligel",
      description: "Cuidado para tus manos con un estilo clásico.",
      duration: "2 Horas",
      price: "$30.000",
      image: RecubrimientoPoli,
    },
    {
      title: "Uñas Acrilicas",
      description: "Uñas semi con el diseño que gustes.",
      duration: "40 min",
      price: "$45.000",
      image: Acrilico,
    },
    {
      title: "Titulo",
      description: "descripcion",
      duration: "duracion",
      price: "precio",
      image: SinNada,
    },
    {
      title: "Titulo",
      description: "descripcion",
      duration: "duracion",
      price: "precio",
      image: SinNada,
    },
  ],
  "Estetica Facial": [
    {
      title: "Hidralips",
      description:
        "Tratamiento para hidratar, rejuvenecer y mejorar la apariencia de los labios",
      duration: "45 min",
      price: "$75.000",
      image: Hidralips,
    },
    {
      title: "-----",
      description: "descripcion",
      duration: "tiempo",
      price: "Precio",
      image: SinNada,
    },
    {
      title: "-----",
      description: "descripcion",
      duration: "tiempo",
      price: "Precio",
      image: SinNada,
    },
  ],
  "Pestañas y Cejas": [
    {
      title: "Pestañas pelo a pelo",
      description: "Descripcion",
      duration: "50 min",
      price: "$90.000",
      image: Pestañas,
    },
    {
      title: "Pestañas pelo a pelo hibridas",
      description: "descripcion",
      duration: "tiempo",
      price: "Precio",
      image: PeloaPeloHibridas,
    },
    {
      title: "Pestañas pelo a pelo volumen tecnológico",
      description: "descripcion",
      duration: "tiempo",
      price: "Precio",
      image: Voltecnologico,
    }
  ],
  "Peluqueria": [
    {
      title: "-----",
      description: "descripcion",
      duration: "tiempo",
      price: "Precio",
      image: SinNada,
    },
    {
      title: "-----",
      description: "descripcion",
      duration: "tiempo",
      price: "Precio",
      image: SinNada,
    },
    {
      title: "-----",
      description: "descripcion",
      duration: "tiempo",
      price: "Precio",
      image: SinNada,
    },
    {
      title: "-----",
      description: "descripcion",
      duration: "tiempo",
      price: "Precio",
      image: SinNada,
    },
    {
      title: "-----",
      description: "descripcion",
      duration: "tiempo",
      price: "Precio",
      image: SinNada,
    },
    {
      title: "-----",
      description: "descripcion",
      duration: "tiempo",
      price: "Precio",
      image: SinNada,
    }
  ],
  "Depilacion":[
    {
      title: "-----",
      description: "descripcion",
      duration: "tiempo",
      price: "Precio",
      image: SinNada,
    },
    {
      title: "-----",
      description: "descripcion",
      duration: "tiempo",
      price: "Precio",
      image: SinNada,
    },
    {
      title: "-----",
      description: "descripcion",
      duration: "tiempo",
      price: "Precio",
      image: SinNada,
    }
  ]
};

// Variantes de animación para las tarjetas de servicios
const cardVariants = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.5, ease: "easeOut" } },
};

export default function Services() {
  const [search, setSearch] = useState("");

  const filteredCategories = Object.entries(servicesByCategory).filter(
    ([category]) => category.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <motion.div
      className="min-h-screen bg-rose-100"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1, transition: { duration: 0.8 } }}
    >
      
      <SideBarPublic title="Shirly Rose" />

      {/* Contenido principal */}
      <main className="pt-28 px-6 pb-12">
        <h2 className="text-3xl font-bold text-rose-600 text-center mb-6">Nuestros Servicios</h2>

        {/* Barra de búsqueda */}
        <motion.div
          className="flex justify-center mb-10"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1, transition: { duration: 0.5, delay: 0.4 } }}
        >
          <div className="flex items-center w-full max-w-md bg-white border border-rose-300 rounded-full shadow-sm px-4 py-2">
            <input
              type="text"
              placeholder="Buscar por categoría..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="flex-grow outline-none bg-transparent text-gray-700 px-2"
            />
            <FiSearch className="text-gray-500 text-xl" />
          </div>
        </motion.div>

        {/* contenedor servicios buscados*/}
        {filteredCategories.length > 0 ? (
          filteredCategories.map(([category, services]) => (
            <motion.section
              key={category}
              className="mb-16"
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.6 }}
            >
              <div className="bg-rose-200 rounded-[15px] p-10 shadow-md">
                <h3
                  className="text-3xl font-bold text-left mb-10 text-rose-500 italic"
                >
                  {category}
                </h3>

                {/* Grid de cartas dentro del contenedor */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  {services.map((service, index) => (
                    <motion.div
                      key={index}
                      className="bg-white rounded-2xl shadow-lg overflow-hidden"
                      variants={cardVariants}
                      initial="hidden"
                      whileInView="visible"
                      viewport={{ once: true, amount: 0.5 }}
                      transition={{ delay: index * 0.1, duration: 0.5 }}
                    >
                      <img src={service.image} alt={service.title} className="h-48 w-full object-cover" />
                      <div className="p-7">
                        <h4 className="text-xl font-bold text-rose-500 mb-2">{service.title}</h4>
                        <p className="text-gray-600 mb-3">{service.description}</p>
                        <p className="text-sm text-gray-500">Duración: {service.duration}</p>
                        <p className="text-sm text-gray-500 mb-4">Precio: {service.price}</p>
                        <button className="w-full bg-rose-400 hover:bg-rose-500 text-white py-2 rounded-lg font-medium transition">Agendar</button>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.section>
          ))
        ) : (
          <p className="text-center text-gray-600">No se encontraron categorías.</p>
        )}
      </main>

      {/* Footer */}
      <motion.footer
        className="text-center py-6 bg-rose-200"
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1, transition: { duration: 0.5, delay: 0.8 } }}
      >
        <Footer />
      </motion.footer>
    </motion.div>
  );
}