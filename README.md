# 📋 Task Manager - MERN Stack Application

A comprehensive full-stack task management system built with MongoDB, Express.js, React.js, and Node.js. This application enables teams to collaborate on projects, manage tasks, and track progress in real-time.

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Node](https://img.shields.io/badge/node-%3E%3D18.0.0-brightgreen)
![React](https://img.shields.io/badge/react-18.2.0-blue)

## 🚀 Live Demo

- **Frontend:** [Coming Soon]
- **Backend API:** [Coming Soon]
- **Video Demo:** [Coming Soon]

## ✨ Features

### Core Functionality
- 🔐 **User Authentication** - Secure JWT-based authentication with password encryption
- 👥 **Project Management** - Create, update, and organize projects with team collaboration
- ✅ **Task Tracking** - Comprehensive task management with status, priority, and assignments
- 💬 **Real-time Updates** - Live notifications and updates using Socket.io
- 📊 **Dashboard Analytics** - Visual insights into project and task statistics
- 🎨 **Responsive Design** - Mobile-friendly interface with modern UI/UX

### Technical Features
- RESTful API with proper error handling
- MongoDB database with Mongoose ODM
- State management with Zustand
- Form validation with React Hook Form
- React Query for data fetching and caching
- Comprehensive testing suite
- Docker containerization
- CI/CD ready deployment configuration

## 📋 Table of Contents

- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Environment Variables](#environment-variables)
- [Running the Application](#running-the-application)
- [Testing](#testing)
- [API Documentation](#api-documentation)
- [Deployment](#deployment)
- [Project Structure](#project-structure)
- [Technologies Used](#technologies-used)
- [Contributing](#contributing)
- [License](#license)

## 🔧 Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v18 or higher) - [Download](https://nodejs.org/)
- **MongoDB** (local or Atlas account) - [Download](https://www.mongodb.com/try/download/community) or [Atlas](https://www.mongodb.com/cloud/atlas)
- **npm** or **yarn** - Comes with Node.js
- **Git** - [Download](https://git-scm.com/)

## 📦 Installation

### 1. Clone the Repository

\`\`\`bash
git clone <your-repo-url>
cd mern-final-project-john89000
\`\`\`

### 2. Install Backend Dependencies

\`\`\`bash
cd backend
npm install
\`\`\`

### 3. Install Frontend Dependencies

\`\`\`bash
cd ../frontend
npm install
\`\`\`

## 🔐 Environment Variables

### Backend (.env)

Create a \`.env\` file in the \`backend\` directory:

\`\`\`env
# Server Configuration
PORT=5000
NODE_ENV=development

# MongoDB Configuration
MONGODB_URI=mongodb://localhost:27017/taskmanager
# For MongoDB Atlas: mongodb+srv://username:password@cluster.mongodb.net/taskmanager

# JWT Configuration
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production
JWT_EXPIRE=7d

# CORS Configuration
CLIENT_URL=http://localhost:3000

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
\`\`\`

### Frontend (.env)

Create a \`.env\` file in the \`frontend\` directory:

\`\`\`env
VITE_API_URL=http://localhost:5000/api
\`\`\`

## 🚀 Running the Application

### Development Mode

#### Option 1: Run Separately

**Backend:**
\`\`\`bash
cd backend
npm run dev
\`\`\`
Server runs on http://localhost:5000

**Frontend:**
\`\`\`bash
cd frontend
npm run dev
\`\`\`
App runs on http://localhost:3000

#### Option 2: Using Docker Compose

\`\`\`bash
# Build and start all services
docker-compose up --build

# Stop services
docker-compose down
\`\`\`

### Production Mode

#### Backend
\`\`\`bash
cd backend
npm start
\`\`\`

#### Frontend
\`\`\`bash
cd frontend
npm run build
npm run preview
\`\`\`

## 🧪 Testing

### Backend Tests

\`\`\`bash
cd backend
npm test              # Run tests once
npm run test:watch    # Run tests in watch mode
\`\`\`

### Frontend Tests

\`\`\`bash
cd frontend
npm test              # Run tests
npm run test:ui       # Run tests with UI
\`\`\`

## 📚 API Documentation

### Authentication Endpoints

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | /api/auth/register | Register new user | No |
| POST | /api/auth/login | Login user | No |
| GET | /api/auth/me | Get current user | Yes |
| PUT | /api/auth/update-profile | Update profile | Yes |
| PUT | /api/auth/change-password | Change password | Yes |

### Projects Endpoints

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | /api/projects | Get all projects | Yes |
| GET | /api/projects/:id | Get project by ID | Yes |
| POST | /api/projects | Create new project | Yes |
| PUT | /api/projects/:id | Update project | Yes |
| DELETE | /api/projects/:id | Delete project | Yes |
| POST | /api/projects/:id/members | Add member | Yes |
| DELETE | /api/projects/:id/members/:userId | Remove member | Yes |

### Tasks Endpoints

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | /api/tasks | Get all tasks | Yes |
| GET | /api/tasks/:id | Get task by ID | Yes |
| POST | /api/tasks | Create new task | Yes |
| PUT | /api/tasks/:id | Update task | Yes |
| DELETE | /api/tasks/:id | Delete task | Yes |
| POST | /api/tasks/:id/comments | Add comment | Yes |

### Example Request

\`\`\`bash
# Register a new user
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "password": "password123"
  }'

# Login
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "password123"
  }'

# Get projects (with auth token)
curl -X GET http://localhost:5000/api/projects \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
\`\`\`

## 🌐 Deployment

### Deploy Backend (Render/Railway/Heroku)

1. Create a new web service
2. Connect your GitHub repository
3. Set environment variables
4. Deploy from the \`backend\` directory

### Deploy Frontend (Vercel/Netlify)

1. Connect your GitHub repository
2. Set build command: \`npm run build\`
3. Set publish directory: \`build\`
4. Set environment variables
5. Deploy

### Deploy with Docker

\`\`\`bash
# Build images
docker-compose build

# Run containers
docker-compose up -d

# View logs
docker-compose logs -f
\`\`\`

## 📁 Project Structure

\`\`\`
mern-final-project-john89000/
├── backend/
│   ├── models/              # Mongoose models
│   ├── routes/              # API routes
│   ├── middleware/          # Custom middleware
│   ├── __tests__/           # Test files
│   ├── server.js            # Entry point
│   ├── package.json
│   └── Dockerfile
├── frontend/
│   ├── src/
│   │   ├── components/      # React components
│   │   ├── pages/           # Page components
│   │   ├── services/        # API services
│   │   ├── store/           # State management
│   │   ├── App.jsx          # Main App component
│   │   └── main.jsx         # Entry point
│   ├── public/
│   ├── package.json
│   ├── vite.config.js
│   └── Dockerfile
├── docker-compose.yml
├── .gitignore
└── README.md
\`\`\`

## 🛠️ Technologies Used

### Backend
- **Node.js** - JavaScript runtime
- **Express.js** - Web framework
- **MongoDB** - NoSQL database
- **Mongoose** - ODM for MongoDB
- **JWT** - Authentication
- **bcryptjs** - Password hashing
- **Socket.io** - Real-time communication
- **Jest** - Testing framework
- **Helmet** - Security middleware
- **Morgan** - HTTP logger

### Frontend
- **React** - UI library
- **Vite** - Build tool
- **React Router** - Routing
- **Zustand** - State management
- **React Query** - Data fetching
- **React Hook Form** - Form handling
- **Axios** - HTTP client
- **Socket.io Client** - Real-time updates
- **React Hot Toast** - Notifications
- **React Icons** - Icon library

## 👨‍💻 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (\`git checkout -b feature/AmazingFeature\`)
3. Commit your changes (\`git commit -m 'Add some AmazingFeature'\`)
4. Push to the branch (\`git push origin feature/AmazingFeature\`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 👤 Author

**Your Name**
- GitHub: [@john89000](https://github.com/john89000)
- Email: your.email@example.com

## 🙏 Acknowledgments

- [MongoDB Documentation](https://docs.mongodb.com/)
- [Express.js Documentation](https://expressjs.com/)
- [React Documentation](https://react.dev/)
- [Node.js Documentation](https://nodejs.org/en/docs/)
- PLP MERN Stack Development Course

## 📞 Support

If you have any questions or need help, please:
- Open an issue on GitHub
- Contact the course instructor
- Refer to the official documentation

---

**Note:** Remember to replace placeholder URLs with actual deployment links and update the author information before final submission. 