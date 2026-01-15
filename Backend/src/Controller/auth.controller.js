const StudentModel = require('../models/Student.model')

exports.registerstudents = async (req, res, next) =>{
const {FullName, email, CollegeRollNo, password } = req.body

const IsstudentExist = await StudentModel.findOne({
    CollegeRollNo
})

if(IsstudentExist){
    return res.status(400).json({
        message: "Student Already Exist"
    })
}
}