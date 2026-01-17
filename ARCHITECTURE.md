# 🏗️ Casino - Architecture Overview

## System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                        End User Browser                      │
│                    (Dark Mode React UI)                      │
└──────────────────────┬──────────────────────────────────────┘
                       │ HTTPS
                       ▼
┌─────────────────────────────────────────────────────────────┐
│                    Nginx Web Server                          │
│  - Static file serving (dist/)                              │
│  - Reverse proxy to backend                                 │
│  - GZIP compression                                         │
│  - Security headers                                         │
│  - SSL/TLS termination                                      │
└──────────────────────┬──────────────────────────────────────┘
                       │ Internal
                       ▼
┌─────────────────────────────────────────────────────────────┐
│               Express.js Backend Server                      │
│  - REST API endpoints                                       │
│  - JWT authentication                                       │
│  - Game logic (server-side RNG)                             │
│  - Balance management                                       │
│  - Transaction logging                                      │
└──────────────────────┬──────────────────────────────────────┘
                       │
                       ▼
┌─────────────────────────────────────────────────────────────┐
│                 SQLite3 Database                             │
│  - Users (auth, balance)                                    │
│  - Transactions (all game activity)                         │
│  - Game History (detailed spin records)                     │
└─────────────────────────────────────────────────────────────┘
```

## Technology Stack Details

### Frontend Layer

**React + Vite**
- Fast development server with HMR (Hot Module Replacement)
- Optimized production builds (tree-shaking, code splitting)
- Modern ES6+ module system

**Tailwind CSS**
- Utility-first CSS framework
- Dark mode configuration
- Custom animations for reel spins
- Responsive grid system

**Key Components**
```
App.jsx (Main Component)
├── Header (User info, balance, logout)
├── AuthPage (Login/Register - conditional)
├── SlotMachine (Game component) x3
│   ├── Game info display
│   ├── Reel animation container
│   ├── Bet amount slider
│   └── Spin button
└── TransactionHistory (Activity log)
```

### Backend Layer

**Express.js Server**
- Lightweight, fast HTTP framework
- Middleware-based architecture
- RESTful API design
- CORS support for cross-origin requests

**API Structure**
```
/api
├── /auth
│   ├── POST /register
│   ├── POST /login
│   └── GET /profile (protected)
├── /games
│   ├── POST /play (protected, RNG happens here)
│   └── GET /config/:gameType
├── /balance
│   ├── GET /balance (protected)
│   ├── GET /transactions (protected)
│   └── GET /game-history (protected)
└── /health
```

**Authentication Flow**
```
1. User registers/logs in
2. Backend validates credentials
3. JWT token generated (24h expiry)
4. Token stored in browser localStorage
5. All protected requests include token in Authorization header
6. Server validates token on each request
```

### Database Layer

**SQLite3**
- File-based (easy deployment, no separate DB service needed)
- ACID compliance (data integrity)
- Suitable for development/small-to-medium scale
- Can be upgraded to PostgreSQL later without major code changes

**Schema**
```sql
-- Users Table (Auth & Balance)
CREATE TABLE users (
  id INTEGER PRIMARY KEY,
  username TEXT UNIQUE,
  email TEXT UNIQUE,
  password TEXT (bcrypt hash),
  balance REAL DEFAULT 1000,
  created_at DATETIME,
  updated_at DATETIME
);

-- Transactions Table (Every game result)
CREATE TABLE transactions (
  id INTEGER PRIMARY KEY,
  user_id INTEGER,
  amount REAL (bet amount),
  type TEXT (WIN/LOSS),
  game TEXT (game name),
  result TEXT (JSON),
  balance_before REAL,
  balance_after REAL,
  created_at DATETIME
);

