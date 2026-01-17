# 🎰 Casino - Quick Test Guide

## 1. Install Dependencies

```bash
# From project root
bash setup.sh

# Or manually:
cd backend && npm install && cd ..
cd frontend && npm install && cd ..
```

## 2. Start Development Servers

### Terminal 1 - Backend
```bash
cd /workspaces/casino/backend
npm run dev

# Expected output:
# 🎰 Casino Backend running on port 5000
```

### Terminal 2 - Frontend
```bash
cd /workspaces/casino/frontend
npm run dev

# Expected output:
# VITE v5.x.x ready in xxx ms
# ➜  Local:   http://localhost:5173/
```

## 3. Test the Application

### Test 1: User Authentication
1. Open http://localhost:5173
2. Click "Register"
3. Create an account with:
   - Username: testuser
   - Email: test@example.com
   - Password: password123
4. You should receive $1,000 virtual currency
5. ✅ Auth test complete

### Test 2: Login
1. Open http://localhost:5173 (if not already there)
2. Click "Login"
3. Use demo credentials:
   - Username: demo
   - Password: demo123
4. You should see the dashboard with balance
5. ✅ Login test complete

### Test 3: Play Classic 777 (Low Volatility)
1. Scroll to "Choose Your Game"
2. Click "SPIN" in Classic 777 (with default $10 bet)
3. You should see reels spinning
4. Result will display: Win/Loss and new balance
5. ✅ Game test complete

### Test 4: Play Neon Cyber (High Volatility)
1. Click "SPIN" in Neon Cyber (increase bet to $50 first)
2. Watch the 5-reel spin
3. Check for WILD symbols (more common wins)
4. ✅ Volatility test complete

### Test 5: Play Ancient Gold (Multiplier Mechanic)
1. Click "SPIN" in Ancient Gold
2. Look for MULTIPLIER symbol (gold ✖️)
3. Multipliers can be 1.5x, 2x, 2.5x, 3x, 4x, or 5x
4. Final payout = base win × multiplier
5. ✅ Multiplier test complete

### Test 6: Transaction History
1. Scroll down to "Transaction History"
2. You should see all your spins listed
3. Green = WIN, Red = LOSS
4. Click "Refresh" to reload latest transactions
5. ✅ History test complete

### Test 7: Balance Updates
1. Note your current balance (top right)
2. Play a game (any game)
3. Check that balance updates correctly
4. ✅ Balance test complete

## 4. API Testing (Optional)

### Health Check
```bash
curl http://localhost:5000/api/health
# Expected: {"status":"OK","message":"Casino backend is running"}
```

### Get Game Config
```bash
curl http://localhost:5000/api/games/config/classic777
# Expected: Game configuration JSON
```

### Play a Game (Requires Token)
```bash
# First, login to get token
TOKEN=$(curl -s -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"demo","password":"demo123"}' | jq -r '.token')

# Then play a game
curl -X POST http://localhost:5000/api/games/play \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"gameType":"classic777","betAmount":100}'
```

## 5. Database Inspection (Optional)

```bash
# Install sqlite3 if not present
sudo apt install -y sqlite3

# Check database
cd backend
sqlite3 casino.db

# In sqlite3 shell:
.tables
SELECT * FROM users;
SELECT * FROM transactions LIMIT 5;
.exit
```

## 6. Frontend Build Test

```bash
cd frontend
npm run build

# Should create dist/ folder with optimized files
ls -la dist/
```

## Common Issues & Fixes

### Port 5000 Already in Use
```bash
# Find process using port 5000
sudo lsof -i :5000

# Kill it
sudo kill -9 <PID>

# Or use different port - edit backend/.env PORT=5001
```

### Port 5173 Already in Use
```bash
# Kill process using port 5173
sudo lsof -i :5173
sudo kill -9 <PID>
```

### CORS Errors
Make sure both servers are running:
- Backend: http://localhost:5000
- Frontend: http://localhost:5173

### Database Issues
```bash
# Reset database (loses all data)
cd backend
rm casino.db

# Restart backend - database will be recreated
npm run dev
```

### Node Modules Issues
```bash
# Clear and reinstall
rm -rf backend/node_modules frontend/node_modules
npm install (in each directory)
```

## 7. Performance Notes

### Game RNG (Random Number Generator)
- All random outcomes generated on **backend**
- **NOT** generated on frontend (prevents cheating)
- Each game has secure probability algorithm
- RTP (Return to Player) rates:
  - Classic 777: 96%
  - Neon Cyber: 94%
  - Ancient Gold: 95%

### Animation Performance
- Reel spins: 0.6s CSS animations
- Win notifications: 2s pulse animation
- Smooth 60fps on modern devices
- Responsive design works on mobile

### Database Performance
- SQLite suitable for development/small scale
- Transactions logged for every spin
- Indexes on frequently queried fields (user_id, created_at)
- For production scale, consider PostgreSQL

## 8. Troubleshooting Specific Scenarios

### Can't login with demo account
```bash
# Demo account might have been modified
# Create a new account instead
# Or reset database and restart backend
```

### Balance not updating after a spin
```bash
# Check backend logs
cd backend
npm run dev  # Watch for errors

# Check that transactions are recorded
sqlite3 casino.db "SELECT * FROM transactions LIMIT 1;"
```

### Reels not spinning
```bash
# Check browser console for errors
# Make sure both servers are running
# Check backend is returning game results
curl http://localhost:5000/api/games/config/classic777
```

### Nginx issues (if testing production setup)
```bash
# Test configuration
sudo nginx -t

# Check if default site is conflicting
sudo rm /etc/nginx/sites-enabled/default
sudo systemctl reload nginx
```

## 9. Success Criteria ✅

All tests should show:
- ✅ User can register
- ✅ User can login
- ✅ User starts with $1,000
- ✅ All 3 games spin correctly
- ✅ Balance updates after each spin
- ✅ Transaction history logs all activity
- ✅ Random outcomes vary (not same result twice)
- ✅ Dark mode UI displays properly
- ✅ Responsive on mobile/tablet
- ✅ No console errors

## 10. Next Steps

Once tests pass:
1. **Production Setup**: Follow README.md for Ubuntu deployment
2. **Nginx Configuration**: Copy casino.conf to /etc/nginx/sites-available/
3. **Systemd Service**: Copy casino.service to /etc/systemd/system/
4. **SSL Certificate**: Use Let's Encrypt for HTTPS
5. **Environment Variables**: Update .env for production
6. **Backup Strategy**: Setup automated database backups

---

**Questions?** Check the main README.md for detailed documentation.
