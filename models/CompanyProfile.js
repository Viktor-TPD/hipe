import { Schema, model } from "mongoose";

const companyProfileSchema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    companyName: { type: String, required: true }, //lägg till fält för hemsida
    industry: { type: String, required: true }, // Bransch
    description: { type: String }, // Nullable field maxtecken på 300?
    contactPerson: {
      name: { type: String, required: true },
      email: { type: String, required: true },
    },
    profileImageUrl: { type: String, default: "" },
    internshipDetails: { type: String }, // Internship (fritext)
  },
  { timestamps: true, collection: "CompanyProfile" }
);

const CompanyProfile = model("CompanyProfile", companyProfileSchema);

export default CompanyProfile;