-- Game History Table (Detailed records)
CREATE TABLE game_history (
  id INTEGER PRIMARY KEY,
  user_id INTEGER,
  game TEXT,
  bet_amount REAL,
  win_amount REAL,
  reel_positions TEXT (JSON),
  multiplier REAL,
  created_at DATETIME
);
```

## Game Logic Architecture

### RNG (Random Number Generator)

**Why Server-Side?**
- Prevents frontend manipulation
- Unpredictable outcomes
- Verifiable fairness

**Classic 777 Algorithm**
```javascript
1. Generate 3 random symbols from array
2. Check against exact match paylines
3. Check special patterns (2+ cherries)
4. Return win multiplier (or 0 for loss)
5. Calculate: winAmount = betAmount × multiplier
6. Update user balance
7. Log to database
```

**Neon Cyber Algorithm**
```javascript
1. Generate 5 random symbols (WILD has 5% chance)
2. Count matching symbols
3. Calculate win patterns (5-in-a-row, 4-in-a-row, etc.)
4. Add WILD bonus if applicable
5. Sum all wins from patterns
6. Return total multiplier
```

**Ancient Gold Algorithm**
```javascript
1. Generate 5 random symbols (MULTIPLIER has 10% chance)
2. Check for consecutive matching symbols (left-to-right)
3. Find first valid payline (3+ consecutive symbols)
4. Calculate base payout for that symbol
5. Find all MULTIPLIER symbols
6. Apply each multiplier to base win
7. Return final win amount
```

### Volatility Concept

- **Low (Classic 777)**: More frequent small wins, less exciting but safer
  - Win frequency: ~40%
  - Max multiplier: 500x
  
- **High (Neon Cyber)**: Less frequent big wins, more exciting but riskier
  - Win frequency: ~25%
  - Max multiplier: 1000x
  
- **Medium (Ancient Gold)**: Balanced with multiplier mechanic
  - Win frequency: ~30%
  - Multiplier range: 1.5x - 5x on wins

### RTP (Return to Player)

- **Classic 777**: 96% - For every $100 bet, ~$96 returns to players long-term
- **Neon Cyber**: 94% - 6% house edge
- **Ancient Gold**: 95% - Balanced

## Deployment Architecture

### Development Environment

```
localhost:5173 (Frontend Dev Server)
    ↓ (API requests)
localhost:5000 (Node.js Backend)
    ↓ (Database queries)
./casino.db (SQLite)
```

### Production Environment

```
User → HTTPS (Port 443)
         ↓
    Nginx (Port 80/443)
    - Static files
    - Reverse proxy
    - SSL termination
         ↓ (Internal HTTP)
    Node.js (Port 5000)
    - Backend API
    - Business logic
         ↓
    SQLite Database
    - Data persistence
```

### Process Management

**systemd Service**
- Automatically restarts if crashed
- Starts on system boot
- Controlled via `systemctl`
- Logs to journalctl
- Resource limits configured

## Security Implementation

### Authentication
```
Registration:
1. Validate input (username, email, password)
2. Hash password with bcryptjs (10 salt rounds)
3. Store in database
4. Generate JWT token

Login:
1. Find user by username
2. Compare password with bcrypt
3. If match, generate JWT token
4. Return token to client

Protected Requests:
1. Client includes token in Authorization header
2. Server verifies JWT signature
3. Extract user ID from token payload
4. Proceed with request
```

### Game RNG Security
```
Client Side:     Just display results
Server Side:     ✓ Generate random outcomes
                 ✓ Calculate multipliers
                 ✓ Update balances
                 ✓ Log transactions
Database:        Store results (immutable audit trail)
```

### Data Protection
- Passwords hashed (bcryptjs) - not reversible
- JWT signed with secret key - can't be forged
- Database queries parameterized - SQL injection prevented
- CORS configured - only specific origins allowed
- HTTPS enforced - encrypted transport

## Performance Optimizations

### Frontend
- Vite builds optimized bundle (~150KB gzipped)
- Code splitting for lazy loading
- CSS animations use GPU acceleration
- Image optimization
- Tailwind CSS purged to only used styles

### Backend
- Connection pooling in database
- Indexed queries on frequently accessed fields
- Gzip compression on responses
- Caching headers for static assets
- Efficient JSON responses

### Database
- Indexes on: user_id, created_at
- Transactions logged immediately
- Old records can be archived/deleted
- SQLite sufficient for <100K concurrent users
- Can upgrade to PostgreSQL if needed

## Scaling Considerations

### Current Limits
- **SQLite**: ~10K concurrent connections (per file)
- **Single Node.js process**: ~10K concurrent users
- **Nginx**: Can handle 1K+ requests/second

### For Higher Scale
1. **Horizontal Scaling**
   - Multiple Node.js instances
   - Load balancer (Nginx)
   - Session storage (Redis)

2. **Database Migration**
   - PostgreSQL instead of SQLite
   - Connection pooling (pgBouncer)
   - Read replicas for analytics

3. **Caching Layer**
   - Redis for sessions
   - Game config caching
   - Balance caching

4. **Real-time Features**
   - WebSocket upgrade (Socket.io)
   - Live leaderboards
   - Real-time notifications

## Monitoring & Observability

### Logs
- **Application**: journalctl (systemd)
- **Web Server**: Nginx access/error logs
- **Database**: SQLite activity

### Metrics to Monitor
- Request latency (p50, p95, p99)
- Error rate (4xx, 5xx responses)
- Database query time
- Disk usage
- CPU/Memory utilization

### Alerting Triggers
- Service down
- High error rate (>5%)
- Database file >1GB
- Disk usage >80%
- CPU sustained >80%

## Disaster Recovery

### Backup Strategy
```
Daily Backups:
- Database snapshot: 2-5MB
- Application code: versioned in Git
- Configuration: .env backups

