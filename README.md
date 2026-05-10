# AgroVision - Agricultural Planning Platform

A modern, full-stack agricultural management application built with Node.js, Express, and MongoDB. Helps farmers plan crops, manage contractors, and calculate revenue projections.

## Features

- **Farmer Portal**: Register farms and browse available contractors
- **Contractor Management**: View and manage service contractors
- **Crop Planner**: Create detailed seasonal plans with activity schedules
- **Revenue Calculator**: Estimate crop revenue based on field parameters
- **Dashboard**: View key statistics and insights

## Prerequisites

- Node.js 20+ or Docker
- MongoDB 6.0+ (or MongoDB Atlas)
- npm or yarn

## Installation

### Local Development

1. **Clone the repository**
```bash
git clone <repository-url>
cd agrovision
```

2. **Install dependencies**
```bash
npm install
```

3. **Configure environment variables**
```bash
cp .env.example .env
# Edit .env with your configuration
```

4. **Start the application**
```bash
# Development mode (with auto-reload)
npm run dev

# Production mode
npm start
```

The application will be available at `http://localhost:3002`

### Docker Deployment

1. **Using Docker Compose** (recommended for quick setup)
```bash
docker-compose up --build
```

2. **Using Docker alone**
```bash
# Build image
docker build -t agrovision .

# Run container
docker run -p 3002:3002 \
  -e MONGODB_URI=mongodb://mongodb:27017/agrovision \
  --network agrovision-network \
  agrovision
```

## Environment Variables

```env
NODE_ENV=production
PORT=3002
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/agrovision
CORS_ORIGIN=*
```

## Project Structure

```
├── config/           # Configuration files
│   └── db.js        # Database connection
├── controllers/      # Business logic
│   ├── pageController.js
│   ├── formController.js
│   ├── plannerController.js
│   └── revenueController.js
├── models/           # Database schemas
│   ├── Farmer.js
│   ├── Contractor.js
│   ├── Application.js
│   └── RevenueRequest.js
├── public/           # Static assets
│   ├── css/
│   └── js/
├── routes/           # API and page routes
│   ├── api.js
│   └── pages.js
├── views/            # EJS templates
│   └── *.ejs
├── app.js            # Express app setup
├── index.js          # Server entry point
└── package.json      # Dependencies
```

## Available Scripts

```bash
npm start           # Start production server
npm run dev         # Start development server with auto-reload
npm run seed        # Seed database with initial data
npm run lint        # Run ESLint
npm test            # Run tests (if configured)
```

## API Endpoints

### Health Check
- `GET /api/health` - Server health status

### Pages (Server-Rendered)
- `GET /` - Home page
- `GET /farmers` - Farmers portal
- `GET /contractors` - Contractors page
- `GET /revenue` - Revenue calculator
- `GET /planner` - Crop planner

### Forms
- `POST /farmers/create` - Register new farmer
- `POST /contractors/create` - Register new contractor
- `POST /revenue/calculate` - Calculate revenue estimate
- `POST /planner/generate` - Generate crop schedule
- `POST /farmers/calculate-revenue` - Calculate revenue from farmers portal
- `POST /farmers/generate-plan` - Generate plan from farmers portal

## Deployment Platforms

### Heroku
```bash
# Login to Heroku
heroku login

# Create app
heroku create agrovision-app

# Set environment variables
heroku config:set MONGODB_URI=<your-mongodb-uri>

# Deploy
git push heroku main
```

### Railway
```bash
# Install Railway CLI
npm i -g @railway/cli

# Login and deploy
railway login
railway up
```

### AWS (Elastic Beanstalk)
```bash
# Install AWS CLI and EB CLI
pip install awsebcli

# Initialize
eb init -p node.js-20 agrovision

# Deploy
eb create agrovision-env
eb deploy
```

### DigitalOcean / Linode (via Docker)
1. Push Docker image to registry
2. Deploy using Docker Compose on your server

## Database Setup

### MongoDB Atlas (Recommended for Production)
1. Create cluster on MongoDB Atlas
2. Get connection string
3. Set `MONGODB_URI` in environment variables

### Local MongoDB
```bash
# Using Docker
docker run -d \
  -p 27017:27017 \
  -e MONGO_INITDB_ROOT_USERNAME=admin \
  -e MONGO_INITDB_ROOT_PASSWORD=password \
  mongo:6-alpine
```

## Performance Optimization

- Static assets cached with 1-day max-age
- Gzip compression enabled for responses
- Security headers configured
- CORS properly configured
- Connection pooling enabled for MongoDB
- Error handling with graceful degradation

## Security Considerations

- Environment variables for sensitive data
- CORS enabled (configure for production)
- Security headers set (X-Content-Type-Options, X-Frame-Options, etc.)
- Input validation required
- SQL injection protection (using MongoDB)
- XSS protection headers

## Monitoring & Logging

- Console logging for development
- Structured logging ready for production
- Health check endpoint available
- Graceful shutdown handling

## Contributing

1. Create feature branch (`git checkout -b feature/AmazingFeature`)
2. Commit changes (`git commit -m 'Add AmazingFeature'`)
3. Push to branch (`git push origin feature/AmazingFeature`)
4. Open Pull Request

## License

This project is licensed under the MIT License - see LICENSE file for details.

## Support

For issues and questions, please create an issue in the repository.

---

**Last Updated**: May 2026
**Maintained by**: AgroVision Team
