import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';

export const useVerifyEmail = (token) => {
  const [status, setStatus] = useState('loading');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();
  const hasVerified = useRef(false); // ⬅️ Evitar múltiples ejecuciones

  useEffect(() => {
    const verifyEmail = async () => {
      // Si ya verificó, no hacer nada
      if (hasVerified.current) {
        console.log('⚠️ Ya se verificó anteriormente, ignorando...');
        return;
      }

      if (!token) {
        setStatus('error');
        setMessage('Token de verificación no proporcionado');
        return;
      }

      // Marcar como verificado ANTES de hacer la petición
      hasVerified.current = true;

      console.log('🔍 Verificando token:', token);

      try {
        const response = await api.get(`/auth/verify-email/${token}`);
        
        console.log('✅ Respuesta de verificación:', response.data);
        
        setStatus('success');
        setMessage(response.data.message);
        
        // Redirigir al login después de 3 segundos
        setTimeout(() => {
          navigate('/login', { 
            state: { 
              verified: true,
              message: '¡Email verificado! Ya puedes iniciar sesión' 
            }
          });
        }, 3000);
        
      } catch (error) {
        console.error('❌ Error al verificar email:', error);
        
        setStatus('error');
        
        const errorMessage = error.response?.data?.message;
        
        // Si dice que ya está verificado, tratarlo como éxito
        if (errorMessage && errorMessage.includes('ya está verificado')) {
          setStatus('success');
          setMessage('Tu email ya está verificado. Puedes iniciar sesión.');
          
          setTimeout(() => {
            navigate('/login', { 
              state: { 
                verified: true,
                message: 'Tu email ya estaba verificado. Inicia sesión' 
              }
            });
          }, 2000);
        } else {
          setMessage(errorMessage || 'Error al verificar el email. Por favor, intenta nuevamente.');
        }
      }
    };

    verifyEmail();
  }, [token, navigate]); // Solo depende de token y navigate

  return { status, message };
};
