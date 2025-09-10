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



    async inputValidateContactForm(req, res){
        return new Promise((resolve, reject) => {
            const inputErrors = [];
            if (!module.exports.emailRegex(req.body.email)) inputErrors.push("email");
            if (!module.exports.stringedRegex(req.body.firstName)) inputErrors.push("firstName");
            if (!module.exports.stringedRegex(req.body.lastName)) inputErrors.push("lastName");
            if (!module.exports.stringedMessage(req.body.message)) inputErrors.push("message");
            if(inputErrors.length > 0) reject(inputErrors);
            resolve();
        })
        
    }
}
