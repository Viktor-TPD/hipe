import { Schema, model } from "mongoose";

const likedSchema = new Schema(
  {
    studentId: {
      type: Schema.Types.ObjectId,
      ref: "StudentProfile",
      required: true,
    },
    companyId: {
      type: Schema.Types.ObjectId,
      ref: "CompanyProfile",
      required: true,
    },
    info: {
      type: String,
    },
  },
  { timestamps: true, collection: "Liked" }
);

const Liked = model("Liked", likedSchema);

export default Liked;
