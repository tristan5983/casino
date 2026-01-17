# 🎰 Casino - Professional Simulation Platform

A full-stack casino simulation website built with Node.js, Express, React, Vite, Tailwind CSS, and SQLite. Designed for development environments running on Ubuntu with Nginx deployment.

## 📋 Features

- **Authentication System**: Secure JWT-based user registration and login
- **Virtual Wallet**: Users start with $1,000 virtual balance
- **Three Unique Slot Machines**:
  - **Classic 777**: 3-reel, low volatility (96% RTP) - Classic fruit symbols
  - **Neon Cyber**: 5-reel, high volatility (94% RTP) - Cyberpunk aesthetic with WILD symbols
  - **Ancient Gold**: 5-reel, medium volatility (95% RTP) - Multiplier mechanics
- **Secure RNG**: Server-side random number generation prevents client-side cheating
- **Transaction History**: Complete log of all spins and results
- **Dark Mode UI**: Professional Stake/Cryptorino-inspired dark theme
- **Responsive Design**: Fully functional on mobile, tablet, and desktop
- **Smooth Animations**: CSS-powered reel spins and win celebrations

## 🛠️ Tech Stack

### Backend
- **Runtime**: Node.js (v18+)
- **Framework**: Express.js 4.18
- **Database**: SQLite3 (lightweight, file-based)
- **Authentication**: JWT (jsonwebtoken)
- **Password Hashing**: bcryptjs
- **Validation**: express-validator

### Frontend
- **Framework**: React 18.2
- **Build Tool**: Vite 5
- **Styling**: Tailwind CSS 3
- **HTTP Client**: Axios
- **Icons**: Lucide React

### DevOps
- **Web Server**: Nginx
- **Process Manager**: systemd
- **OS**: Ubuntu 24.04 LTS

## 📦 Project Structure

```
casino/
├── backend/
│   ├── src/
│   │   ├── server.js              # Express app entry point
│   │   ├── db.js                  # SQLite database setup
│   │   ├── middleware/
│   │   │   └── auth.js            # JWT authentication middleware
│   │   ├── routes/
│   │   │   ├── auth.js            # User auth endpoints
│   │   │   ├── games.js           # Game play endpoints
│   │   │   └── balance.js         # Balance & transaction endpoints
│   │   ├── controllers/
│   │   │   ├── authController.js  # Auth logic
│   │   │   ├── gameController.js  # Game play logic
│   │   │   └── balanceController.js # Balance logic
│   │   └── games/
│   │       ├── classicSlots.js    # Classic 777 RNG
│   │       ├── neonCyber.js       # Neon Cyber RNG
│   │       └── ancientGold.js     # Ancient Gold RNG
│   ├── package.json
│   ├── .env                       # Environment variables
│   └── casino.db                  # SQLite database (auto-created)
├── frontend/
│   ├── src/
│   │   ├── App.jsx                # Main React component
│   │   ├── main.jsx               # React entry point
│   │   ├── index.css              # Global styles
│   │   ├── components/
│   │   │   ├── Header.jsx         # Navigation header
│   │   │   ├── SlotMachine.jsx    # Slot machine component
│   │   │   └── TransactionHistory.jsx # Transaction log
│   │   ├── pages/
│   │   │   └── AuthPage.jsx       # Login/register page
│   │   └── utils/
│   │       └── api.js             # API client
│   ├── public/                    # Static assets
│   ├── index.html
│   ├── vite.config.js
│   ├── tailwind.config.js
│   ├── postcss.config.js
│   └── package.json
├── nginx/
│   └── casino.conf                # Nginx configuration
├── systemd/
│   └── casino.service             # systemd service file
├── README.md                      # This file
└── .gitignore
```

## 🚀 Installation & Setup

### Prerequisites

- **Ubuntu 24.04 LTS** or compatible Linux distribution
- **Node.js 18+** and npm
- **Nginx** web server
- **SQLite3** (included with Node.js)
- **Git** (optional)

### Step 1: Install System Dependencies

```bash
sudo apt update
sudo apt install -y curl wget git build-essential

# Install Node.js (18+ LTS)
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs

# Install Nginx
sudo apt install -y nginx

# Verify installations
node --version
npm --version
nginx -v
```

### Step 2: Clone or Setup the Project

```bash
# Clone the repository (if using Git)
git clone https://github.com/tristan5983/casino.git
cd casino

# Or create directories manually
mkdir -p /var/www/casino
cd /var/www/casino
```

### Step 3: Setup Backend

```bash
cd backend

# Install dependencies
npm install

# Create environment file (already provided, but verify it exists)
# Edit .env if needed - default values are suitable for development
cat .env
```

### Step 4: Setup Frontend

```bash
cd ../frontend

# Install dependencies
npm install

# Build for production
npm run build

# Output will be in dist/ directory
ls dist/
```

