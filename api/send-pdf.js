const express = require('express');
const app = express();
const port = process.env.PORT || 3000;
const nodemailer = require('nodemailer');
const path = require('path');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

module.exports = async (req, res) => {
  // Configurar los encabezados CORS
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*'); // Reemplaza * con tu dominio en producción
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  // Manejar la solicitud OPTIONS (preflight)
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'POST') {
    return res.status(405).send('Method Not Allowed');
  }

  const { email } = req.body;
  
  if (!email) {
    return res.status(400).send('Email is required');
  }

  const pdfPath = path.join(process.cwd(), 'assets', 'cvhugotorres.pdf');

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: 'Your PDF Document',
    text: 'Please find attached the PDF document you requested.',
    attachments: [
      {
        filename: 'document.pdf',
        path: pdfPath
      }
    ]
  };

  try {
    await transporter.sendMail(mailOptions);
    res.status(200).send('Email sent successfully');
  } catch (error) {
    console.error('Error sending email:', error);
    res.status(500).send('Error sending email');
  }

};

app.listen(port,'0.0.0.0',() => {
  console.log(`Server running on port ${port}`);
});
app.get('/', (req, res) => {
  res.send('Hello World!');
});