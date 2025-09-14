# MalishaEdu Global Scholarship Platform

A comprehensive scholarship platform built with Vue.js 3 + Vuetify frontend, Node.js backend, PostgreSQL database, and Cloudflare R2 storage.

## 🎨 Design System

- **Theme Color**: #068b76
- **Font**: Roboto (Google Fonts)
- **Design**: Material Design (Vuetify)
- **Responsive**: Mobile-first approach

## 🏗️ Project Structure

```
malisha-edu-scholarship-platform/
├── frontend/          # Vue.js 3 + Vuetify
├── backend/           # Node.js + Express
├── database/          # PostgreSQL schema & migrations
├── docker/            # Docker configurations
└── docs/              # Documentation
```

## 🚀 Quick Start

1. **Install dependencies**:
   ```bash
   npm run install:all
   ```

2. **Set up environment variables**:
   - Copy `.env.example` to `.env` in both frontend and backend directories
   - Configure your database and API keys

3. **Run development servers**:
   ```bash
   npm run dev
   ```

4. **Access the application**:
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:5000

## 🛠️ Tech Stack

### Frontend
- Vue.js 3
- Vuetify 3
- Vue Router
- Axios
- Pinia (State Management)

### Backend
- Node.js
- Express.js
- PostgreSQL
- JWT Authentication
- Cloudflare R2 (S3-compatible storage)

### Database
- PostgreSQL
- Knex.js (Query Builder & Migrations)

## 📱 Features

- **Home Page**: Hero section, partner universities, hot programs
- **University Pages**: Detailed university information with image galleries
- **Program Pages**: Scholarship details, requirements, application process
- **Scholarship Search**: Advanced filtering and search
- **User Authentication**: Sign up, sign in, profile management
- **Admin Panel**: University and program management
- **File Upload**: Cloudflare R2 integration for images

## 🚀 Deployment

The project includes Docker configurations and GitHub Actions for automated deployment to Railway.

## 📄 License

MIT License

Master Prompt
"Master Prompt for Cursor

You are building a Vue.js 3 + Vuetify frontend + Node.js (Express) backend + PostgreSQL + Cloudflare R2 storage project.
The website is modeled after scholarshipchina.com but branded as MalishaEdu Global Scholarship Platform.

🎨 Styling & Design Rules

Theme color: #068b76

Font: Roboto (Google Fonts, default in Vuetify)

Design system: Material Design (Vuetify components, responsive, mobile-first)

Headings: Bold uppercase (text-h4 or larger depending on section)

Buttons: Rounded with Material ripple effect

Navbar: Left = logo (malisha-logo.png), Right = menu items (Home, Scholarship, Universities, Apply, Sign Up/Sign In)

Hero section: Full-width background (hero1.jpg) with overlay text:

Big headline: GLOBAL APPLICATION PLATFORM

Subtext:
"ScholarshipChina aims to help international students find all self-finance & scholarship programs in Chinese universities easily and safely."

Social icons (LinkedIn, Facebook, YouTube, Twitter) bottom center, overlapping hero section

🖥️ Frontend (Vue.js 3 + Vuetify)

Home Page

Navbar, Hero, Partner Universities (carousel grid, 2 rows × 4 per page, next/prev buttons).

Hot Programs section with tabs (Full Scholarship, ISSP, Hot Majors, Chinese Language).

University Detail Page (/university/:id)

University name, About, YouTube embed, image gallery (from R2), images enlarge on click.

Program Detail Page (/program/:id)

Show program info (fees, intake, deadline, scholarship details).

Requirements checklist (from DB).

Scholarship Page (/scholarship)

Filters: Degree, Language, Intake, Accept minors, City, University, Keyword.

Result table with pagination.

Universities Page (/universities)

Paginated grid of universities.

Auth Pages

Sign In / Sign Up (JWT-based).

Student profile editor (upload passport, profile image, etc).

Footer (common)

⚙️ Backend (Node.js + Express + PostgreSQL)

REST API endpoints:

/api/auth/signup, /api/auth/login, /api/auth/profile

/api/universities (CRUD)

/api/programs (CRUD, filter, detail)

/api/cities (CRUD)

/api/uploads → direct upload to Cloudflare R2 via S3 API

Use JWT authentication for protected routes.

Role-based (admin vs student).

🗄️ Database (PostgreSQL)

users (students)

universities

university_images (R2 URLs)

programs

program_requirements

cities

🛠️ Admin Panel (Vue + Vuetify)

Sidebar navigation

Dashboard: student registrations by day/week/month

CRUD: universities, programs, students, cities, images

Tables with filter + pagination

🚀 Deployment

Create Dockerfile for frontend & backend.

GitHub Actions workflow for CI/CD → deploy on Railway.

Railway services:

PostgreSQL

Backend (Express)

Frontend (Vue, served as static files)

🔑 Developer Workflow with Cursor

Generate project structure (frontend, backend)

Generate DB schema + migrations (Knex.js or Prisma recommended)

Generate API routes (Express controllers + models)

Generate Vue pages & components one by one

Wire API calls in frontend using Axios

Add Dockerfiles + GitHub Actions

👉 Always follow these rules when generating code:

Use Vuetify for all Vue UI elements.

Always apply theme color #068b76.

Mobile-first: test responsiveness with d-flex flex-column and v-container fluid.

Code must be copy-paste ready and runnable.

Include imports and setup code explicitly (don’t assume)."