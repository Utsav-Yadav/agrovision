# Deployment Guide

## Quick Start Deployment

Choose your preferred platform and follow the instructions below.

## Option 1: Heroku (Easiest for Beginners)

### Prerequisites
- Heroku account (free tier available)
- Heroku CLI installed
- Git installed

### Steps

```bash
# 1. Login to Heroku
heroku login

# 2. Create a new app
heroku create your-app-name

# 3. Add MongoDB Atlas database
# - Create MongoDB Atlas cluster (free tier available)
# - Get connection string
# - Set it as env variable
heroku config:set MONGODB_URI="mongodb+srv://user:password@cluster.mongodb.net/agrovision"

# 4. Deploy
git push heroku main
```

## Option 2: Railway (Recommended - Modern & Easy)

### Prerequisites
- Railway account (free tier available)
- Railway CLI or web interface

### Steps

```bash
# 1. Install Railway CLI
npm install -g @railway/cli

# 2. Login
railway login

# 3. Deploy
railway up
```

Railway automatically detects Node.js app and deploys it!

## Option 3: Render (Simple & Reliable)

### Steps

1. Push code to GitHub
2. Go to [render.com](https://render.com)
3. Create New → Web Service
4. Connect GitHub repository
5. Set Environment Variables:
   - `NODE_ENV`: production
   - `MONGODB_URI`: your-mongodb-uri
6. Deploy!

## Option 4: Vercel (For Serverless)

Not ideal for long-running apps, but possible with serverless functions.

## Option 5: Docker Deployment

### Prerequisites
- Docker installed
- Docker Hub account (for image storage)

### Steps

```bash
# 1. Build Docker image
docker build -t yourusername/agrovision .

# 2. Tag image
docker tag agrovision yourusername/agrovision:latest

# 3. Push to Docker Hub
docker push yourusername/agrovision:latest

# 4. Deploy anywhere that supports Docker
# Examples: AWS ECS, DigitalOcean, Linode, etc.
```

### Deploy to DigitalOcean App Platform

1. Create DigitalOcean account
2. Create new App
3. Connect Docker Hub
4. Select image: yourusername/agrovision
5. Set environment variables
6. Deploy!

## Option 6: Traditional VPS (AWS EC2, Linode, DigitalOcean Droplet)

### Prerequisites
- SSH access to server
- Node.js 20+ installed
- MongoDB running or MongoDB Atlas URI

### Steps

```bash
# 1. SSH into server
ssh root@your-server-ip

# 2. Install Node.js
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs

# 3. Clone repository
git clone your-repo-url
cd agrovision

# 4. Install dependencies
npm install

# 5. Set environment variables
nano .env

# 6. Install PM2 (process manager)
sudo npm install -g pm2

# 7. Start application
pm2 start index.js --name "agrovision"
pm2 startup
pm2 save

# 8. Setup reverse proxy (nginx)
sudo apt-get install nginx
# Configure nginx to proxy to localhost:3002
```

### Nginx Configuration Example

```nginx
server {
    listen 80;
    server_name your-domain.com;

    location / {
        proxy_pass http://localhost:3002;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

## Option 7: AWS Elastic Beanstalk

```bash
# Install AWS EB CLI
pip install awsebcli

# Initialize
eb init -p node.js-20 agrovision --region us-east-1

# Create environment
eb create agrovision-prod

# Deploy updates
eb deploy
```

## Environment Variables for Production

```env
NODE_ENV=production
PORT=3002
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/agrovision
CORS_ORIGIN=https://yourdomain.com
```

## MongoDB Atlas Setup (Recommended)

1. Go to [mongodb.com/cloud/atlas](https://mongodb.com/cloud/atlas)
2. Create free account
3. Create cluster (M0 free tier available)
4. Get connection string
5. Replace username, password, cluster name
6. Use as `MONGODB_URI`

## SSL/HTTPS

### Option A: Let's Encrypt (Free)
```bash
sudo apt-get install certbot python3-certbot-nginx
sudo certbot --nginx -d yourdomain.com
```

### Option B: Cloud Provider
- Heroku: Automatic HTTPS
- Railway: Automatic HTTPS
- Render: Automatic HTTPS
- AWS: Use ACM (AWS Certificate Manager)

## Monitoring & Logging

### Option A: PM2 (VPS)
```bash
pm2 logs agrovision
pm2 monit
```

### Option B: Cloud Provider Logs
- Heroku: `heroku logs --tail`
- Railway: Web dashboard
- Render: Web dashboard

## Continuous Integration/Deployment (CI/CD)

### GitHub Actions Example

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Deploy to Heroku
        uses: akhileshns/heroku-deploy@v3.12.12
        with:
          heroku_api_key: ${{ secrets.HEROKU_API_KEY }}
          heroku_app_name: "your-app-name"
          heroku_email: "your-email@example.com"
```

## Performance Checklist

- [ ] Set NODE_ENV=production
- [ ] Configure MongoDB connection pooling
- [ ] Enable CORS with specific origins (not *)
- [ ] Set up HTTPS/SSL
- [ ] Configure rate limiting
- [ ] Set up logging
- [ ] Enable security headers
- [ ] Test health endpoint
- [ ] Set up monitoring/alerts
- [ ] Configure backups for database

## Troubleshooting

### App crashes after deployment
- Check logs: `heroku logs --tail`
- Verify environment variables are set
- Check MongoDB connection

### Slow performance
- Check MongoDB indexes
- Enable caching
- Optimize database queries
- Check server resources

### CORS errors
- Set CORS_ORIGIN to your domain
- Check allowed origins in code

## Next Steps

1. Deploy to chosen platform
2. Set up custom domain
3. Configure SSL certificate
4. Set up monitoring
5. Configure backups
6. Set up CI/CD pipeline
7. Continue development!

---

For detailed help on your chosen platform, visit their documentation.
