# MacroTrack

A comprehensive nutrition tracking application that helps you monitor your daily macronutrient intake, calories, and food consumption. Track your fitness goals effortlessly with real-time progress visualization.

![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)
![Express](https://img.shields.io/badge/Express-000000?style=for-the-badge&logo=express&logoColor=white)
![MySQL](https://img.shields.io/badge/MySQL-005C84?style=for-the-badge&logo=mysql&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)

---

## 📋 Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Architecture Overview](#architecture-overview)
- [System Flow & Workflow](#system-flow--workflow)
- [How It Works](#how-it-works)
- [Project Structure](#project-structure)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Configuration](#configuration)
- [Running the Application](#running-the-application)
- [Usage](#usage)
- [API Endpoints](#api-endpoints)
- [Database Schema](#database-schema)
- [Contributing](#contributing)
- [License](#license)

---

## Features

- **User Authentication**: Secure sign-up and login system with encrypted passwords
- **Daily Macro Tracking**: Monitor your protein, carbohydrates, and fats intake
- **Calorie Counting**: Track daily calorie consumption with visual progress bars
- **Food Logging**: Log foods with their macronutrient and calorie information
- **Progress Visualization**: View your daily progress with interactive progress bars
- **User Dashboard**: Centralized dashboard to view all tracking data
- **Session Management**: Persistent user sessions with secure cookie-based authentication
- **Responsive Design**: Works seamlessly on desktop and mobile devices
- **User Profile**: Manage your account information and preferences

---

## Tech Stack

### Backend
- **Runtime**: Node.js
- **Framework**: Express.js (v5.2.1)
- **Database**: MySQL with mysql2 driver
- **Authentication**: bcrypt (password hashing), express-session
- **Security**: CORS, HTTP-only cookies
- **Environment Management**: dotenv

### Frontend
- **HTML5**: Semantic markup
- **CSS3**: Responsive styling
- **Vanilla JavaScript**: Client-side logic
- **Bootstrap/CSS Framework**: Responsive design

---

## Architecture Overview

### **High-Level Architecture Diagram**

```
┌────────────────────────────────────────────────────────────────┐
│                        CLIENT LAYER                            │
│                    (Frontend - Browser)                        │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │  HTML Pages (.html)    |  CSS Styles (.css)              │  │
│  │  - index.html          │  - Responsive design            │  │
│  │  - login.html          │  - UI Components                │  │
│  │  - signup.html         │  - Progress bars                │  │
│  │  - dashboard.html      │                                 │  │
│  │  - profile.html        │  JavaScript Files (.js)         │  │
│  │  - contact.html        │  - API requests (fetch)         │  │
│  │                        │  - Form handling                │  │
│  │                        │  - DOM manipulation             │  │
│  └──────────────────────────────────────────────────────────┘  │
└────────────────────────────────────────────────────────────────┘
                            ↕ HTTP/HTTPS
                        (JSON Requests)
┌─────────────────────────────────────────────────────────────────┐
│                     SERVER LAYER                                │
│                   (Backend - Express.js)                        │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │ server.js (Entry Point)                                  │   │
│  │ - Port: 5000                                             │   │
│  │ - Middleware: CORS, Session, JSON Parser                 │   │
│  │                                                          │   │
│  │ Routes:                                                  │   │
│  │ ├─ /auth (Authentication)                                │   │
│  │ │  ├─ POST /register      → User signup                  │   │
│  │ │  ├─ POST /login         → User login                   │   │
│  │ │  ├─ POST /logout        → Logout & destroy session     │   │
│  │ │  └─ GET /profile        → Get user info                │   │
│  │ │                                                        │   │
│  │ └─ /tracker (Nutrition Tracking)                         │   │
│  │    ├─ POST /goal          → Set macro goals              │   │
│  │    ├─ POST /log           → Log food entry               │   │
│  │    ├─ GET /today          → Get today's progress         │   │
│  │    └─ DELETE /today       → Clear today's logs           │   │
│  └──────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────┘
                            ↕ Database Queries
┌────────────────────────────────────────────────────────────────┐
│                    DATABASE LAYER                              │
│                    (MySQL Database)                            │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │ Database: macrotrack                                     │  │
│  │                                                          │  │
│  │ Tables:                                                  │  │
│  │ ├─ users (User accounts & profile info)                  │  │
│  │ ├─ goals (Daily macro & calorie targets)                 │  │
│  │ └─ food_logs (Daily food intake logs)                    │  │
│  └──────────────────────────────────────────────────────────┘  │
└────────────────────────────────────────────────────────────────┘
```

### **Component Diagram**

```
┌──────────────────┐
│   User Browser   │
│                  │
│  ┌─────────────┐ │
│  │ HTML Pages  │ │
│  └──────┬──────┘ │
│         │ fetch  │
│  ┌──────▼───────┐│
│  │  JavaScript  ││
│  │ (API Client) ││
│  └──────┬───────┘│
└─────────┼────────┘
          │ HTTP/AJAX
          ▼
┌──────────────────────────────┐
│    Express.js Server         │
│                              │
│  ┌────────────────────────┐  │
│  │  Authentication Routes │  │
│  │  (Middleware: Session) │  │
│  └──────────┬─────────────┘  │
│             │                │
│  ┌──────────▼─────────────┐  │
│  │  Tracker Routes        │  │
│  │  (Middleware: Auth)    │  │
│  └──────────┬─────────────┘  │
│             │                │
│  ┌──────────▼─────────────┐  │
│  │  MySQL Connection      │  │
│  │  (Database Layer)      │  │
│  └────────────────────────┘  │
└──────────────────────────────┘
          │
          │ SQL Queries
          ▼
┌──────────────────────────────┐
│   MySQL Database             │
│                              │
│  ├─ users table              │
│  ├─ goals table              │
│  └─ food_logs table          │
└──────────────────────────────┘
```

---

## System Flow & Workflow

### **User Authentication Flow**

```
START
  │
  ├─→ User visits http://localhost:5000
  │   └─→ Server serves index.html
  │
  ├─→ User clicks "Sign Up"
  │   ├─→ Browser loads signup.html
  │   ├─→ User enters: name, email, password, age, weight, height, activity_level
  │   ├─→ JavaScript sends POST to /auth/register
  │   │
  │   └─→ Server (auth.js) processes:
  │       ├─→ Validate input data
  │       ├─→ Check if email already exists
  │       ├─→ Hash password with bcrypt (10 rounds)
  │       ├─→ Insert user into 'users' table
  │       ├─→ Regenerate session
  │       ├─→ Set session.userId
  │       └─→ Return success (201)
  │
  │   └─→ Frontend redirects to dashboard
  │
  ├─→ User clicks "Login"
  │   ├─→ Browser loads login.html
  │   ├─→ User enters: email, password
  │   ├─→ JavaScript sends POST to /auth/login
  │   │
  │   └─→ Server (auth.js) processes:
  │       ├─→ Validate input (email, password required)
  │       ├─→ Query users table for email
  │       ├─→ Compare password with bcrypt.compare()
  │       ├─→ If match → Regenerate session
  │       ├─→ Set session.userId
  │       └─→ Return success (200)
  │
  │   └─→ Frontend redirects to dashboard
  │
  └─→ User clicks "Logout"
      ├─→ JavaScript sends POST to /auth/logout
      │
      └─→ Server processes:
          ├─→ Destroy session
          ├─→ Clear 'connect.sid' cookie
          └─→ Redirect to login
END
```

### **Daily Nutrition Tracking Flow**

```
START (User logged in → Dashboard)
  │
  ├─→ First Time: User sets daily goals
  │   ├─→ User enters: calories_goal, protein_goal, carbs_goal, fats_goal
  │   ├─→ JavaScript sends POST to /tracker/goal
  │   │
  │   └─→ Server (tracker.js) processes:
  │       ├─→ Validate: Check session.userId
  │       ├─→ Validate: Check numeric values > 0
  │       ├─→ Insert into 'goals' table
  │       └─→ Return success (201)
  │
  ├─→ User logs food throughout the day
  │   ├─→ User enters: food name (optional), calories, protein, carbs, fats
  │   ├─→ JavaScript sends POST to /tracker/log
  │   │
  │   └─→ Server (tracker.js) processes:
  │       ├─→ Validate: Check session.userId
  │       ├─→ Validate: Check all numeric values
  │       ├─→ Insert into 'food_logs' table (with CURDATE())
  │       └─→ Return success (201)
  │
  ├─→ User views dashboard/progress
  │   ├─→ Dashboard page loads
  │   ├─→ JavaScript sends GET to /tracker/today
  │   │
  │   └─→ Server (tracker.js) processes:
  │       ├─→ Validate: Check session.userId
  │       ├─→ Query food_logs: SUM(calories, protein, carbs, fats)
  │       │   WHERE user_id = ? AND log_date = CURDATE()
  │       ├─→ Query goals: Get latest goal for user_id
  │       ├─→ Calculate remaining = goal - consumed
  │       └─→ Return JSON with consumed, goal, remaining
  │
  │   └─→ Frontend renders progress bars:
  │       ├─→ Calories: [████████░░] 1500/2000
  │       ├─→ Protein:  [██████░░░░] 100g/150g
  │       ├─→ Carbs:    [█████░░░░░] 200g/250g
  │       └─→ Fats:     [███████░░░] 60g/70g
  │
  ├─→ User deletes today's entries (reset)
  │   ├─→ User clicks "Clear Today"
  │   ├─→ JavaScript sends DELETE to /tracker/today
  │   │
  │   └─→ Server (tracker.js) processes:
  │       ├─→ Validate: Check session.userId
  │       ├─→ Delete from food_logs
  │       │   WHERE user_id = ? AND log_date = CURDATE()
  │       └─→ Return success (200)
  │
  └─→ User clicks logout
      └─→ Session destroyed, redirected to login
END
```

### **Session & Security Flow**

```
┌──────────────────────────────────────────────────────┐
│        Session Management & Security                 │
├──────────────────────────────────────────────────────┤
│                                                      │
│  1. User logs in                                     │
│     └─→ Server regenerates session ID (prevents      │
│         session fixation attacks)                    │
│     └─→ Sets session.userId = user.id                │
│     └─→ Session stored in memory (dev) or Redis      │
│     └─→ Session cookie sent to browser               │
│        (httpOnly: true, sameSite: lax)               │
│                                                      │
│  2. Subsequent requests                              │
│     └─→ Browser sends session cookie automatically   │
│     └─→ Express-session middleware reads cookie      │
│     └─→ Matches against session store                │
│     └─→ req.session.userId available in routes       │
│                                                      │
│  3. Authentication check in routes                   │
│     ├─→ IF !req.session.userId                       │
│     │   └─→ Return 401 Unauthorized                  │
│     └─→ ELSE Allow route to proceed                  │
│                                                      │
│  4. User logs out                                    │
│     └─→ Session destroyed (removed from store)       │
│     └─→ Cookie cleared in browser                    │
│     └─→ Next request: No session.userId              │
│     └─→ User redirected to login                     │
│                                                      │
│  5. Password Security                                │
│     └─→ bcrypt used (10 salt rounds)                 │
│     └─→ Password never stored in plain text          │
│     └─→ Comparison: bcrypt.compare(input, hash)      │
│                                                      │
└──────────────────────────────────────────────────────┘
```

---

## How It Works

### **Registration Process**
1. User fills signup form with personal details
2. Password is hashed using bcrypt (10 salt rounds)
3. User data is validated (age 10-100, valid email, password >6 chars, etc.)
4. User is inserted into database with hashed password
5. Session is created and user is automatically logged in
6. User redirected to dashboard

### **Login Process**
1. User enters email and password
2. System checks if email exists in database
3. Password is compared using bcrypt.compare() (doesn't decrypt, just compares)
4. If match: Session created with user ID
5. User is redirected to protected dashboard page
6. If no match: Error message displayed

### **Food Logging Process**
1. User on dashboard enters food details (calories, macros)
2. Data sent to `/tracker/log` endpoint via POST
3. Server validates all values are numeric and non-negative
4. Entry inserted into `food_logs` table with current date
5. Frontend displays success message
6. Progress bars update in real-time

### **Daily Progress Calculation**
1. User views dashboard
2. Frontend requests `/tracker/today` endpoint via GET
3. Server queries `food_logs` for today's entries
4. Calculates totals: SUM(calories, protein, carbs, fats)
5. Fetches latest goal from `goals` table
6. Calculates remaining: goal - consumed
7. Returns JSON with all data
8. Frontend renders visual progress bars

### **Session Persistence**
1. Session stored with httpOnly flag (prevents XSS access)
2. SameSite: lax prevents CSRF attacks
3. Session expires after 24 hours (configurable)
4. Each request automatically includes session cookie
5. Server verifies session before processing requests

---

## Project Structure

```
MacroTrack/
├── config/
│   └── db.js                 # Database configuration and initialization
├── routes/
│   ├── auth.js              # Authentication endpoints (login, signup, logout)
│   └── tracker.js           # Nutrition tracking endpoints
├── frontend/
│   ├── index.html           # Landing page
│   ├── home.html            # Home page
│   ├── login.html           # Login page
│   ├── signup.html          # Sign-up page
│   ├── dashboard.html       # Main dashboard (private)
│   ├── profile.html         # User profile (private)
│   ├── contact.html         # Contact page (private)
│   ├── css/                 # Stylesheets
│   └── js/                  # Client-side JavaScript
├── .env                     # Environment variables (create this)
├── .gitignore              # Git ignore file
├── package.json            # Project dependencies
├── package-lock.json       # Locked dependency versions
├── server.js               # Express server entry point
└── README.md               # This file
```

---

## Prerequisites

Make sure you have the following installed:

- **Node.js** (v14 or higher) - [Download](https://nodejs.org/)
- **npm** (v6 or higher) - Comes with Node.js
- **MySQL** (v5.7 or higher) - [Download](https://www.mysql.com/downloads/)
- **Git** (optional, for cloning the repository)

---

## Installation

### Step 1: Clone the Repository

```bash
git clone https://github.com/sagarbhati23/nutrition-tracker.git
cd MacroTrack
```

Or download and extract the project folder.

### Step 2: Install Dependencies

```bash
npm install
```

This will install all required packages listed in `package.json`.

---

## Configuration

### Step 1: Create Environment Variables

Create a `.env` file in the root directory with the following variables:

```env
# Server Configuration
PORT=5000

# Database Configuration
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_mysql_password
DB_NAME=macrotrack

# Session Configuration
SESSION_SECRET=your_secure_random_string_here
```

**Important**: 
- Replace `your_mysql_password` with your MySQL root password
- Replace `your_secure_random_string_here` with a random secure string (use a password generator)
- Never commit the `.env` file to version control

### Step 2: Set Up MySQL Database

1. Open MySQL command line or MySQL Workbench
2. Create the database:

```sql
CREATE DATABASE macrotrack;
```

3. The application will automatically create the necessary tables when it starts for the first time.

---

## Running the Application

### Development Mode (with auto-reload)

```bash
npm run dev
```

This uses `nodemon` to automatically restart the server when you make changes.

### Production Mode

```bash
npm start
```

### Access the Application

Once the server is running, open your browser and navigate to:

```
http://localhost:5000
```

You should see the MacroTrack landing page.

---

## Usage

### Creating an Account

1. Navigate to `http://localhost:5000/signup.html`
2. Enter your email and password
3. Click "Sign Up"
4. You'll be redirected to the login page

### Logging In

1. Go to `http://localhost:5000/login.html`
2. Enter your credentials
3. Click "Login"
4. You'll be redirected to your dashboard

### Tracking Your Nutrition

1. From the dashboard, log your daily meals
2. For each meal/food item, enter:
   - Food name
   - Quantity
   - Calories
   - Macronutrients (Protein, Carbs, Fats)
3. View your daily progress with visual progress bars
4. Monitor your macro and calorie intake throughout the day

### Viewing Your Profile

- Navigate to the profile page to view and update your account information

---

## API Endpoints

### Authentication Routes (`/auth`)

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/auth/signup` | Register a new user |
| POST | `/auth/login` | Log in an existing user |
| POST | `/auth/logout` | Log out the current user |
| GET | `/auth/user` | Get current user information |

### Tracker Routes (`/tracker`)

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/tracker/add-food` | Log a new food entry |
| GET | `/tracker/daily` | Get daily nutrition summary |
| GET | `/tracker/foods` | Get all logged foods |
| DELETE | `/tracker/food/:id` | Delete a food entry |
| PUT | `/tracker/food/:id` | Update a food entry |

---

## Database Schema

The application automatically creates the following tables:

### `users` Table
- `id` (INT, Primary Key)
- `email` (VARCHAR, Unique)
- `password` (VARCHAR, Hashed)
- `created_at` (TIMESTAMP)

### `food_logs` Table
- `id` (INT, Primary Key)
- `user_id` (INT, Foreign Key)
- `food_name` (VARCHAR)
- `quantity` (DECIMAL)
- `calories` (DECIMAL)
- `protein` (DECIMAL)
- `carbs` (DECIMAL)
- `fats` (DECIMAL)
- `logged_date` (DATE)
- `created_at` (TIMESTAMP)

---

## Security Features

- **Password Hashing**: Passwords are hashed using bcrypt before storage
- **Session Management**: HTTP-only cookies prevent XSS attacks
- **CORS Protection**: Configured to accept requests only from the same origin
- **Authentication Middleware**: Private routes require valid user sessions
- **Environment Variables**: Sensitive data is stored in `.env`, not in code

---

## Troubleshooting

### Error: "Can't connect to MySQL server"
- Ensure MySQL is running
- Verify DB credentials in `.env` file
- Check if port 3306 is available

### Error: "Cannot find module"
- Run `npm install` to install all dependencies
- Clear npm cache: `npm cache clean --force`

### Error: "Port 5000 is already in use"
- Change the PORT in `.env` to an available port
- Or kill the process using port 5000

### Session not persisting
- Check if cookies are enabled in your browser
- Verify `SESSION_SECRET` is set in `.env`
- Clear browser cookies and try again

---

## Additional Resources

- [Express.js Documentation](https://expressjs.com/)
- [MySQL Documentation](https://dev.mysql.com/doc/)
- [bcrypt Documentation](https://github.com/kelektiv/node.bcrypt.js)
- [express-session Documentation](https://github.com/expressjs/session)

---

## Contributing

Contributions are welcome! To contribute:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request


---

## 👤 Author

**Sagar Bhati**

- GitHub: [@sagarbhati23](https://github.com/sagarbhati23)
- Repository: [nutrition-tracker](https://github.com/sagarbhati23/nutrition-tracker)

---

## Support

If you have any questions or encounter issues, please:

1. Check the [Troubleshooting](#troubleshooting) section
2. Review the existing issues on GitHub
3. Create a new issue with a detailed description

---

**Happy Tracking!**

Keep your nutrition goals on track with MacroTrack!
