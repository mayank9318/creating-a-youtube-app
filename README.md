# YouTube Clone - Full Stack Video Platform

A comprehensive video-sharing platform built with the MERN stack (MongoDB, Express, React, Node.js), featuring video uploads, user authentication, social interactions, and a personal dashboard.

## 🚀 Features

- **User Authentication**: Secure Login/Register with JWT, password encryption (bcrypt), and cookie-based sessions.
- **Video Management**: 
  - Upload videos with thumbnails (stored on Cloudinary).
  - Toggle video visibility (Publish/Unpublish).
  - Edit/Delete video details.
- **Social Interactions**:
  - Like/Dislike videos, comments, and tweets.
  - Nested commenting system.
  - Subscribe/Unsubscribe to channels.
- **User Content**:
  - Tweet creation and management.
  - Personal playlists (Create, Update, Delete).
- **Channel Dashboard**: Real-time stats including total views, subscribers, and video performance.
- **Search & Discovery**: Search for videos and browse channel profiles.

## 🛠️ Technology Stack

### Backend
- **Node.js & Express**: Server-side runtime and framework.
- **MongoDB & Mongoose**: NoSQL database and ORM for data modeling.
- **Cloudinary**: Cloud-based image and video management.
- **Multer**: Middleware for handling `multipart/form-data` (file uploads).
- **JWT (JSON Web Token)**: Secure authentication and authorization.
- **Bcrypt**: For password hashing.

### Frontend
- **React & Vite**: Fast and modern frontend development.
- **Tailwind CSS**: Utility-first CSS framework for styling.
- **React Router**: For navigation and routing.
- **Axios**: Promised-based HTTP client for API requests.
- **React Icons**: Comprehensive icon library.
- **React Hot Toast**: For elegant notifications.

---

## 🏁 Getting Started

### Prerequisites
- [Node.js](https://nodejs.org/) installed on your machine.
- A [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) account and a database URI.
- A [Cloudinary](https://cloudinary.com/) account for media storage.

### 1. Clone the Repository
```bash
git clone <repository-url>
cd yyyt
```

### 2. Backend Setup
```bash
cd backend
npm install
```

Create a `.env` file in the `backend` directory and add the following variables:
```env
PORT = 8800
MONGO_URI = your_mongodb_connection_string
CORS_ORIGIN = http://localhost:5173
ACCESS_TOKEN_SECRET = your_access_token_secret
ACCESS_TOKEN_EXPIRY = 1d
REFRESH_TOKEN_SECRET = your_refresh_token_secret
REFRESH_TOKEN_EXPIRY = 10d

CLOUDINARY_CLOUD_NAME = your_cloudinary_name
CLOUDINARY_API_KEY = your_cloudinary_api_key
CLOUDINARY_API_SECRET = your_cloudinary_api_secret
```

Start the backend server:
```bash
npm run dev
```

### 3. Frontend Setup
```bash
cd ../frontend
npm install
npm run dev
```

---

## 📁 Project Structure

```text
├── backend
│   ├── src
│   │   ├── controllers    # Business logic for each resource
│   │   ├── models         # Mongoose schemas
│   │   ├── routs          # API endpoint definitions
│   │   ├── middlewares    # Auth and upload middlewares
│   │   ├── db             # Database connection logic
│   │   └── utils          # Utility functions (API response, Error handling)
├── frontend
│   ├── src
│   │   ├── components     # Reusable UI components
│   │   ├── context        # React Context for state management
│   │   ├── api            # API call configurations
│   │   └── App.jsx        # Main application routing
```

## 📜 Available Scripts

### Backend
- `npm run dev`: Runs the backend in development mode with nodemon.
- `npm start`: Starts the backend in production mode.

### Frontend
- `npm run dev`: Starts the Vite development server.
- `npm run build`: Generates the production build.

---

## 🤝 Contributing
Feel free to fork this project and submit pull requests.

## 📄 License
This project is licensed under the ISC License.
