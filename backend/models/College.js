import mongoose from 'mongoose';

const collegeSchema = new mongoose.Schema({
  name: { type: String, required: true },
  country: { type: String, required: true },
  state: { type: String, required: true },
  tuition: { type: Number, required: true },
  requiredFitScore: { type: Number, required: true },
  topDomains: [{ type: String }] // 
});

//THE COMPOUND INDEX
//1 means sort in ascending order. This makes searching by location+ budget very fast
//instead of O(n) it will now take O(logN)
collegeSchema.index({ state: 1, tuition: 1 });

export default mongoose.model('College', collegeSchema);