# Thoradin Site - AI Grid Interface

An interactive grid-based AI interface with matrix animations and starry backgrounds.

## 🚀 Features

- **Interactive Grid System**: Click-based navigation with smart action handling
- **AI Chat Interface**: Direct LLM interaction with connection monitoring
- **Matrix Animations**: Dynamic spiral animations and starry backgrounds
- **Multilingual Support**: Column-based content storage with language detection
- **Smart Error Handling**: Graceful API fallbacks and connection status monitoring
- **Responsive Design**: Works across all devices and screen sizes

## 🎯 Quick Start

### Local Development
```bash
# Install dependencies
npm install

# Start both frontend and backend
npm run dev

# Or start individually
npm run dev:frontend  # Frontend on localhost:3000
npm run dev:backend   # Backend on localhost:3001
```

### Production Deployment
- **Frontend**: Automatically deployed on Vercel
- **Backend**: Deployed on Render
- **Database**: PostgreSQL with Prisma ORM

## 🔧 Environment Variables

### Frontend (.env)
```bash
VITE_API_BASE_URL=http://localhost:3001  # Local development
VITE_API_BASE_URL=https://thoradin-backend.onrender.com  # Production
```

### Backend (.env)
```bash
DATABASE_URL=your_postgres_connection_string
JWT_SECRET=your_jwt_secret
OPENAI_API_KEY=your_openai_key
PORT=3001
NODE_ENV=production
FRONTEND_URL=https://your-vercel-domain.vercel.app
```

## 🎮 Grid Navigation

- **Homepage**: Matrix spiral animation with interactive grid
- **AI Interface**: Access via G11.7 (bottom right grid)
- **Smart Actions**: Grid clicks only active when actions are defined

## 🤖 AI Features

- **Connection Monitoring**: Real-time API health checking
- **Error Handling**: Graceful fallbacks and user feedback
- **Loading States**: Animated spinners and disabled states
- **Response Metadata**: Model info and response times

## 📊 System Status

- ✅ **Backend**: Live on Render
- ✅ **Frontend**: Auto-deploying on Vercel
- ✅ **Database**: PostgreSQL with 60+ content entries
- ✅ **Admin User**: Configured and ready
- ✅ **Error Handling**: Comprehensive and user-friendly

## 🎨 UI Components

- **GridPlay**: Reusable grid system with layer management
- **AIInteraction**: Chat interface with starry background
- **MatrixSpiralCanvas**: Dynamic matrix animations
- **LayeredInterface**: Smart component layering

## 🔄 Latest Update

Enhanced AI interaction with comprehensive error handling, connection monitoring, and graceful API fallbacks. Production deployment ready with environment variable configuration.

---

**Status**: Production Ready ✅ 