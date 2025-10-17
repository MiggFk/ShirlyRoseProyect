import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaEnvelope, FaPhone, FaMapMarkerAlt, FaHome } from 'react-icons/fa';
import emailjs from '@emailjs/browser';
import Swal from 'sweetalert2';

export default function Contact() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      await emailjs.send(
        'service_f3yf1bn', // Quita el espacio extra después del ID
        'template_x7up5jh',
        {
          from_name: formData.name,
          from_email: formData.email,
          subject: formData.subject,
          message: formData.message
        },
        'uN98lJSpwNdwhgyV_'
      );

      Swal.fire({
        icon: 'success',
        title: '¡Mensaje enviado!',
        text: 'Nos pondremos en contacto contigo pronto.',
        iconColor: '#fb7185',
        confirmButtonColor: '#fb7185'
      });

      setFormData({
        name: '',
        email: '',
        subject: '',
        message: ''
      });

    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'No se pudo enviar el mensaje. Por favor, intenta nuevamente.',
        iconColor: '#fb7185',
        confirmButtonColor: '#fb7185'
      });
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="min-h-screen py-12 px-4 sm:px-6 lg:px-8 bg-rose-50 relative"
    >
      {/* Botón Home */}
      <motion.button
        onClick={() => navigate('/')}
    
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
      >
        <FaHome className="text-4xl text-rose-500" />
      </motion.button>

      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-rose-500 mb-4">Contáctanos</h1>
          <p className="text-gray-600">Estamos aquí para ayudarte. ¡Envíanos un mensaje!</p>
        </div>

        {/* Info Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <InfoCard 
            icon={<FaEnvelope />}
            title="Email"
            content="noreply.shirlyrose@gmail.com"
          />
          <InfoCard 
            icon={<FaPhone />}
            title="Teléfono"
            content="+57 310 831 7548"
          />
          <InfoCard 
            icon={<FaMapMarkerAlt />}
            title="Ubicación"
            content="cr23 #10-19 Caucasia - Antioquia"
          />
        </div>

        {/* Contact Form */}
        <motion.form
          onSubmit={handleSubmit}
          className="bg-white rounded-xl shadow-lg p-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-gray-700 mb-2">Nombre</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500"
              />
            </div>
            <div>
              <label className="block text-gray-700 mb-2">Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500"
              />
            </div>
          </div>

          <div className="mt-6">
            <label className="block text-gray-700 mb-2">Asunto</label>
            <input
              type="text"
              name="subject"
              value={formData.subject}
              onChange={handleChange}
              required
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500"
            />
          </div>

          <div className="mt-6">
            <label className="block text-gray-700 mb-2">Mensaje</label>
            <textarea
              name="message"
              value={formData.message}
              onChange={handleChange}
              required
              rows="6"
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500"
            ></textarea>
          </div>

          <div className="mt-6">
            <button
              type="submit"
              className="w-full bg-rose-500 text-white py-3 px-6 rounded-lg hover:bg-rose-600 transition-colors duration-300"
            >
              Enviar Mensaje
            </button>
          </div>
        </motion.form>
      </div>
    </motion.div>
  );
}

const InfoCard = ({ icon, title, content }) => (
  <motion.div
    whileHover={{ y: -5 }}
    className="bg-white p-6 rounded-xl shadow-md text-center"
  >
    <div className="text-3xl text-rose-500 mb-4 flex justify-center">
      {icon}
    </div>
    <h3 className="text-lg font-semibold text-gray-800 mb-2">{title}</h3>
    <p className="text-gray-600">{content}</p>
  </motion.div>
);