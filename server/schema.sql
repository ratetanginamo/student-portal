PRAGMA foreign_keys = ON;

CREATE TABLE IF NOT EXISTS users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  role TEXT CHECK(role IN ('student','teacher','admin')) NOT NULL DEFAULT 'student',
  email TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  full_name TEXT NOT NULL,
  program TEXT,
  year_level INTEGER DEFAULT 1,
  avatar_url TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS courses (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  code TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  teacher_id INTEGER NOT NULL,
  FOREIGN KEY(teacher_id) REFERENCES users(id)
);

CREATE TABLE IF NOT EXISTS enrollments (
  user_id INTEGER NOT NULL,
  course_id INTEGER NOT NULL,
  role TEXT CHECK(role IN ('student','teacher')) NOT NULL,
  PRIMARY KEY (user_id, course_id),
  FOREIGN KEY(user_id) REFERENCES users(id),
  FOREIGN KEY(course_id) REFERENCES courses(id)
);

CREATE TABLE IF NOT EXISTS announcements (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  course_id INTEGER,
  author_id INTEGER NOT NULL,
  content TEXT NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY(course_id) REFERENCES courses(id),
  FOREIGN KEY(author_id) REFERENCES users(id)
);

CREATE TABLE IF NOT EXISTS assignments (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  course_id INTEGER NOT NULL,
  title TEXT NOT NULL,
  instructions TEXT,
  due_at DATETIME,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY(course_id) REFERENCES courses(id)
);

CREATE TABLE IF NOT EXISTS submissions (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  assignment_id INTEGER NOT NULL,
  student_id INTEGER NOT NULL,
  file_path TEXT,
  note TEXT,
  submitted_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  grade REAL,
  feedback TEXT,
  FOREIGN KEY(assignment_id) REFERENCES assignments(id),
  FOREIGN KEY(student_id) REFERENCES users(id)
);

CREATE TABLE IF NOT EXISTS attendance (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  course_id INTEGER NOT NULL,
  session_date DATE NOT NULL,
  student_id INTEGER NOT NULL,
  status TEXT CHECK(status IN ('present','late','absent')) NOT NULL,
  recorded_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(course_id, session_date, student_id),
  FOREIGN KEY(course_id) REFERENCES courses(id),
  FOREIGN KEY(student_id) REFERENCES users(id)
);

CREATE TABLE IF NOT EXISTS messages (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  room TEXT NOT NULL,
  author_id INTEGER NOT NULL,
  body TEXT NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY(author_id) REFERENCES users(id)
);

CREATE TABLE IF NOT EXISTS files (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  course_id INTEGER,
  uploader_id INTEGER NOT NULL,
  filename TEXT NOT NULL,
  path TEXT NOT NULL,
  uploaded_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY(course_id) REFERENCES courses(id),
  FOREIGN KEY(uploader_id) REFERENCES users(id)
);
