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
    },
    TeacherName:{
        type: String,
    },
    email:{
        type: String,
    },
    Department:{
        type: String,
    }
    
},
 {
    Timestamp: true,
  })

  const Facultymodel = mongoose.model('Faculty', Facultyschema,'faculty')
  module.exports = Facultymodel; 
