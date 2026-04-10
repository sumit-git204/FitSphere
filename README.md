<p align="center">
  <img src="https://readme-typing-svg.herokuapp.com?font=Fira+Code&weight=700&size=40&duration=3000&pause=500&color=1F2937&center=true&vCenter=true&width=800&height=120&lines=FitSphere+%7C+Gym+Management+Platform" alt="Typing SVG" />
</p>

## 💪 FitSphere - Gym Management & Fitness Service Booking Platform

FitSphere is a Node.js web application built with Express and EJS that provides a comprehensive gym management system with user registration/login, fitness service booking, BMI tracking, membership plans, and admin controls.

## 🔥 What FitSphere Does

- Provides a **public landing page** with gym services, membership plans, trainers, and facilities showcase.
- Allows users to **register and log in** with secure password hashing.
- Lets users **book fitness services** including personal training, group classes, and wellness programs.
- Enables users to **track BMI** and view their fitness progress.
- Allows users to **manage their profile** and view membership plan details.
- Ships with an **admin dashboard** for managing users, bookings, services, and memberships.
- Uses **MongoDB** to persist users, services, bookings, memberships, and fitness data.

## 🎯 Key Features

- **User authentication** with email/password login and secure session management.
- **User dashboard** for customers to view bookings, profile, and fitness tracking.
- **Admin dashboard** with role-protected routes and management tools.
- **Service booking**: browse and book fitness services, personal training, and classes.
- **BMI calculator & tracker**: track fitness metrics and health progress over time.
- **Membership management**: view available plans and active membership details.
- **Service management**: admin panel to add, update, delete, and manage services.
- **Booking management**: track all user bookings with admin controls.
- **Dynamic service display** on homepage with search and filter functionality.
- **Responsive UI** using Bootstrap and EJS views.

## 🧩 Tech Stack

- **Node.js**
- **Express**
- **EJS**
- **MongoDB / Mongoose**
- **bcrypt** for password hashing
- **express-session** for session management
- **dotenv** for configuration
- **Bootstrap** for frontend styling
- **Chart.js** for fitness progress visualization (optional)

## 📁 Main Routes

| Route | Purpose |
|---|---|
| `/` | Homepage with services, membership plans, and facilities |
| `/about` | About gym and team information |
| `/services` | Fitness service listing page |
| `/membership` | Membership plans page |
| `/trainers` | Personal trainers showcase |
| `/contact` | Contact page |
| `/login` | User login page |
| `/register` | User registration page |
| `/user/dashboard` | User dashboard and profile |
| `/user/bookings` | User's fitness bookings |
| `/user/bmi-tracker` | BMI tracking and fitness progress |
| `/admin/dashboard` | Admin dashboard |
| `/admin/login` | Admin login page |

## ⚙️ API Endpoints

| Path | Method | Access |
|---|---|---|
| `/register` | POST | Public |
| `/login` | POST | Public |
| `/logout` | GET | Authenticated |
| `/dashboard-stats` | GET | Admin only |
| `/all-users` | GET | Admin only |
| `/bookings` | POST | Authenticated |
| `/bookings` | GET | Admin only |
| `/user/bookings` | GET | Authenticated |
| `/bookings/:id` | PUT / DELETE | Admin only |
| `/bmi-tracker` | POST | Authenticated |
| `/user/bmi-history` | GET | Authenticated |
| `/memberships` | GET | Public |
| `/user/memberships` | GET | Authenticated |
| `/services` | POST / GET | Admin only |
| `/services/:id` | PUT / DELETE | Admin only |
| `/profile` | GET / PUT | Authenticated |

## 🛠️ Installation

```bash
cd fitsphere
npm install
```

Create a `.env` file in the project root with at least:

```env
MONGO_URI=mongodb://127.0.0.1:27017/fitsphere
SESSION_SECRET=your_session_secret
PORT=5000
NODE_ENV=development
```

## ▶️ Run the App

```bash
nodemon app.js
```

Then open:

```text
http://localhost:5000
```

## 🧠 How the App Works

- **Users** can view gym services, membership plans, and available trainers.
- After registration and login, users can book fitness services and track their BMI progress.
- Users can view their active bookings and membership details in their personal dashboard.
- **Admin users** can access protected admin routes to manage users, services, bookings, and view platform statistics.
- **Fitness tracking** helps users monitor their progress with BMI calculator and historical data visualization.

## 🧭 Project Structure

```text
fitsphere/
├── app.js
├── auth.js
├── package.json
├── README.md
├── .gitignore
├── config/
│   ├── db.js
│   └── seedAdmin.js
├── models/
│   ├── User.js
│   ├── Admin.js
│   ├── Service.js
│   ├── Booking.js
│   ├── BMITracker.js
│   └── Membership.js
├── public/
│   ├── css/
│   │   └── styles.css
│   ├── images/
│   ├── js/
│   │   └── script.js
│   └── data.js
├── routes/
│   ├── web.js
│   ├── auth.js
│   └── api.js
└── views/
    ├── index.ejs
    ├── about.ejs
    ├── services.ejs
    ├── membership.ejs
    ├── trainers.ejs
    ├── contact.ejs
    ├── login.ejs
    ├── register.ejs
    ├── user-dashboard.ejs
    ├── user-bookings.ejs
    ├── bmi-tracker.ejs
    ├── admin-dashboard.ejs
    ├── admin-login.ejs
    └── partials/
        ├── header.ejs
        ├── navbar.ejs
        ├── footer.ejs
        ├── hero.ejs
        └── sidebar.ejs
```

## 💡 Notes

- The app connects to MongoDB at `mongodb://127.0.0.1:27017/fitsphere` by default.
- Admin-only routes are protected using authentication middleware.
- Passwords are stored securely with `bcrypt` hashing.
- User sessions are managed with `express-session` for persistent login.

## ✅ Summary

FitSphere is a full-stack Express app for gym management and fitness service booking, with user authentication, service booking, BMI tracking, membership management, and admin controls. It's ideal for showcasing a practical gym management platform built with Node.js and MongoDB.

---

**Built with ❤️ using Node.js & Express**
