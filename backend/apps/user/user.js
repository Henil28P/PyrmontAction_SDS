const sqlite3 = require('sqlite3').verbose();
const bcrypt = require('bcrypt')

module.exports = {
    async hashPassword(password){
      return new Promise((resolve, reject) => {
        salt = 12
        bcrypt.hash(password, salt, (error, hashedPassword) => {
          if(error) reject(error);
          resolve(hashedPassword);
        })
      });
      
      
    },

    async createUser(data, db){
      return new Promise((resolve, reject) => {
        query = 'INSERT INTO users (email, password, firstName, lastName, mobilePhone, areaOfInterest, streetName, city, state, postcode, role_id) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)';
        db.run(query, data, function(error){
          if(error){
            if (error.message.includes("UNIQUE constraint failed")) reject(["email"])
            reject("Invalid details");
          }
          resolve();
        }
      )        
      }
      
      )
    },


    async getUser(email, db){
      return new Promise((resolve, reject) => {
        query = "SELECT email, password, role_id FROM users WHERE email = ?"
        db.get(query, [email], (error, result) => {
          if (error) reject("Caused from searching users: " + error);
          resolve(result);

        });
        
      })
    },

    async getAllUserDetails(email, db){
      return new Promise((resolve, reject) => {
        query = "SELECT * FROM users WHERE email = ?"
        db.get(query, [email], (error, result) => {
          if (error) reject("Caused from searching users: " + error);
          resolve(result);
        });
        
      })
    },

    async getCheckUserExists(email, db){
      return new Promise((resolve, reject) => {
        query = "SELECT COUNT(*) as count FROM users WHERE email = ?"
        db.get(query, [email], (error, result) => {
          if (error) reject("Caused from searching users: " + error);
          if(result.count !== 0) reject(["email"]);
          resolve();

        });
        
      })
    },

    async getCheck(userInputEmail, userInputPassword, userEmailStored, userPasswordStored){
      return new Promise((resolve, reject) => {
        if(userInputEmail != userEmailStored) reject("Username Incorrect")
        bcrypt.compare(userInputPassword, userPasswordStored, (error, result) => {
          if(error) reject("Error in unhashing password: " + error);
          
          if(result){
            resolve("Password correct");
          }
          reject("Incorrect Password");
        })
      })
    }
};



