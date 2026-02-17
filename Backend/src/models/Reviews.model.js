const mongoose = require('mongoose')

const reviewSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    role: { type: String, trim: true, default: "Student" },
    rating: { type: Number, required: true, min: 1, max: 5 },
    tag: { type: String, trim: true, default: "Reviewer" },
    message: { type: String, required: true, trim: true },
  },
  { timestamps: true },
);

const ReviewModel = mongoose.model("Reviews",reviewSchema);
module.exports = ReviewModel;