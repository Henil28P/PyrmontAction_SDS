import mongoose from 'mongoose';

const MemberSchema = new mongoose.Schema(
  {
    name: String,
    email: { type: String, unique: true, required: true },
    username: String,
    password: String,
    membershipExpiry: { type: Date, default: null },
  },
  { timestamps: true }
);

// Virtual field for active/expired
MemberSchema.virtual('isActive').get(function () {
  return this.membershipExpiry && this.membershipExpiry >= new Date();
});

MemberSchema.set('toJSON', { virtuals: true });
MemberSchema.set('toObject', { virtuals: true });

export default mongoose.model('Member', MemberSchema);
