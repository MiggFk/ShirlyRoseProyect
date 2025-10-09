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
  Settings,
  ArrowRight,
  Sparkles,
  Heart,
  Award,
  Users,
  TrendingUp
} from "lucide-react";

export default function IndexHome() {
  const { products, loading: productsLoading } = usePublicProducts();
  const { services, loading: servicesLoading } = usePublicServices();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const userData = localStorage.getItem("user");
    if (userData) {
      setUser(JSON.parse(userData));
    }
  }, []);

  const featuredProducts = products.slice(0, 6);
  const featuredServices = services.slice(0, 4);

  const formatDuration = (duration) => {
    const durationMap = {
      '30_min': '30m', '45_min': '45m', '1_hora': '1h',
      '1_hora_30_min': '1h 30m', '2_horas': '2h', '2_horas_30_min': '2h 30m',
      '3_horas': '3h', '3_horas_30_min': '3h 30m', '4_horas': '4h', 'mas_4_horas': '+4h'
    };
    return durationMap[duration] || duration;
  };

  return (
    <div className="min-h-screen">
      <SideBarPublic />
      
      {/* Hero Section Rediseñado */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-rose-600 via-pink-600 to-purple-700">
        {/* Decorative elements */}
        <div className="absolute inset-0">
          <div className="absolute top-20 left-10 w-72 h-72 bg-white/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-pink-300/20 rounded-full blur-3xl"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-purple-300/10 rounded-full blur-3xl"></div>
        </div>
        
        <div className="relative z-10 text-center max-w-6xl mx-auto px-6">
          <motion.div
            className="mb-6"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1 }}
          >
            <Sparkles className="text-yellow-300 w-16 h-16 mx-auto mb-4" />
          </motion.div>

          <motion.h1
            className="text-6xl md:text-8xl font-black mb-8 text-white leading-none"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            Shirly
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-yellow-200 to-pink-200">
              Rose
            </span>
          </motion.h1>

          <motion.p
            className="text-xl md:text-3xl text-pink-100 mb-12 font-light max-w-4xl mx-auto"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            Tu destino de belleza donde los sueños se vuelven realidad ✨
          </motion.p>

          {/* User Status */}
          {user ? (
            <motion.div
              className="mb-8 p-6 bg-white/20 backdrop-blur-lg rounded-3xl border border-white/30 max-w-md mx-auto"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
            >
              <p className="text-pink-100 mb-2">¡Hola de nuevo!</p>
              <p className="text-2xl font-bold text-white mb-4">{user.name} 👑</p>
              <div className="flex gap-3 justify-center">
                <Link
                  to="/profile"
                  className="flex items-center gap-2 bg-gradient-to-r from-pink-400 to-rose-400 hover:from-pink-500 hover:to-rose-500 text-white font-semibold px-6 py-3 rounded-2xl transition-all duration-300 shadow-lg"
                >
                  <User size={18} />
                  Mi Perfil
                </Link>
                {user.role === 'admin' && (
                  <Link
                    to="/dashboard"
                    className="flex items-center gap-2 bg-gradient-to-r from-purple-400 to-indigo-400 hover:from-purple-500 hover:to-indigo-500 text-white font-semibold px-6 py-3 rounded-2xl transition-all duration-300 shadow-lg"
                  >
                    <Settings size={18} />
                    Dashboard
                  </Link>
                )}
              </div>
            </motion.div>
          ) : (
            <motion.div
              className="flex flex-col sm:flex-row gap-6 justify-center mb-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
            >
              <Link
                to="/login"
                className="group relative bg-white text-rose-600 font-bold px-10 py-4 rounded-2xl transition-all duration-300 text-lg shadow-2xl hover:shadow-pink-500/25 hover:scale-105"
              >
                <span className="relative z-10">Iniciar Sesión</span>
                <div className="absolute inset-0 bg-gradient-to-r from-pink-50 to-rose-50 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </Link>
              <Link
                to="/register"
                className="group relative bg-gradient-to-r from-yellow-400 to-pink-400 hover:from-yellow-500 hover:to-pink-500 text-white font-bold px-10 py-4 rounded-2xl transition-all duration-300 text-lg shadow-2xl hover:shadow-yellow-500/25 hover:scale-105"
              >
                <span className="relative z-10">Crear Cuenta</span>
              </Link>
            </motion.div>
          )}

          {/* Action Buttons */}
          <motion.div
            className="flex flex-col sm:flex-row gap-4 justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.8 }}
          >
            <Link
              to="/products"
              className="group flex items-center justify-center gap-3 bg-white/20 backdrop-blur-lg hover:bg-white/30 text-white font-semibold px-8 py-4 rounded-2xl transition-all duration-300 border border-white/30 hover:border-white/50"
            >
              <ShoppingBag size={20} />
              Explorar Productos
              <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link
              to="/services"
              className="group flex items-center justify-center gap-3 bg-white/20 backdrop-blur-lg hover:bg-white/30 text-white font-semibold px-8 py-4 rounded-2xl transition-all duration-300 border border-white/30 hover:border-white/50"
            >
              <Scissors size={20} />
              Ver Servicios
              <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
            </Link>
          </motion.div>
        </div>

        {/* Floating elements */}
        <motion.div
          className="absolute top-1/4 left-1/4 text-white/20"
          animate={{ 
            y: [0, -20, 0],
            rotate: [0, 5, -5, 0]
          }}
          transition={{ 
            duration: 6,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        >
          <Heart size={60} />
        </motion.div>
        <motion.div
          className="absolute bottom-1/4 right-1/4 text-white/20"
          animate={{ 
            y: [0, 20, 0],
            rotate: [0, -5, 5, 0]
          }}
          transition={{ 
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        >
          <Sparkles size={40} />
        </motion.div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-gradient-to-r from-rose-50 to-pink-50">
        <div className="container mx-auto max-w-6xl px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { icon: Users, number: "500+", label: "Clientas Felices" },
              { icon: Award, number: "50+", label: "Productos Premium" },
              { icon: Scissors, number: "20+", label: "Servicios Únicos" },
              { icon: TrendingUp, number: "98%", label: "Satisfacción" }
            ].map((stat, index) => (
              <motion.div
                key={index}
                className="text-center"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <div className="w-16 h-16 bg-gradient-to-br from-rose-400 to-pink-400 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                  <stat.icon className="text-white" size={28} />
                </div>
                <div className="text-3xl font-black text-gray-800 mb-2">{stat.number}</div>
                <div className="text-gray-600 font-medium">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Products Section Rediseñado */}
      <section className="py-24 bg-white">
        <div className="container mx-auto max-w-7xl px-6">
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
              className="hidden md:flex items-center gap-2 bg-gradient-to-r from-rose-500 to-pink-500 hover:from-rose-600 hover:to-pink-600 text-white font-bold px-8 py-4 rounded-2xl transition-all duration-300 shadow-xl hover:shadow-rose-500/25"
            >
              Ver Todo
              <ArrowRight size={20} />
            </Link>
          </motion.div>

          {productsLoading ? (
            <div className="flex justify-center py-20">
              <div className="w-12 h-12 border-4 border-rose-500 border-t-transparent rounded-full animate-spin"></div>
            </div>
          ) : featuredProducts.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {featuredProducts.map((product, index) => (
                <motion.div
                  key={product._id}
                  className="group relative bg-white rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-500 overflow-hidden border border-gray-100"
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  whileHover={{ y: -10 }}
                >
                  <div className="relative h-64 overflow-hidden">
                    {product.images && product.images.length > 0 ? (
                      <img
                        src={product.images[0].url}
                        alt={product.name}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-rose-100 to-pink-200 flex items-center justify-center">
                        <ShoppingBag size={48} className="text-rose-400" />
                      </div>
                    )}
                    
                    {/* Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <div className="absolute bottom-4 left-4 right-4">
                        <button className="w-full bg-white/90 backdrop-blur-sm text-gray-800 font-semibold py-3 rounded-xl hover:bg-white transition-colors">
                          Ver Detalles
                        </button>
                      </div>
                    </div>

                    {/* Badge */}
                    <div className="absolute top-4 left-4 bg-gradient-to-r from-yellow-400 to-orange-400 text-white text-xs font-bold px-3 py-1 rounded-full">
                      Popular
                    </div>
                    
                    {/* Multiple images indicator */}
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
                        <span className="text-2xl font-black text-rose-500">
                          ${product.price?.toLocaleString()}
                        </span>
                        <span className="text-sm text-gray-500 block">Precio especial</span>
                      </div>
                      <button className="bg-gradient-to-r from-rose-500 to-pink-500 hover:from-rose-600 hover:to-pink-600 text-white font-semibold px-6 py-3 rounded-xl transition-all duration-300 shadow-lg hover:shadow-rose-500/25">
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
              className="inline-flex items-center gap-2 bg-gradient-to-r from-rose-500 to-pink-500 hover:from-rose-600 hover:to-pink-600 text-white font-bold px-8 py-4 rounded-2xl transition-all duration-300 shadow-xl"
            >
              Ver Todos los Productos
              <ArrowRight size={20} />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Services Section Rediseñado */}
      <section className="py-24 bg-gradient-to-br from-purple-50 via-pink-50 to-rose-50">
        <div className="container mx-auto max-w-7xl px-6">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-5xl font-black text-gray-800 mb-6">
              Servicios de
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-purple-500 to-pink-500">
                Lujo
              </span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Experiencias únicas diseñadas para consentirte y realzar tu belleza
            </p>
          </motion.div>

          {servicesLoading ? (
            <div className="flex justify-center py-20">
              <div className="w-12 h-12 border-4 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
            </div>
          ) : featuredServices.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {featuredServices.map((service, index) => (
                <motion.div
                  key={service._id}
                  className="group relative bg-white rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-500 overflow-hidden"
                  initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.8, delay: index * 0.2 }}
                  viewport={{ once: true }}
                  whileHover={{ scale: 1.02 }}
                >
                  <div className="relative h-72 overflow-hidden">
                    {service.images && service.images.length > 0 ? (
                      <img
                        src={service.images[0].url}
                        alt={service.name}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-purple-100 to-pink-200 flex items-center justify-center">
                        <Scissors size={64} className="text-purple-400" />
                      </div>
                    )}
                    
                    {/* Overlay with details */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent">
                      <div className="absolute bottom-6 left-6 right-6">
                        <div className="flex items-center gap-3 mb-3">
                          <div className="bg-white/20 backdrop-blur-sm rounded-full px-3 py-1 flex items-center gap-2">
                            <Clock size={14} className="text-white" />
                            <span className="text-white text-sm font-medium">
                              {formatDuration(service.duration)}
                            </span>
                          </div>
                          <div className="bg-gradient-to-r from-yellow-400 to-orange-400 rounded-full px-3 py-1">
                            <span className="text-white text-sm font-bold">Premium</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="p-8">
                    <h3 className="text-2xl font-bold text-gray-800 mb-3">
                      {service.name}
                    </h3>
                    <p className="text-gray-600 mb-6 line-clamp-2 leading-relaxed">
                      {service.description || 'Servicio profesional de belleza diseñado especialmente para ti'}
                    </p>
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="text-3xl font-black text-purple-500">
                          ${service.price?.toLocaleString()}
                        </span>
                        <span className="text-gray-500 text-sm block">Por sesión</span>
                      </div>
                      <button className="group bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-bold px-8 py-4 rounded-2xl transition-all duration-300 shadow-xl hover:shadow-purple-500/25">
                        Reservar
                        <ArrowRight size={18} className="inline ml-2 group-hover:translate-x-1 transition-transform" />
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
            className="text-center mt-16"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <Link
              to="/services"
              className="inline-flex items-center gap-2 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-bold px-8 py-4 rounded-2xl transition-all duration-300 shadow-xl"
            >
              Ver Todos los Servicios
              <ArrowRight size={20} />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Why Choose Us - Rediseñado */}
      <section className="py-24 bg-white">
        <div className="container mx-auto max-w-7xl px-6">
          <motion.div
            className="text-center mb-20"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-5xl font-black text-gray-800 mb-6">
              ¿Por qué
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-rose-500 to-purple-500">
                Shirly Rose?
              </span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Somos más que un salón de belleza, somos tu aliado en el camino hacia la confianza y el bienestar
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
        {[
          {
            title: "Calidad Premium",
            description: "Trabajamos únicamente con productos de las mejores marcas internacionales para garantizar resultados excepcionales",
            icon: Award,
            color: "from-yellow-400 to-orange-400"
          },
          {
            title: "Profesionales Expertos",
            description: "Nuestro equipo cuenta con certificaciones internacionales y años de experiencia en el sector",
            icon: Users,
            color: "from-rose-400 to-pink-400"
          },
          {
            title: "Experiencia Personalizada",
            description: "Cada cliente es único. Diseñamos tratamientos y servicios adaptados a tus necesidades específicas",
            icon: Heart,
            color: "from-purple-400 to-indigo-400"
          }
        ].map((feature, index) => (
          <motion.div
            key={index}
            className="relative group"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: index * 0.2 }}
            viewport={{ once: true }}
          >
            <div className="bg-white rounded-3xl p-8 shadow-lg hover:shadow-2xl transition-all duration-500 border border-gray-100 group-hover:-translate-y-2">
              <div className={`w-20 h-20 bg-gradient-to-r ${feature.color} rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                <feature.icon className="text-white" size={36} />
              </div>
              <h3 className="text-2xl font-bold text-gray-800 mb-4 text-center">
                {feature.title}
              </h3>
              <p className="text-gray-600 text-center leading-relaxed">
                {feature.description}
              </p>
            </div>
          </motion.div>
        ))}
    </div>

              <Footer />
            </div>
          </section>
        </div>
      );
    }