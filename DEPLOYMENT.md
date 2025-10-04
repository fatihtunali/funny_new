# Deployment Instructions for Funny Tourism Website

## 📦 What's in the Package

This is your complete Funny Tourism website ready for deployment to your live server at **dreamdestinationturkey.com** (IP: 188.132.230.193)

## 🚀 Step-by-Step Deployment Guide

### Step 1: Upload Files to Server

1. **Upload the zip file** to your server using:
   - FTP/SFTP client (FileZilla, WinSCP)
   - Or cPanel File Manager

2. **Extract the files** in your web directory:
   ```bash
   # Usually one of these locations:
   /home/yourusername/public_html/
   # or
   /var/www/html/
   # or
   /home/yourusername/dreamdestinationturkey.com/
   ```

### Step 2: Setup Environment File

1. **Rename `.env.server` to `.env`**:
   ```bash
   cd /path/to/your/website
   mv .env.server .env
   ```

2. **Verify the .env file contains**:
   ```
   DATABASE_URL="mysql://dream_dream:Dlr235672.-Yt@188.132.230.193:3306/dream_funny_web"
   JWT_SECRET="ecbac95566d0cfb46eda6fc6005cf69a2b7cd994dbfd3c11b885f4c72466ca47"
   NEXTAUTH_SECRET="9d7b48f0bb1906ee2ca7beedbac639461e4178060c3fb63d0aa8ced2fa37499a"
   NEXTAUTH_URL="https://dreamdestinationturkey.com"
   OPENAI_API_KEY="sk-proj-..."
   NODE_ENV="production"
   ```

### Step 3: Install Dependencies

Connect to your server via SSH and run:

```bash
cd /path/to/your/website

# Install Node.js dependencies
npm install

# Generate Prisma Client
npx prisma generate
```

### Step 4: Build the Application

```bash
# Build for production
npm run build
```

This creates an optimized production build in the `.next` folder.

### Step 5: Start the Application

**Option A: Using PM2 (Recommended for production)**

```bash
# Install PM2 globally (if not already installed)
npm install -g pm2

# Start the application
pm2 start npm --name "funny-tourism" -- start

# Save PM2 configuration
pm2 save

# Setup PM2 to start on server reboot
pm2 startup
```

**Option B: Using npm start directly**

```bash
# Start the application (runs on port 3000 by default)
npm start
```

**Option C: Using a custom port**

```bash
# Start on a specific port (e.g., 3001)
PORT=3001 npm start
```

### Step 6: Configure Web Server (Nginx/Apache)

**For Nginx:**

Create a configuration file: `/etc/nginx/sites-available/dreamdestinationturkey.com`

```nginx
server {
    listen 80;
    server_name dreamdestinationturkey.com www.dreamdestinationturkey.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

Enable the site:
```bash
sudo ln -s /etc/nginx/sites-available/dreamdestinationturkey.com /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

**For Apache:**

Create/edit: `/etc/apache2/sites-available/dreamdestinationturkey.com.conf`

```apache
<VirtualHost *:80>
    ServerName dreamdestinationturkey.com
    ServerAlias www.dreamdestinationturkey.com

    ProxyPreserveHost On
    ProxyPass / http://localhost:3000/
    ProxyPassReverse / http://localhost:3000/
</VirtualHost>
```

Enable required modules and site:
```bash
sudo a2enmod proxy proxy_http
sudo a2ensite dreamdestinationturkey.com
sudo systemctl reload apache2
```

### Step 7: Setup SSL Certificate (HTTPS)

```bash
# Install Certbot
sudo apt-get update
sudo apt-get install certbot python3-certbot-nginx  # For Nginx
# OR
sudo apt-get install certbot python3-certbot-apache  # For Apache

# Get SSL certificate
sudo certbot --nginx -d dreamdestinationturkey.com -d www.dreamdestinationturkey.com
# OR
sudo certbot --apache -d dreamdestinationturkey.com -d www.dreamdestinationturkey.com
```

### Step 8: Create Admin User

Once the site is running, create your first admin user:

```bash
cd /path/to/your/website
npm run create-admin
```

Follow the prompts to enter:
- Admin name
- Admin email
- Admin password

Then login at: **https://dreamdestinationturkey.com/admin/login**

## ✅ Verification Checklist

After deployment, verify these pages are working:

- [ ] Homepage: https://dreamdestinationturkey.com
- [ ] Packages: https://dreamdestinationturkey.com/packages
- [ ] Customer Login: https://dreamdestinationturkey.com/login
- [ ] Customer Registration: https://dreamdestinationturkey.com/register
- [ ] Admin Login: https://dreamdestinationturkey.com/admin/login
- [ ] Admin Dashboard: https://dreamdestinationturkey.com/admin/dashboard
- [ ] Contact Form: https://dreamdestinationturkey.com/contact

## 🔧 Useful Commands

```bash
# Check application status (PM2)
pm2 status

# View logs
pm2 logs funny-tourism

# Restart application
pm2 restart funny-tourism

# Stop application
pm2 stop funny-tourism

# View live logs
npm start  # Shows console output
```

## 🐛 Troubleshooting

**Database connection errors:**
- Verify the database credentials in `.env`
- Check if MySQL is running: `sudo systemctl status mysql`
- Ensure your server IP is whitelisted in MySQL

**Port already in use:**
```bash
# Find what's using port 3000
sudo lsof -i :3000

# Kill the process
sudo kill -9 <PID>
```

**Build errors:**
```bash
# Clear Next.js cache and rebuild
rm -rf .next
npm run build
```

**Permission issues:**
```bash
# Fix file permissions
sudo chown -R $USER:$USER /path/to/your/website
```

## 📊 Database Information

**Production Database:**
- Host: 188.132.230.193:3306
- Database: dream_funny_web
- User: dream_dream
- Password: Dlr235672.-Yt

**Tables Created:**
- User (customer accounts)
- Admin (admin users)
- Package (tour packages)
- Booking (customer bookings)
- ContactInquiry (contact form submissions)

## 🎯 Next Steps After Deployment

1. **Create admin account** using `npm run create-admin`
2. **Test all functionality** using the verification checklist
3. **Add tour packages** via admin panel
4. **Test customer registration and booking flow**
5. **Setup analytics** (Google Analytics, Facebook Pixel already integrated)
6. **Monitor logs** for any errors

## 📞 Support

If you encounter any issues during deployment:
1. Check the logs: `pm2 logs funny-tourism`
2. Verify `.env` file settings
3. Ensure all dependencies are installed
4. Check web server configuration

---

**Your website is ready to go live! 🚀**

Visit: https://dreamdestinationturkey.com
