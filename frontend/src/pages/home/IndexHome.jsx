  import React, { useState, useEffect } from "react";
  import { motion } from "framer-motion";
  import { Link } from "react-router-dom";
  import Footer from "../../components/Footer";
  import LogoShirly from "../../components/LogoShirly";
  import { usePublicProducts } from "../../hooks/usePublicProducts";
  import { usePublicServices } from "../../hooks/usePublicServices";
  import { 
    ShoppingBag, 
    Scissors, 
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

    return (
      <div className="min-h-screen bg-gradient-to-br from-rose-50 via-pink-50 to-purple-50">
        {/* Header Mejorado */}
        <motion.header
          className="flex justify-between items-center px-6 py-4 shadow-md bg-white sticky top-0 z-50"
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1, transition: { duration: 0.5 } }}
        >
          {/* Logo + nombre */}
          <div className="flex items-center gap-2">
            <Link to="/" className="flex items-center gap-2">
              <LogoShirly size="h-12 w-12" />
              <h1 className="text-2xl font-medium text-gray-700">Shirly Rose</h1>
            </Link>
          </div>

          {/* Navegación header */}
          <nav className="hidden md:flex gap-6">
            <Link to="/services" className="text-gray-700 hover:text-rose-500 font-medium transition">
              Servicios
            </Link>
            <Link to="/products" className="text-gray-700 hover:text-rose-500 font-medium transition">
              Productos
            </Link>
            <Link to="/about" className="text-gray-700 hover:text-rose-500 font-medium transition">
              Nosotros
            </Link>
            <Link to="/appointment" className="text-gray-700 hover:text-rose-500 font-medium transition">
              Agendar Cita
            </Link>
          </nav>

          {/* Botones dinámicos según estado de sesión */}
          <div className="flex items-center gap-3">
            {user ? (
              // Usuario logueado
              <>
                <div className="hidden md:flex items-center gap-2 text-gray-700">
                  <span className="text-sm">Hola,</span>
                  <span className="font-semibold text-rose-600">{user.name}</span>
                </div>
                <Link
                  to="/profile"
                  className="flex items-center gap-2 px-4 py-2 rounded-lg bg-rose-400 text-white font-medium shadow hover:bg-rose-500 transition"
                >
                  <User size={18} />
                  <span className="hidden sm:inline">Perfil</span>
                </Link>
                {user.role === 'admin' && (
                  <Link
                    to="/dashboard"
                    className="flex items-center gap-2 px-4 py-2 rounded-lg bg-rose-300 text-rose-800 font-bold shadow hover:bg-rose-500 hover:text-white transition"
                  >
                    <Settings size={18} />
                    <span className="hidden sm:inline">Dashboard</span>
                  </Link>
                )}
              </>
            ) : (
              // Usuario NO logueado
              <>
                <Link
                  to="/login"
                  className="px-4 py-2 rounded-lg text-sm bg-rose-400 text-white font-medium shadow hover:bg-rose-500 transition"
                >
                  Iniciar Sesión
                </Link>
                <Link
                  to="/register"
                  className="px-4 py-2 rounded-lg text-sm bg-rose-400 text-white font-medium shadow hover:bg-rose-500 transition"
                >
                  Registrarse
                </Link>
              </>
            )}
          </div>
        </motion.header>
        
        {/* Hero Section con imagen de fondo */}
        <motion.section
          className="relative w-full h-[100vh] flex items-center justify-start bg-cover bg-center"
          style={{
            backgroundImage: `url(${require("../../assets/images/Fondo-HOME.png")})`,
            backgroundPosition: "right center",
          }}
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0, transition: { duration: 0.8 } }}
        >
          {/* Capa semi-transparente para mejor legibilidad */}
          <div className="absolute inset-0 bg-gradient-to-r from-rose-100/50 via-rose-50/20 to-transparent"></div>

          {/* Contenido del Hero */}
          <div className="relative z-10 pl-10 md:pl-20 max-w-lg text-left">
            <motion.h2
              className="text-4xl md:text-6xl text-rose-400 mb-4 italic drop-shadow-md"
              style={{ fontFamily: "'Great Vibes', cursive" }}
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              Bienvenido a
            </motion.h2>
            <motion.h2
              className="text-4xl md:text-7xl font-extrabold text-rose-400 mb-4 italic drop-shadow-md"
              style={{ fontFamily: "'Great Vibes', cursive" }}
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
            >
              Shirly Rose...
            </motion.h2>
            <motion.p
              className="text-lg text-gray-700 max-w-md mb-8"
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              Relájate, cuida tu piel y luce espectacular con nuestros servicios
              de estética, spa y peluquería. Aquí podrás reservar tu cita
              fácilmente.
            </motion.p>
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.5 }}
            >
              <Link
                to="/appointment"
                className="inline-block px-8 py-3 rounded-xl bg-rose-400 text-white font-semibold shadow hover:bg-rose-500 transition duration-200"
              >
                Agenda tu cita
              </Link>
            </motion.div>
          </div>
        </motion.section>

        {/* Productos Destacados */}
        <section className="py-20 px-6 bg-rose-50">
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
                  <span className="block text-transparent bg-clip-text bg-rose-400">
                    Destacados
                  </span>
                </h2>
                <p className="text-xl text-gray-600">Descubre lo que está en tendencia</p>
              </div>
              <Link
                to="/products"
                className="hidden md:flex items-center gap-2 bg-rose-500 hover:bg-rose-400 hover:text-rose-700 text-white font-semibold px-8 py-3 rounded-full transition-all duration-300 shadow-lg hover:shadow-xl"
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
                        <div className="w-full h-full bg-rose-200 flex items-center justify-center">
                          <ShoppingBag size={48} className="text-rose-400" />
                        </div>
                      )}
                      
                      {product.images && product.images.length > 1 && (
                        <div className="absolute top-4 right-4 bg-black/70 backdrop-blur-sm rounded-full px-2 py-1">
                          <span className="text-white text-xs font-medium">+{product.images.length - 1}</span>
                        </div>
                      )}
                    </div>
                    
                    <div className="p-6">
                      <div className="mb-3">
                        <h3 className="font-bold text-lg text-gray-800 line-clamp-1">
                          {product.name}
                        </h3>
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
                        <button className="bg-rose-500 hover:bg-rose-600 text-white font-semibold px-6 py-2 rounded-xl transition-all duration-300 shadow-lg hover:shadow-rose-500/25">
                          Encargar
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
                <div className="w-24 h-24 bg-rose-200 rounded-3xl flex items-center justify-center mx-auto mb-6">
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
          <section className="py-20 px-6 bg-rose-100">
          <div className="container mx-auto max-w-7xl">
            <motion.div
            className="flex items-center justify-between mb-16 flex-row-reverse"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            >
  <div className="text-right">
    <h2 className="text-5xl font-black text-gray-800 mb-4">
      Servicios
      <span className="block text-transparent bg-clip-text bg-rose-400">
        Destacados
      </span>
    </h2>
    <p className="text-xl text-gray-600">
      Descubre los servicios más solicitados
    </p>
  </div>
  <Link
    to="/services"
    className="hidden md:flex items-center gap-2 bg-rose-500 hover:bg-rose-400 hover:text-rose-700 text-white font-semibold px-8 py-3 rounded-full transition-all duration-300 shadow-lg hover:shadow-xl"
  >
    Ver Todo
  </Link>
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
                        <div className="w-full h-full bg-purple-200 flex items-center justify-center">
                          <Scissors size={48} className="text-purple-400" />
                        </div>
                      )}
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
                        <button className="bg-rose-500 hover:bg-rose-700 text-white font-semibold px-6 py-2 rounded-full transition-all duration-300">
                          Agendar
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
                <div className="w-24 h-24 bg-purple-200 rounded-3xl flex items-center justify-center mx-auto mb-6">
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
                className="inline-flex items-center gap-2 bg-rose-400 hover:bg-rose-400 hover:text-rose-700 text-white font-semibold px-8 py-3 rounded-full transition-all duration-300 shadow-lg hover:shadow-xl"
              >
                <Scissors size={20} />
                Ver Todos los Servicios
              </Link>
            </motion.div>
          </div>
        </section>

        {/* Por qué elegirnos */}
        <section className="py-20 px-6 bg-rose-50">
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

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
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
          </div>
        </section>
        <Footer />
      </div>
    );
  }
