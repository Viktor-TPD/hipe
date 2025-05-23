import { Schema, model } from 'mongoose';

const userSchema = new Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true }, // Hashed password
  userType: { type: String, enum: ["student", "company"], required: true },
}, { timestamps: true, collection: 'Users' }); 


const User = model('User', userSchema);

export default User;