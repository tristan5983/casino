/**
 * Neon Cyber - 5 Reel, High Volatility Slot Machine
 * Symbols: Skull, Code, Matrix, Neon, Glitch, Cyber
 */

const SYMBOLS = ['SKULL', 'CODE', 'MATRIX', 'NEON', 'GLITCH', 'CYBER', 'WILD'];

const WINNING_PATTERNS = {
  // 5 in a row
  'full-match': 1000,
  // 4 in a row
  '4-match': 300,
  // 3 in a row
  '3-match': 100,
  // 2 in a row
  '2-match': 25,
  // WILD bonus
  'wild-bonus': 50
};

function getRandomSymbol() {
  // WILD has lower probability
  const rand = Math.random();
  if (rand < 0.05) return 'WILD';
  return SYMBOLS[Math.floor(Math.random() * (SYMBOLS.length - 1))];
}

function checkMatches(reels) {
  let wins = [];
  let wildCount = reels.filter(s => s === 'WILD').length;

  // Count matching symbols
  const symbolCounts = {};
  reels.forEach(symbol => {
    if (symbol !== 'WILD') {
      symbolCounts[symbol] = (symbolCounts[symbol] || 0) + 1;
    }
  });

  // Check for patterns
  for (const [symbol, count] of Object.entries(symbolCounts)) {
    if (count === 5) {
      wins.push({ pattern: 'full-match', symbol, multiplier: WINNING_PATTERNS['full-match'] });
    } else if (count === 4 || (count === 3 && wildCount > 0)) {
      wins.push({ pattern: '4-match', symbol, multiplier: WINNING_PATTERNS['4-match'] });
    } else if (count === 3 || (count === 2 && wildCount > 0)) {
      wins.push({ pattern: '3-match', symbol, multiplier: WINNING_PATTERNS['3-match'] });
    } else if (count === 2) {
      wins.push({ pattern: '2-match', symbol, multiplier: WINNING_PATTERNS['2-match'] });
    }
  }

  if (wildCount >= 3) {
    wins.push({ pattern: 'wild-bonus', symbol: 'WILD', multiplier: WINNING_PATTERNS['wild-bonus'] });
  }

  return wins;
}

export function spinNeonCyber() {
  const reels = Array.from({ length: 5 }, () => getRandomSymbol());
  const wins = checkMatches(reels);

  const totalMultiplier = wins.length > 0 
    ? wins.reduce((sum, win) => sum + win.multiplier, 0)
    : 0;

  return {
    reels,
    wins,
    totalMultiplier,
    win: totalMultiplier > 0,
    wildCount: reels.filter(s => s === 'WILD').length
  };
}

export const neonConfig = {
  name: 'Neon Cyber',
  reels: 5,
  minBet: 20,
  maxBet: 2000,
  volatility: 'high',
  rtp: 0.94, // 94% Return to Player (higher volatility)
  symbols: SYMBOLS
};
