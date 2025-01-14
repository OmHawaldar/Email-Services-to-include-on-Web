const express = require('express');
const nodemailer = require('nodemailer');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const PORT = 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Email credentials
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'your_email@gmail.com', // Replace with your email
        pass: 'your_email_password_or_app_password' // Replace with your email password or app password, setup app password in google account and use that
    }
});

// API endpoint for sending emails
app.post('/send-email', (req, res) => {
    const { to, subject, message } = req.body;

    const mailOptions = {
        from: 'your_email@gmail.com', // Replace with your email
        to: to,
        subject: subject,
        text: message
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.error('Error sending email:', error);
            res.status(500).json({ message: 'Failed to send email', error });
        } else {
            console.log('Email sent:', info.response);
            res.status(200).json({ message: 'Email sent successfully' });
        }
    });
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
