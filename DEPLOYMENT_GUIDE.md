# Deployment & Configuration Guide

## Local Development Setup

### Prerequisites
- Node.js 18+ 
- npm or yarn package manager
- Modern web browser

### Installation Steps

1. **Clone/Download Project**
   ```bash
   cd tradies-admin-dashboard
   ```

2. **Install Dependencies** (if package.json present)
   ```bash
   npm install
   ```

3. **Set Environment Variables**
   Create `.env.local` in root directory:
   ```env
   NEXT_PUBLIC_API_URL=http://localhost:5000
   ```

4. **Run Development Server**
   ```bash
   npm run dev
   ```
   
5. **Access Application**
   - Open browser to `http://localhost:3000`
   - Login with demo credentials

### Development Environment Variables

```env
# API Configuration
NEXT_PUBLIC_API_URL=http://localhost:5000

# Optional: Enable debug logging
DEBUG=tradies:*
```

---

## Production Deployment

### Vercel Deployment (Recommended)

1. **Push to GitHub**
   ```bash
   git push origin main
   ```

2. **Connect to Vercel**
   - Go to https://vercel.com/new
   - Select your GitHub repository
   - Click "Import"

3. **Configure Environment Variables**
   In Vercel dashboard:
   ```
   NEXT_PUBLIC_API_URL=https://api.yourdomain.com
   ```

4. **Deploy**
   - Click "Deploy"
   - Monitor deployment progress
   - Access live site at vercel-generated URL

### Self-Hosted Deployment (AWS/DigitalOcean/etc.)

#### 1. Build the Project
```bash
npm run build
```

#### 2. Deploy to Server
```bash
# Copy build files
scp -r .next package.json package-lock.json user@server:/app

# SSH into server
ssh user@server

# Navigate to app directory
cd /app

# Install production dependencies
npm ci --production

# Set environment variables
export NEXT_PUBLIC_API_URL=https://api.yourdomain.com

# Start server (with PM2 recommended)
npm start
```

#### 3. Using PM2 for Process Management
```bash
# Install PM2
npm install -g pm2

# Create ecosystem.config.js
cat > ecosystem.config.js << EOF
module.exports = {
  apps: [{
    name: 'tradies-admin',
    script: 'npm',
    args: 'start',
    env: {
      NODE_ENV: 'production',
      NEXT_PUBLIC_API_URL: 'https://api.yourdomain.com'
    },
    instances: 2,
    exec_mode: 'cluster'
  }]
};
EOF

# Start with PM2
pm2 start ecosystem.config.js

# Auto-restart on server reboot
pm2 startup
pm2 save
```

#### 4. Setup Reverse Proxy (Nginx)
```nginx
upstream nextjs {
  server 127.0.0.1:3000;
}

server {
  listen 80;
  server_name admin.yourdomain.com;
  
  location / {
    proxy_pass http://nextjs;
    proxy_http_version 1.1;
    proxy_set_header Upgrade $http_upgrade;
    proxy_set_header Connection 'upgrade';
    proxy_set_header Host $host;
    proxy_cache_bypass $http_upgrade;
  }
}
```

---

## Docker Deployment

### Dockerfile
```dockerfile
FROM node:18-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci

# Copy application
COPY . .

# Build application
RUN npm run build

# Expose port
EXPOSE 3000

# Set environment variables
ENV NODE_ENV=production

# Start application
CMD ["npm", "start"]
```

### Docker Compose
```yaml
version: '3.8'

services:
  app:
    build: .
    ports:
      - "3000:3000"
    environment:
      NEXT_PUBLIC_API_URL: http://api:5000
    depends_on:
      - api

  api:
    image: your-api-image:latest
    ports:
      - "5000:5000"
```

### Build and Run
```bash
# Build image
docker build -t tradies-admin:latest .

# Run container
docker run -p 3000:3000 \
  -e NEXT_PUBLIC_API_URL=https://api.yourdomain.com \
  tradies-admin:latest

# With Docker Compose
docker-compose up -d
```

---

## Environment Configuration

### Development (.env.local)
```env
NEXT_PUBLIC_API_URL=http://localhost:5000
DEBUG=tradies:*
```

### Staging (.env.staging)
```env
NEXT_PUBLIC_API_URL=https://api-staging.yourdomain.com
NODE_ENV=production
```

### Production (.env.production)
```env
NEXT_PUBLIC_API_URL=https://api.yourdomain.com
NODE_ENV=production
```

### Vercel Environment Variables
1. Go to Project Settings → Environment Variables
2. Add each variable for each environment:
   - **Development**: For preview deployments
   - **Preview**: For branch deployments
   - **Production**: For main branch

---

## HTTPS/SSL Configuration

### Let's Encrypt (Free)
```bash
# Install Certbot
sudo apt-get install certbot python3-certbot-nginx

# Generate certificate
sudo certbot certonly --nginx -d admin.yourdomain.com

# Auto-renew
sudo systemctl enable certbot.timer
```

### Nginx SSL Configuration
```nginx
server {
  listen 443 ssl;
  server_name admin.yourdomain.com;
  
  ssl_certificate /etc/letsencrypt/live/admin.yourdomain.com/fullchain.pem;
  ssl_certificate_key /etc/letsencrypt/live/admin.yourdomain.com/privkey.pem;
  
  # ... rest of config
}

# Redirect HTTP to HTTPS
server {
  listen 80;
  server_name admin.yourdomain.com;
  return 301 https://$server_name$request_uri;
}
```

