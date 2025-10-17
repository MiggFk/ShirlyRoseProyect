import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect, useRef } from "react";
import { useProfile } from "../../hooks/useProfile";
import { useNavigate } from "react-router-dom";
import Footer from "../../components/Footer";
import paloRosa from "../../assets/images/paloRosa.png";
import Swal from 'sweetalert2';
import {
  FaHome,
  FaCalendarAlt,
  FaClock,
  FaBars,
  FaSignOutAlt,
  FaUserCircle,
  FaEdit,
  FaCamera,
  FaTimes,
  FaArrowLeft,
  FaImages,
  FaTrash,
} from "react-icons/fa";

// COMPONENTE: Tarjeta de contenido
const ContentCard = ({ title, children }) => (
  <motion.div
    className="bg-white rounded-xl shadow-md p-6"
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5 }}
  >
    <h2 className="text-2xl font-bold text-rose-500 mb-4">{title}</h2>
    {children}
  </motion.div>
);

// COMPONENTE: Sidebar
const Sidebar = ({ isOpen, onClose, onLogout, user, setActiveTab }) => {
  const navigate = useNavigate();

  const getImageUrl = (profileImage) => {
    if (!profileImage) return null;
    if (typeof profileImage === 'string') return profileImage;
    if (profileImage.url) return profileImage.url;
    return null;
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-50 flex"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className="absolute inset-0 bg-black/50"
            onClick={onClose}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          />

          <motion.aside
            className="relative w-64 bg-white h-full shadow-xl"
            initial={{ x: -300 }}
            animate={{ x: 0 }}
            exit={{ x: -300 }}
            transition={{ type: "spring", damping: 20 }}
          >
            <button
              onClick={onClose}
              className="absolute top-4 right-4 p-2 hover:bg-rose-100 rounded-full transition"
            >
              <FaTimes className="w-6 h-6 text-rose-500" />
            </button>

            <div className="p-6 border-b border-rose-200">
              <div className="flex items-center gap-3">
                {getImageUrl(user?.profileImage) ? (
                  <img
                    src={getImageUrl(user.profileImage)}
                    alt="Perfil"
                    className="w-12 h-12 rounded-full object-cover"
                  />
                ) : (
                  <FaUserCircle className="w-12 h-12 text-rose-400" />
                )}
                <div>
                  <p className="font-bold text-gray-800">{user?.name}</p>
                  <p className="text-xs text-gray-500">{user?.email}</p>
                </div>
              </div>
            </div>

            <nav className="p-4 space-y-2">
              <button
                onClick={() => {
                  navigate("/");
                  onClose();
                }}
                className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-rose-100 transition text-gray-700"
              >
                <FaArrowLeft /> Volver al Inicio
              </button>
              <button
                onClick={() => {
                  setActiveTab("dashboard");
                  onClose();
                }}
                className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-rose-100 transition text-gray-700"
              >
                <FaHome /> Home
              </button>
              <button
                onClick={() => {
                  setActiveTab("edit");
                  onClose();
                }}
                className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-rose-100 transition text-gray-700"
              >
                <FaEdit /> Editar Perfil
              </button>
              <button
                onClick={() => {
                  setActiveTab("appointments");
                  onClose();
                }}
                className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-rose-100 transition text-gray-700"
              >
                <FaCalendarAlt /> Mis Citas
              </button>
              <button
                onClick={() => {
                  setActiveTab("history");
                  onClose();
                }}
                className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-rose-100 transition text-gray-700"
              >
                <FaClock /> Historial
              </button>
            </nav>

            <div className="absolute bottom-4 left-4 right-4">
              <button
                onClick={onLogout}
                className="w-full flex items-center justify-center gap-2 bg-rose-500 text-white py-2 rounded-lg hover:bg-rose-600 transition font-semibold"
              >
                <FaSignOutAlt /> Cerrar Sesión
              </button>
            </div>
          </motion.aside>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

// VISTA: Dashboard
const DashboardView = ({ user }) => {
  const getImageUrl = (profileImage) => {
    if (!profileImage) return null;
    if (typeof profileImage === 'string') return profileImage;
    if (profileImage.url) return profileImage.url;
    return null;
  };

  const calculateAge = (birthDate) => {
    if (!birthDate) return null;
    const today = new Date();
    const birth = new Date(birthDate);
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
      age--;
    }
    return age;
  };

  return (
    <motion.div
      className="grid md:grid-cols-2 gap-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <ContentCard title="Información Personal">
        <div className="space-y-3 text-gray-700">
          {user?.profileImage && (
            <div className="flex justify-center mb-4">
              <img
                src={getImageUrl(user.profileImage)}
                alt="Perfil"
                className="w-24 h-24 rounded-full object-cover border-4 border-rose-300"
              />
            </div>
          )}
          <div className="bg-rose-50 p-3 rounded-lg">
            <p className="text-sm text-gray-600">Nombre completo</p>
            <p className="font-semibold text-gray-800">{user?.name}</p>
          </div>
          
          <div className="bg-rose-50 p-3 rounded-lg">
            <p className="text-sm text-gray-600">Correo electrónico</p>
            <p className="font-semibold text-gray-800">{user?.email}</p>
          </div>
          
          <div className="bg-rose-50 p-3 rounded-lg">
            <p className="text-sm text-gray-600">Teléfono</p>
            <p className="font-semibold text-gray-800">
              {user?.phone || "No registrado"}
            </p>
          </div>

          {user?.birthDate && (
            <div className="bg-rose-50 p-3 rounded-lg">
              <p className="text-sm text-gray-600">Edad</p>
              <p className="font-semibold text-gray-800">
                {calculateAge(user.birthDate)} años
              </p>
            </div>
          )}
        </div>
      </ContentCard>

      <ContentCard title="Información Adicional">
        <div className="space-y-3 text-gray-700">
          <div className="bg-rose-50 p-3 rounded-lg">
            <p className="text-sm text-gray-600">Dirección</p>
            <p className="font-semibold text-gray-800">
              {user?.address?.street
                ? `${user.address.street}, ${user.address.city || ""}`
                : "No registrada"}
            </p>
          </div>

          {user?.address?.postalCode && (
            <div className="bg-rose-50 p-3 rounded-lg">
              <p className="text-sm text-gray-600">Código Postal</p>
              <p className="font-semibold text-gray-800">
                {user.address.postalCode}
              </p>
            </div>
          )}

          <div className="bg-rose-50 p-3 rounded-lg">
            <p className="text-sm text-gray-600">Miembro desde</p>
            <p className="font-semibold text-gray-800">
              {new Date(user?.createdAt || Date.now()).toLocaleDateString('es-ES', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}
            </p>
          </div>

          <div className="bg-rose-50 p-3 rounded-lg">
            <p className="text-sm text-gray-600">Estado de cuenta</p>
            <div className="flex items-center gap-2 mt-1">
              <span className="w-2 h-2 bg-green-500 rounded-full"></span>
              <p className="font-semibold text-green-600">Activa</p>
            </div>
          </div>
        </div>
      </ContentCard>
    </motion.div>
  );
};

// VISTA: Editar Perfil
const EditProfileView = ({ user, onUpdate, setActiveTab }) => {
  const getImageUrl = (profileImage) => {
    if (!profileImage) return null;
    if (typeof profileImage === 'string') return profileImage;
    if (profileImage.url) return profileImage.url;
    return null;
  };

  const [formData, setFormData] = useState({
    name: user?.name || "",
    email: user?.email || "",
    phone: user?.phone || "",
    street: user?.address?.street || "",
    city: user?.address?.city || "",
    postalCode: user?.address?.postalCode || "",
    birthDate: user?.birthDate
      ? new Date(user.birthDate).toISOString().split("T")[0]
      : "",
  });

  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(getImageUrl(user?.profileImage));
  const [loading, setLoading] = useState(false);
  const [showImageModal, setShowImageModal] = useState(false);
  const [showCameraModal, setShowCameraModal] = useState(false);
  const [stream, setStream] = useState(null);
  const videoRef = useState(null);

  useEffect(() => {
    setImagePreview(getImageUrl(user?.profileImage));
  }, [user?.profileImage]);

  useEffect(() => {
    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, [stream]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const processImageFile = (file) => {
    if (file.size > 5 * 1024 * 1024) {
      Swal.fire('Error', 'La imagen no debe superar los 5MB', 'error');
      return;
    }

    if (!file.type.startsWith('image/')) {
      Swal.fire('Error', 'Solo se permiten archivos de imagen', 'error');
      return;
    }

    setImageFile(file);
    
    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result);
    };
    reader.readAsDataURL(file);
    setShowImageModal(false);
  };

  const handleTakePhoto = async () => {
    setShowImageModal(false);
    setShowCameraModal(true);

    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: { 
          facingMode: 'user',
          width: { ideal: 1280 },
          height: { ideal: 720 }
        }
      });

      setStream(mediaStream);

      setTimeout(() => {
        if (videoRef.current) {
          videoRef.current.srcObject = mediaStream;
        }
      }, 100);

    } catch (error) {
      console.error('Error al acceder a la cámara:', error);
      setShowCameraModal(false);
      
      Swal.fire({
        icon: 'error',
        title: 'Error de cámara',
        text: 'No se pudo acceder a la cámara. Verifica los permisos del navegador.',
      });
    }
  };

  const capturePhoto = () => {
    if (!videoRef.current) return;

    const canvas = document.createElement('canvas');
    canvas.width = videoRef.current.videoWidth;
    canvas.height = videoRef.current.videoHeight;

    const context = canvas.getContext('2d');
    context.drawImage(videoRef.current, 0, 0);

    canvas.toBlob((blob) => {
      if (!blob) return;

      const file = new File([blob], `foto-perfil-${Date.now()}.jpg`, {
        type: 'image/jpeg'
      });

      processImageFile(file);
      closeCameraModal();
    }, 'image/jpeg', 0.95);
  };

  const closeCameraModal = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
    }
    setShowCameraModal(false);
  };

  const switchCamera = async () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
    }

    try {
      const currentFacingMode = stream?.getVideoTracks()[0].getSettings().facingMode;
      const newFacingMode = currentFacingMode === 'user' ? 'environment' : 'user';

      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: { 
          facingMode: newFacingMode,
          width: { ideal: 1280 },
          height: { ideal: 720 }
        }
      });

      setStream(mediaStream);
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
    } catch (error) {
      console.error('Error al cambiar cámara:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const profileData = {
      name: formData.name,
      email: formData.email,
      phone: formData.phone,
      address: {
        street: formData.street,
        city: formData.city,
        postalCode: formData.postalCode,
      },
      birthDate: formData.birthDate,
    };

    const success = await onUpdate(profileData, imageFile);

    if (success) {
      setImageFile(null);
      setTimeout(() => {
        setActiveTab('dashboard');
      }, 1500);
    }

    setLoading(false);
  };

  const handleDeletePhoto = async () => {
    const result = await Swal.fire({
      title: '¿Eliminar foto de perfil?',
      text: 'Esta acción no se puede deshacer',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#f43f5e',
      cancelButtonColor: '#6b7280',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar'
    });

    if (result.isConfirmed) {
      setLoading(true);
      setShowImageModal(false);
      
      const profileData = {
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        address: {
          street: formData.street,
          city: formData.city,
          postalCode: formData.postalCode,
        },
        birthDate: formData.birthDate,
        removeProfileImage: true
      };
      
      const success = await onUpdate(profileData, null);
      
      if (success) {
        setImageFile(null);
        setImagePreview(null);
        setTimeout(() => {
          setActiveTab('dashboard');
        }, 1500);
      }
      
      setLoading(false);
    }
  };

  const handleSelectFromGallery = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    
    input.onchange = (e) => {
      const file = e.target.files[0];
      if (file) {
        processImageFile(file);
      }
    };
    
    input.click();
  };

  const hasChanges = () => {
    const dataChanged = 
      formData.name !== (user?.name || "") ||
      formData.email !== (user?.email || "") ||
      formData.phone !== (user?.phone || "") ||
      formData.street !== (user?.address?.street || "") ||
      formData.city !== (user?.address?.city || "") ||
      formData.postalCode !== (user?.address?.postalCode || "") ||
      formData.birthDate !== (user?.birthDate ? new Date(user.birthDate).toISOString().split("T")[0] : "");
    
    return dataChanged || imageFile !== null;
  };

  return (
    <ContentCard title="Editar Información Personal">
      <div className="space-y-4">
        <AnimatePresence>
          {showCameraModal && (
            <motion.div
              className="fixed inset-0 z-50 flex items-center justify-center p-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <motion.div
                className="absolute inset-0 bg-black/90"
                onClick={closeCameraModal}
              />
              
              <motion.div
                className="relative bg-black rounded-2xl overflow-hidden max-w-2xl w-full shadow-2xl z-10"
                initial={{ scale: 0.9 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0.9 }}
              >
                <button
                  onClick={closeCameraModal}
                  className="absolute top-4 right-4 z-20 p-2 bg-white/20 hover:bg-white/30 rounded-full transition backdrop-blur"
                >
                  <FaTimes className="w-6 h-6 text-white" />
                </button>

                <video
                  ref={(ref) => { videoRef.current = ref; }}
                  autoPlay
                  playsInline
                  className="w-full h-auto"
                />

                <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/80 to-transparent">
                  <div className="flex items-center justify-center gap-4">
                    <button
                      onClick={switchCamera}
                      className="p-4 bg-white/20 hover:bg-white/30 rounded-full transition backdrop-blur text-white"
                      title="Cambiar cámara"
                    >
                      <FaCamera className="w-6 h-6" />
                    </button>

                    <button
                      onClick={capturePhoto}
                      className="p-6 bg-rose-500 hover:bg-rose-600 rounded-full transition shadow-lg transform hover:scale-110"
                      title="Tomar foto"
                    >
                      <div className="w-8 h-8 bg-white rounded-full" />
                    </button>

                    <button
                      onClick={closeCameraModal}
                      className="p-4 bg-white/20 hover:bg-white/30 rounded-full transition backdrop-blur text-white"
                      title="Cancelar"
                    >
                      <FaTimes className="w-6 h-6" />
                    </button>
                  </div>

                  <p className="text-center text-white text-sm mt-4">
                    Presiona el botón para capturar la foto
                  </p>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {showImageModal && (
            <motion.div
              className="fixed inset-0 z-50 flex items-center justify-center p-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <motion.div
                className="absolute inset-0 bg-black/50"
                onClick={() => setShowImageModal(false)}
              />
              
              <motion.div
                className="relative bg-white rounded-2xl p-6 max-w-sm w-full shadow-2xl z-10"
                initial={{ scale: 0.9, y: 20 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.9, y: 20 }}
              >
                <button
                  onClick={() => setShowImageModal(false)}
                  className="absolute top-4 right-4 p-2 hover:bg-gray-100 rounded-full transition"
                >
                  <FaTimes className="w-5 h-5 text-gray-600" />
                </button>

                <h3 className="text-2xl font-bold text-rose-500 mb-6">
                  Selecciona una opción
                </h3>

                <div className="space-y-3">
                  <button
                    onClick={handleTakePhoto}
                    className="w-full flex items-center gap-4 p-4 bg-rose-50 hover:bg-rose-100 rounded-xl transition group"
                  >
                    <div className="bg-rose-500 p-3 rounded-full group-hover:scale-110 transition">
                      <FaCamera className="w-6 h-6 text-white" />
                    </div>
                    <div className="text-left">
                      <p className="font-semibold text-gray-800">Tomar Foto</p>
                      <p className="text-sm text-gray-600">Usa tu cámara</p>
                    </div>
                  </button>

                  <button
                    onClick={handleSelectFromGallery}
                    className="w-full flex items-center gap-4 p-4 bg-rose-50 hover:bg-rose-100 rounded-xl transition group"
                  >
                    <div className="bg-rose-500 p-3 rounded-full group-hover:scale-110 transition">
                      <FaImages className="w-6 h-6 text-white" />
                    </div>
                    <div className="text-left">
                      <p className="font-semibold text-gray-800">Seleccionar de Galería</p>
                      <p className="text-sm text-gray-600">Elige una foto existente</p>
                    </div>
                  </button>

                  {(imagePreview || user?.profileImage) && (
                    <button
                      onClick={handleDeletePhoto}
                      className="w-full flex items-center gap-4 p-4 bg-red-50 hover:bg-red-100 rounded-xl transition group"
                    >
                      <div className="bg-red-500 p-3 rounded-full group-hover:scale-110 transition">
                        <FaTrash className="w-6 h-6 text-white" />
                      </div>
                      <div className="text-left">
                        <p className="font-semibold text-gray-800">Eliminar Foto</p>
                        <p className="text-sm text-gray-600">Quitar foto de perfil</p>
                      </div>
                    </button>
                  )}
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="flex flex-col items-center mb-6">
          <div className="relative">
            <div className="w-32 h-32 rounded-full overflow-hidden bg-rose-200 flex items-center justify-center">
              {imagePreview ? (
                <img
                  src={imagePreview}
                  alt="Perfil"
                  className="w-full h-full object-cover"
                />
              ) : (
                <FaUserCircle className="w-20 h-20 text-rose-400" />
              )}
            </div>
            <button
              type="button"
              onClick={() => setShowImageModal(true)}
              className="absolute bottom-0 right-0 bg-rose-500 text-white p-3 rounded-full cursor-pointer hover:bg-rose-600 transition shadow-lg hover:scale-110"
            >
              <FaCamera className="w-5 h-5" />
            </button>
          </div>
          <p className="text-sm text-gray-500 mt-2">
            Haz clic en el ícono para cambiar tu foto (máx. 5MB)
          </p>
          {imageFile && (
            <p className="text-xs text-green-600 mt-1">
              ✓ Nueva imagen seleccionada: {imageFile.name}
            </p>
          )}
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              Nombre Completo
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-rose-200 rounded-lg focus:ring-2 focus:ring-rose-400 focus:outline-none"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              Teléfono
            </label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-rose-200 rounded-lg focus:ring-2 focus:ring-rose-400 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              Fecha de Nacimiento
            </label>
            <input
              type="date"
              name="birthDate"
              value={formData.birthDate}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-rose-200 rounded-lg focus:ring-2 focus:ring-rose-400 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              Ciudad
            </label>
            <input
              type="text"
              name="city"
              value={formData.city}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-rose-200 rounded-lg focus:ring-2 focus:ring-rose-400 focus:outline-none"
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              Dirección
            </label>
            <input
              type="text"
              name="street"
              value={formData.street}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-rose-200 rounded-lg focus:ring-2 focus:ring-rose-400 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              Código Postal
            </label>
            <input
              type="text"
              name="postalCode"
              value={formData.postalCode}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-rose-200 rounded-lg focus:ring-2 focus:ring-rose-400 focus:outline-none"
            />
          </div>
        </div>

        <div className="flex gap-4 pt-4">
          <button
            onClick={handleSubmit}
            disabled={loading || !hasChanges()}
            className={`flex-1 py-2 rounded-lg transition font-semibold ${
              loading || !hasChanges()
                ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                : "bg-rose-500 text-white hover:bg-rose-600"
            }`}
          >
            {loading ? "Guardando..." : "Guardar Cambios"}
          </button>
        </div>

        {!hasChanges() && !loading && (
          <p className="text-sm text-gray-500 text-center">
            No hay cambios para guardar
          </p>
        )}
      </div>
    </ContentCard>
  );
};

// VISTA: Mis Citas
const AppointmentsView = ({ appointments }) => {
  const upcomingAppointments = appointments.filter((apt) => {
    const appointmentDate = new Date(apt.dateTime || apt.date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    return appointmentDate >= today && apt.status !== "cancelled" && apt.status !== "completed";
  });

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('es-ES', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatTime = (dateString) => {
    return new Date(dateString).toLocaleTimeString('es-ES', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatDuration = (duration) => {
    if (!duration) return 'N/A';
    return duration.replace(/_/g, ' ').replace(/-/g, ' ');
  };

  const normalizeCategory = (category) => {
    if (!category) return 'Belleza';
    
    const cleanCategory = String(category).trim();
    
    const categoryMap = {
      'unas': 'Uñas',
      'uñas': 'Uñas',
      'nails': 'Uñas',
      'manicure': 'Uñas',
      'pedicure': 'Uñas',
      'manicure_pedicure': 'Uñas',
      'manicure y pedicure': 'Uñas',
      
      'pestañas': 'Pestañas',
      'pestanas': 'Pestañas',
      'lashes': 'Pestañas',
      'extensiones': 'Pestañas',
      
      'cejas': 'Cejas',
      'brows': 'Cejas',
      
      'faciales': 'Faciales',
      'facial': 'Faciales',
      'piel': 'Faciales',
      'skin': 'Faciales',
      
      'depilacion': 'Depilación',
      'depilación': 'Depilación',
      'waxing': 'Depilación',
      
      'corporales': 'Corporales',
      'masaje': 'Corporales',
      'massage': 'Corporales'
    };
    
    const normalized = categoryMap[cleanCategory.toLowerCase()];
    if (normalized) return normalized;
    
    return cleanCategory.charAt(0).toUpperCase() + cleanCategory.slice(1);
  };

  const getServiceCategory = (appointment) => {
    const category = appointment.serviceId?.category || 
                    appointment.service?.category || 
                    appointment.category;
    
    return normalizeCategory(category);
  };

  console.log('🔍 Appointments con categorías:', appointments.map(apt => ({
    name: apt.serviceId?.name || apt.service?.name,
    category: apt.serviceId?.category || apt.service?.category,
    normalized: getServiceCategory(apt)
  })));

  if (!appointments || appointments.length === 0) {
    return (
      <ContentCard title="Mis Citas">
        <div className="text-center py-8">
          <FaCalendarAlt className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500 text-lg">No tienes citas registradas</p>
          <p className="text-gray-400 text-sm mt-2">
            Agenda una cita desde la página principal
          </p>
        </div>
      </ContentCard>
    );
  }

  if (upcomingAppointments.length === 0) {
    return (
      <ContentCard title="Mis Citas Próximas">
        <div className="text-center py-8">
          <FaCalendarAlt className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500 text-lg">No tienes citas próximas</p>
          <p className="text-gray-400 text-sm mt-2">
            Todas tus citas están en el historial
          </p>
        </div>
      </ContentCard>
    );
  }

  return (
    <ContentCard title="Mis Citas Próximas">
      <div className="space-y-4">
        {upcomingAppointments.map((appointment) => (
          <motion.div
            key={appointment._id}
            className="border border-rose-200 rounded-xl p-4 hover:shadow-md transition"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="flex justify-between items-start mb-2">
              <div>
                <h3 className="font-bold text-lg text-gray-800">
                  {appointment.serviceId?.name || appointment.service?.name || "Servicio"}
                </h3>
                <p className="text-sm text-gray-500">
                  {getServiceCategory(appointment)}
                </p>
              </div>
              <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                appointment.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                appointment.status === 'confirmed' ? 'bg-green-100 text-green-700' :
                'bg-gray-100 text-gray-700'
              }`}>
                {appointment.status === 'pending' ? 'Pendiente' :
                 appointment.status === 'confirmed' ? 'Confirmada' : 
                 appointment.status || 'Sin estado'}
              </span>
            </div>

            <div className="space-y-2 text-sm text-gray-600">
              <div className="flex items-center gap-2">
                <FaCalendarAlt className="text-rose-400" />
                <span>{formatDate(appointment.dateTime || appointment.date)}</span>
              </div>
              <div className="flex items-center gap-2">
                <FaClock className="text-rose-400" />
                <span>{formatTime(appointment.dateTime || appointment.date) || appointment.time || 'Hora no especificada'}</span>
              </div>
              {(appointment.serviceId?.price || appointment.service?.price) && (
                <div className="mt-3 pt-3 border-t border-rose-100">
                  <span className="font-semibold text-rose-500">
                    ${(appointment.serviceId?.price || appointment.service?.price).toLocaleString()}
                  </span>
                  {(appointment.serviceId?.duration || appointment.service?.duration) && (
                    <span className="text-gray-500">
                      {' '}- Duración: {formatDuration(appointment.serviceId?.duration || appointment.service?.duration)}
                    </span>
                  )}
                </div>
              )}
            </div>
          </motion.div>
        ))}
      </div>
    </ContentCard>
  );
};

// VISTA: Historial
const HistoryView = ({ appointments }) => {
  const pastAppointments = appointments.filter((apt) => {
    const appointmentDate = new Date(apt.dateTime || apt.date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    return appointmentDate < today || apt.status === "cancelled" || apt.status === "completed";
  });

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatTime = (dateString) => {
    return new Date(dateString).toLocaleTimeString('es-ES', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatDuration = (duration) => {
    if (!duration) return 'N/A';
    return duration.replace(/_/g, ' ').replace(/-/g, ' ');
  };

  const normalizeCategory = (category) => {
    if (!category) return 'Belleza';
    
    const cleanCategory = String(category).trim();
    
    const categoryMap = {
      'unas': 'Uñas',
      'uñas': 'Uñas',
      'nails': 'Uñas',
      'manicure': 'Uñas',
      'pedicure': 'Uñas',
      'manicure_pedicure': 'Uñas',
      'manicure y pedicure': 'Uñas',
      
      'pestañas': 'Pestañas',
      'pestanas': 'Pestañas',
      'lashes': 'Pestañas',
      'extensiones': 'Pestañas',
      
      'cejas': 'Cejas',
      'brows': 'Cejas',
      
      'faciales': 'Faciales',
      'facial': 'Faciales',
      'piel': 'Faciales',
      'skin': 'Faciales',
      
      'depilacion': 'Depilación',
      'depilación': 'Depilación',
      'waxing': 'Depilación',
      
      'corporales': 'Corporales',
      'masaje': 'Corporales',
      'massage': 'Corporales'
    };
    
    const normalized = categoryMap[cleanCategory.toLowerCase()];
    if (normalized) return normalized;
    
    return cleanCategory.charAt(0).toUpperCase() + cleanCategory.slice(1);
  };

  const getServiceCategory = (appointment) => {
    const category = appointment.serviceId?.category || 
                    appointment.service?.category || 
                    appointment.category;
    
    return normalizeCategory(category);
  };

  if (!appointments || appointments.length === 0) {
    return (
      <ContentCard title="Historial de Citas">
        <div className="text-center py-8">
          <FaClock className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500 text-lg">No tienes citas registradas</p>
          <p className="text-gray-400 text-sm mt-2">
            Aquí aparecerán tus citas pasadas
          </p>
        </div>
      </ContentCard>
    );
  }

  if (pastAppointments.length === 0) {
    return (
      <ContentCard title="Historial de Citas">
        <div className="text-center py-8">
          <FaClock className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500 text-lg">No tienes historial de citas</p>
          <p className="text-gray-400 text-sm mt-2">
            Aquí aparecerán tus citas pasadas o canceladas
          </p>
        </div>
      </ContentCard>
    );
  }

  return (
    <ContentCard title="Historial de Citas">
      <div className="space-y-4">
        {pastAppointments.map((appointment) => (
          <motion.div
            key={appointment._id}
            className="border border-gray-200 rounded-xl p-4 bg-gray-50 hover:shadow-md transition"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="flex justify-between items-start mb-2">
              <div>
                <h3 className="font-bold text-lg text-gray-800">
                  {appointment.serviceId?.name || appointment.service?.name || "Servicio"}
                </h3>
                <p className="text-sm text-gray-500">
                  {getServiceCategory(appointment)}
                </p>
              </div>
              <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                appointment.status === 'completed' ? 'bg-blue-100 text-blue-700' :
                appointment.status === 'cancelled' ? 'bg-red-100 text-red-700' :
                'bg-gray-100 text-gray-700'
              }`}>
                {appointment.status === 'completed' ? 'Completada' :
                 appointment.status === 'cancelled' ? 'Cancelada' : 
                 appointment.status || 'Finalizada'}
              </span>
            </div>

            <div className="space-y-2 text-sm text-gray-600">
              <div className="flex items-center gap-2">
                <FaCalendarAlt className="text-gray-400" />
                <span>{formatDate(appointment.dateTime || appointment.date)}</span>
              </div>
              <div className="flex items-center gap-2">
                <FaClock className="text-gray-400" />
                <span>{formatTime(appointment.dateTime || appointment.date) || appointment.time || 'Hora no especificada'}</span>
              </div>
              {(appointment.serviceId?.price || appointment.service?.price) && (
                <div className="mt-3 pt-3 border-t border-gray-200">
                  <span className="font-semibold text-gray-600">
                    ${(appointment.serviceId?.price || appointment.service?.price).toLocaleString()}
                  </span>
                  {(appointment.serviceId?.duration || appointment.service?.duration) && (
                    <span className="text-gray-500 ml-2">
                      • {formatDuration(appointment.serviceId?.duration || appointment.service?.duration)}
                    </span>
                  )}
                </div>
              )}
            </div>
          </motion.div>
        ))}
      </div>
    </ContentCard>
  );
};

// COMPONENTE PRINCIPAL
const Profile = () => {
  const { user, appointments, loading, handleLogout, updateProfile } = useProfile();
  const [activeTab, setActiveTab] = useState("dashboard");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const getImageUrl = (profileImage) => {
    if (!profileImage) return null;
    if (typeof profileImage === 'string') return profileImage;
    if (profileImage.url) return profileImage.url;
    return null;
  };

  useEffect(() => {
    console.log('Profile - appointments:', appointments);
    console.log('Profile - appointments length:', appointments?.length);
  }, [appointments]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="w-10 h-10 border-4 border-rose-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-center text-gray-600 text-lg">
          No has iniciado sesión...
        </p>
      </div>
    );
  }

  const userInitials = user.name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase();

  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
        onLogout={handleLogout}
        user={user}
        setActiveTab={setActiveTab}
      />

      <motion.header
        className="relative h-56 w-full shadow-xl overflow-hidden"
        initial={{ opacity: 0, y: -40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        style={{
          backgroundImage: `url(${paloRosa})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="absolute inset-0 bg-black/20"></div>

        <div className="relative max-w-7xl mx-auto h-full px-6 flex items-center justify-between">
          <div className="flex items-center gap-5">
            {getImageUrl(user.profileImage) ? (
              <motion.img
                src={getImageUrl(user.profileImage)}
                alt="Perfil"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.6 }}
                className="w-20 h-20 rounded-full object-cover border-4 border-white shadow-lg"
              />
            ) : (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.6 }}
                className="w-20 h-20 rounded-full bg-rose-300 flex items-center justify-center text-white font-bold text-3xl shadow-lg"
              >
                {userInitials}
              </motion.div>
            )}

            <motion.div
              initial={{ opacity: 0, x: -40 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              <h1 className="text-4xl font-bold text-white drop-shadow">
                Hola, {user?.name ? `Hola, ${user.name.split(" ")[0]}` : "Hola"}
              </h1>
              <p className="text-rose-100">Bienvenida a Shirly Rose</p>
            </motion.div>
          </div>

          <button
            onClick={() => setIsSidebarOpen(true)}
            className="p-4 bg-white/30 backdrop-blur-md rounded-full hover:bg-white/50 transition text-white shadow-md"
          >
            <FaBars className="w-6 h-6" />
          </button>
        </div>
      </motion.header>

      <main className="max-w-6xl mx-auto px-4 mt-[-3rem] pb-12">
        <motion.div
          className="bg-white rounded-2xl shadow-lg flex justify-around p-3 mt-16 overflow-x-auto"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          {[
            { id: "dashboard", label: "Menú", Icon: FaHome },
            { id: "edit", label: "Editar Perfil", Icon: FaEdit },
            { id: "appointments", label: "Mis Citas", Icon: FaCalendarAlt },
            { id: "history", label: "Historial", Icon: FaClock },
          ].map((tab) => (
            <motion.button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center justify-center gap-2 py-3 px-4 rounded-lg font-semibold transition-all whitespace-nowrap ${
                activeTab === tab.id
                  ? "bg-rose-400 text-white shadow-md"
                  : "bg-white text-rose-400 hover:bg-rose-50"
              }`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.97 }}
            >
              <tab.Icon />
              {tab.label}
            </motion.button>
          ))}
        </motion.div>

        <div className="mt-8">
          <AnimatePresence mode="wait">
            {activeTab === "dashboard" && <DashboardView user={user} />}
            {activeTab === "edit" && (
              <EditProfileView 
                user={user} 
                onUpdate={updateProfile}
                setActiveTab={setActiveTab}
              />
            )}
            {activeTab === "appointments" && (
              <AppointmentsView appointments={appointments || []} />
            )}
            {activeTab === "history" && (
              <HistoryView appointments={appointments || []} />
            )}
          </AnimatePresence>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Profile;