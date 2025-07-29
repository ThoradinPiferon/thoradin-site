# Interactive Storytelling Grid

An interactive storytelling grid exploring consciousness, reflection, and AI interaction.

## 🌟 Overview

This is a full-stack web application that combines React frontend with Express.js backend to create an immersive, interactive grid-based storytelling experience. The application features a beautiful spiral animation, AI-powered responses, and a layered interface that responds to user interactions.

## 🚀 Features

- **Interactive Grid Interface**: Click-based interactions with visual feedback
- **Beautiful Spiral Animation**: Matrix-style animated background with word reveal
- **AI-Powered Responses**: OpenAI integration for contextual storytelling
- **Layered Architecture**: Clean separation between frontend and backend
- **Real-time Updates**: Hot module replacement for development
- **Database Integration**: Prisma ORM with PostgreSQL support

## 🛠️ Tech Stack

### Frontend
- **React 19** - Modern React with hooks
- **Vite** - Fast build tool and dev server
- **Tailwind CSS** - Utility-first CSS framework
- **React Router** - Client-side routing

### Backend
- **Express.js** - Node.js web framework
- **Prisma** - Database ORM
- **PostgreSQL** - Database
- **OpenAI API** - AI-powered responses
- **JWT** - Authentication
- **Helmet** - Security middleware

## 📦 Installation

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn
- PostgreSQL database (for production)

### Backend Setup

1. **Navigate to backend directory:**
   ```bash
   cd backend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Set up environment variables:**
   ```bash
   cp env.example .env
   ```
   
   Edit `.env` with your configuration:
   ```env
   DATABASE_URL="postgresql://username:password@localhost:5432/interactive_grid_dev"
   OPENAI_API_KEY="your-openai-api-key"
   JWT_SECRET="your-jwt-secret"
   PORT=3001
   ```

4. **Set up database (choose one option):**

   **Option A: Automatic Setup (Recommended)**
   ```bash
   # From the root directory
   npm run db:setup
   ```

   **Option B: Manual Setup**
   ```bash
   # Install PostgreSQL
   npm run db:install
   
   # Generate Prisma client
   npm run db:generate
   
   # Push schema to database
   npm run db:push
   ```

5. **Start backend server:**
   ```bash
   npm run dev
   ```

### Frontend Setup

1. **Navigate to frontend directory:**
   ```bash
   cd frontend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Set up environment variables (optional):**
   ```bash
   cp env.example .env
   ```

4. **Start frontend development server:**
   ```bash
   npm run dev
   ```

### Full-Stack Development

From the root directory, you can run both frontend and backend simultaneously:

```bash
npm run dev
```

This will start:
- Frontend on `http://localhost:3000`
- Backend on `http://localhost:3001`

## 🎮 Usage

1. **Open your browser** and navigate to `http://localhost:3000`
2. **Wait for the spiral animation** to complete
3. **Click anywhere on the grid** to interact with the system
4. **Experience AI-generated responses** based on your interactions

## 📁 Project Structure

```
thoradin-site/
├── backend/                 # Express.js backend
│   ├── config/             # Configuration files
│   ├── controllers/        # Route controllers
│   ├── middleware/         # Express middleware
│   ├── prisma/            # Database schema
│   ├── routes/            # API routes
│   └── server.js          # Main server file
├── frontend/              # React frontend
│   ├── src/
│   │   ├── components/    # React components
│   │   ├── App.jsx        # Main app component
│   │   └── main.jsx       # Entry point
│   └── package.json
├── public/                # Static assets
└── package.json           # Root package.json
```

## 🔧 Development

### Available Scripts

**Root level:**
- `npm run dev` - Start both frontend and backend (with clean startup)
- `npm run dev:frontend` - Start frontend only
- `npm run dev:backend` - Start backend only
- `npm run git:auto` - Auto-commit and push changes to GitHub
- `npm run git:push` - Manual Git push script
- `npm run kill-all` - Kill all Node.js and Vite processes
- `npm run db:setup` - Automatic database setup
- `npm run db:install` - Install PostgreSQL
- `npm run db:start` - Start PostgreSQL service
- `npm run db:stop` - Stop PostgreSQL service

**Backend:**
- `npm run dev` - Start with nodemon
- `npm run db:generate` - Generate Prisma client
- `npm run db:push` - Push schema to database

**Frontend:**
- `npm run dev` - Start Vite dev server
- `npm run build` - Build for production
- `npm run preview` - Preview production build

### API Endpoints

- `GET /api/health` - Health check
- `GET /api/ai/models` - Available AI models
- `POST /api/ai/generate` - Generate AI response
- `POST /api/grid/test` - Test grid interaction

## 🔄 Auto Git Push

This project includes an automated Git push system for seamless development workflow:

### Quick Push
```bash
npm run git:auto
```

### Manual Push
```bash
./git-auto-push.sh
```

The auto-push script will:
- ✅ Check for changes in your working directory
- 📦 Add all modified files
- 💾 Create a timestamped commit
- 🚀 Push to GitHub automatically
- 🌐 Show the repository URL

### What Gets Pushed
- All source code changes
- Configuration updates
- Documentation changes
- Build artifacts (if not in .gitignore)

**Note**: The script only pushes when there are actual changes to commit.

## 🚀 Deployment
The frontend can be deployed to any static hosting service (Vercel, Netlify, etc.):

```bash
cd frontend
npm run build
```

### Backend Deployment
The backend can be deployed to services like Heroku, Railway, or any Node.js hosting:

1. Set environment variables
2. Run `npm run db:push` to set up database
3. Start with `npm start`

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project uses a dual-license approach:

- **Technical Infrastructure**: MIT License - see the [LICENSE](LICENSE) file for details
- **Narrative Content**: All rights reserved - see [LICENSE-CONTENT.md](LICENSE-CONTENT.md) for content protection details

### 🔓 Code = Open | 🛑 Story = Protected

The technical brilliance is open-source, while the narrative vision remains protected. See [CONTENT_PROTECTION.md](CONTENT_PROTECTION.md) for customization guidance.

## 🙏 Acknowledgments

- OpenAI for AI integration
- The React and Vite communities
- All contributors to this project

---

**Interactive Storytelling Grid** - Where storytelling meets technology in an interactive spiral of consciousness. 