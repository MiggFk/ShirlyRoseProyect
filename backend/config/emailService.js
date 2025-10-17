const nodemailer = require('nodemailer');

// Configurar el transportador
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

// Verificar la conexión al iniciar
transporter.verify((error, success) => {
  if (error) {
    console.error('❌ Error en configuración de email:', error);
  } else {
    console.log('✅ Servidor de email configurado correctamente');
    console.log('📧 Usando email:', process.env.EMAIL_USER);
  }
});

// Función para enviar email de verificación
const sendVerificationEmail = async (toEmail, userName, token) => {
  try {
    console.log('📧 Intentando enviar email a:', toEmail);
    console.log('🔑 Token:', token);

    // Validar que el email existe
    if (!toEmail || toEmail === 'undefined' || toEmail === '') {
      throw new Error('Email destinatario no válido: ' + toEmail);
    }

    // ✅ CORREGIDO: Quitar la "d" extra de "verify-email"
    const verificationUrl = `${process.env.FRONTEND_URL}/verify-email/${token}`;

    const mailOptions = {
      from: {
        name: 'Shirly Rose',
        address: process.env.EMAIL_USER
      },
      to: toEmail,
      subject: '✨ Verifica tu cuenta de Shirly Rose',
      html: `
        <!DOCTYPE html>
        <html lang="es">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <style>
            * {
              margin: 0;
              padding: 0;
              box-sizing: border-box;
            }
            body {
              font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', sans-serif;
              background: linear-gradient(135deg, #fdf2f8 0%, #f3e8ff 100%);
              padding: 20px;
            }
            .container {
              max-width: 600px;
              margin: 0 auto;
              background-color: white;
              border-radius: 20px;
              overflow: hidden;
              box-shadow: 0 20px 60px rgba(236, 72, 153, 0.15);
            }
            .header {
              background: linear-gradient(135deg, #ec4899 0%, #be185d 100%);
              padding: 50px 30px;
              text-align: center;
            }
            .header h1 {
              color: white;
              margin: 0;
              font-size: 32px;
              font-weight: 700;
              letter-spacing: -0.5px;
            }
            .header p {
              color: rgba(255, 255, 255, 0.9);
              margin: 8px 0 0 0;
              font-size: 14px;
            }
            .content {
              padding: 50px 40px;
            }
            .greeting {
              color: #1f2937;
              font-size: 20px;
              font-weight: 600;
              margin-bottom: 20px;
            }
            .text-block {
              color: #6b7280;
              line-height: 1.8;
              margin-bottom: 24px;
              font-size: 15px;
            }
            .button-container {
              text-align: center;
              margin: 40px 0;
            }
            .button {
              display: inline-block;
              background: linear-gradient(135deg, #ec4899 0%, #be185d 100%);
              color: white;
              text-decoration: none;
              padding: 16px 48px;
              border-radius: 10px;
              font-weight: 600;
              font-size: 16px;
              transition: transform 0.2s, box-shadow 0.2s;
              box-shadow: 0 10px 25px rgba(236, 72, 153, 0.3);
            }
            .button:hover {
              transform: translateY(-2px);
              box-shadow: 0 15px 35px rgba(236, 72, 153, 0.4);
            }
            .warning {
              background: linear-gradient(135deg, rgba(236, 72, 153, 0.05) 0%, rgba(190, 24, 93, 0.05) 100%);
              border-left: 4px solid #ec4899;
              padding: 16px 20px;
              margin: 30px 0;
              border-radius: 8px;
              font-size: 13px;
              color: #5a1d4d;
              font-weight: 500;
            }
            .link-backup {
              background: #f9fafb;
              padding: 20px;
              border-radius: 8px;
              margin: 30px 0;
              font-size: 12px;
              color: #6b7280;
              word-break: break-all;
            }
            .link-backup a {
              color: #ec4899;
              text-decoration: none;
              font-weight: 600;
            }
            .footer {
              background: linear-gradient(135deg, #faf5ff 0%, #f3e8ff 100%);
              padding: 30px;
              text-align: center;
              border-top: 1px solid #f0e7ff;
            }
            .footer-text {
              color: #9ca3af;
              font-size: 12px;
              line-height: 1.6;
              margin: 0;
            }
            .footer-text:not(:last-child) {
              margin-bottom: 8px;
            }
            .divider {
              width: 40px;
              height: 2px;
              background: linear-gradient(90deg, transparent, #ec4899, transparent);
              margin: 20px auto;
            }
            .features {
              background: #faf5ff;
              padding: 20px;
              border-radius: 10px;
              margin: 25px 0;
              font-size: 13px;
              color: #6b7280;
            }
            .features p {
              margin: 8px 0;
            }
            .emoji {
              font-size: 20px;
              margin-right: 8px;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>💅 Shirly Rose</h1>
              <p>Verifica tu cuenta para comenzar</p>
            </div>
            
            <div class="content">
              <div class="greeting">¡Hola ${userName}! 👋</div>
              
              <div class="text-block">
                Gracias por registrarte en <strong>Shirly Rose</strong>. Estamos emocionados de tenerte con nosotros.
              </div>
              
              <div class="text-block">
                Para completar tu registro y activar tu cuenta, verifica tu dirección de email haciendo clic en el botón de abajo:
              </div>
              
              <div class="button-container">
                <a href="${verificationUrl}" class="button">✓ Verificar mi email</a>
              </div>
              
              <div class="warning">
                ⏰ <strong>Este enlace expirará en 24 horas</strong>. Actúa rápido para no perder tu acceso.
              </div>
              
              <div class="features">
                <p><span class="emoji">📅</span><strong>Reserva citas</strong> de forma segura y fácil</p>
                <p><span class="emoji">💇</span><strong>Acceso a servicios</strong> premium personalizados</p>
                <p><span class="emoji">✨</span><strong>Ofertas exclusivas</strong> para miembros verificados</p>
              </div>
              
              <div class="link-backup">
                <strong style="color: #1f2937;">Si el botón no funciona, copia este enlace:</strong><br><br>
                <a href="${verificationUrl}">${verificationUrl}</a>
              </div>
              
              <div class="text-block" style="font-size: 13px; color: #9ca3af; margin-bottom: 0;">
                Si no creaste esta cuenta, puedes ignorar este mensaje de forma segura.
              </div>
            </div>
            
            <div class="footer">
              <p class="footer-text">© 2025 Shirly Rose. Todos los derechos reservados.</p>
              <div class="divider"></div>
              <p class="footer-text">Este es un email automático. Por favor no respondas a este mensaje.</p>
            </div>
          </div>
        </body>
        </html>
      `
    };

    console.log('📧 Opciones de email:', {
      from: mailOptions.from,
      to: mailOptions.to,
      subject: mailOptions.subject
    });

    const info = await transporter.sendMail(mailOptions);
    
    console.log('✅ Email enviado exitosamente:', info.messageId);
    
    return info;
  } catch (error) {
    console.error('❌ Error al enviar email:', error);
    throw error;
  }
};

