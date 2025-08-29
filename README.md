# 🎓 Student Portal – All-in-One Platform

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
