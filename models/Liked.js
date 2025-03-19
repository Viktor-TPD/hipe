import { Schema, model } from 'mongoose';

const likedSchema = new Schema({
  studentId: { type: Schema.Types.ObjectId, ref: 'StudentProfile', required: true },
  companyId: { type: Schema.Types.ObjectId, ref: 'CompanyProfile', required: true },
  isPoked: { type: Boolean, default: false },
  date: { type: Date, default: Date.now }
}, { timestamps: true });

const Liked = model('Liked', likedSchema);

export default Liked;
