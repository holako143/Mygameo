import { Schema, model, models } from 'mongoose';

const UserSchema = new Schema({
  email: { type: String, unique: true },
  name: String,
  image: String,
  points: { type: Number, default: 0 },
  bravePoints: { type: Number, default: 0 },
  achievements: [String],
  titles: [String],
  inventory: [String], // عناصر المتجر
}, { timestamps: true });

export default models.User || model('User', UserSchema);