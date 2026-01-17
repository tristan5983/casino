import { getAsync, runAsync } from '../db.js';
import { spinClassic777 } from '../games/classicSlots.js';
import { spinNeonCyber } from '../games/neonCyber.js';
import { spinAncientGold } from '../games/ancientGold.js';

export async function playSlot(req, res) {
  try {
    const { gameType, betAmount } = req.body;
    const userId = req.user.id;

    // Validate input
    if (!gameType || !betAmount || betAmount < 0) {
      return res.status(400).json({ error: 'Invalid game type or bet amount' });
    }

    // Get user balance
    const user = await getAsync(
      `SELECT balance FROM users WHERE id = ?`,
      [userId]
    );

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    if (user.balance < betAmount) {
      return res.status(400).json({ error: 'Insufficient balance' });
    }

    // Deduct bet
    const balanceBefore = user.balance;
    await runAsync(
      `UPDATE users SET balance = balance - ? WHERE id = ?`,
      [betAmount, userId]
    );

    // Spin the game
    let spinResult;
    let multiplier = 0;

    switch (gameType.toLowerCase()) {
      case 'classic777':
        spinResult = spinClassic777();
        multiplier = spinResult.multiplier;
        break;
      case 'neoncyber':
        spinResult = spinNeonCyber();
        multiplier = spinResult.totalMultiplier;
        break;
      case 'ancientgold':
        spinResult = spinAncientGold();
        multiplier = spinResult.totalWin;
        break;
      default:
        return res.status(400).json({ error: 'Unknown game type' });
    }

    // Calculate winnings
    const winAmount = Math.floor(betAmount * multiplier);
    const netChange = winAmount - betAmount;

    // Update balance with winnings
    if (winAmount > 0) {
      await runAsync(
        `UPDATE users SET balance = balance + ? WHERE id = ?`,
        [winAmount, userId]
      );
    }

    const balanceAfter = balanceBefore + netChange;

    // Record transaction
    await runAsync(
      `INSERT INTO transactions (user_id, amount, type, game, result, balance_before, balance_after)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [
        userId,
        betAmount,
        spinResult.win ? 'WIN' : 'LOSS',
        gameType,
        JSON.stringify(spinResult),
        balanceBefore,
        balanceAfter
      ]
    );

    // Record game history
    const reelPositions = gameType.toLowerCase() === 'ancientgold' 
      ? JSON.stringify(spinResult) 
      : JSON.stringify(spinResult.reels);

    await runAsync(
      `INSERT INTO game_history (user_id, game, bet_amount, win_amount, reel_positions, multiplier)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [
        userId,
        gameType,
        betAmount,
        winAmount,
        reelPositions,
        multiplier
      ]
    );

    res.json({
      success: true,
      game: gameType,
      bet: betAmount,
      result: spinResult,
      winAmount,
      netChange,
      balanceBefore,
      balanceAfter
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

export async function getGameConfig(req, res) {
  try {
    const { gameType } = req.params;

    const configs = {
      'classic777': {
        name: 'Classic 777',
        reels: 3,
        minBet: 10,
        maxBet: 1000,
        volatility: 'low',
        rtp: 0.96,
        symbols: ['7', 'CHERRY', 'LEMON', 'ORANGE', 'BELL', 'BAR']
      },
      'neoncyber': {
        name: 'Neon Cyber',
        reels: 5,
        minBet: 20,
        maxBet: 2000,
        volatility: 'high',
        rtp: 0.94,
        symbols: ['SKULL', 'CODE', 'MATRIX', 'NEON', 'GLITCH', 'CYBER', 'WILD']
      },
      'ancientgold': {
        name: 'Ancient Gold',
        reels: 5,
        minBet: 15,
        maxBet: 1500,
        volatility: 'medium',
        rtp: 0.95,
        symbols: ['PYRAMID', 'SCARAB', 'PHARAOH', 'GOLD', 'ANKH', 'EYE', 'MULTIPLIER'],
        hasMultiplier: true
      }
    };

    const config = configs[gameType.toLowerCase()];
    if (!config) {
      return res.status(404).json({ error: 'Game not found' });
    }

    res.json(config);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}