---

## CORS Configuration

### Backend API Configuration
The admin dashboard requires CORS headers from your API:

```
Access-Control-Allow-Origin: https://admin.yourdomain.com
Access-Control-Allow-Credentials: true
Access-Control-Allow-Methods: GET, POST, PATCH, DELETE, OPTIONS
Access-Control-Allow-Headers: Content-Type, Authorization
```

### Node.js/Express Example
```javascript
const cors = require('cors');

app.use(cors({
  origin: [
    'http://localhost:3000',
    'https://admin.yourdomain.com'
  ],
  credentials: true
}));
```

---

## Database Connection

The admin dashboard is **frontend-only** and connects to an external API backend.

### API Backend Requirements
- Support JWT token-based authentication
- Implement all required endpoints (see API_REFERENCE.md)
- Enable CORS for dashboard domain
- Use HTTPS in production

---

## Monitoring & Analytics

### Application Performance Monitoring

#### Vercel Analytics
- Automatically included with Vercel deployment
- Monitor Web Vitals and performance metrics

#### Custom Analytics
```typescript
// pages/_app.tsx or app/layout.tsx
import { Analytics } from '@vercel/analytics/next';

export default function App() {
  return (
    <>
      {/* app content */}
      <Analytics />
    </>
  );
}
```

### Error Tracking (Optional)

#### Sentry Integration
```bash
npm install @sentry/nextjs
```

```typescript
// sentry.client.config.ts
import * as Sentry from '@sentry/nextjs';

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
  environment: process.env.NODE_ENV,
});
```

---

## Security Best Practices

### 1. Environment Variables
- Never commit `.env.local` to version control
- Use `.env.example` to document required variables
- Rotate sensitive values regularly

### 2. Authentication
- Implement token expiration
- Refresh tokens regularly
- Clear tokens on logout
- Use httpOnly cookies for tokens (optional)

### 3. API Security
- Validate all inputs on backend
- Implement rate limiting
- Use HTTPS only in production
- Add CORS restrictions
- Implement request signing if needed

### 4. Headers & CSP
```javascript
// next.config.js
module.exports = {
  headers: async () => [
    {
      source: '/:path*',
      headers: [
        { key: 'X-Content-Type-Options', value: 'nosniff' },
        { key: 'X-Frame-Options', value: 'DENY' },
        { key: 'X-XSS-Protection', value: '1; mode=block' },
      ],
    },
  ],
};
```

### 5. Database
- Use parameterized queries
- Implement row-level security
- Regular backups
- Encryption at rest

---

## Troubleshooting

### Common Issues

#### 1. CORS Errors
**Problem**: "Access to XMLHttpRequest blocked by CORS policy"

**Solution**:
- Check backend CORS configuration
- Verify domain is whitelisted
- Check for typos in NEXT_PUBLIC_API_URL

#### 2. 401 Unauthorized
**Problem**: API returns 401 for all requests

**Solution**:
- Verify token is being sent correctly
- Check token expiration
- Verify backend token validation
- Clear localStorage and re-login

#### 3. Build Errors
**Problem**: Build fails during deployment

**Solution**:
```bash
# Clear cache
rm -rf .next

# Rebuild locally
npm run build

# Check for TypeScript errors
npm run type-check
```

#### 4. Slow Performance
**Problem**: Dashboard loads slowly

**Solution**:
- Check network requests in DevTools
- Verify API response times
- Enable SWR caching
- Use CDN for static assets

---

## Maintenance & Updates

### Updating Dependencies
```bash
# Check outdated packages
npm outdated

# Update packages
npm update

# Update major versions (careful!)
npm upgrade
```

### Database Backups
```bash
# Recommended: Daily automated backups
# Configure with your database provider
```

### Log Monitoring
```bash
# View application logs
pm2 logs tradies-admin

# View system logs
tail -f /var/log/syslog
```

### Health Checks
```bash
# Simple health check endpoint
curl http://localhost:3000/api/health
```

---

## Performance Optimization

### Build Output
```bash
# Analyze bundle size
npm install -D @next/bundle-analyzer

# Generate report
npm run analyze
```

### Caching Headers
```javascript
// next.config.js
module.exports = {
  onDemandEntries: {
    maxInactiveAge: 60 * 60 * 1000,
    pagesBufferLength: 5,
  },
};
```

### Image Optimization
```javascript
// next.config.js
module.exports = {
  images: {
    formats: ['image/avif', 'image/webp'],
    minimumCacheTTL: 60000,
  },
};
```

---

## Rollback Procedure

### Vercel
- Deployment overview → Click previous deployment
- Click "Redeploy"

### Manual Rollback
```bash
# Revert to previous code
git revert HEAD

# Rebuild and redeploy
npm run build
npm start
```

---

## Support & Contact

For deployment issues:
1. Check logs for error messages
2. Review this guide's troubleshooting section
3. Check API backend health
4. Contact your DevOps team

## Checklist Before Production

- [ ] Set correct NEXT_PUBLIC_API_URL
- [ ] Enable HTTPS/SSL
- [ ] Configure CORS properly
- [ ] Set up monitoring
- [ ] Configure backups
- [ ] Test authentication flow
- [ ] Test all major features
- [ ] Performance testing
- [ ] Security audit
- [ ] Document deployment process
- [ ] Train team on updates
