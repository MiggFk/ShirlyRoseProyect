import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import Footer from "../../components/Footer";
import SideBarPublic from "../../components/SideBarPublic";
import { usePublicProducts } from "../../hooks/usePublicProducts";
import { usePublicServices } from "../../hooks/usePublicServices";
import { 
  ShoppingBag, 
  Scissors, 
  Star, 
  Clock, 
  User,
  Settings
} from "lucide-react";

export default function IndexHome() {
  const { products, loading: productsLoading } = usePublicProducts();
  const { services, loading: servicesLoading } = usePublicServices();
  const [user, setUser] = useState(null);

  // Verificar si hay usuario logueado
  useEffect(() => {
    const userData = localStorage.getItem("user");
    if (userData) {
      setUser(JSON.parse(userData));
    }
  }, []);

  // Tomar solo los primeros productos y servicios para destacados
  const featuredProducts = products.slice(0, 6);
  const featuredServices = services.slice(0, 4);

  const formatDuration = (duration) => {
    const durationMap = {
      '30_min': '30m',
      '45_min': '45m', 
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 via-pink-50 to-purple-50">
      <SideBarPublic />
      
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-rose-100/80 via-pink-100/60 to-purple-100/80"></div>
        
        <div className="relative z-10 text-center max-w-4xl mx-auto px-6">
          <motion.h1
            className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-rose-600 via-pink-600 to-purple-600 bg-clip-text text-transparent"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            Belleza que Inspira
          </motion.h1>

          <motion.p
            className="text-xl md:text-2xl text-gray-700 mb-8 leading-relaxed"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            Descubre productos de belleza únicos y servicios profesionales 
            que realzan tu esencia natural
          </motion.p>

          {/* Botones Auth */}
          <motion.div
            className="flex flex-col sm:flex-row gap-4 justify-center items-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            {user ? (
              // Usuario logueado
              <div className="flex flex-col sm:flex-row gap-4 items-center">
                <div className="text-center">
                  <p className="text-gray-600 mb-2">¡Bienvenida de vuelta!</p>
                  <p className="text-2xl font-bold text-rose-600">{user.name}</p>
                </div>
                
                <div className="flex gap-3">
                  <Link
                    to="/profile"
                    className="flex items-center gap-2 bg-rose-500 hover:bg-rose-600 text-white font-semibold px-6 py-3 rounded-full transition-all duration-300 shadow-lg hover:shadow-xl"
                  >
                    <User size={20} />
                    Mi Perfil
                  </Link>
                  
                  {user.role === 'admin' && (
                    <Link
                      to="/dashboard"
                      className="flex items-center gap-2 bg-purple-500 hover:bg-purple-600 text-white font-semibold px-6 py-3 rounded-full transition-all duration-300 shadow-lg hover:shadow-xl"
                    >
                      <Settings size={20} />
                      Dashboard
                    </Link>
                  )}
                </div>
              </div>
            ) : (
              // Usuario NO logueado
              <>
                <Link
                  to="/login"
                  className="bg-rose-500 hover:bg-rose-600 text-white font-semibold px-8 py-4 rounded-full transition-all duration-300 text-lg shadow-lg hover:shadow-xl transform hover:scale-105"
                >
                  Iniciar Sesión
                </Link>
                <Link
                  to="/register"
                  className="bg-white hover:bg-gray-50 text-rose-600 font-semibold px-8 py-4 rounded-full border-2 border-rose-500 transition-all duration-300 text-lg shadow-lg hover:shadow-xl transform hover:scale-105"
                >
                  Crear Cuenta
                </Link>
              </>
            )}
          </motion.div>

          {/* Call to action */}
          <motion.div
            className="mt-12 flex flex-col sm:flex-row gap-4 justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.6 }}
          >
            <Link
              to="/products"
              className="flex items-center gap-2 bg-gradient-to-r from-rose-400 to-pink-400 hover:from-rose-500 hover:to-pink-500 text-white font-medium px-6 py-3 rounded-full transition-all duration-300 shadow-md"
            >
              <ShoppingBag size={18} />
              Ver Productos
            </Link>
            <Link
              to="/services"
              className="flex items-center gap-2 bg-gradient-to-r from-purple-400 to-pink-400 hover:from-purple-500 hover:to-pink-500 text-white font-medium px-6 py-3 rounded-full transition-all duration-300 shadow-md"
            >
              <Scissors size={18} />
              Ver Servicios
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Productos Destacados */}
      <section className="py-20 px-6">
        <div className="container mx-auto max-w-7xl">
          <motion.div
            className="flex items-center justify-between mb-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <div>
              <h2 className="text-5xl font-black text-gray-800 mb-4">
                Productos
                <span className="block text-transparent bg-clip-text bg-gradient-to-r from-rose-500 to-pink-500">
                  Favoritos
                </span>
              </h2>
              <p className="text-xl text-gray-600">Descubre lo que está en tendencia</p>
            </div>
            <Link
              to="/products"
              className="hidden md:flex items-center gap-2 bg-gradient-to-r from-rose-500 to-pink-500 hover:from-rose-600 hover:to-pink-600 text-white font-semibold px-8 py-3 rounded-full transition-all duration-300 shadow-lg hover:shadow-xl"
            >
              Ver Todo
            </Link>
          </motion.div>

          {productsLoading ? (
            <div className="flex justify-center py-20">
              <div className="w-8 h-8 border-4 border-rose-500 border-t-transparent rounded-full animate-spin"></div>
            </div>
          ) : featuredProducts.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {featuredProducts.map((product, index) => (
                <motion.div
                  key={product._id}
                  className="group relative bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden"
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  viewport={{ once: true }}
                >
                  <div className="relative h-64 overflow-hidden">
                    {product.images && product.images.length > 0 ? (
                      <img
                        src={product.images[0].url}
                        alt={product.name}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-rose-100 to-pink-200 flex items-center justify-center">
                        <ShoppingBag size={48} className="text-rose-400" />
                      </div>
                    )}
                    
                    <div className="absolute top-4 left-4 bg-gradient-to-r from-yellow-400 to-orange-400 text-white text-xs font-bold px-3 py-1 rounded-full">
                      Popular
                    </div>
                    
                    {product.images && product.images.length > 1 && (
                      <div className="absolute top-4 right-4 bg-black/70 backdrop-blur-sm rounded-full px-2 py-1">
                        <span className="text-white text-xs font-medium">+{product.images.length - 1}</span>
                      </div>
                    )}
                  </div>
                  
                  <div className="p-6">
                    <div className="flex items-start justify-between mb-3">
                      <h3 className="font-bold text-lg text-gray-800 line-clamp-1 flex-1">
                        {product.name}
                      </h3>
                      <div className="flex items-center gap-1 ml-2">
                        <Star size={16} className="text-yellow-400 fill-current" />
                        <span className="text-sm text-gray-600 font-medium">4.9</span>
                      </div>
                    </div>
                    
                    <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                      {product.description || 'Producto de belleza premium para realzar tu belleza natural'}
                    </p>
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="text-2xl font-bold text-rose-500">
                          ${product.price?.toLocaleString()}
                        </span>
                        <span className="text-sm text-gray-500 block">Precio especial</span>
                      </div>
                      <button className="bg-gradient-to-r from-rose-500 to-pink-500 hover:from-rose-600 hover:to-pink-600 text-white font-semibold px-6 py-2 rounded-xl transition-all duration-300 shadow-lg hover:shadow-rose-500/25">
                        Agregar
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            <motion.div 
              className="text-center py-20"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
            >
              <div className="w-24 h-24 bg-gradient-to-br from-rose-100 to-pink-200 rounded-3xl flex items-center justify-center mx-auto mb-6">
                <ShoppingBag size={48} className="text-rose-400" />
              </div>
              <h3 className="text-2xl font-bold text-gray-800 mb-2">¡Próximamente!</h3>
              <p className="text-gray-600">Estamos preparando productos increíbles para ti</p>
            </motion.div>
          )}

          <motion.div
            className="text-center mt-16 md:hidden"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <Link
              to="/products"
              className="inline-flex items-center gap-2 bg-gradient-to-r from-rose-500 to-pink-500 hover:from-rose-600 hover:to-pink-600 text-white font-semibold px-8 py-3 rounded-full transition-all duration-300 shadow-lg hover:shadow-xl"
            >
              Ver Todos los Productos
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Servicios Destacados */}
      <section className="py-20 px-6 bg-white/50">
        <div className="container mx-auto max-w-7xl">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl font-bold text-gray-800 mb-4">
              Servicios Profesionales
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Relájate y déjanos consentirte con nuestros servicios de belleza especializados
            </p>
          </motion.div>

          {servicesLoading ? (
            <div className="flex justify-center py-20">
              <div className="w-8 h-8 border-4 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
            </div>
          ) : featuredServices.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {featuredServices.map((service, index) => (
                <motion.div
                  key={service._id}
                  className="bg-white rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-300 overflow-hidden group"
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.2 }}
                  viewport={{ once: true }}
                >
                  <div className="relative h-56 overflow-hidden">
                    {service.images && service.images.length > 0 ? (
                      <img
                        src={service.images[0].url}
                        alt={service.name}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-purple-100 to-pink-200 flex items-center justify-center">
                        <Scissors size={48} className="text-purple-400" />
                      </div>
                    )}
                    
                    <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm rounded-full px-3 py-1 flex items-center gap-1">
                      <Clock size={14} className="text-rose-500" />
                      <span className="text-sm font-medium text-gray-700">
                        {formatDuration(service.duration)}
                      </span>
                    </div>
                  </div>
                  
                  <div className="p-6">
                    <h3 className="text-xl font-bold text-gray-800 mb-2">
                      {service.name}
                    </h3>
                    <p className="text-gray-600 mb-4 line-clamp-2">
                      {service.description || 'Servicio profesional de belleza diseñado especialmente para ti'}
                    </p>
                    <div className="flex items-center justify-between">
                      <span className="text-2xl font-bold text-rose-500">
                        ${service.price?.toLocaleString()}
                      </span>
                      <button className="bg-gradient-to-r from-rose-500 to-pink-500 hover:from-rose-600 hover:to-pink-600 text-white font-semibold px-6 py-2 rounded-full transition-all duration-300">
                        Reservar
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            <motion.div 
              className="text-center py-20"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
            >
              <div className="w-24 h-24 bg-gradient-to-br from-purple-100 to-pink-200 rounded-3xl flex items-center justify-center mx-auto mb-6">
                <Scissors size={48} className="text-purple-400" />
              </div>
              <h3 className="text-2xl font-bold text-gray-800 mb-2">¡Próximamente!</h3>
              <p className="text-gray-600">Estamos diseñando servicios únicos para ti</p>
            </motion.div>
          )}

          <motion.div
            className="text-center mt-12"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            viewport={{ once: true }}
          >
            <Link
              to="/services"
              className="inline-flex items-center gap-2 bg-purple-500 hover:bg-purple-600 text-white font-semibold px-8 py-3 rounded-full transition-all duration-300 shadow-lg hover:shadow-xl"
            >
              <Scissors size={20} />
              Ver Todos los Servicios
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Por qué elegirnos */}
      <section className="py-20 px-6">
        <div className="container mx-auto max-w-7xl">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl font-bold text-gray-800 mb-4">
              ¿Por qué elegirnos?
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Nos comprometemos a brindarte la mejor experiencia en belleza y bienestar
            </p>
          </motion.div>

         {[
          {
            title: "Calidad Premium",
            description:
              "Trabajamos únicamente con productos de las mejores marcas internacionales para garantizar resultados excepcionales",
            icon: "✨",
          },
          {
            title: "Profesionales Expertos",
            description:
              "Nuestro equipo cuenta con certificaciones internacionales y años de experiencia en el sector",
            icon: "👩‍💼",
          },
          {
            title: "Experiencia Personalizada",
            description:
              "Cada cliente es único. Diseñamos tratamientos y servicios adaptados a tus necesidades específicas",
            icon: "💖",
          },
        ].map((feature, index) => (
          <motion.div
            key={index}
            className="text-center p-8 bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: index * 0.2 }}
            viewport={{ once: true }}
          >
            <div className="text-4xl mb-4">{feature.icon}</div>
            <h3 className="text-xl font-semibold text-gray-800 mb-3">
              {feature.title}
            </h3>
            <p className="text-gray-600">{feature.description}</p>
          </motion.div>
        ))}

          </div>
        </section>
      
      <Footer />
    </div>
  );
}