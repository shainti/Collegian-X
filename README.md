<div align="center">

# 🎓 Collegian X

### Your Smart College Companion

**One dashboard for all your timetables, assignments, notices, books, chats, and reminders — designed to reduce confusion and save your time.**

[![Live Demo](https://img.shields.io/badge/🌐_Live_Demo-collegainx.vercel.app-blue?style=for-the-badge)](https://collegainx.vercel.app)
[![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://reactjs.org/)
[![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)](https://nodejs.org/)
[![MongoDB](https://img.shields.io/badge/MongoDB-47A248?style=for-the-badge&logo=mongodb&logoColor=white)](https://mongodb.com/)
[![Vercel](https://img.shields.io/badge/Vercel-000000?style=for-the-badge&logo=vercel&logoColor=white)](https://vercel.com/)

![Rating](https://img.shields.io/badge/Average_Rating-4.8⭐-yellow?style=flat-square)
![Reviews](https://img.shields.io/badge/Reviews-4_Students-green?style=flat-square)
![Recommend](https://img.shields.io/badge/Recommend-100%25-brightgreen?style=flat-square)

</div>

---

## 📌 Table of Contents

- [About the Project](#-about-the-project)
- [Live Demo](#-live-demo)
- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Project Structure](#-project-structure)
- [Getting Started](#-getting-started)
- [Screenshots](#-screenshots)
- [What Students Are Saying](#-what-students-are-saying)
- [Author](#-author)

---

## 🧠 About the Project

**Collegian X** is a full-stack college management web application built to solve a real problem — the chaos that college students and faculty face every day. Missing assignment deadlines, losing timetable PDFs, having no idea if your leave got approved, and hunting down your library books across different apps.

Collegian X puts everything in one place.

I built this project solo from scratch — designing the UI, building the REST API, setting up authentication for both students and faculty, and deploying it live. It's not a tutorial clone. It's a real product solving a real problem, and real students are already using and rating it.

> *"Collegian X is an impressive student management system website. It is user-friendly, well-organized, and efficient. It simplifies attendance, records, and communication, making academic management easier for students and faculty."* — Bhumika Sharma, Computer Science

---

## 🌐 Live Demo

🔗 **[https://collegainx.vercel.app](https://collegainx.vercel.app)**

You can log in as a **Student** or **Faculty** using separate portals.

---

## ✨ Features

### 👨‍🎓 Student Portal

| Feature | Description |
|---|---|
| 📅 **My Timetable** | View weekly class schedule with subject, teacher, room, and time slots. Download it as a file. |
| 📝 **My Assignments** | See assignments posted by faculty with due dates, attached files, and overdue status badges. |
| 📊 **Attendance Tracker** | Visual attendance overview per subject — percentage, progress bar, and status (Average / Good / Excellent). Guidelines for eligibility (75% minimum). |
| ✈️ **Leave Application** | Apply for sick/casual/emergency leave with date range, reason, and medical certificate upload. Track leave history with approval/rejection status and rejection reason. |
| 📢 **Notice Board** | Stay updated with institutional notices posted by faculty. |
| 📚 **Library** | Browse and access library books from your dashboard. |
| 🚨 **Complaint Desk** | Submit formal complaints with category, priority level (Low/Medium/High), description, and supporting documents (up to 10MB each). |
| 🤖 **AI Study Planner** | Powered by AI — enter your subjects, study hours, hardest topic, exam date, and learning style to receive a personalized study plan. |
| 💬 **Chat** | In-app messaging feature. |

### 👩‍🏫 Faculty Portal

| Feature | Description |
|---|---|
| 📝 **Update Assignments** | Post and manage assignments for students. |
| 📅 **Update Timetable** | Push timetable updates that reflect instantly on student dashboards. |
| 📊 **Update Attendance** | Mark and update student attendance records. |
| 📢 **Update Notices** | Publish institutional announcements. |
| ✈️ **Update Leaves** | Approve or reject student leave applications with a reason. |
| 🚨 **Check Complaints** | Review and manage student complaints. |

### 🌟 General

- Dual login system — separate portals for Students and Faculty
- Profile pages for both roles (read-only, managed by admin)
- Clean dark-themed UI with smooth animations
- Fully deployed and live with real users

---

## 🛠 Tech Stack

### Frontend
- **React.js** (Vite)
- **React Router** — client-side routing
- **Axios** — API communication
- **CSS / Custom Styling** — dark theme UI with animations

### Backend
- **Node.js** with **Express.js**
- **MongoDB** with **Mongoose** — database and models
- **JWT** — authentication for students and faculty
- **Multer** — file upload handling (assignments, certificates, complaints)
- **MVC Architecture** — Controllers, Models, Routes, Middleware

### Deployment
- **Frontend** → Vercel
- **Backend** → Cloud-hosted Node.js server

---

## 📁 Project Structure

```
Collegian_X/
│
├── Backend/
│   └── src/
│       ├── Controller/       # Business logic for all features
│       ├── db/               # MongoDB connection
│       ├── middleware/        # Auth middleware (JWT)
│       ├── models/           # Mongoose schemas
│       ├── routes/           # Express route definitions
│       ├── uploads/          # Uploaded files storage
│       ├── app.js
│       └── Server.js
│
└── Frontend/
    └── src/
        ├── assets/           # Images, icons
        ├── auth/             # Login/register components
        ├── components/       # Reusable UI components
        ├── Icons/            # Custom icon components
        ├── screens/          # Page-level components (Dashboard, Timetable, etc.)
        ├── api.js            # Axios API configuration
        ├── App.jsx           # Main app with routing
        └── main.jsx          # Entry point
```

---

## 🚀 Getting Started

### Prerequisites

Make sure you have the following installed:
- Node.js (v18+)
- MongoDB (local or Atlas)
- npm or yarn

### Clone the Repository

```bash
git clone https://github.com/your-username/Collegian_X.git
cd Collegian_X
```

### Backend Setup

```bash
cd Backend
npm install
```

Create a `.env` file inside `Backend/`:

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
```

Start the backend server:

```bash
npm run dev
```

### Frontend Setup

```bash
cd Frontend
npm install
```

Create a `.env` file inside `Frontend/`:

```env
VITE_API_URL=http://localhost:5000
```

Start the frontend:

```bash
npm run dev
```

The app will be running at `http://localhost:5173`

---

## 📸 Screenshots

| Landing Page | Student Dashboard |
|---|---|
| One-page overview of all features | Timetable, Assignments, Attendance |

| AI Study Planner | Faculty Panel |
|---|---|
| Personalized study plan by AI | Manage attendance, assignments, leaves |

> See the live demo at [collegainx.vercel.app](https://collegainx.vercel.app) for the full experience.

---

## 💬 What Students Are Saying

> *"I've watched this project grow step by step. Collegian X feels real, useful, and thoughtfully built. It shows how much care and learning went into every part."*
> — **Tanisha**, Computer Science

> *"As a friend, I've seen the effort behind this project. Collegian X is practical, clean, and genuinely useful, not just for show. It reflects real dedication and growth."*
> — **Bunty**, Computer Science

> *"Collegian X is an impressive student management system website. It simplifies attendance, records, and communication, making academic management easier for students and faculty."*
> — **Bhumika Sharma**, Computer Science

> *"As an alumnus, I found it reliable, user-friendly, and extremely helpful for accessing records and managing academics efficiently."*
> — **Alumni Reviewer**

---

## 👨‍💻 Author

**Built with ❤️ by a BCA student who wanted to solve real college problems.**

- 🔗 LinkedIn: *[your LinkedIn profile]*
- 💻 GitHub: *[your GitHub profile]*
- 🌐 Live Project: [collegainx.vercel.app](https://collegainx.vercel.app)

---

## 📄 License

This project is open for viewing and learning purposes. Please reach out before using it commercially.

---

<div align="center">

**⭐ If you found this project helpful or impressive, please star the repository!**

*Collegian X — Because college is already complicated enough.*

</div>