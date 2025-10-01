const { Schema, model } = require("mongoose");

const UserSchema = new Schema({
  email: { type: String, required: true, unique: true, index: true },
  passwordHash: { type: String, required: true },
  firstName: String,
  lastName: String,
  mobilePhone: String,
  streetName: String,
  city: String,
  state: String,
  postcode: String,
  role_id: { type: Number, default: 1 }, // 0=admin, 1=member

  stripeCustomerId: { type: String, index: true },
  subscriptionId: { type: String, index: true },
  membershipStatus: { type: String, enum: ["active","canceled","past_due","trialing","incomplete","inactive"], default: "inactive", index: true },
  paidAt: Date
}, { timestamps: true });

module.exports = model("User", UserSchema);
