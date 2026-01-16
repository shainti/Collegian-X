const mongoose = require("mongoose");

const Facultyschema = new mongoose.Schema(
    {
    FacultyId: {
        type: Number,
        required: true
    },
    password: {
        type: Number,
        required: true
    }
},
 {
    Timestamp: true,
  })

  const Facultymodel = mongoose.model('Faculty', Facultyschema)
  module.exports = Facultymodel; 
