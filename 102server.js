const express = require("express");
const nodemailer = require("nodemailer");
const cors = require("cors");
const bodyParser = require("body-parser");
const schedule = require('node-schedule');

const app = express();
const port = 3000;

// Use CORS middleware globally
app.use(cors()); // Allow all origins by default (You can configure this if you need more security)
app.use(bodyParser.json()); // Parse JSON bodies

// Initialize an empty array for recipients
let emailRecipients = [];

// Function to send reminder emails to all recipients
function sendReminders() {
    console.log('Sending reminders to:', emailRecipients);

    // Nodemailer configuration for Gmail
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: 'yuuoooooorrrsss', // Replace with your Gmail address
            pass: 'dev D'   // Replace with your Gmail app password
        }
    });

    // Email options
    const mailOptions = {
        from: 'yoursEmail@gmail.com',  // Sender's email
        to: emailRecipients,           // List of recipients
        subject: 'Reminder Email',
        text: 'This is a reminder email sent every 2 minutes.'
    };

    // Send the email
    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.log('Error sending email:', error);
        } else {
            console.log('Email sent: ' + info.response);
        }
    });
}

// Endpoint to add a recipient email
app.post('/add-recipient', (req, res) => {
    const { email } = req.body;
    if (email && !emailRecipients.includes(email)) {
        emailRecipients.push(email);
        res.status(200).json({ message: 'Recipient added successfully!' });
    } else {
        res.status(400).json({ message: 'Invalid or duplicate email!' });
    }
});

// Endpoint to get the list of recipients
app.get('/get-recipients', (req, res) => {
    res.status(200).json({ recipients: emailRecipients });
});

// Schedule the task to send emails every 2 minutes, can be changed
schedule.scheduleJob('*/2 * * * *', () => {
    sendReminders();
    console.log('Email reminders sent at:', new Date().toLocaleTimeString());
});

// Start the Express server
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
