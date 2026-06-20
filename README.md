# 📚 StudySync — AI Study Planner

> Study smarter, not harder.

StudySync is a full-stack MERN application that helps students create AI-powered day-by-day study plans, track their progress and test themselves with AI-generated quizzes.

🌐 **Live Demo:** https://studysync-teal.vercel.app/

---

## ✨ Features

- 🔐 **Authentication** — Secure register/login with JWT
- 📖 **Subject Manager** — Add subjects with exam dates, difficulty and topics
- 🤖 **AI Study Plan** — Generates a personalized day-by-day plan based on your exam date
- ☑️ **Progress Tracker** — Mark study days as complete with visual progress bar
- 🧠 **AI Quiz Generator** — Generate MCQ quizzes from any subject or your own notes
- 📊 **Score Review** — See correct answers with explanations after every quiz
- 🏠 **Dashboard** — Upcoming exams countdown + quiz history

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React.js, React Router |
| Backend | Node.js, Express.js |
| Database | MongoDB, Mongoose |
| Authentication | JWT, bcryptjs |
| AI | OpenRouter API (Llama 4) |
| Deployment | Vercel (frontend), Render (backend) |

---

## 🚀 Getting Started

### Prerequisites
- Node.js installed
- MongoDB Atlas account
- OpenRouter API key (free at openrouter.ai)

### Clone the repo
```bash
git clone https://github.com/shatakshi-1404/studysync.git
cd studysync
```

### Backend Setup
```bash
cd server
npm install
```

Create `server/.env`:
```env
PORT=5000
MONGO_URI=your_mongodb_uri
JWT_SECRET=your_secret_key
OPENROUTER_API_KEY=your_openrouter_key
```

```bash
npm run dev
```

### Frontend Setup
```bash
cd client
npm install
npm start
```

---

## 📁 Project Structure
studysync/
├── client/                 # React frontend
│   └── src/
│       ├── api/            # Axios config
│       ├── components/     # Navbar, Loader, PrivateRoute
│       ├── context/        # Auth context
│       └── pages/          # Dashboard, Subjects, StudyPlan, Quiz
└── server/                 # Node.js backend
├── controllers/        # Business logic
├── models/             # Mongoose schemas
├── routes/             # API routes
└── middleware/         # Auth middleware

---

## 🌐 API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| POST | /api/auth/register | Register user |
| POST | /api/auth/login | Login user |
| GET | /api/subjects | Get all subjects |
| POST | /api/subjects | Add subject |
| DELETE | /api/subjects/:id | Delete subject |
| POST | /api/plans/generate/:id | Generate AI study plan |
| GET | /api/plans/:id | Get study plan |
| PATCH | /api/plans/:id/day/:index | Toggle day complete |
| POST | /api/quiz/generate | Generate AI quiz |
| POST | /api/quiz/submit/:id | Submit quiz answers |

---

## 🤝 Connect

Built by **Shatakshi** — actively looking for full-stack developer opportunities!

[![LinkedIn](https://img.shields.io/badge/LinkedIn-Connect-blue)](https://www.linkedin.com/in/shatakshi-prasad-9104772b8/)
[![GitHub](https://img.shields.io/badge/GitHub-Follow-black)](https://github.com/shatakshi-1404)
