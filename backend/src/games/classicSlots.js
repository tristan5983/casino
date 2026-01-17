/**
 * Classic 777 - 3 Reel, Low Volatility Slot Machine
 * Symbols: 7, Cherry, Lemon, Orange, Bell, BAR
 */

const SYMBOLS = ['7', 'CHERRY', 'LEMON', 'ORANGE', 'BELL', 'BAR'];

const PAYLINES = {
  '7-7-7': 500,        // Jackpot
  'CHERRY-CHERRY-CHERRY': 100,
  'LEMON-LEMON-LEMON': 50,
  'ORANGE-ORANGE-ORANGE': 40,
  'BELL-BELL-BELL': 30,
  'BAR-BAR-BAR': 25,
  'CHERRY-CHERRY-7': 20,
  'CHERRY-CHERRY-CHERRY': 100,
  'CHERRY-LEMON-CHERRY': 15,
  'LEMON-LEMON-7': 10
};

function getRandomSymbol() {
  return SYMBOLS[Math.floor(Math.random() * SYMBOLS.length)];
}

export function spinClassic777() {
  const reel1 = getRandomSymbol();
  const reel2 = getRandomSymbol();
  const reel3 = getRandomSymbol();

  const combination = `${reel1}-${reel2}-${reel3}`;
  
  // Check exact match first
  if (PAYLINES[combination]) {
    return {
      reels: [reel1, reel2, reel3],
      combination,
      multiplier: PAYLINES[combination],
      win: true
    };
  }

  // Check cherry combination (any two cherries)
  const cherryCount = [reel1, reel2, reel3].filter(s => s === 'CHERRY').length;
  if (cherryCount === 2) {
    return {
      reels: [reel1, reel2, reel3],
      combination: 'CHERRY-CHERRY-*',
      multiplier: 20,
      win: true
    };
  }

  // Check single cherry
  if (cherryCount === 1) {
    return {
      reels: [reel1, reel2, reel3],
      combination: 'CHERRY-*-*',
      multiplier: 5,
      win: true
    };
  }

  return {
    reels: [reel1, reel2, reel3],
    combination,
    multiplier: 0,
    win: false
  };
}

export const classicConfig = {
  name: 'Classic 777',
  reels: 3,
  minBet: 10,
  maxBet: 1000,
  volatility: 'low',
  rtp: 0.96, // 96% Return to Player
  symbols: SYMBOLS
};
