# GridPlay - Interactive Storytelling Grid

A dynamic, grid-based storytelling platform with AI integration, multilingual support, and modular architecture.

## 🚀 Quick Start

### Prerequisites
- Node.js (v18+)
- PostgreSQL database
- OpenAI API key (optional, for AI features)

### Local Development

1. **Clone and Setup**
```bash
git clone <your-repo-url>
cd thoradin-site
npm run setup:full
```

2. **Environment Variables**

Create `.env` files in both `backend/` and `frontend/` directories:

**Backend (`backend/.env`)**:
```env
DATABASE_URL="postgresql://username:password@localhost:5432/gridplay_db"
JWT_SECRET="your-super-secret-jwt-key"
OPENAI_API_KEY="your-openai-api-key"
PORT=3001
NODE_ENV=development
FRONTEND_URL="http://localhost:3000"
```

**Frontend (`frontend/.env`)**:
```env
VITE_API_BASE_URL="http://localhost:3001"
```

3. **Start Development Servers**
```bash
npm run dev
```

### Production Deployment

#### Backend (Render)
1. Connect your GitHub repository to Render
2. Set environment variables in Render dashboard:
   - `DATABASE_URL` (PostgreSQL connection string)
   - `JWT_SECRET` (random string for JWT signing)
   - `OPENAI_API_KEY` (your OpenAI API key)
   - `NODE_ENV=production`
   - `FRONTEND_URL` (your frontend domain)

#### Frontend (Vercel)
1. Connect your GitHub repository to Vercel
2. Set environment variable in Vercel dashboard:
   - `VITE_API_BASE_URL` (your backend URL, e.g., `https://your-backend.onrender.com`)

## 🔧 Configuration

### Environment Variables Reference

| Variable | Required | Description | Example |
|----------|----------|-------------|---------|
| `DATABASE_URL` | ✅ | PostgreSQL connection string | `postgresql://user:pass@host:5432/db` |
| `JWT_SECRET` | ✅ | Secret for JWT token signing | `your-super-secret-key` |
| `OPENAI_API_KEY` | ❌ | OpenAI API key for AI features | `sk-...` |
| `VITE_API_BASE_URL` | ✅ | Backend API URL for frontend | `https://backend.onrender.com` |
| `NODE_ENV` | ❌ | Environment mode | `development` or `production` |
| `PORT` | ❌ | Backend port | `3001` |
| `FRONTEND_URL` | ❌ | Frontend URL for CORS | `https://your-frontend.vercel.app` |

### Customization

Edit `backend/config/customization.js` to customize:
- Admin credentials
- Character names
- Project themes
- Content settings

## 🏗️ Architecture

### Backend
- **Express.js** server with RESTful API
- **Prisma ORM** for database management
- **PostgreSQL** database with multilingual content
- **JWT** authentication
- **OpenAI** integration for AI responses

### Frontend
- **React** with **Vite** for fast development
- **Grid-based UI** with interactive elements
- **Modular component system** for easy page creation
- **Client-side routing** with React Router

### Key Features
- **Multilingual Support**: Column-based language storage
- **AI Integration**: Direct LLM interaction via chat interface
- **Modular Grid System**: Reusable page templates
- **Dynamic Content**: Admin-configurable content and themes
- **Responsive Design**: Works on desktop and mobile

## 📁 Project Structure

```
thoradin-site/
├── backend/                 # Express.js API server
│   ├── config/             # Database, OpenAI, customization
│   ├── controllers/        # API route handlers
│   ├── middleware/         # Authentication, CORS
│   ├── models/            # Database models
│   ├── routes/            # API endpoints
│   ├── services/          # Business logic
│   └── scripts/           # Database initialization
├── frontend/              # React frontend
│   ├── src/
│   │   ├── components/    # React components
│   │   ├── services/      # API services
│   │   └── utils/         # Utility functions
│   └── public/            # Static assets
└── docs/                  # Documentation
```

## 🎮 Usage

### Grid Navigation
- Click grid cells to trigger actions
- G11.7 navigates to the Vault (AI chat interface)
- Grid actions are configurable per page

### Vault Interface
- Interactive AI chat with the grid consciousness
- Real-time responses with loading states
- Connection status monitoring

### Admin Features
- User authentication and authorization
- Content management via database
- Customizable themes and settings

## 🔍 Troubleshooting

### Common Issues

1. **Frontend shows "disconnected"**
   - Check `VITE_API_BASE_URL` environment variable
   - Verify backend is running and accessible
   - Check CORS configuration

2. **Database connection errors**
   - Verify `DATABASE_URL` is correct
   - Ensure PostgreSQL is running
   - Run `npm run db:setup` to initialize database

3. **AI features not working**
   - Check `OPENAI_API_KEY` is set
   - Verify API key has sufficient credits
   - Check backend logs for OpenAI errors

### Debug Commands

```bash
# Test database connection
npm run test:db

# Check backend health
curl https://your-backend.onrender.com/api/health

# Test AI chat
curl -X POST https://your-backend.onrender.com/api/ai/chat \
  -H "Content-Type: application/json" \
  -d '{"message": "test", "language": "en"}'
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

### Development Guidelines
- Follow existing code style
- Add tests for new features
- Update documentation as needed
- Ensure environment variables are properly configured

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

For issues and questions:
1. Check the troubleshooting section
2. Review the documentation
3. Open an issue on GitHub
4. Check console logs for detailed error messages

---

**Last Updated**: 2025-07-30  
**Version**: 1.0.0  
**Status**: Production Ready ✅
