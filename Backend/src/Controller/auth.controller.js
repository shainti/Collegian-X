const StudentModel = require("../models/Student.model");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { default: mongoose } = require("mongoose");
const Facultymodel = require("../models/Faculty.model");

exports.registerstudents = async (req, res, next) => {
  const { FullName, email, Department, Semester, CollegeRollNo, password } = req.body;

  const IsstudentExist = await StudentModel.findOne({
    CollegeRollNo,
  });

  if (IsstudentExist) {
    return res.status(400).json({
      message: "Student Already Exist",
    });
  }
  const hashpassword = await bcrypt.hash(password, 10);
  const Student = await StudentModel.create({
    FullName,
    email,
    Department,
    Semester,
    CollegeRollNo,
    password: hashpassword,
  });

  const token = jwt.sign(
    {
      id: Student._id,
    },
    process.env.JWT_SECRET);

  res.cookie("token", token);
  res.status(201).json({
    message: "Student Register Successfully",
    Student: {
      _id: Student._id,
      FullName: Student.FullName,
      email: Student.email,
      Department: Student.Department,
      Semester: Student.Semester,
      CollegeRollNo: Student.CollegeRollNo,
    },
  });
};

exports.loginstudents = async (req, res, next) => {
  const { email, CollegeRollNo, Department, password } = req.body;

  const Student = await StudentModel.findOne({
    email,
    CollegeRollNo,
  });
  if (!Student) {
    res.status(400).json({
      Message: "invalid email or password",
    });
  }
  const ispasswordvaild = await bcrypt.compare(password, Student.password);
  if (!ispasswordvaild) {  
    res.status(400).json({  
      Message: "invalid email or password",
    });
  }
  console.log("student ho gya");
  const token = jwt.sign({
    id: Student._id,
  },process.env.JWT_SECRET)

  res.cookie("token", token);
  res.status(200).json({
    Message: "Studetnt Login Sucsessfully",
    Student:{
        id: Student._id,
        FullName: Student.FullName,
        CollegeRollNo: Student.CollegeRollNo,
        Department: Student.Department
    }
  })
};

exports.logoutstudent = (req, res, next) => {
        res.clearCookie("token");
        res.status(200).json({
            Message: "Student Logout Successfully"
        });
};

exports.Facultylogin = async (req, res, next) => {

  const {FacultyId, password} = req.body

  const faculty = await Facultymodel.findOne({
    FacultyId
  })
  if(!faculty){
    res.status(400).json({
      message: "Faculty not found"
    })
  }

  const ispasswordvaild = await bcrypt.compare(password, faculty.password);
  if(!ispasswordvaild){
    res.status(400).json({
      message: "Invaild id or password"
    })
  }
    const token = jwt.sign({
    id: faculty._id,
  },process.env.JWT_SECRET)

  res.cookie("token", token);
  res.status(200).json({
    Message: "Faculty Login Sucsessfully",
    Student:{
        id: faculty._id,
        Faculty: faculty.FacultyId
    }
  })
}