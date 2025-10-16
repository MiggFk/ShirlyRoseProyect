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

    const verificationUrl = `${process.env.FRONTEND_URL}/verify-email/${token}`;

    const mailOptions = {
      from: {
        name: 'Shirly Rose',
        address: process.env.EMAIL_USER
      },
      to: toEmail, // Asegurarse que sea una cadena válida
      subject: '✨ Verifica tu cuenta de Shirly Rose',
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body {
              font-family: 'Arial', sans-serif;
              background-color: #fdf2f8;
              margin: 0;
              padding: 0;
            }
            .container {
              max-width: 600px;
              margin: 40px auto;
              background-color: white;
              border-radius: 16px;
              overflow: hidden;
              box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
            }
            .header {
              background: linear-gradient(135deg, #ec4899 0%, #9333ea 100%);
              padding: 40px 20px;
              text-align: center;
            }
            .header h1 {
              color: white;
              margin: 0;
              font-size: 28px;
            }
            .content {
              padding: 40px 30px;
              text-align: center;
            }
            .content h2 {
              color: #1f2937;
              margin-bottom: 20px;
            }
            .content p {
              color: #6b7280;
              line-height: 1.6;
              margin-bottom: 30px;
            }
            .button {
              display: inline-block;
              background: linear-gradient(135deg, #ec4899 0%, #9333ea 100%);
              color: white;
              text-decoration: none;
              padding: 15px 40px;
              border-radius: 8px;
              font-weight: bold;
              margin: 20px 0;
            }
            .footer {
              background-color: #f9fafb;
              padding: 20px;
              text-align: center;
              color: #9ca3af;
              font-size: 12px;
            }
            .warning {
              background-color: #fef3c7;
              border-left: 4px solid #f59e0b;
              padding: 15px;
              margin: 20px 0;
              text-align: left;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>💅 Shirly Rose</h1>
            </div>
            <div class="content">
              <h2>¡Hola ${userName}! 👋</h2>
              <p>Gracias por registrarte en Shirly Rose. Estamos emocionados de tenerte con nosotros.</p>
              <p>Para completar tu registro y activar tu cuenta, por favor verifica tu dirección de email haciendo clic en el botón de abajo:</p>
              
              <a href="${verificationUrl}" class="button">Verificar mi email</a>
              
              <div class="warning">
                <strong>⏰ Este enlace expirará en 24 horas</strong>
              </div>
              
              <p style="font-size: 14px; color: #9ca3af;">
                Si no creaste esta cuenta, puedes ignorar este mensaje de forma segura.
              </p>
              
              <p style="font-size: 12px; color: #9ca3af; margin-top: 30px;">
                Si el botón no funciona, copia y pega este enlace en tu navegador:<br>
                <span style="color: #ec4899;">${verificationUrl}</span>
              </p>
            </div>
            <div class="footer">
              <p>© 2025 Shirly Rose. Todos los derechos reservados.</p>
              <p>Este es un email automático, por favor no respondas a este mensaje.</p>
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
    console.log('📧 Preview URL:', nodemailer.getTestMessageUrl(info));
    
    return info;
  } catch (error) {
    console.error('❌ Error al enviar email:', error);
    throw error;
  }
};

module.exports = {
  sendVerificationEmail
};