const { Schema, model } = require("mongoose");

const IntentSchema = new Schema({
  email: { type: String, required: true, index: true },
  passwordHash: { type: String, required: true },
  firstName: String,
  lastName: String,
  mobilePhone: String,
  streetName: String,
  city: String,
  state: String,
  postcode: String,
  status: { type: String, enum: ["awaiting_payment","completed","canceled"], default: "awaiting_payment" }
}, { timestamps: true });

module.exports = model("RegistrationIntent", IntentSchema);
