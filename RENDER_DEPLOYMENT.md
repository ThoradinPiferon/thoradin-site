# 🚀 Render Deployment Guide

## Environment Variables for Render

When deploying to Render, you need to set these environment variables in your Render dashboard:

### **Required Environment Variables:**

| Variable Name | Value | Description |
|---------------|-------|-------------|
| `DATABASE_URL` | `postgresql://username:password@host:port/database` | Your PostgreSQL connection string from Render |
| `JWT_SECRET` | `your-super-secure-jwt-secret-key-here` | Secret key for JWT token generation |
| `OPENAI_API_KEY` | `sk-your-openai-api-key-here` | Your OpenAI API key |
| `PORT` | `3001` | Port your server runs on (Render will override this) |
| `NODE_ENV` | `production` | Environment setting |

### **Optional Environment Variables:**

| Variable Name | Value | Description |
|---------------|-------|-------------|
| `FRONTEND_URL` | `https://your-frontend-app.onrender.com` | Frontend URL for CORS |
| `RATE_LIMIT_WINDOW_MS` | `900000` | Rate limiting window (15 minutes) |
| `RATE_LIMIT_MAX_REQUESTS` | `100` | Max requests per window |

## 🔐 Admin User Login

After deployment, you can log in with the admin user:

```
Email: Marc.R.T.Dache@gmail.com
Password: ThoradinAdmin2024!
```

## 📋 Setup Steps for Render:

### 1. **Create PostgreSQL Database on Render:**
- Go to Render Dashboard
- Create a new PostgreSQL database
- Copy the connection string

### 2. **Create Web Service:**
- Connect your GitHub repository
- Set build command: `npm run setup:full`
- Set start command: `npm start`
- Add environment variables (see above)

### 3. **Database Migration:**
After deployment, the database will be automatically set up with:
- Admin user: Thoradin.Piferon
- 60 multilingual content items
- All necessary tables and relations

## 🔧 Build Commands for Render:

```bash
# Build Command
npm run setup:full

# Start Command  
npm start
```

## 🌍 Multilingual System:

The system supports 10 languages:
- English (en)
- Spanish (es)
- French (fr)
- German (de)
- Italian (it)
- Portuguese (pt)
- Russian (ru)
- Japanese (ja)
- Korean (ko)
- Chinese (zh)

## 🔒 Security Features:

- bcrypt password hashing
- JWT token authentication
- Role-based access control
- Rate limiting
- Input validation
- CORS protection

## 📊 API Endpoints:

### Authentication:
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/verify` - Verify JWT token
- `GET /api/auth/profile` - Get user profile

### Grid & AI:
- `POST /api/grid/interact` - Grid interaction
- `POST /api/ai/generate` - AI response generation
- `GET /api/grid/history` - User interaction history

### Configuration:
- `GET /api/config/content/:type` - Get content by type
- `GET /api/config/language/stats` - Language statistics

## 🚨 Important Notes:

1. **Database URL**: Use the connection string from Render's PostgreSQL service
2. **JWT Secret**: Generate a strong, unique secret key
3. **OpenAI Key**: Ensure your OpenAI API key is valid and has credits
4. **CORS**: Update FRONTEND_URL to match your frontend deployment URL

## 🔍 Troubleshooting:

### Common Issues:
- **Database Connection**: Ensure DATABASE_URL is correct
- **JWT Errors**: Check JWT_SECRET is set
- **CORS Errors**: Verify FRONTEND_URL matches your frontend
- **Build Failures**: Check all dependencies are in package.json

### Health Check:
- Visit `/api/health` to verify the server is running
- Check database connection with `/api/config/language/stats`

## 📞 Support:

If you encounter issues:
1. Check Render logs for error messages
2. Verify all environment variables are set
3. Ensure database is properly initialized
4. Test API endpoints with Postman or similar tool 