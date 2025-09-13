# 🎯 GoalLab - AI-Powered Learning Platform  

![React](https://img.shields.io/badge/React-18.2.0-blue)  
![FastAPI](https://img.shields.io/badge/FastAPI-0.104.1-green)  
![MongoDB](https://img.shields.io/badge/MongoDB-6.0-green)  
![TailwindCSS](https://img.shields.io/badge/TailwindCSS-3.3.0-blue)  

GoalLab is an AI-powered learning platform that helps users achieve their goals through personalized learning journeys, progress tracking, and an AI tutor.  

---

## 🚀 Features  
- **User Authentication** – Secure JWT-based registration and login  
- **Goal Management** – Create, edit, and track learning goals  
- **AI-Powered Timeline Generation** – Automatic milestone creation based on goal complexity  
- **Progress Tracking** – Visual indicators and milestone completion  
- **AI Tutor** – Real-time conversational assistant via WebSocket  
- **Check-in System** – Regular progress assessments and reflections  
- **Responsive Design** – Works seamlessly on desktop and mobile  

---

## 🏗️ Project Architecture  

GoalLab/
├── backend/ # FastAPI Backend
│ ├── app/
│ │ ├── auth.py # Authentication utilities
│ │ ├── config.py # Configuration settings
│ │ ├── database.py # MongoDB connection
│ │ ├── main.py # FastAPI application
│ │ └── routes/ # API routes
│ │ ├── auth.py # Authentication endpoints
│ │ ├── goals.py # Goal management endpoints
│ │ ├── checkins.py # Check-in endpoints
│ │ └── progress.py # Progress tracking endpoints
│ ├── models/ # Data models
│ ├── schemas/ # Pydantic schemas
│ ├── requirements.txt # Python dependencies
│ └── .env # Environment variables
│
└── frontend/ # React Frontend
├── src/
│ ├── api/ # API clients
│ ├── components/ # React components
│ ├── redux/ # Redux store & slices
│ ├── App.jsx
│ └── main.jsx
├── package.json
├── tailwind.config.js
└── vite.config.js

---

## 🛠️ Installation & Setup  

### Prerequisites  
- Node.js 16+  
- Python 3.8+  
- MongoDB 6.0+  
- OpenAI API Key  

### Backend Setup  
```bash
cd backend
python -m venv venv
source venv/bin/activate   # On Windows: venv\Scripts\activate
pip install -r requirements.txt
Create .env in backend/:
MONGODB_URL=mongodb://localhost:27017
OPENAI_API_KEY=your_openai_api_key_here
SECRET_KEY=your-super-secret-jwt-key
ALGORITHM=HS256
Start MongoDB:
# macOS
brew services start mongodb/brew/mongodb-community

# Ubuntu
sudo systemctl start mongod

# Windows
net start MongoDB
Run backend:
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
API will be available at: http://localhost:8000
Frontend Setup
cd frontend
npm install
npm run dev
App will be available at: http://localhost:5173
📖 API Documentation
Swagger UI → http://localhost:8000/docs
ReDoc → http://localhost:8000/redoc
Method	Endpoint	Description
POST	/api/auth/register	User registration
POST	/api/auth/login	User login
GET	/api/goals	Get user goals
POST	/api/goals	Create new goal
PUT	/api/goals/{id}	Update goal
DELETE	/api/goals/{id}	Delete goal
WS	/ws/tutor/{user_id}	AI Tutor WebSocket
🎯 Usage Guide
Creating Your First Goal
Register/Login
Create Goal → “Create New Goal”
Choose AI-suggested/custom timeline
Add title, category, description, complexity
Track progress on dashboard
Using the AI Tutor
Navigate to AI Tutor
Ask questions about learning goals
Get explanations & guidance
Use quick suggestions
Regular Check-ins
Go to Check-in Section
Record accomplishments
Note challenges & plan next steps
🔧 Configuration
Backend Environment Variables
Variable	Description	Default
MONGODB_URL	MongoDB connection string	mongodb://localhost:27017
OPENAI_API_KEY	OpenAI API key	Required
SECRET_KEY	JWT secret key	Random string
ALGORITHM	JWT algorithm	HS256
Frontend Configuration
Update API base URL in src/api/auth.js and src/api/goals.js:
const API = axios.create({ baseURL: "http://localhost:8000/api" });
For production → set environment variables in hosting provider.
🧪 Testing
Backend Tests
cd backend
python -m pytest
python -m pytest --cov=app tests/
Frontend Tests
cd frontend
npm test
npm test -- --coverage
🤝 Contributing
Fork the repo
Create branch → git checkout -b feature/my-feature
Commit changes → git commit -m "Add feature"
Push branch → git push origin feature/my-feature
Open Pull Request
📝 License
This project is licensed under the MIT License. See LICENSE for details.
🆘 Support
If you face issues:
Check API docs
Review console errors
Verify environment variables
Ensure MongoDB is running
Or open an issue in this repository.
🙏 Acknowledgments
OpenAI – GPT integration
FastAPI – Backend framework
React + Redux – Frontend
MongoDB – Database
TailwindCSS – Styling utilities
