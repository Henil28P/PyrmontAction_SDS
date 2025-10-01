const emailSender = require('nodemailer')

require('dotenv').config()
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

    async createEmail(req){
        email = {
            from: req.body.email,
            to: process.env.HOST_EMAIL,
            subject: `Contact Us Inquiry from ${req.body.email} ` ,
            html: `<html><h3>Sender Name: ${req.body.firstName} ${req.body.lastName}</h3><p>${req.body.message}</p></html>`
        }
        return email


    }

}