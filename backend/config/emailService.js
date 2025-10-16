const nodemailer = require('nodemailer');

// Configurar transporter (Gmail en este caso)
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER, // Tu email
    pass: process.env.EMAIL_PASS  // Contraseña de aplicación de Gmail
  }
});

// 🔹 VERIFICAR CONEXIÓN AL INICIAR
transporter.verify(function (error, success) {
  if (error) {
    console.log('❌ Error en configuración de email:', error.message);
    console.log('📧 EMAIL_USER:', process.env.EMAIL_USER);
    console.log('🔑 EMAIL_PASS:', process.env.EMAIL_PASS ? '****** (configurada)' : 'NO CONFIGURADA');
  } else {
    console.log('✅ Servidor de email configurado correctamente');
    console.log('📧 Usando email:', process.env.EMAIL_USER);
  }
});

// Enviar email de verificación
const sendVerificationEmail = async (user, token) => {
  const verificationUrl = `${process.env.FRONTEND_URL}/verify-email/${token}`;

  const mailOptions = {
    from: `"ShirlyRose" <${process.env.EMAIL_USER}>`,
    to: user.email,
    subject: '✨ Verifica tu cuenta en ShirlyRose',
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body {
            font-family: Arial, sans-serif;
            background-color: #f9f9f9;
            margin: 0;
            padding: 0;
          }
          .container {
            max-width: 600px;
            margin: 50px auto;
            background: white;
            border-radius: 20px;
            overflow: hidden;
            box-shadow: 0 4px 20px rgba(0,0,0,0.1);
          }
          .header {
            background: linear-gradient(135deg, #ff6b9d, #c0395a);
            padding: 40px;
            text-align: center;
            color: white;
          }
          .header h1 {
            margin: 0;
            font-size: 32px;
          }
          .content {
            padding: 40px;
            color: #333;
          }
          .content h2 {
            color: #ff6b9d;
            margin-top: 0;
          }
          .button {
            display: inline-block;
            padding: 15px 40px;
            background: linear-gradient(135deg, #ff6b9d, #c0395a);
            color: white;
            text-decoration: none;
            border-radius: 50px;
            font-weight: bold;
            margin: 20px 0;
            transition: transform 0.3s;
          }
          .button:hover {
            transform: scale(1.05);
          }
          .footer {
            background: #f5f5f5;
            padding: 20px;
            text-align: center;
            color: #666;
            font-size: 12px;
          }
          .info-box {
            background: #fff0f5;
            border-left: 4px solid #ff6b9d;
            padding: 15px;
            margin: 20px 0;
            border-radius: 8px;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🌸 ShirlyRose</h1>
          </div>
          <div class="content">
            <h2>¡Hola, ${user.name}! 👋</h2>
            <p>Gracias por registrarte en <strong>ShirlyRose</strong>.</p>
            <p>Para completar tu registro y comenzar a disfrutar de nuestros servicios, necesitamos verificar tu correo electrónico.</p>
            
            <div style="text-align: center;">
              <a href="${verificationUrl}" class="button">
                ✅ Verificar mi correo
              </a>
            </div>

            <div class="info-box">
              <strong>⏰ Este enlace expira en 24 horas.</strong>
              <p style="margin: 5px 0 0 0; font-size: 14px;">
                Si no te registraste en ShirlyRose, puedes ignorar este mensaje.
              </p>
            </div>

            <p style="margin-top: 30px; font-size: 14px; color: #666;">
              Si el botón no funciona, copia y pega este enlace en tu navegador:
            </p>
            <p style="word-break: break-all; color: #ff6b9d; font-size: 12px;">
              ${verificationUrl}
            </p>
          </div>
          <div class="footer">
            <p>© 2025 ShirlyRose. Todos los derechos reservados.</p>
            <p>Este es un correo automático, por favor no respondas a este mensaje.</p>
          </div>
        </div>
      </body>
      </html>
    `
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log('✅ Email de verificación enviado a:', user.email);
    return true;
  } catch (error) {
    console.error('❌ Error al enviar email:', error);
    return false;
  }
};

// Enviar email de recuperación de contraseña
const sendPasswordResetEmail = async (user, token) => {
  const resetUrl = `${process.env.FRONTEND_URL}/reset-password/${token}`;

  const mailOptions = {
    from: `"ShirlyRose" <${process.env.EMAIL_USER}>`,
    to: user.email,
    subject: '🔐 Recupera tu contraseña - ShirlyRose',
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body {
            font-family: Arial, sans-serif;
            background-color: #f9f9f9;
            margin: 0;
            padding: 0;
          }
          .container {
            max-width: 600px;
            margin: 50px auto;
            background: white;
            border-radius: 20px;
            overflow: hidden;
            box-shadow: 0 4px 20px rgba(0,0,0,0.1);
          }
          .header {
            background: linear-gradient(135deg, #ff6b9d, #c0395a);
            padding: 40px;
            text-align: center;
            color: white;
          }
          .header h1 {
            margin: 0;
            font-size: 32px;
          }
          .content {
            padding: 40px;
            color: #333;
          }
          .content h2 {
            color: #ff6b9d;
            margin-top: 0;
          }
          .button {
            display: inline-block;
            padding: 15px 40px;
            background: linear-gradient(135deg, #ff6b9d, #c0395a);
            color: white;
            text-decoration: none;
            border-radius: 50px;
            font-weight: bold;
            margin: 20px 0;
            transition: transform 0.3s;
          }
          .button:hover {
            transform: scale(1.05);
          }
          .footer {
            background: #f5f5f5;
            padding: 20px;
            text-align: center;
            color: #666;
            font-size: 12px;
          }
          .warning-box {
            background: #fff4e5;
            border-left: 4px solid #ff9800;
            padding: 15px;
            margin: 20px 0;
            border-radius: 8px;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🌸 ShirlyRose</h1>
          </div>
          <div class="content">
            <h2>Recuperación de contraseña 🔐</h2>
            <p>Hola, <strong>${user.name}</strong></p>
            <p>Recibimos una solicitud para restablecer tu contraseña.</p>
            
            <div style="text-align: center;">
              <a href="${resetUrl}" class="button">
                🔓 Restablecer contraseña
              </a>
            </div>

            <div class="warning-box">
              <strong>⏰ Este enlace expira en 1 hora.</strong>
              <p style="margin: 5px 0 0 0; font-size: 14px;">
                Si no solicitaste cambiar tu contraseña, ignora este mensaje y tu cuenta permanecerá segura.
              </p>
            </div>

            <p style="margin-top: 30px; font-size: 14px; color: #666;">
              Si el botón no funciona, copia y pega este enlace en tu navegador:
            </p>
            <p style="word-break: break-all; color: #ff6b9d; font-size: 12px;">
              ${resetUrl}
            </p>
          </div>
          <div class="footer">
            <p>© 2025 ShirlyRose. Todos los derechos reservados.</p>
            <p>Este es un correo automático, por favor no respondas a este mensaje.</p>
          </div>
        </div>
      </body>
      </html>
    `
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log('✅ Email de recuperación enviado a:', user.email);
    return true;
  } catch (error) {
    console.error('❌ Error al enviar email:', error);
    return false;
  }
};

module.exports = {
  sendVerificationEmail,
  sendPasswordResetEmail
};