
const user = require('./user');
const userAuth = require('./userAuthentication')

module.exports = {
    async register(req, res, db) {
        try{
            const validateUser = await userAuth.inputValidatorJoinUs(req, res, db);
            const hashedPassword = await user.hashPassword(req.body.password);
            userDetails = [req.body.email, hashedPassword, req.body.firstName, req.body.lastName, req.body.mobilePhone, req.body.areaOfInterest, req.body.streetName, req.body.city, req.body.state, req.body.postcode, 1]
            await user.createUser(userDetails, db);

            // const adminHashed = await user.hashPassword("admin");

            // await user.createUser(['admin@admin.com', adminHashed, 'admin', 'admin', '1234567890', 'fdsfadfsdsafdsa', 'fdsafdsafdsafdsa', 'fdasfsaf', 'NSW', '0000', 0], db)
            res.status(200).json({ message: 'User Inserted successfully.'});
        }
        catch(error){
            return res.status(400).json({message: 'Error has occurred when registering', errors : error});
        }
    },

    async login(req, res, db) {
        try{
                // db.exec(
                // `INSERT INTO roles(role_id, role_type)
                // VALUES
                //     (0, 'admin'),
                //     (1, 'member');
                //  `)
            const validateUser = await userAuth.inputValidatorLogin(req, res);
            const userEmailInput = req.body.email;
            const userPasswordInput = req.body.password;
            userInfo = await user.getUser(userEmailInput, db);
            userChecker = await user.getCheck(userEmailInput, userPasswordInput, userInfo.email, userInfo.password);
            access_token = await userAuth.generateAccessToken(userInfo.email, userInfo.role_id);
            refresh_token = await userAuth.generateRefreshToken(userInfo.email, userInfo.role_id);
            return res.status(200).json({message: 'Successfully logged in', token: {accessToken: access_token, refreshToken: refresh_token}, user: { email: userInfo.email, role: userInfo.role_id}});

        }
        catch(error){
            return res.status(403).json({message: 'Error occurred during login'});
        }
    },
    async displayAdminDetails(req, res, db) {
        try{
            const userDetails = await user.getAllUserDetails(req.user.email, db);
            res.status(200).json({ message: 'Admin User Details Found successfully.', adminInfo: userDetails});
        }
        catch(error){
            console.log(error);
            return res.status(400).json({message: 'Error with displaying admin', errors : error});
        }
    },

    async displayMemberDetails(req, res, db) {
        try{
            const userDetails = await user.getAllUserDetails(req.user.email, db);
            res.status(200).json({ message: 'Member User Details Found successfully.', memberInfo: userDetails});
        }
        catch(error){
            console.log(error);
            return res.status(400).json({message: 'Error with displaying members', errors : error});
        }
    },



};

