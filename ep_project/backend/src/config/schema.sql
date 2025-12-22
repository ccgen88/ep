-- Users Table
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    full_name VARCHAR(255) NOT NULL,
    role VARCHAR(20) NOT NULL CHECK (role IN ('admin', 'student', 'examiner')),
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Student Profile (additional info for students)
CREATE TABLE student_profiles (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    roll_number VARCHAR(50) UNIQUE,
    department VARCHAR(100),
    year INTEGER,
    section VARCHAR(10),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Question Bank
CREATE TABLE questions (
    id SERIAL PRIMARY KEY,
    question_text TEXT NOT NULL,
    question_type VARCHAR(20) NOT NULL CHECK (question_type IN ('mcq', 'descriptive', 'coding')),
    difficulty VARCHAR(20) CHECK (difficulty IN ('easy', 'medium', 'hard')),
    marks INTEGER NOT NULL DEFAULT 1,
    created_by INTEGER REFERENCES users(id),
    category VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- MCQ Options (only for MCQ questions)
CREATE TABLE question_options (
    id SERIAL PRIMARY KEY,
    question_id INTEGER REFERENCES questions(id) ON DELETE CASCADE,
    option_text TEXT NOT NULL,
    is_correct BOOLEAN DEFAULT false,
    option_order INTEGER
);

-- Exams
CREATE TABLE exams (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    duration INTEGER NOT NULL, -- in minutes
    total_marks INTEGER NOT NULL,
    passing_marks INTEGER NOT NULL,
    start_time TIMESTAMP NOT NULL,
    end_time TIMESTAMP NOT NULL,
    created_by INTEGER REFERENCES users(id),
    is_published BOOLEAN DEFAULT false,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Exam Questions Mapping
CREATE TABLE exam_questions (
    id SERIAL PRIMARY KEY,
    exam_id INTEGER REFERENCES exams(id) ON DELETE CASCADE,
    question_id INTEGER REFERENCES questions(id) ON DELETE CASCADE,
    question_order INTEGER,
    marks_override INTEGER, -- if different from question's default marks
    UNIQUE(exam_id, question_id)
);

-- Student Exam Assignments
CREATE TABLE student_exams (
    id SERIAL PRIMARY KEY,
    student_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    exam_id INTEGER REFERENCES exams(id) ON DELETE CASCADE,
    assigned_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(student_id, exam_id)
);

-- Exam Attempts
CREATE TABLE exam_attempts (
    id SERIAL PRIMARY KEY,
    student_id INTEGER REFERENCES users(id),
    exam_id INTEGER REFERENCES exams(id),
    start_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    end_time TIMESTAMP,
    submitted_at TIMESTAMP,
    is_submitted BOOLEAN DEFAULT false,
    total_score INTEGER,
    percentage DECIMAL(5,2),
    status VARCHAR(20) DEFAULT 'in_progress' CHECK (status IN ('in_progress', 'submitted', 'graded', 'expired'))
);

-- Student Answers
CREATE TABLE student_answers (
    id SERIAL PRIMARY KEY,
    attempt_id INTEGER REFERENCES exam_attempts(id) ON DELETE CASCADE,
    question_id INTEGER REFERENCES questions(id),
    answer_text TEXT,
    selected_option_id INTEGER REFERENCES question_options(id),
    marks_obtained INTEGER,
    is_correct BOOLEAN,
    graded_by INTEGER REFERENCES users(id),
    feedback TEXT,
    saved_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Results
CREATE TABLE results (
    id SERIAL PRIMARY KEY,
    attempt_id INTEGER REFERENCES exam_attempts(id) ON DELETE CASCADE,
    student_id INTEGER REFERENCES users(id),
    exam_id INTEGER REFERENCES exams(id),
    total_marks_obtained INTEGER,
    total_marks INTEGER,
    percentage DECIMAL(5,2),
    status VARCHAR(20) CHECK (status IN ('pass', 'fail')),
    graded_by INTEGER REFERENCES users(id),
    graded_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for better performance
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_role ON users(role);
CREATE INDEX idx_exams_created_by ON exams(created_by);
CREATE INDEX idx_questions_created_by ON questions(created_by);
CREATE INDEX idx_student_exams_student ON student_exams(student_id);
CREATE INDEX idx_student_exams_exam ON student_exams(exam_id);
CREATE INDEX idx_exam_attempts_student ON exam_attempts(student_id);
CREATE INDEX idx_exam_attempts_exam ON exam_attempts(exam_id);