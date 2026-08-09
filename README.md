# AI Helpdesk & Security Ticketing System

An AI-powered Helpdesk and Security Ticketing System designed to help employees raise, track, manage, and resolve IT support tickets through a centralized web application.

The system uses Firebase for authentication and cloud data storage, and Gemini AI for automatic ticket classification.

---

## 🚀 Live Demo

**Live Application:**

https://ai-helpdesk-a3d4a.web.app/

**GitHub Repository:**

https://github.com/poojams2374-blip/AI-Helpdesk-System

---

## 📌 Project Objective

The objective of this project is to develop a centralized AI-powered helpdesk system that allows employees to report IT issues and enables administrators to efficiently manage and resolve those issues.

The system reduces manual ticket classification and improves ticket management through automation, filtering, notifications, and dashboard analytics.

---

## ❗ Problem Statement

Traditional IT helpdesk systems often require users or support teams to manually categorize tickets and track their status.

This can result in:

- Delayed ticket processing
- Incorrect ticket categorization
- Difficulty tracking ticket status
- Lack of centralized ticket management
- Increased workload for support teams

The proposed system addresses these problems through a centralized web-based ticketing platform with AI-assisted ticket classification.

---

## 💡 Key Features

### 🔐 User Authentication

- User registration
- User login
- Firebase Authentication
- Logout functionality

### 🎫 Ticket Management

Users can:

- Create tickets
- View tickets
- Edit tickets
- Delete tickets
- Close/resolve tickets
- Track ticket status

### 🤖 AI Ticket Classification

Gemini AI automatically classifies tickets into categories such as:

- Hardware
- Software
- Network
- Account/Access
- Other

This reduces manual classification effort.

### 📊 Dashboard

The dashboard provides:

- Total ticket count
- Open ticket count
- Resolved ticket count
- Ticket statistics
- Doughnut chart visualization
- User notifications

### 🔔 Notifications

The notification system provides updates related to ticket activity and open tickets.

### 👨‍💼 Admin Panel

Administrators can:

- View all tickets
- Search tickets
- Filter tickets by status
- Filter tickets by category
- Update ticket status
- Resolve tickets

### 👤 User Profile

Users can view their:

- Name
- Email
- Role
- Profile information

---

## 🏗️ System Architecture

```text
                    ┌─────────────────────┐
                    │       User          │
                    └──────────┬──────────┘
                               │
                               ▼
                    ┌─────────────────────┐
                    │   Web Application   │
                    │ HTML / CSS / JS      │
                    └──────────┬──────────┘
                               │
                ┌──────────────┴──────────────┐
                │                             │
                ▼                             ▼
       ┌─────────────────┐          ┌─────────────────┐
       │ Firebase Auth   │          │   Gemini AI     │
       │                 │          │                 │
       │ Login/Register  │          │ Ticket         │
       │                 │          │ Classification │
       └─────────────────┘          └────────┬────────┘
                                             │
                                             ▼
                                  ┌─────────────────────┐
                                  │     Firestore       │
                                  │                     │
                                  │ Ticket Storage      │
                                  │ Status              │
                                  │ Category            │
                                  └──────────┬──────────┘
                                             │
                              ┌──────────────┴──────────────┐
                              │                             │
                              ▼                             ▼
                    ┌─────────────────┐          ┌─────────────────┐
                    │ User Dashboard  │          │  Admin Panel    │
                    │                 │          │                 │
                    │ Tickets         │          │ Manage Tickets  │
                    │ Charts          │          │ Search/Filter   │
                    │ Notifications   │          │ Resolve Tickets │
                    └─────────────────┘          └─────────────────┘



Ticket Processing Workflow

User Login
    ↓
Raise Ticket
    ↓
Enter Title & Description
    ↓
Gemini AI Classification
    ↓
Category Assigned
    ↓
Ticket Stored in Firestore
    ↓
Ticket Status = Open
    ↓
Displayed on Dashboard
    ↓
Admin Reviews Ticket
    ↓
Admin Resolves Ticket
    ↓
Ticket Status = Resolved
    ↓
Dashboard Statistics Updated

🛠️ Technology Stack

| Technology              | Purpose                    |
| ----------------------- | -------------------------- |
| HTML5                   | Web page structure         |
| CSS3                    | User interface and styling |
| JavaScript              | Application logic          |
| Firebase Authentication | User authentication        |
| Firebase Firestore      | Database                   |
| Firebase Hosting        | Application deployment     |
| Gemini AI               | Ticket classification      |
| Chart.js                | Dashboard charts           |
| Git                     | Version control            |
| GitHub                  | Source code repository     |
| VS Code                 | Development environment    |


🗄️ Firestore Database

Example ticket document:
tickets
│
└── ticketId
    ├── title
    ├── description
    ├── status
    ├── category
    └── createdAt

Ticket Status

Tickets can have statuses such as:
Open
In Progress
Resolved
Closed

Ticket Categories
Hardware
Software
Network
Account/Access
Other

📊 Dashboard Analytics

The dashboard displays:

Total Tickets
Open Tickets
Resolved Tickets

A doughnut chart provides a visual representation of ticket status.

🔐 Authentication Flow
Registration
     ↓
Firebase Authentication
     ↓
Account Created
     ↓
Login
     ↓
Firebase Authentication Verification
     ↓
Dashboard

🔔 Notification System

The dashboard includes a notification system that displays ticket-related updates.

The notification count is dynamically calculated from ticket information stored in Firestore