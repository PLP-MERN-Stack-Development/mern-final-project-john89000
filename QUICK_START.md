# Quick Start Guide

This guide will help you get the Task Manager application running in minutes.

## 🚀 Quick Setup

### Step 1: Prerequisites Check

Make sure you have these installed:
```bash
node --version    # Should be v18 or higher
npm --version     # Comes with Node.js
mongod --version  # MongoDB (or use Atlas)
git --version
```

### Step 2: Clone and Install

```bash
# Clone the repository
git clone <your-repo-url>
cd mern-final-project-john89000

# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend
npm install
```

### Step 3: Set Up Environment Variables

**Backend (.env):**
```bash
cd backend
cp .env.example .env
# Edit .env with your values
```

**Frontend (.env):**
```bash
cd frontend
cp .env.example .env
# Edit .env if needed
```

### Step 4: Start MongoDB

**Option A - Local MongoDB:**
```bash
# Windows
net start MongoDB

# macOS/Linux
sudo service mongodb start
# OR
mongod --dbpath /path/to/data/directory
```

**Option B - MongoDB Atlas:**
- Get connection string from Atlas
- Update MONGODB_URI in backend/.env

### Step 5: Run the Application

**Terminal 1 - Backend:**
```bash
cd backend
npm run dev
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm run dev
```

### Step 6: Access the Application

- **Frontend:** http://localhost:3000
- **Backend API:** http://localhost:5000
- **API Health:** http://localhost:5000/api/health

## 🎯 First Steps After Running

1. **Register a New Account**
   - Go to http://localhost:3000/register
   - Create your account

2. **Create Your First Project**
   - Click "Create Project" on the dashboard
   - Fill in project details

3. **Add Tasks**
   - Open your project
   - Add tasks to get started

## 🐛 Common Issues

### Port Already in Use

**Problem:** Port 3000 or 5000 is already in use

**Solution:**
```bash
# Find process using port (Windows)
netstat -ano | findstr :3000

# Kill process (replace PID)
taskkill /PID <PID> /F

# Or change port in .env files
```

### MongoDB Connection Error

**Problem:** Cannot connect to MongoDB

**Solution:**
- Check if MongoDB is running
- Verify MONGODB_URI in .env
- Check network access in Atlas (if using)

### Module Not Found

**Problem:** Cannot find module errors

**Solution:**
```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install
```

## 📱 Using Docker (Alternative Method)

```bash
# Build and start all services
docker-compose up --build

# Access application
# Frontend: http://localhost:3000
# Backend: http://localhost:5000
```

## 🧪 Running Tests

```bash
# Backend tests
cd backend
npm test

# Frontend tests
cd frontend
npm test
```

## 📚 Next Steps

- Read the full [README.md](README.md)
- Review [API Documentation](API_DOCUMENTATION.md)
- Check [Deployment Guide](DEPLOYMENT.md)
- Explore the code and customize features

## 💡 Tips

- Use MongoDB Compass to view your database
- Install React Developer Tools for debugging
- Use Postman to test API endpoints
- Check browser console for frontend errors
- Check terminal for backend errors

## 🆘 Need Help?

- Check the [README.md](README.md) for detailed information
- Review error messages carefully
- Search for similar issues online
- Ask your course instructor

## 🎉 Success!

If you see the login page and can register/login, you're all set! Start exploring the features and building your task management workflow.

---

**Happy Coding!** 🚀
