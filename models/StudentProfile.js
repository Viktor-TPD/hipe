import { Schema, model } from 'mongoose';

const studentProfileSchema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  name: { type: String, required: true },
  classId: { type: String, required: true },
  specialization: { type: String },
  software: { type: String }, 
  stack: [String], 
  languages: [String], 
  portfolio: { type: String }, 
}, { timestamps: true });

const StudentProfile = model('StudentProfile', studentProfileSchema);

export default StudentProfile;
