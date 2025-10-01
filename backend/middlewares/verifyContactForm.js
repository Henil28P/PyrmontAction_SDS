// Middleware to validate contact form inputs
// Error Array with the fields that fail will be sent back to frontend
// Frontend will display error messages accordingly
module.exports = {
    
    emailRegex: function(input){
        emailRegex = new RegExp(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/g)
        return emailRegex.test(input);
    },


    stringedRegex : function(input){
        nameOrCityRegex = new RegExp(/^[A-Za-z0-9]{1,25}$/);
        return nameOrCityRegex.test(input);
    },

    stringedMessage : function(input){
        messageRegex = new RegExp(/^[a-zA-Z0-9!@#$&()\-`'.+,\"].{0,}/g);
        return messageRegex.test(input);
    },



    async inputValidation(req, res, next){
            const inputErrors = [];
            if (!module.exports.emailRegex(req.body.email)) inputErrors.push("email");
            if (!module.exports.stringedRegex(req.body.firstName)) inputErrors.push("firstName");
            if (!module.exports.stringedRegex(req.body.lastName)) inputErrors.push("lastName");
            if (!module.exports.stringedMessage(req.body.message)) inputErrors.push("message");

            if (inputErrors.length > 0) {
                return res.status(400).json({ message: 'Validation failed', errors: inputErrors });
            }

            next();

    }
}
