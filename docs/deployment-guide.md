# Deployment Guide

This guide covers deploying OpenGood to a production environment.

## Prerequisites

- A server (VPS) with Docker and Docker Compose installed
- A domain name (optional but recommended)
- A PostgreSQL database (included via Docker Compose)

## Option 1: Docker Compose (Recommended)

This is the simplest deployment method and works on any Linux VPS ($5/month is sufficient).

### 1. Clone the Repository

```bash
git clone https://github.com/YOUR_USERNAME/opengood.git
cd opengood
```

### 2. Configure Environment Variables

```bash
cp .env.example .env
```

Edit `.env` with your production values:

```bash
# Generate a secure secret
AUTH_SECRET=$(openssl rand -base64 32)

# Set your domain
AUTH_URL=https://yourdomain.com
NEXT_PUBLIC_SITE_URL=https://yourdomain.com

# Database (the Docker Compose default works, but change the password)
DATABASE_URL=postgresql://opengood:YOUR_SECURE_PASSWORD@db:5432/opengood
```

Update `docker-compose.yml` to match the database password.

### 3. Configure Stripe (Optional)

1. Create a Stripe account at https://stripe.com
2. Get your API keys from the Stripe Dashboard
3. Add to `.env`:
   ```
   STRIPE_SECRET_KEY=sk_live_...
   NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_...
   ```
4. Set up a webhook endpoint pointing to `https://yourdomain.com/api/donations/webhook`
5. Add the webhook signing secret:
   ```
   STRIPE_WEBHOOK_SECRET=whsec_...
   ```

### 4. Configure Email (Optional)

**Option A: SMTP**
```bash
SMTP_HOST=smtp.your-provider.com
SMTP_PORT=587
SMTP_USER=your-email@example.com
SMTP_PASS=your-password
```

**Option B: Resend**
```bash
RESEND_API_KEY=re_...
```

### 5. Build and Start

```bash
docker-compose up -d --build
```

### 6. Run Database Migrations

```bash
docker-compose exec app npx prisma migrate deploy
```

### 7. Create Admin Account

Visit `https://yourdomain.com/admin/setup` to create your first admin account.

### 8. Set Up Reverse Proxy (Optional)

For HTTPS, use Nginx or Caddy as a reverse proxy:

**Caddy (simplest — auto HTTPS):**
```
yourdomain.com {
    reverse_proxy localhost:3000
}
```

**Nginx:**
```nginx
server {
    listen 80;
    server_name yourdomain.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

## Option 2: Manual Deployment

### 1. Set Up PostgreSQL

Install PostgreSQL on your server or use a managed service (e.g., Supabase, Neon, Railway).

### 2. Install Node.js

Install Node.js 20+ on your server.

### 3. Build and Run

```bash
npm ci
npx prisma generate
npx prisma migrate deploy
npm run build
npm start
```

### 4. Process Manager

Use PM2 to keep the application running:

```bash
npm install -g pm2
pm2 start npm --name opengood -- start
pm2 save
pm2 startup
```

## Updating

```bash
git pull
docker-compose up -d --build
docker-compose exec app npx prisma migrate deploy
```

## Backups

Back up your PostgreSQL database regularly:

```bash
docker-compose exec db pg_dump -U opengood opengood > backup-$(date +%Y%m%d).sql
```

Restore from backup:

```bash
cat backup.sql | docker-compose exec -T db psql -U opengood opengood
```
