import { Schema, model } from 'mongoose';

const testDevSchema = new Schema({
  name: { type: String },
  email: { type: String }, 
  course: { type: String, enum: ["dd", "wu"] },
}, { timestamps: true, collection: 'TestDev' }); 


const TestDev = model('TestDev', testDevSchema);

export default TestDev;