// 📧 ENVIAR EMAIL DE RECUPERACIÓN DE CONTRASEÑA
const sendPasswordResetEmail = async (email, name, resetCode) => {
  try {
    const htmlTemplate = `
      <!DOCTYPE html>
      <html lang="es">
      <head>
        <meta charset="UTF-8">
        <style>
          body { font-family: Arial, sans-serif; background-color: #f5f5f5; }
          .container { max-width: 600px; margin: 20px auto; background: white; padding: 40px; border-radius: 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
          .header { text-align: center; color: #ec4899; margin-bottom: 30px; }
          .header h1 { margin: 0; font-size: 28px; }
          .code-box { background: linear-gradient(135deg, #fce7f3 0%, #fbcfe8 100%); padding: 20px; border-radius: 8px; text-align: center; margin: 30px 0; }
          .code { font-size: 36px; font-weight: bold; color: #be185d; letter-spacing: 5px; }
          .message { color: #666; line-height: 1.6; }
          .footer { text-align: center; margin-top: 30px; color: #999; font-size: 12px; }
          .warning { background: #fef3c7; padding: 10px; border-radius: 5px; color: #92400e; font-size: 14px; margin: 20px 0; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🌸 Shirly Rose</h1>
            <p>Recuperación de Contraseña</p>
          </div>
          
          <div class="message">
            <p>¡Hola ${name}!</p>
            <p>Recibimos una solicitud para recuperar tu contraseña. Usa el siguiente código para continuar:</p>
          </div>
          
          <div class="code-box">
            <p style="margin: 0 0 10px 0; color: #999;">Tu código de verificación:</p>
            <div class="code">${resetCode}</div>
          </div>
          
          <div class="message">
            <p><strong>Este código expirará en 15 minutos.</strong></p>
            <p>Si no solicitaste recuperar tu contraseña, ignora este email.</p>
          </div>
          
          <div class="warning">
            ⚠️ Por seguridad, nunca compartas este código con nadie. Nuestro equipo nunca te pedirá este código.
          </div>
          
          <div class="footer">
            <p>© 2024 Shirly Rose. Todos los derechos reservados.</p>
          </div>
        </div>
      </body>
      </html>
    `;

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: '🔐 Código de Recuperación de Contraseña - Shirly Rose',
      html: htmlTemplate
    };

    await transporter.sendMail(mailOptions);
    console.log('✅ Email de recuperación enviado a:', email);
    return true;

  } catch (error) {
    console.error('❌ Error al enviar email de recuperación:', error);
    throw error;
  }
};

module.exports = {
  sendVerificationEmail,
  sendPasswordResetEmail, // ✅ Agregar esta función
  // ...other exports...
};