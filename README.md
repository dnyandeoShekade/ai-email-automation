# 🤖 AI Email Assistant

An AI-powered email automation assistant that connects with Gmail, reads and analyzes emails, generates AI-based summaries and replies, and helps automate common email workflows.

## 🚀 Goal

Build an intelligent email assistant that can:

* Connect securely with Gmail using OAuth 2.0
* Fetch and store emails
* Analyze emails using an LLM
* Generate email summaries
* Generate smart replies
* Categorize emails
* Automate repetitive email tasks
* Store users, emails, and AI results in MongoDB

---

## 🏗️ Architecture

```text
User
 │
 ▼
Next.js Frontend
 │
 ▼
API Routes
 │
 ├── Gmail API
 │
 ├── AI / LLM
 │
 └── MongoDB
       │
       ├── Users
       └── Emails
```

### Email Automation Flow

```text
Gmail
  ↓
Fetch Email
  ↓
Store Email in MongoDB
  ↓
AI Analysis
  ↓
Summarize / Categorize
  ↓
Generate Reply
  ↓
User Reviews Reply
  ↓
Send Reply through Gmail API
```

---

## 🛠️ Tech Stack

### Frontend

* Next.js
* React
* JavaScript
* Tailwind CSS

### Backend

* Next.js API Routes
* Node.js
* Gmail API
* Google OAuth 2.0

### Database

* MongoDB
* Mongoose

### AI

* LLM API
* Prompt Engineering
* AI Summarization
* AI Classification
* AI Reply Generation

### Tools

* Git
* GitHub
* VS Code
* Postman
* Google Cloud Console

---

## 📁 Project Structure

```text
ai-email-assistant/
│
├── app/
│   ├── api/
│   │   ├── auth/
│   │   ├── emails/
│   │   └── ai/
│   │
│   ├── dashboard/
│   └── page.js
│
├── lib/
│   ├── db.js
│   ├── gmail.js
│   │
│   └── models/
│       ├── User.js
│       └── Email.js
│
├── .env.local
├── package.json
└── README.md
```

---

## 🗄️ Database

### User

Stores:

```text
name
email
googleId
accessToken
refreshToken
tokenExpiry
createdAt
updatedAt
```

### Email

Stores:

```text
user
gmailMessageId
threadId
from
to
subject
body
receivedAt
aiSummary
aiReply
category
isRead
isProcessed
createdAt
updatedAt
```

---

## 🔐 Authentication

The application uses **Google OAuth 2.0**.

```text
User
 ↓
Google Login
 ↓
Google OAuth Consent
 ↓
Authorization Code
 ↓
Access / Refresh Token
 ↓
Gmail API
```

The refresh token allows the application to continue accessing Gmail without requiring the user to log in every time.

---

## 🧠 AI Features

### 1. Email Summarization

```text
Long Email
    ↓
LLM
    ↓
Short Summary
```

### 2. Email Categorization

Example categories:

```text
Work
Job
Personal
Promotion
Spam
Other
```

### 3. AI Reply Generation

```text
Incoming Email
      ↓
AI understands context
      ↓
Generate Reply
      ↓
User reviews
      ↓
Send through Gmail
```

---

## 🔄 Future Automation

The project can later be extended with:

```text
Function Calling
      ↓
Tool Calling
      ↓
AI Agent
      ↓
Gmail Tools
      ↓
Database Tools
      ↓
External API Tools
      ↓
Automated Workflows
```

Possible automations:

* Automatically summarize important emails
* Detect job-related emails
* Generate job application replies
* Create follow-up reminders
* Send automated responses
* Extract information from emails
* Save important information to the database
* Trigger workflows using webhooks
* Connect with n8n

---

## 🔮 Future Tech

Planned technologies:

* LangChain
* RAG
* Embeddings
* Vector Database
* Function Calling
* AI Agents
* n8n
* Webhooks
* Redis
* Background Jobs
* Docker
* CI/CD

---

## ⚙️ Environment Variables

Create `.env.local`:

```env
MONGODB_URI=

GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
GOOGLE_REDIRECT_URI=

OPENAI_API_KEY=
```

Never commit `.env.local` or API keys to GitHub.

---

## 🎯 Learning Objectives

This project is designed to learn practical AI automation concepts:

```text
Gmail API
   ↓
OAuth
   ↓
Database
   ↓
LLM
   ↓
Prompt Engineering
   ↓
Function Calling
   ↓
Tool Calling
   ↓
AI Agents
   ↓
Automation
```

The final goal is to turn the project from a simple **AI email assistant** into a production-style **AI automation agent**.


ai-email/
│
├── app/
│   ├── api/
│   │   ├── ai/
│   │   │
│   │   └── auth/
│   │       ├── google/
│   │       │   └── route.js
│   │       │
│   │       └── callback/
│   │           └── google/
│   │               └── route.js
│   │
│   ├── dashboard/
│   │   └── page.js
│   │
│   ├── globals.css
│   ├── layout.js
│   └── page.js
│
├── lib/
│   ├── ai.js
│   ├── db.js
│   └── gmail.js   ← ⭐ Gmail logic here
│
├── src/
│   └── .env.local
│
└── package.json
ai-email/
│
├── app/
│   ├── api/
│   │   ├── ai/
│   │   │
│   │   └── auth/
│   │       ├── google/
│   │       │   └── route.js
│   │       │
│   │       └── callback/
│   │           └── google/
│   │               └── route.js
│   │
│   ├── dashboard/
│   │   └── page.js
│   │
│   ├── globals.css
│   ├── layout.js
│   └── page.js
│
├── lib/
│   ├── ai.js
│   ├── db.js
│   └── gmail.js   ← ⭐ Gmail logic here
│
├── src/
│   └── .env.local
│
└── package.json