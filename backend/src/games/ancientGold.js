/**
 * Ancient Gold - 5 Reel, Medium Volatility with Multiplier Mechanic
 * Symbols: Pyramid, Scarab, Pharaoh, Gold, Ankh, Eye
 */

const SYMBOLS = ['PYRAMID', 'SCARAB', 'PHARAOH', 'GOLD', 'ANKH', 'EYE', 'MULTIPLIER'];

const PAYOUTS = {
  'PYRAMID': 200,
  'SCARAB': 150,
  'PHARAOH': 250,
  'GOLD': 300,
  'ANKH': 100,
  'EYE': 120
};

const MULTIPLIER_VALUES = [1.5, 2, 2.5, 3, 4, 5];

function getRandomSymbol() {
  // MULTIPLIER has lower probability (10%)
  if (Math.random() < 0.1) return 'MULTIPLIER';
  return SYMBOLS[Math.floor(Math.random() * (SYMBOLS.length - 1))];
}

function countConsecutive(reels, startIndex, symbol) {
  let count = 0;
  for (let i = startIndex; i < reels.length; i++) {
    if (reels[i] === symbol) count++;
    else break;
  }
  return count;
}

function checkWinningLines(reels) {
  const wins = [];
  const multipliers = [];

  // Find multipliers
  reels.forEach((symbol, index) => {
    if (symbol === 'MULTIPLIER') {
      multipliers.push(MULTIPLIER_VALUES[Math.floor(Math.random() * MULTIPLIER_VALUES.length)]);
    }
  });

  // Check for consecutive symbols from left to right (left-to-right payline)
  for (let i = 0; i < reels.length - 2; i++) {
    const symbol = reels[i];
    if (symbol !== 'MULTIPLIER' && PAYOUTS[symbol]) {
      const consecutiveCount = countConsecutive(reels, i, symbol);
      if (consecutiveCount >= 3) {
        wins.push({
          symbol,
          count: consecutiveCount,
          payout: PAYOUTS[symbol] * consecutiveCount
        });
        break; // Only one win per spin for simplicity
      }
    }
  }

  const baseWin = wins.length > 0 ? wins[0].payout : 0;
  const multiplier = multipliers.length > 0 
    ? multipliers.reduce((a, b) => a * b, 1)
    : 1;

  return {
    wins,
    baseWin,
    multiplier,
    totalWin: Math.floor(baseWin * multiplier),
    multiplierCount: multipliers.length
  };
}

export function spinAncientGold() {
  const reels = Array.from({ length: 5 }, () => getRandomSymbol());
  const result = checkWinningLines(reels);

  return {
    reels,
    ...result,
    win: result.totalWin > 0
  };
}

export const ancientConfig = {
  name: 'Ancient Gold',
  reels: 5,
  minBet: 15,
  maxBet: 1500,
  volatility: 'medium',
  rtp: 0.95, // 95% Return to Player
  symbols: SYMBOLS,
  hasMultiplier: true
};
