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
    const { name, role, rating, tag, message } = req.body;

    // .create() already saves — no need for .save()
    const review = await ReviewModel.create({ name, role, rating, tag, message });

    res.status(201).json({
      success: true,
      data:    review,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