### Step 5: Configure Nginx

```bash
# Copy Nginx configuration
sudo cp nginx/casino.conf /etc/nginx/sites-available/casino

# Enable the site
sudo ln -sf /etc/nginx/sites-available/casino /etc/nginx/sites-enabled/casino

# Disable default site (optional)
sudo rm /etc/nginx/sites-enabled/default

# Test Nginx configuration
sudo nginx -t

# Reload Nginx
sudo systemctl reload nginx
```

### Step 6: Setup systemd Service

```bash
# Copy systemd service file
sudo cp systemd/casino.service /etc/systemd/system/

# Reload systemd daemon
sudo systemctl daemon-reload

# Enable and start the service
sudo systemctl enable casino.service
sudo systemctl start casino.service

# Check status
sudo systemctl status casino.service
```

### Step 7: Adjust File Permissions

```bash
# Set proper ownership
sudo chown -R www-data:www-data /var/www/casino

# Set permissions
sudo chmod -R 755 /var/www/casino
sudo chmod -R 755 /var/www/casino/backend/src
sudo chmod 644 /var/www/casino/backend/.env
```

## 🏃 Running Locally (Development)

For local development without Nginx and systemd:

### Terminal 1 - Backend

```bash
cd /workspaces/casino/backend

# Install dependencies (if not done)
npm install

# Start development server
npm run dev

# Output: 🎰 Casino Backend running on port 5000
```

### Terminal 2 - Frontend

```bash
cd /workspaces/casino/frontend

# Install dependencies (if not done)
npm install

# Start development server
npm run dev

# Output: 
# VITE v5.x.x ready in xxxx ms
# Local: http://localhost:5173/
```

### Access the Application

Open your browser and navigate to:
- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:5000/api/health

## 🎮 Using the Application

### Create an Account

1. Open http://localhost:5173 (or your deployed URL)
2. Click "Register"
3. Enter username, email, and password
4. Submit to create your account
5. You'll receive $1,000 virtual currency

### Demo Account

Pre-created for testing:
- **Username**: demo
- **Password**: demo123

### Playing Games

1. **Select a Game**: Choose from Classic 777, Neon Cyber, or Ancient Gold
2. **Set Your Bet**: Adjust the slider to set bet amount (min-max varies by game)
3. **Spin**: Click the SPIN button
4. **View Results**: See your winnings or losses immediately
5. **Check History**: Transaction history updates automatically

### Game Details

#### Classic 777 (3-Reel, Low Volatility)
- **Min Bet**: $10 | **Max Bet**: $1,000
- **Symbols**: 7, Cherry, Lemon, Orange, Bell, BAR
- **Best Payout**: 7-7-7 = 500x bet
- **RTP**: 96%

#### Neon Cyber (5-Reel, High Volatility)
- **Min Bet**: $20 | **Max Bet**: $2,000
- **Symbols**: Skull, Code, Matrix, Neon, Glitch, Cyber, WILD
- **Best Payout**: Full Match = 1000x bet
- **WILD Bonus**: 3+ WILD symbols = 50x bet
- **RTP**: 94%

#### Ancient Gold (5-Reel, Medium Volatility)
- **Min Bet**: $15 | **Max Bet**: $1,500
- **Symbols**: Pyramid, Scarab, Pharaoh, Gold, Ankh, Eye, MULTIPLIER
- **Multiplier Mechanic**: Up to 5x multiplier on wins
- **Best Payout**: Pyramid = 200x, Gold = 300x (with multipliers)
- **RTP**: 95%

## 📊 API Endpoints

### Authentication

```
POST   /api/auth/register
POST   /api/auth/login
GET    /api/auth/profile          (requires JWT)
```

### Games

```
POST   /api/games/play            (requires JWT)
GET    /api/games/config/:gameType
```

**Play Game Request**:
```json
{
  "gameType": "classic777",
  "betAmount": 100
}
```

**Play Game Response**:
```json
{
  "success": true,
  "game": "classic777",
  "bet": 100,
  "result": { ... },
  "winAmount": 0,
  "netChange": -100,
  "balanceBefore": 1000,
  "balanceAfter": 900
}
```

### Balance & Transactions

```
GET    /api/balance/balance       (requires JWT)
GET    /api/balance/transactions  (requires JWT)
GET    /api/balance/game-history  (requires JWT)
```

## 🔐 Security Considerations

### Implemented
- ✅ **JWT Authentication**: Secure token-based auth with 24h expiry
- ✅ **Password Hashing**: bcryptjs with 10 salt rounds
- ✅ **Server-Side RNG**: All game outcomes calculated on backend
- ✅ **CORS Protection**: Configured for specific origins
- ✅ **SQL Protection**: Parameterized queries prevent SQL injection
- ✅ **HTTPS Ready**: Nginx config includes SSL/TLS support (commented out)
- ✅ **Security Headers**: X-Frame-Options, X-Content-Type-Options, etc.

