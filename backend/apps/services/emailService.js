const emailSender = require('nodemailer')

module.exports = {
    async createTransporter(){
        const transporter = emailSender.createTransport({
            host: "smtp.gmail.com",
            port: 587,
            secure: false,
            auth: {
                user: process.env.HOST_EMAIL,
                pass: process.env.HOST_EMAIL_PASSWORD
            } 
            
        })
        return transporter;
    },

    async createContactUsEmail(req){
        email = {
            from: req.body.email,
            to: process.env.HOST_EMAIL,
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
    

}