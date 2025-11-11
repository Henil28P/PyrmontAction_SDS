const emailSender = require('nodemailer')

module.exports = {
    async createTransporter(){
        const transporter = emailSender.createTransport({
            host: "smtp.gmail.com",
            port: 587,
            secure: false,
            auth: {
                user: process.env.FORWARDER,
                pass: process.env.FORWARDER_PASSWORD
            } 
            
        })
        return transporter;
    },

    async createContactUsEmail(req){
        email = {
            to: process.env.CONVENER,
            subject: `Contact Us Inquiry from ${req.body.email} ` ,
            html: `
                <html>
                <head>
                    <style>
                        body {
                            font-family: Arial, sans-serif;
                            padding: 20px;
                        }
                        .info-row {
                            margin-bottom: 15px;
                        }
                        .label {
                            font-weight: bold;
                            display: inline-block;
                            min-width: 120px;
                        }
                        .value {
                            display: inline-block;
                        }
                    </style>
                </head>
                <body>
                    <h2>Contact Us Inquiry</h2>
                    <div class="info-row">
                        <span class="label">Sender Email:</span>
                        <span class="value">${req.body.email}</span>
                    </div>
                    <div class="info-row">
                        <span class="label">Sender Name:</span>
                        <span class="value">${req.body.firstName} ${req.body.lastName}</span>
                    </div>
                    <div class="info-row">
                        <span class="label">Message:</span>
                    </div>
                    <p>${req.body.message}</p>
                </body>
                </html>`
        }
        return email
    },

    async createPaymentAlert(user){
        email = {
            to: process.env.TREASURER,
            subject: `STRIPE: New Payment Alert from ${user.email} `,
            html: `
                <html>
                <head>
                    <style>
                        body {
                            font-family: Arial, sans-serif;
                            padding: 20px;
                        }
                        .info-row {
                            margin-bottom: 15px;
                        }
                        .label {
                            font-weight: bold;
                            display: inline-block;
                            min-width: 120px;
                        }
                        .value {
                            display: inline-block;
                        }
                    </style>
                </head>
                <body>
                    <h2>Stripe Payment Alert</h2>
                    <div class="info-row">
                        <span class="label">Customer Name:</span>
                        <span class="value">${user.firstName} ${user.lastName}</span>
                    </div>
                    <div class="info-row">
                        <span class="label">Customer Email:</span>
                        <span class="value">${user.email}</span>
                    </div>
                    <div class="info-row">
                        <span class="label">Stripe Customer ID:</span>
                        <span class="value">${user.stripeCustomerID}</span>
                    </div>
                    <div class="info-row">
                        <span class="label">Payment Date:</span>
                        <span class="value">${new Date().toLocaleString()}</span>
                    </div>
                    <div class="info-row">
                        <span class="label">Payment Cost:</span>
                        <span class="value">$${process.env.MEMBERSHIP_PRICE}</span>
                    </div>
                </body>
                </html>`
        }
        return email
    },
    

}