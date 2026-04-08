import { Resend } from 'resend';
const resend = new Resend('re_8U3UM1AH_PNh9jhPdf7PcvhfNBaoSKF');
resend.emails.send({
  from: 'Punta Cana Investments <info@puntacanainvestmentsrd.com>',
  to: ['info@puntacanainvestmentsrd.com'],
  subject: 'Test auto-responder',
  html: '<p>Test</p>'
}).then(console.log).catch(console.error);
