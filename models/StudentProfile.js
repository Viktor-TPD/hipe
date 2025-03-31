import { Schema, model } from 'mongoose';

const studentProfileSchema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  name: { type: String, required: true },
  courseId: { type: String, required: true, default: 'dd' },
  specializations: [String],
  softwares: [String], 
  stacks: [String], 
  languages: [String], 
  portfolio: { type: String }, 
  linkedin: { type: String }, 
  profilePicture:  { type: String, default: '' },
}, { timestamps: true , collection: 'StudentProfile' });

const StudentProfile = model('StudentProfile', studentProfileSchema);

export default StudentProfile;
