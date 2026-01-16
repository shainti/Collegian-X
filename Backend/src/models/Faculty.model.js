const mongoose = require("mongoose");

const Facultyschema = new mongoose.Schema(
    {
    FacultyId: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    }
},
 {
    Timestamp: true,
  })

  const Facultymodel = mongoose.model('Faculty', Facultyschema)
  module.exports = Facultymodel; 
