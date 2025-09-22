# Production Deployment Guide

## Environment Setup

### 1. Environment Variables

Create a `.env.production` file in the frontend directory:

```bash
# Production Environment Configuration
VITE_API_BASE_URL=https://your-api-domain.com/api
VITE_APP_NAME=DevCommunity
VITE_APP_VERSION=1.0.0
NODE_ENV=production

# Optional: Analytics
# VITE_GOOGLE_ANALYTICS_ID=your_ga_id
# VITE_SENTRY_DSN=your_sentry_dsn
```

### 2. Build for Production

```bash
# Install dependencies
npm install

# Build for production
npm run build:prod

# Preview production build locally
npm run preview:prod
```

## Deployment Options

### Option 1: Static Hosting (Netlify, Vercel, GitHub Pages)

1. Build the project: `npm run build:prod`
2. Deploy the `dist` folder to your hosting service
3. Configure environment variables in your hosting platform
4. Set up redirects for SPA routing (all routes should redirect to `index.html`)

### Option 2: Nginx Server

1. Build the project: `npm run build:prod`
2. Copy `dist` folder to your server
3. Configure Nginx:

```nginx
server {
    listen 80;
    server_name your-domain.com;
    root /path/to/dist;
    index index.html;

    # Handle client-side routing
    location / {
        try_files $uri $uri/ /index.html;
    }

    # Cache static assets
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }

    # Security headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;
}
```

### Option 3: Docker Deployment

Create a `Dockerfile`:

```dockerfile
# Build stage
FROM node:18-alpine as build
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
RUN npm run build:prod

# Production stage
FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/nginx.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

## Backend Configuration

### Environment Variables for Backend

Create a `.env` file in the backend directory:

```bash
# Database
MONGODB_URI=mongodb://localhost:27017/devcommunity
# or for production: mongodb://username:password@host:port/database

# Server
PORT=8000
NODE_ENV=production

# CORS
CORS_ORIGIN=https://your-frontend-domain.com

# JWT
JWT_SECRET=your-super-secret-jwt-key
JWT_EXPIRY=7d

# Cloudinary (for image uploads)
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret
```

### Backend Deployment

1. Install dependencies: `npm install`
2. Set up environment variables
3. Start the server: `npm run dev` (development) or use PM2 for production

```bash
# Install PM2 globally
npm install -g pm2

# Start with PM2
pm2 start src/index.js --name "devcommunity-api"

# Save PM2 configuration
pm2 save
pm2 startup
```

## Full Stack Deployment

### Using Docker Compose

Create a `docker-compose.yml`:

```yaml
version: '3.8'
services:
  frontend:
    build: ./frontend
    ports:
      - "80:80"
    depends_on:
      - backend
    environment:
      - VITE_API_BASE_URL=http://backend:8000/api

  backend:
    build: ./backend
    ports:
      - "8000:8000"
    environment:
      - MONGODB_URI=mongodb://mongo:27017/devcommunity
      - CORS_ORIGIN=http://localhost
    depends_on:
      - mongo

  mongo:
    image: mongo:latest
    ports:
      - "27017:27017"
    volumes:
      - mongo_data:/data/db

volumes:
  mongo_data:
```

## Performance Optimization

### Frontend Optimizations

1. **Code Splitting**: Already configured in `vite.config.ts`
2. **Image Optimization**: Use WebP format and lazy loading
3. **Bundle Analysis**: Run `npm run build` and check bundle size
4. **CDN**: Use a CDN for static assets

### Backend Optimizations

1. **Rate Limiting**: Already implemented
2. **Caching**: Add Redis for session storage and caching
3. **Database Indexing**: Ensure proper MongoDB indexes
4. **Compression**: Enable gzip compression

## Security Checklist

- [ ] Environment variables are properly set
- [ ] CORS is configured correctly
- [ ] JWT secrets are strong and unique
- [ ] Rate limiting is enabled
- [ ] Input validation is in place
- [ ] HTTPS is enabled in production
- [ ] Security headers are configured
- [ ] Database credentials are secure
- [ ] File uploads are validated and sanitized

## Monitoring

### Frontend Monitoring

- Set up error tracking (Sentry)
- Monitor Core Web Vitals
- Track user analytics

### Backend Monitoring

- Set up logging (Winston)
- Monitor API performance
- Set up health checks
- Monitor database performance

## Backup Strategy

1. **Database Backups**: Regular MongoDB backups
2. **File Backups**: Backup uploaded images
3. **Configuration Backups**: Version control for configs

## SSL/HTTPS Setup

Use Let's Encrypt for free SSL certificates:

```bash
# Install certbot
sudo apt install certbot python3-certbot-nginx

# Get certificate
sudo certbot --nginx -d your-domain.com
```

## Troubleshooting

### Common Issues

1. **CORS Errors**: Check CORS_ORIGIN in backend
2. **Build Failures**: Check environment variables
3. **Routing Issues**: Ensure SPA redirects are configured
4. **Database Connection**: Verify MongoDB URI and network access

### Logs

- Frontend: Check browser console and network tab
- Backend: Check PM2 logs or server logs
- Database: Check MongoDB logs
