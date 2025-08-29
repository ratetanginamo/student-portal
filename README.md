# 🎓 Student Portal – All-in-One Platform

![Student Portal Logo](web/assets/logo.png)

A **full-stack Student Portal** built with **React (frontend)** and **Node.js + Express + SQLite (backend)**.  
This platform centralizes everything a student needs into one app: courses, assignments, announcements, chat, grades, and attendance.

---

## ✨ Features

- 📚 **Courses & Assignments** – view syllabus, deadlines, and submissions.
- 📝 **Announcements** – teachers/admins post updates, visible to all students.
- 💬 **Real-time Chat** – student-to-student and teacher-student messaging (via Socket.io).
- 📊 **Grades & Attendance** – transparent tracking system.
- 📂 **File Sharing** – upload & download study resources.
- 🔑 **Authentication & Roles** – JWT-based login (Student / Teacher / Admin).
- 📱 **Cross-platform** – works on web, and runs on Android via Termux.

---

## 🌄 Screenshots

### Portal Homepage
![Portal Homepage](web/assets/homepage.png "Student Portal Home")

### Courses & Assignments
![Courses & Assignments](web/assets/courses.png "View and manage courses and assignments")

### Real-time Chat
![Real-time Chat](web/assets/chat.png "Student and Teacher Chat Feature")

### Grades & Attendance
![Grades & Attendance](web/assets/grades.png "Track academic performance and attendance")

---

## 📂 Project Structure

```bash
student-portal/
│── backend/         # Node.js + Express + SQLite API
│   ├── server.js
│   ├── package.json
│   └── database.sqlite (auto-created)
│
│── frontend/        # React app
│   ├── src/
│   ├── public/
│   └── package.json
│
└── README.md
