import { Schema, model } from 'mongoose';

const companyProfileSchema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  companyName: { type: String, required: true },
  industry: { type: String, required: true }, // Bransch
  description: { type: String }, // Nullable field
  contactPerson: {
    name: { type: String, required: true },
    email: { type: String, required: true }
  },
  internshipDetails: { type: String } // Internship (fritext)
}, { timestamps: true, collection: 'CompanyProfile' });

const CompanyProfile = model('CompanyProfile', companyProfileSchema);

export default CompanyProfile;
