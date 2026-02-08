const StudentModel = require("../models/Student.model");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { default: mongoose } = require("mongoose");
const Facultymodel = require("../models/Faculty.model");
const { check } = require("express-validator");
const  sendverificationcode = require('../middleware/Email.confiq')

exports.registerstudents = async (req, res, next) => {
  try {
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

    const existingStudent = await StudentModel.findOne({ CollegeRollNo });
    if (existingStudent) {
      return res.status(400).json({
        errors: ["Roll number already exists"],
      });
    }

    if (!password || password.length < 8) {
      return res.status(400).json({
        errors: ["Enter 8 digit valid Password"],
      });
    }

    const hashpassword = await bcrypt.hash(password, 10);

    const VerificationCode = Math.floor(100000 + Math.random() * 900000).toString();

    const Student = await StudentModel.create({
      FullName,
      email,
      Department,
      Semester,
      CollegeRollNo,
      password: hashpassword,
      VerificationCode,
    });


    try {
      await sendverificationcode(Student.email, VerificationCode);
      
      res.status(201).json({
        message: "Student Registered Successfully. Verification code sent to your email.",
        Student: {
          _id: Student._id,
          FullName: Student.FullName,
          email: Student.email,
          Department: Student.Department,
          Semester: Student.Semester,
          CollegeRollNo: Student.CollegeRollNo,
        },
      });
    } catch (emailError) {
      // If email fails, delete the student and return error
      await StudentModel.findByIdAndDelete(Student._id);
      console.error("Email send error:", emailError);
      
      return res.status(500).json({
        errors: ["Failed to send verification email. Please try registering again."],
      });
    }
  } catch (error) {
    console.error("Registration error:", error);
    return res.status(500).json({
      errors: ["Server error during registration. Please try again."],
    });
  }
};

exports.verifyMail = async (req, res) => {
  try {
    const { email, verificationCode } = req.body;
    console.log(email,verificationCode);
    if (!email || !verificationCode) {
      return res.status(400).json({
        errors: ["Email and verification code are required"],
      });
    }

    const student = await StudentModel.findOne({ email });

    if (!student) {
      return res.status(404).json({
        errors: ["Student not found"],
      });
    }

    if (student.isverified) {
      return res.status(400).json({
        errors: ["Email already verified"],
      });
    }

    if (student.VerificationCode !== verificationCode) {
      return res.status(400).json({
        errors: ["Invalid verification code"],
      });
    }

    student.isverified = true;
    student.VerificationCode = null;

    await student.save();

    res.status(200).json({
      message: "Email verified successfully",
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({
      errors: ["Server error"],
    });
  }
};



exports.loginstudents = async (req, res, next) => {
  const { email, CollegeRollNo, Department, password } = req.body;
  const Student = await StudentModel.findOne({
    CollegeRollNo,
  });

  if (!Student) {
    return res.status(400).json({
      errors: ["invalid College Roll No"],
    });
  }
  if (Student.isverified !== true) {
    await StudentModel.findByIdAndDelete(Student._id);
  
    return res.status(403).json({
      errors: ["Email not verified. Student registration removed."],
    });
  }



  if (Student.email !== email) {
    return res.status(400).json({
      errors: ["Invalid Email or Password"],
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
  if (!Faculty) {
    return res.status(400).json({
      errors: ["Faculty not Found"],
    });
  }

  const ispasswordvaild = await bcrypt.compare(password, Faculty.password);
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
    Faculty: {
      id: Faculty._id,
      FacultyId: Faculty.FacultyId,
      TeacherName: Faculty.TeacherName,
      email: Faculty.email,
      Department: Faculty.Department,
    },
  });
};
