# MysteryMessage 🕵️‍♂️💬

An anonymous messaging web application built using **Next.js** as a learning-focused full-stack project.

---

## 📌 About the Project

**MysteryMessage** allows users to receive anonymous messages through a public profile link.  
Each user can control whether they want to accept messages or not, and all received messages are displayed securely on the user’s dashboard.

This project was built to apply real-world **Next.js full-stack concepts** beyond tutorials.

---

## ✨ Features

- 🔗 Public profile link for each user
- 📨 Send anonymous messages
- ✅ Enable/disable message receiving
- 📊 Private dashboard to view received messages
- 🔐 Credentials-based authentication
- 📧 Email verification using OTP
- 🧠 Username availability check with debouncing
- 🛡️ Secure password hashing

---

## 🛠 Tech Stack

### Frontend & Backend
- Next.js (App Router)
- TypeScript

### Authentication
- NextAuth (Credentials Provider)
- bcrypt

### Database
- MongoDB

### Validation & Forms
- Zod
- React Hook Form

### UI
- Shadcn UI

### Utilities
- Axios
- Debouncing for real-time validation

### Email
- Resend (used for email verification – limited due to domain constraints)

---

## 📚 What I Learned

- Full-stack development using **Next.js**
- Authentication and authorization with **NextAuth**
- Working with **MongoDB**
- Schema validation using **Zod**
- Improving UX with **debouncing**
- Structuring scalable APIs
- Building clean and reusable UI components

---

## 🚧 Current Limitations

- Email verification is limited due to the absence of a private domain
- Only credentials-based authentication is implemented

---

## 🔮 Future Improvements

- Add **Google Sign-In**
- Improve email verification flow
- UI/UX enhancements
- Message moderation features

---

## 🚀 Getting Started Locally

### 1️⃣ Clone the repository
```bash
git clone https://github.com/Demonking14/AnnonymousMessage-.git
cd AnnonymousMessage-

2️⃣ Install dependencies

npm install

3️⃣ Set up environment variables

Create a .env file in the root directory and add:

MONGODB_URI=your_mongodb_connection_string
NEXTAUTH_SECRET=your_nextauth_secret
NEXTAUTH_URL=http://localhost:3000
RESEND_API_KEY=your_resend_api_key

4️⃣ Run the development server

npm run dev

Open http://localhost:3000 in your browser.
🌐 Live Demo

👉 https://annonymous-message-seven.vercel.app
🤝 Feedback & Contributions

This project was built for learning purposes.
Feedback, suggestions, and improvements are welcome.
📄 License

This project is open-source and available under the MIT License.