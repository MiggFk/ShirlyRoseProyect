import React, { useState } from 'react';
import { motion } from "framer-motion";
import Footer from "../../components/Footer";
import PublicNavbar from "../../components/PublicNavbar";
import { usePublicServices } from '../../hooks/usePublicServices';
import { Clock, Scissors, Star } from 'lucide-react';

export default function Services() {
  const { services, loading, error } = usePublicServices();
  const [search, setSearch] = useState("");

  // Función para formatear duración
  const formatDuration = (duration) => {
    const durationMap = {
      '30_min': '30 min',
      '45_min': '45 min',
      '1_hora': '1h',
      '1_hora_30_min': '1h 30m',
      '2_horas': '2h',
      '2_horas_30_min': '2h 30m',
      '3_horas': '3h',
      '3_horas_30_min': '3h 30m',
      '4_horas': '4h',
      'mas_4_horas': '+4h'
    };
    return durationMap[duration] || duration;
  };

  // Función para formatear categoría
  const formatCategory = (category) => {
    const categoryMap = {
      'manicure_pedicure': 'Manicure y Pedicure',
      'tratamientos_faciales': 'Tratamientos Faciales',
      'depilacion': 'Depilación',
      'masajes': 'Masajes y Relajación',
      'maquillaje_eventos': 'Maquillaje para Eventos',
      'tratamientos_cabello': 'Tratamientos Capilares'
    };
    return categoryMap[category] || category;
  };

  // Filtrar servicios por búsqueda de categoría o nombre
  const filteredServices = React.useMemo(() => {
    if (!search.trim()) return services;
    
    const searchLower = search.toLowerCase().trim();
    
    return services.filter(service => {
      // Buscar en la categoría formateada
      const categoryFormatted = formatCategory(service.category).toLowerCase();
      
      // Buscar en el nombre del servicio
      const serviceName = (service.name || '').toLowerCase();
      
      // Buscar también en la categoría raw
      const categoryRaw = (service.category || '').toLowerCase().replace(/_/g, ' ');
      
      return categoryFormatted.includes(searchLower) || 
             serviceName.includes(searchLower) ||
             categoryRaw.includes(searchLower);
    });
  }, [services, search]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-rose-50 via-pink-50 to-purple-50 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-16 h-16 border-4 border-rose-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-rose-600 font-medium">Cargando servicios...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-rose-50 via-pink-50 to-purple-50 flex items-center justify-center">
        <div className="text-red-500 text-center max-w-md mx-auto p-8">
          <Scissors size={48} className="mx-auto mb-4 text-red-400" />
          <h2 className="text-2xl font-bold mb-4">Error al cargar servicios</h2>
          <p className="text-red-600">{error}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="mt-4 px-6 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
          >
            Reintentar
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 via-pink-50 to-purple-50">
      <PublicNavbar />
      
      <div className="container mx-auto px-4 py-28">
        {/* Header con más espacio */}
        <motion.div 
          className="text-center mb-20"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <div className="flex items-center justify-center gap-3 mb-4">
            <Scissors className="text-rose-500" size={40} />
            <h1 className="text-5xl font-bold text-gray-800">
              Nuestros Servicios
            </h1>
          </div>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Descubre nuestra amplia gama de servicios de belleza y bienestar, 
            diseñados para realzar tu belleza natural y hacerte sentir increíble.
          </p>
        </motion.div>

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
            <Scissors className="text-gray-500 text-xl" />
          </div>
        </motion.div>

        {services.length === 0 ? (
          <motion.div 
            className="text-center py-20"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            <Scissors size={80} className="mx-auto mb-6 text-gray-400" />
            <h3 className="text-2xl font-semibold text-gray-600 mb-2">
              Próximamente
            </h3>
            <p className="text-gray-500 max-w-md mx-auto">
              Estamos preparando increíbles servicios para ti. 
              ¡Vuelve pronto para descubrir todas nuestras opciones!
            </p>
          </motion.div>
        ) : filteredServices.length === 0 ? (
          <motion.div 
            className="text-center py-20"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            <Scissors size={80} className="mx-auto mb-6 text-gray-400" />
            <h3 className="text-2xl font-semibold text-gray-600 mb-2">
              No se encontraron servicios
            </h3>
            <p className="text-gray-500 max-w-md mx-auto">
              No hay servicios que coincidan con "{search}". Intenta con otra búsqueda.
            </p>
            <button
              onClick={() => setSearch("")}
              className="mt-4 px-6 py-2 bg-rose-500 text-white rounded-lg hover:bg-rose-600 transition"
            >
              Limpiar búsqueda
            </button>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredServices.map((service, index) => (
              <ServiceCard 
                key={service._id} 
                service={service} 
                index={index}
                formatDuration={formatDuration}
                formatCategory={formatCategory}
              />
            ))}
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
}

function ServiceCard({ service, index, formatDuration, formatCategory }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: index * 0.1 }}
      className="bg-white rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-300 overflow-hidden group"
    >
      {/* Imagen */}
      <div className="relative h-56 overflow-hidden">
        {service.images && service.images.length > 0 ? (
          <>
            <img
              src={service.images[0].url}
              alt={service.name}
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
            />
            
            {/* Indicador de múltiples imágenes */}
            {service.images.length > 1 && (
              <div className="absolute top-4 left-4 bg-black/70 backdrop-blur-sm rounded-full px-2 py-1 flex items-center gap-1">
                <Star size={12} className="text-yellow-400 fill-current" />
                <span className="text-xs text-white font-medium">
                  +{service.images.length - 1}
                </span>
              </div>
            )}
          </>
        ) : (
          // Imagen por defecto
          <div className="w-full h-full bg-gradient-to-br from-rose-100 to-pink-200 flex items-center justify-center">
            <div className="text-center">
              <Scissors size={48} className="text-rose-400 mx-auto mb-2" />
              <p className="text-rose-600 font-medium text-sm">
                {formatCategory(service.category)}
              </p>
            </div>
          </div>
        )}

        {/* Overlay con categoría */}
        <div className="absolute bottom-4 left-4 bg-rose-500/90 backdrop-blur-sm rounded-full px-3 py-1">
          <span className="text-sm font-medium text-white">
            {formatCategory(service.category)}
          </span>
        </div>
      </div>

      {/* Contenido */}
      <div className="p-6">
        <div className="mb-4">
          <h3 className="font-bold text-xl text-gray-800 mb-2 line-clamp-1">
            {service.name}
          </h3>
          
          {service.description && (
            <p className="text-gray-600 text-sm leading-relaxed line-clamp-3">
              {service.description}
            </p>
          )}
        </div>

        {/* Footer de la card */}
        <div className="flex items-center justify-between">
          <div className="flex flex-col">
            <span className="text-3xl font-bold text-rose-500">
              ${service.price?.toLocaleString()}
            </span>
            <span className="text-xs text-gray-500 flex items-center gap-1">
              <Clock size={12} />
              {formatDuration(service.duration)}
            </span>
          </div>
          
          <a
          href="/appointment"
          className="inline-block bg-rose-400 hover:bg-rose-600 text-white font-semibold px-10 py-4 rounded-full transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
          >
          Agendar
          </a>
        </div>
      </div>
    </motion.div>
  );
}