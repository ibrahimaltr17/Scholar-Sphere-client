# 📚 Scholar Sphere

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![Status](https://img.shields.io/badge/status-Active-brightgreen)]()
[![React](https://img.shields.io/badge/React-17.0.2-blue?logo=react)]()
[![Node.js](https://img.shields.io/badge/Node.js-18.0-green?logo=node.js)]()
[![MongoDB](https://img.shields.io/badge/MongoDB-6.0-green?logo=mongodb)]()
[![Firebase](https://img.shields.io/badge/Firebase-9.0-orange?logo=firebase)]()
[![Stripe](https://img.shields.io/badge/Stripe-10.0-purple?logo=stripe)]()

---

## 🔹 Project Overview

**Scholar Sphere** is a robust Scholarship Management System that allows students to:

- Search for suitable universities and scholarships.
- Apply directly for scholarships through the platform.
- Track application status and manage reviews.

The system supports **three types of users**:

1. **User** – Can browse scholarships, apply, and leave reviews.  
2. **Moderator** – Can manage scholarships, reviews, and applications.  
3. **Admin** – Full access to manage users, scholarships, reviews, and applications.

---

## 🌟 Core Features

### Home Page
- Navbar with dynamic links based on user role.
- Banner with 3+ carousel sliders.
- Top Scholarships section with 6+ scholarships and "All Scholarships" button.
- Two additional custom sections for engagement.
- Scholarship cards display:
  - University Name & Logo
  - Scholarship Category
  - University Location
  - Application Deadline
  - Subject Category
  - Application Fees
  - Average Rating
  - Details Button

### Scholarship Details Page
- Private route for logged-in users.
- Full scholarship info including stipend, post date, service charge, and description.
- Reviews carousel showing reviewer image, name, rating, comment, and date.
- Apply Scholarship functionality with form and payment.

### Apply Scholarship
- Collect user details (phone, address, gender, degree, SSC/HSC results, study gap, etc.).
- Stripe payment integration.
- Store application data with user ID, scholarship ID, and timestamp.
- Toast notifications for success or errors.

### All Scholarships Page
- Search scholarships by name, university, or degree.
- Display results in cards with Details button.
- Meaningful message if no scholarships match search.

### Authentication
- Email/password login & registration with Firebase.
- Social login integration (Google/Facebook optional).
- Password validation (length, capital letters, special characters).
- Dynamic Navbar updates upon login.
- 404 Page for unknown routes.

### Dashboards

#### User Dashboard
- My Profile
- My Applications (view, edit, cancel)
- My Reviews (add, edit, delete)

#### Moderator Dashboard
- My Profile
- Manage Scholarships (view, edit, delete)
- All Reviews (view, delete)
- All Applied Scholarships (details, feedback, cancel)
- Add Scholarship

#### Admin Dashboard
- Admin Profile
- Manage Users (view, edit roles, delete)
- Manage Scholarships
- Manage Applied Applications
- Manage Reviews
- Add Scholarship

---

## 🛠️ Technologies & Dependencies

- **Frontend:** React, Tailwind CSS, Axios, TanStack Query  
- **Backend:** Node.js, Express.js  
- **Database:** MongoDB  
- **Authentication & Hosting:** Firebase  
- **Payment Gateway:** Stripe  
- **Notifications:** SweetAlert/Toast  

---

## 📁 Project Structure (Simplified)