Weekly Backups:
- Full system backup
- Test restore procedure

Retention:
- Daily: 30 days
- Weekly: 6 months
- Monthly: 1 year
```

### Recovery Procedures
```
Database Corruption:
1. Restore from latest backup
2. Verify data integrity
3. Restart service

Service Crash:
1. Restart via systemctl
2. Check logs for root cause
3. Alert team if repeated

Full System Failure:
1. Provision new server
2. Install dependencies
3. Deploy code
4. Restore database
5. Verify all systems
```

## API Contract Examples

### Register User
**Request**
```http
POST /api/auth/register
Content-Type: application/json

{
  "username": "player1",
  "email": "player@example.com",
  "password": "secure_password"
}
```

**Response**
```json
{
  "message": "User registered successfully",
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "user": {
    "id": 1,
    "username": "player1",
    "email": "player@example.com",
    "balance": 1000
  }
}
```

### Play a Game
**Request**
```http
POST /api/games/play
Authorization: Bearer eyJhbGciOiJIUzI1NiIs...
Content-Type: application/json

{
  "gameType": "classic777",
  "betAmount": 100
}
```

**Response**
```json
{
  "success": true,
  "game": "classic777",
  "bet": 100,
  "result": {
    "reels": ["7", "7", "7"],
    "combination": "7-7-7",
    "multiplier": 500,
    "win": true
  },
  "winAmount": 50000,
  "netChange": 49900,
  "balanceBefore": 1000,
  "balanceAfter": 50900
}
```

## Code Flow Example - Play Game

```
1. Frontend
   - User clicks SPIN
   - Sends POST /api/games/play with gameType & betAmount
   
2. Nginx
   - Receives request at :443 (HTTPS)
   - Routes to http://localhost:5000 (reverse proxy)
   
3. Express Server
   - Middleware: authenticateToken
   - Controller: gameController.playSlot()
   - Validate bet amount
   
4. Database
   - SELECT user balance
   - Verify sufficient funds
   - Deduct bet (UPDATE balance - betAmount)
   
5. Game Logic
   - Import appropriate game module (classic777, neonCyber, ancientGold)
   - Call spin function
   - RNG generates random symbols
   - Check winning patterns
   - Calculate multiplier
   
6. Database Update
   - UPDATE balance + winAmount
   - INSERT into transactions
   - INSERT into game_history
   
7. Response
   - Return result to frontend
   - Frontend displays reels
   - Shows win/loss message
   - Updates balance display
   - User sees transaction in history
```

## File Size Reference

```
Backend:
├── node_modules/        ~200 MB (not deployed)
├── src/                 ~50 KB
├── package.json         ~1 KB
└── casino.db            1-100 MB (grows with data)

Frontend:
├── node_modules/        ~500 MB (not deployed)
├── src/                 ~50 KB
├── dist/                ~150 KB (gzipped production build)
└── package.json         ~1 KB

Total Production Size: ~300 KB (frontend) + 50 KB (backend) + DB
```

## Deployment Checklist

- [ ] System dependencies installed (Node.js, Nginx)
- [ ] Backend dependencies installed
- [ ] Frontend built (npm run build)
- [ ] Database created (casino.db)
- [ ] Environment variables configured (.env)
- [ ] Service file installed (/etc/systemd/system/casino.service)
- [ ] Service enabled and started
- [ ] Nginx config installed and tested
- [ ] SSL certificate obtained (if using HTTPS)
- [ ] Backups configured
- [ ] Monitoring set up
- [ ] Security hardening applied
- [ ] Load testing completed
- [ ] Documentation reviewed
- [ ] Team trained on operations

---

**This architecture is designed for:**
- ✅ Security (JWT, password hashing, server-side RNG)
- ✅ Scalability (horizontal scaling possible)
- ✅ Maintainability (clean separation of concerns)
- ✅ Reliability (automated backups, monitoring)
- ✅ Performance (optimized builds, efficient queries)

