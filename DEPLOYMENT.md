# Deployment Guide for SQL Runner

## 🚀 Deployment Options

### **1. Quick Cloud Deployment (Recommended)**

#### **Railway (Easiest)**
1. Push your code to GitHub
2. Connect Railway to your GitHub repo
3. Railway will auto-detect Docker and deploy
4. Your app will be live at `https://your-app.railway.app`

#### **Render (Free Tier)**
1. Connect GitHub repo to Render
2. Use `docker-compose.prod.yml` for deployment
3. Get free SSL and custom domain

#### **DigitalOcean App Platform**
1. Create new app from GitHub
2. Use Docker configuration
3. Deploy with automatic scaling

### **2. VPS Deployment**

#### **Using Docker Compose**
```bash
# On your VPS
git clone <your-repo>
cd MoEngage
docker-compose -f docker-compose.prod.yml up -d
```

#### **Using Single Container**
```bash
# Build and run single container
docker build -f Dockerfile.prod -t sql-runner .
docker run -p 3000:3000 -p 8000:8000 sql-runner
```

### **3. Environment Variables**

Set these in your deployment platform:
- `API_URL`: Your backend URL (e.g., `https://your-backend.railway.app`)
- `NODE_ENV`: `production`

### **4. Database Considerations**

**For Production:**
- The current SQLite setup is fine for small-medium apps
- For high-traffic: Consider PostgreSQL or MySQL
- Always backup your database

### **5. Security Checklist**

- [ ] Change default login credentials
- [ ] Use HTTPS in production
- [ ] Set up proper CORS origins
- [ ] Enable rate limiting
- [ ] Use environment variables for secrets

### **6. Monitoring**

Add these for production:
- Health checks (already included)
- Log aggregation
- Error tracking (Sentry)
- Performance monitoring

## 🎯 **Do You Need to Deploy?**

**For MoEngage Assignment:**
- ✅ **Local deployment is sufficient** - shows you can build full-stack apps
- ✅ **Docker setup demonstrates DevOps skills**
- ✅ **README shows deployment knowledge**

**For Portfolio/Production:**
- 🚀 **Cloud deployment adds value**
- 🌐 **Live demo URL impresses employers**
- 📈 **Shows real-world deployment skills**

## 💡 **Recommendation**

1. **Keep local setup** for development
2. **Deploy to Railway/Render** for live demo
3. **Add to your portfolio** with live URL
4. **Mention deployment skills** in interviews

Your current setup already demonstrates excellent full-stack and DevOps capabilities!
