# Skit0 - AI-Powered Script Augmentation Platform

![Skit0 Banner](https://img.shields.io/badge/Skit0-AI%20Script%20Augmentation-blue?style=for-the-badge)
![Status](https://img.shields.io/badge/Status-Live-success?style=for-the-badge)

**Skit0** is a full-stack web application that helps content creators augment their scripts with AI-powered keyword extraction and intelligent image suggestions. Write your script, click "Augment," and let AI find the perfect visuals for your content.

## 🌐 Live Demo

- **Frontend**: [https://skit-0-frontend.lindy.site](https://skit-0-frontend.lindy.site)
- **Backend API**: [https://skit-0-backend.lindy.site](https://skit-0-backend.lindy.site)

## ✨ Features

### 🎯 Core Functionality
- **AI Keyword Extraction**: Automatically extracts relevant keywords from your script using Groq AI
- **Smart Image Search**: Finds high-quality, royalty-free images from Unsplash based on extracted keywords
- **Real-time Augmentation**: Instant keyword extraction and image suggestions as you write
- **Project Management**: Create, edit, save, and organize multiple script projects

### 🎨 User Experience
- **Modern Dark UI**: Beautiful dark theme with smooth animations
- **Responsive Design**: Works seamlessly on desktop, tablet, and mobile
- **Intuitive Editor**: Clean, distraction-free writing environment
- **Visual Keyword Navigation**: Click keywords to instantly see relevant images
- **Image Attribution**: Proper photographer credits and source links

### 🔐 Authentication & Security
- **JWT Authentication**: Secure user authentication with JSON Web Tokens
- **Password Hashing**: Bcrypt password encryption
- **Protected Routes**: Client-side and server-side route protection
- **Session Management**: Persistent login with localStorage

## 🛠️ Technology Stack

### Frontend
- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: shadcn/ui
- **Icons**: Lucide React
- **Notifications**: Sonner (Toast)
- **Theme**: next-themes (Dark mode)
- **HTTP Client**: Fetch API

### Backend
- **Runtime**: Node.js
- **Framework**: Express.js
- **Language**: TypeScript
- **Database**: PostgreSQL
- **Authentication**: JWT + bcrypt
- **AI Service**: Groq API (Mixtral-8x7b)
- **Image Service**: Unsplash API

### Database Schema
```sql
-- Users table
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  username VARCHAR(100) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Projects table
CREATE TABLE projects (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL,
  script_content TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Image references table
CREATE TABLE image_references (
  id SERIAL PRIMARY KEY,
  project_id INTEGER REFERENCES projects(id) ON DELETE CASCADE,
  keyword VARCHAR(100) NOT NULL,
  image_url TEXT NOT NULL,
  source_url TEXT,
  description TEXT,
  license_note TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ and npm/bun
- PostgreSQL 14+
- Groq API Key ([Get one here](https://console.groq.com))
- Unsplash API Key ([Get one here](https://unsplash.com/developers))

### Backend Setup

1. **Clone the repository**
```bash
git clone https://github.com/Lightiam/Skit0-AI.git
cd Skit0-AI/backend
```

2. **Install dependencies**
```bash
npm install
```

3. **Set up PostgreSQL database**
```bash
# Create database
createdb skit0_db

# Run migrations
npm run migrate
```

4. **Configure environment variables**
Create a `.env` file in the backend directory:
```env
# Server Configuration
PORT=5000
NODE_ENV=development

# Database Configuration
PGHOST=localhost
PGPORT=5432
PGDATABASE=skit0_db
PGUSER=postgres
PGPASSWORD=your_postgres_password

# JWT Secret (change in production!)
JWT_SECRET=your-super-secret-jwt-key-change-in-production

# API Keys
GROQ_API_KEY=your-groq-api-key
UNSPLASH_ACCESS_KEY=your-unsplash-access-key

# CORS
FRONTEND_URL=http://localhost:3000
```

5. **Start the backend server**
```bash
npm run dev
```

Backend will run on `http://localhost:5000`

### Frontend Setup

1. **Navigate to frontend directory**
```bash
cd ../frontend
```

2. **Install dependencies**
```bash
npm install
```

3. **Configure environment variables**
Create a `.env.local` file:
```env
NEXT_PUBLIC_API_URL=http://localhost:5000
```

4. **Start the development server**
```bash
npm run dev
```

Frontend will run on `http://localhost:3000`

## 📁 Project Structure

```
Skit0-AI/
├── backend/
│   ├── src/
│   │   ├── config/
│   │   │   └── database.ts          # PostgreSQL connection
│   │   ├── controllers/
│   │   │   ├── authController.ts    # Authentication logic
│   │   │   ├── projectController.ts # Project CRUD
│   │   │   └── augmentController.ts # AI augmentation
│   │   ├── middleware/
│   │   │   ├── auth.ts              # JWT verification
│   │   │   └── errorHandler.ts      # Error handling
│   │   ├── routes/
│   │   │   ├── authRoutes.ts
│   │   │   ├── projectRoutes.ts
│   │   │   └── augmentRoutes.ts
│   │   ├── services/
│   │   │   ├── groqService.ts       # AI keyword extraction
│   │   │   └── unsplashService.ts   # Image search
│   │   └── index.ts                 # Express app entry
│   ├── package.json
│   └── tsconfig.json
│
└── frontend/
    ├── app/
    │   ├── (auth)/
    │   │   ├── sign-in/page.tsx     # Login page
    │   │   └── sign-up/page.tsx     # Registration page
    │   ├── dashboard/page.tsx       # Projects dashboard
    │   ├── projects/[id]/page.tsx   # Script editor
    │   ├── layout.tsx               # Root layout
    │   └── page.tsx                 # Landing page
    ├── components/ui/               # shadcn/ui components
    ├── contexts/
    │   └── AuthContext.tsx          # Authentication state
    ├── lib/
    │   └── api/client.ts            # API client
    ├── package.json
    └── tsconfig.json
```

## 🔌 API Endpoints

### Authentication
- `POST /api/auth/register` - Create new user account
- `POST /api/auth/login` - Login and get JWT token
- `POST /api/auth/logout` - Logout user

### Projects
- `GET /api/projects` - Get all user projects
- `GET /api/projects/:id` - Get specific project
- `POST /api/projects` - Create new project
- `PUT /api/projects/:id` - Update project
- `DELETE /api/projects/:id` - Delete project

### Augmentation
- `POST /api/augment/images` - Extract keywords and find images
- `GET /api/augment/search?keyword=tokyo` - Search images by keyword

## 🎨 UI Components

The application uses **shadcn/ui** components for a consistent, accessible design:
- Button, Input, Textarea, Label
- Card, Dialog, Badge, ScrollArea
- Toast notifications (Sonner)
- Dark mode support (next-themes)

## 🔒 Security Features

- **Password Hashing**: Bcrypt with salt rounds
- **JWT Tokens**: Secure authentication tokens
- **CORS Protection**: Configured allowed origins
- **SQL Injection Prevention**: Parameterized queries
- **XSS Protection**: Input sanitization
- **Environment Variables**: Sensitive data in .env files

## 🌟 Key Features Demonstration

### 1. User Registration & Login
- Create account with email, username, and password
- Secure JWT-based authentication
- Persistent sessions

### 2. Project Management
- Create unlimited projects
- Edit project titles and content
- Delete projects with confirmation
- View all projects in dashboard

### 3. AI-Powered Augmentation
- Write your script in the editor
- Click "Augment" to extract keywords
- View 6 image suggestions per keyword
- Click keywords to switch between image sets
- View source and download images

### 4. Script Editor
- Clean, distraction-free writing environment
- Auto-save functionality
- Real-time keyword extraction
- Side-by-side image suggestions

## 📊 Performance

- **Fast Load Times**: Optimized Next.js build
- **Efficient API**: Express.js with connection pooling
- **Image Optimization**: Thumbnail previews from Unsplash
- **Responsive UI**: Smooth animations and transitions

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License.

## 👨‍💻 Author

**Bola Olatunji**
- Email: bola.olatunji@gmail.com
- GitHub: [@Lightiam](https://github.com/Lightiam)

## 🙏 Acknowledgments

- **Groq** for lightning-fast AI inference
- **Unsplash** for beautiful, free images
- **shadcn/ui** for amazing UI components
- **Vercel** for Next.js framework

## 📞 Support

For support, email bola.olatunji@gmail.com or open an issue on GitHub.

---

**Built with ❤️ using Next.js, Express, and AI**
