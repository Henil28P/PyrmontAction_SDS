const inputValidateContactForm  = require("../../middlewares/verifyContactForm")
const contactUsForm = require('./contactModel')
inputValidator = require("../../middlewares/verifyContactForm")


module.exports = {
    async sendContactMail(req, res) {
        try {
            const sender = await contactUsForm.createTransporter();
            const email = await contactUsForm.createEmail(req);
            sender.sendMail(email, function (error) {
                if (error) {
                    console.log(error);
                    return res.status(500).json({ message: 'Failed to send email' });
                }
            });
            return res.status(200).json({ message: 'Email sent' });
        } catch (error) {
            return res.status(500).json({ message: 'Internal server error', errors: error });
        }
    }
};
