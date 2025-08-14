// Requiere instalar la librería Twilio: npm install twilio
const twilio = require('twilio');

const accountSid = 'TU_ACCOUNT_SID';
const authToken = 'TU_AUTH_TOKEN';
const client = new twilio(accountSid, authToken);

function sendVerificationCode(phoneNumber, code) {
  return client.messages.create({
    body: `Tu código de verificación es: ${code}`,
    from: '+526564282008', // tu número de Twilio
    to: phoneNumber
  });
}

// Ejemplo de uso:
const code = Math.floor(100000 + Math.random() * 900000); // código 6 dígitos
sendVerificationCode('+521234567890', code)
  .then(message => console.log('SMS enviado, SID:', message.sid))
  .catch(err => console.error(err));
