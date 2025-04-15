import { Schema, model } from "mongoose";

const companyProfileSchema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    companyName: { type: String, required: true },
    industry: { type: String, required: true },
    description: { type: String },
    website: { type: String },
    contactPerson: {
      name: { type: String, required: true },
      email: { type: String, required: true },
    },
    profileImageUrl: { type: String, default: "" },
    internshipDetails: { type: String },
    hasLikedOnce: { type: Boolean, default: false },

  },
  { timestamps: true, collection: "CompanyProfile" }
);

const CompanyProfile = model("CompanyProfile", companyProfileSchema);

export default CompanyProfile;
