# Full-Stack CRM Application

A comprehensive Customer Relationship Management (CRM) system built for a small sales team to manage leads, track pipeline progress, and organize notes.

## Project Overview
This CRM application provides a clean, modern interface for sales teams to track potential customers through the sales pipeline. It features a complete dashboard for analytics, robust lead management (CRUD), detailed note-taking capabilities, and secure authentication.

## Tech Stack
- **Frontend:** React, Vite, Tailwind CSS, React Router DOM, Axios, Lucide React (Icons), date-fns.
- **Backend:** Node.js, Express.js, Firebase Admin SDK.
- **Database:** Firebase Firestore.
- **Authentication:** Custom JWT (JSON Web Tokens) with a secure middleware for protected routes.

## Features Implemented
- **Authentication:** Secure login system using JWT.
- **Dashboard:** Analytics showing total leads, pipeline value, won deals, and breakdown by status.
- **Lead Management:** Create, Read, Update, and Delete (CRUD) leads.
- **Lead Pipeline:** Easily update lead statuses (New, Contacted, Qualified, Proposal Sent, Won, Lost).
- **Notes System:** Add and view timestamped notes on individual leads.
- **Search & Filtering:** Filter leads by status and search by name, company, or email in real-time.
- **Responsive UI:** Clean, aesthetically pleasing, and responsive user interface powered by Tailwind CSS.

## Test Login Credentials
- **Email:** admin@example.com
- **Password:** password123

## Database Setup (Firebase)
To run this application, you must connect it to a Firebase project:
1. Go to the [Firebase Console](https://console.firebase.google.com/) and create a new project.
2. Navigate to **Firestore Database** and create a new database (Start in Test Mode).
3. Go to **Project Settings > Service Accounts**.
4. Click **Generate new private key**. This will download a JSON file.
5. Open the downloaded JSON file and copy the values for `project_id`, `client_email`, and `private_key`.
6. Open the `backend/.env` file and paste these values into the corresponding variables.

## Environment Variables
The backend uses a `.env` file for configuration. A default `.env` is already provided in the `backend/` directory. Fill it out with your Firebase credentials:
```env
PORT=5000
JWT_SECRET=super_secret_crm_key_2026

# Firebase Configuration
FIREBASE_PROJECT_ID=your-project-id
FIREBASE_CLIENT_EMAIL=your-client-email@your-project-id.iam.gserviceaccount.com
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nYOUR_PRIVATE_KEY_HERE\n-----END PRIVATE KEY-----\n"
```

## How to Run Locally

### 1. Start the Backend
Open a terminal in the `backend` directory:
```bash
cd backend
npm install
npm run dev
```
*(Ensure you have configured your Firebase environment variables in the `backend/.env` file first!)*

### 2. Start the Frontend
Open a new terminal in the `frontend` directory:
```bash
cd frontend
npm install
npm run dev
```

### 3. Open the App
The frontend will start at `http://localhost:5173`. Open this URL in your browser and log in using the test credentials.

## Known Limitations
- Search and filtering is currently implemented efficiently in the backend using an in-memory fallback. Firestore does not natively support full-text search without third-party extensions like Algolia, so this approach is suitable for a small-to-medium number of leads.
- Only a single hardcoded test user is implemented to satisfy the assessment requirement simply and effectively without requiring a full user registration flow.
- Pagination is not implemented; all leads are fetched at once.

## Reflection
Building this CRM was a great exercise in structuring a clean, maintainable full-stack application. I focused heavily on providing a premium user experience on the frontend with modern Tailwind design patterns (glassmorphism accents, soft shadows, clear visual hierarchy). 
For the backend, I designed RESTful APIs that interface with Firestore. A key problem I solved was the limitation of Firestore's search capabilities; I bypassed this by retrieving the collection and filtering it on the Node.js server, which works excellently for small team CRM scales. If I had more time, I would integrate Algolia for robust search, add user management with Firebase Auth, and implement a Kanban board view for the sales pipeline.