### Production Recommendations
- 🔒 Enable HTTPS with valid SSL certificate
- 🔒 Update `JWT_SECRET` in `.env` to a strong random string
- 🔒 Set `FRONTEND_URL` to your actual domain
- 🔒 Use environment variables from secure vault
- 🔒 Implement rate limiting on API endpoints
- 🔒 Regular database backups
- 🔒 Monitor logs for suspicious activity

## 🐛 Troubleshooting

### Backend won't start

```bash
# Check if port 5000 is in use
sudo lsof -i :5000

# Kill the process if needed
sudo kill -9 <PID>

# Check logs
sudo journalctl -u casino.service -f
```

### Nginx errors

```bash
# Test configuration
sudo nginx -t

# Reload without restart
sudo systemctl reload nginx

# Check Nginx error log
sudo tail -50 /var/log/nginx/casino_error.log
```

### Database issues

```bash
# Delete and recreate database (will lose all data)
rm /var/www/casino/backend/casino.db

# Restart backend service
sudo systemctl restart casino.service
```

### CORS errors

Update `FRONTEND_URL` in backend `.env` to match your frontend domain:
```bash
FRONTEND_URL=http://yourdomain.com
```

## 📝 Environment Variables

### Backend (.env)

```
PORT=5000                                           # Backend port
JWT_SECRET=your_super_secret_jwt_key_change_in_production_12345  # Change in production!
NODE_ENV=development                                # development or production
FRONTEND_URL=http://localhost:5173                  # Frontend URL
DATABASE_PATH=./casino.db                           # Database file path
```

### Frontend (hardcoded in vite.config.js)

Proxy is configured to `/api` which maps to `http://localhost:5000`

## 📈 Database Schema

### users
```sql
id              INTEGER PRIMARY KEY
username        TEXT UNIQUE NOT NULL
email           TEXT UNIQUE NOT NULL
password        TEXT NOT NULL (bcryptjs hashed)
balance         REAL DEFAULT 1000
created_at      DATETIME
updated_at      DATETIME
```

### transactions
```sql
id              INTEGER PRIMARY KEY
user_id         INTEGER FOREIGN KEY
amount          REAL
type            TEXT (WIN/LOSS)
game            TEXT
result          TEXT (JSON)
balance_before  REAL
balance_after   REAL
created_at      DATETIME
```

### game_history
```sql
id              INTEGER PRIMARY KEY
user_id         INTEGER FOREIGN KEY
game            TEXT
bet_amount      REAL
win_amount      REAL
reel_positions  TEXT (JSON)
multiplier      REAL
created_at      DATETIME
```

## 🚢 Production Deployment

### Additional Steps for Production

1. **SSL Certificate** (Let's Encrypt)
   ```bash
   sudo apt install -y certbot python3-certbot-nginx
   sudo certbot certonly --nginx -d yourdomain.com
   # Uncomment SSL section in nginx/casino.conf
   ```

2. **Environment Variables**
   ```bash
   sudo nano /var/www/casino/backend/.env
   # Update JWT_SECRET, FRONTEND_URL, NODE_ENV
   ```

3. **Database Backup**
   ```bash
   # Setup automated backup
   sudo crontab -e
   # Add: 0 3 * * * cp /var/www/casino/backend/casino.db /backups/casino_$(date +\%Y\%m\%d).db
   ```

4. **Monitoring**
   ```bash
   # Monitor service health
   sudo systemctl status casino.service
   # Check logs
   sudo journalctl -u casino.service -n 100
   ```

5. **Performance Tuning**
   - Increase Nginx worker processes: `worker_processes auto;`
   - Enable HTTP/2 in SSL configuration
   - Consider Redis caching for high-traffic scenarios
   - Implement rate limiting on /api/games/play

## 📄 License

This project is for educational and entertainment purposes only. All gambling is simulated using virtual currency.

## 🙋 Support

For issues or questions:
1. Check the Troubleshooting section
2. Review backend logs: `sudo journalctl -u casino.service -f`
3. Check Nginx logs: `/var/log/nginx/casino_error.log`
4. Verify database: `sqlite3 /var/www/casino/backend/casino.db ".tables"`

## 🎯 Future Enhancements

- [ ] Additional game types (Roulette, Blackjack, Poker)
- [ ] Leaderboard system
- [ ] Real-time multiplayer mode
- [ ] Admin dashboard
- [ ] Advanced analytics
- [ ] Email notifications
- [ ] Two-factor authentication
- [ ] Mobile app (React Native)
- [ ] WebSocket real-time updates
- [ ] Cryptocurrency integration (testnet only)

---

**Created for the iGaming development community** 🎰
Version 1.0.0 | Ubuntu 24.04 LTS | Node.js 20+ | Nginx
