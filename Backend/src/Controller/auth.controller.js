const StudentModel = require("../models/Student.model");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { default: mongoose } = require("mongoose");
const Facultymodel = require("../models/Faculty.model");
const { check } = require("express-validator");

exports.registerstudents = async (req, res, next) => {
  const { FullName, email, Department, Semester, CollegeRollNo, password } =
    req.body;

  const Email = await StudentModel.findOne({ email });
  if (Email) {
    return res.status(400).json({
      errors: ["Student Already Exist"],
    });
  }

if (!CollegeRollNo || CollegeRollNo.length !== 4) {
  return res.status(400).json({
    errors: ["Enter 4 digit valid Roll No"],
  });
}

const rollnoCollection = mongoose.connection.db.collection("rollno");
const rollExists = await rollnoCollection.findOne({ CollegeRollNo });

if (!rollExists) {
  return res.status(400).json({
    errors: ["Roll number not found"],
  });
}

// then check duplicate student
const existingStudent = await StudentModel.findOne({ CollegeRollNo });
if (existingStudent) {
  return res.status(400).json({
    errors: ["Roll number already exists"],
  });
}

if (!password || password.length !== 8) {
  return res.status(400).json({
    errors: ["Enter 8 digit valid Password"],
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
  
const rollnoCollection = mongoose.connection.db.collection("rollno");
const rollExists = await rollnoCollection.findOne({ CollegeRollNo });
if(!rollExists){
    return res.status(400).json({
      errors: ["Invalid College Roll NO"],
    });
}

  
  const ispasswordvaild = await bcrypt.compare(password, Student.password);
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
      email: Student.email,
      CollegeRollNo: Student.CollegeRollNo,
      Department: Student.Department,
      Semester: Student.Semester,
      Url: rollExists.url,
    },
  });
};


exports.Facultylogin = async (req, res, next) => {
  console.log(req.body);
  const { FacultyId, password } = req.body;

  const Faculty = await Facultymodel.findOne({
    FacultyId,
  });
  console.log(Faculty);
  if (!Faculty) {
    return res.status(400).json({
      errors: ["Faculty not Found"],
    });
  }

  const ispasswordvaild = await bcrypt.compare(password, Faculty.password);
  console.log(ispasswordvaild);
  if (!ispasswordvaild) {
    return res.status(400).json({
      errors: ["FacultyId or Password not Found"],
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
      FacultyId: Faculty.FacultyId,
      TeacherName: Faculty.TeacherName,
      email: Faculty.email,
      Department: Faculty.Department,
    },
  });
};
