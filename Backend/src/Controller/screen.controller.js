const mongoose = require("mongoose");
const ReviewModel = require('../models/Reviews.model')

exports.getReviews = async (req, res) => {
  try {
    const reviews = await ReviewModel.find().sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count:   reviews.length,
      data:    reviews,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.postReviews = async (req, res) => {
  try {
    const { name, userId, role, rating, tag, message } = req.body; // ✅ added userId

      if (userId) {
      const existing = await ReviewModel.findOne({ userId });
      if (existing) {
        return res.status(400).json({
          success: false,
          message: "You have already posted a review!",
        });
      }
    }
    const review = await ReviewModel.create({ name, userId, role, rating, tag, message }); // ✅ removed useless find()

    res.status(201).json({
      success: true,
      data: review,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
