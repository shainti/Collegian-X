const StudentModel = require("../models/Student.model");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { default: mongoose } = require("mongoose");
const Facultymodel = require("../models/Faculty.model");

exports.registerstudents = async (req, res, next) => {
  const { FullName, email, Department, Semester, CollegeRollNo, password } =
    req.body;

  const existingStudent = await StudentModel.findOne({
    $or: [{ email }, { CollegeRollNo }],
  });
  if (existingStudent) {
    return res.status(400).json({
      errors: ["Student Already Exist"],
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
    process.env.JWT_SECRET,
  );

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
  });
  if (!Student) {
    return res.status(400).json({
      errors: ["invalid Email or password"],
    });
  }
  if (Student.CollegeRollNo !== CollegeRollNo) {
    return res.status(400).json({
      errors: ["Invalid College Roll NO"],
    });
  }
  const ispasswordvaild = await bcrypt.compare(password, Student.password);
  console.log(ispasswordvaild)
  if (!ispasswordvaild) {
    return res.status(400).json({
      errors: ["invalid Email or password"],
    });
  }
  if (Student.Department !== Department) {
    return res.status(400).json({
      errors: ["Invalid department"],
    });
  }
  console.log("student ho gya");
  const token = jwt.sign(
    {
      id: Student._id,
    },
    process.env.JWT_SECRET,
  );

  res.cookie("token", token);
  res.status(200).json({
    Message: "Studetnt Login Sucsessfully",
    token,
    Student: {
      id: Student._id,
      FullName: Student.FullName,
      CollegeRollNo: Student.CollegeRollNo,
      Department: Student.Department,
    },
  });
};

exports.logoutstudent = (req, res, next) => {
  res.clearCookie("token");
  res.status(200).json({
    Message: "Student Logout Successfully",
  });
};

exports.Facultylogin = async (req, res, next) => {
  console.log(req.body);
  const { FacultyId, password } = req.body;

  const Faculty = await Facultymodel.findOne({
    FacultyId
  });
  console.log(Faculty);
  if (!Faculty) {
     return res.status(400).json({
      errors: ["Faculty not Found"]
    });
  }

  const ispasswordvaild = await bcrypt.compare(password, Faculty.password);
  console.log(ispasswordvaild)
  if (!ispasswordvaild) {
     return res.status(400).json({
      errors: ["FacultyId or Password not Found"]
    });
  }
  const token = jwt.sign(
    {
      id: Faculty._id,
    },
    process.env.JWT_SECRET,
  );

  res.cookie("token", token);
  res.status(200).json({
    Message: "Faculty Login Sucsessfully",
    token,
    Faculty: {
      id: Faculty._id,
      Faculty: Faculty.FacultyId,
    },
  });
};
