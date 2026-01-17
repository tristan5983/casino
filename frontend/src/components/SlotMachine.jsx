import React, { useState } from 'react';
import { Play, AlertCircle } from 'lucide-react';

const SlotMachine = ({ gameType, config, onPlay, isLoading }) => {
  const [betAmount, setBetAmount] = useState(config.minBet);
  const [result, setResult] = useState(null);
  const [isSpinning, setIsSpinning] = useState(false);

  const handleSpin = async () => {
    if (betAmount < config.minBet || betAmount > config.maxBet) {
      alert(`Bet must be between $${config.minBet} and $${config.maxBet}`);
      return;
    }

    setIsSpinning(true);
    try {
      const response = await onPlay(gameType, betAmount);
      setResult(response);
      // Auto-hide result after 3 seconds
      setTimeout(() => setResult(null), 3000);
    } catch (error) {
      alert(error.message || 'Failed to play game');
    } finally {
      setIsSpinning(false);
    }
  };

  const getSymbolEmoji = (symbol) => {
    const emojis = {
      '7': '7️⃣',
      'CHERRY': '🍒',
      'LEMON': '🍋',
      'ORANGE': '🍊',
      'BELL': '🔔',
      'BAR': '🏅',
      'SKULL': '💀',
      'CODE': '💻',
      'MATRIX': '🟢',
      'NEON': '⚡',
      'GLITCH': '❌',
      'CYBER': '🤖',
      'WILD': '🌟',
      'PYRAMID': '🔺',
      'SCARAB': '🪲',
      'PHARAOH': '👑',
      'GOLD': '💛',
      'ANKH': '☥️',
      'EYE': '👁️',
      'MULTIPLIER': '✖️'
    };
    return emojis[symbol] || '?';
  };

  return (
    <div className="card p-6">
      <h2 className="text-2xl font-bold mb-4 neon-purple">{config.name}</h2>

      {/* Game Info */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mb-6 text-sm">
        <div className="bg-dark-input p-2 rounded">
          <p className="text-gray-400 text-xs">Reels</p>
          <p className="font-bold">{config.reels}</p>
        </div>
        <div className="bg-dark-input p-2 rounded">
          <p className="text-gray-400 text-xs">Volatility</p>
          <p className="font-bold capitalize">{config.volatility}</p>
        </div>
        <div className="bg-dark-input p-2 rounded">
          <p className="text-gray-400 text-xs">RTP</p>
          <p className="font-bold">{(config.rtp * 100).toFixed(0)}%</p>
        </div>
        <div className="bg-dark-input p-2 rounded">
          <p className="text-gray-400 text-xs">Bet Range</p>
          <p className="font-bold">${config.minBet}-${config.maxBet}</p>
        </div>
      </div>

      {/* Reels Display */}
      <div className="bg-dark-input p-8 rounded-lg mb-6 flex justify-center items-center gap-4">
        {result && result.result.reels ? (
          <div className="flex gap-4">
            {result.result.reels.map((symbol, idx) => (
              <div
                key={idx}
                className={`w-16 h-16 bg-gradient-to-br from-neon-purple to-neon-pink rounded-lg flex items-center justify-center text-3xl font-bold ${
                  isSpinning ? 'animate-spin' : ''
                } border-2 border-neon-cyan`}
              >
                {getSymbolEmoji(symbol)}
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center">
            <p className="text-gray-500">Click Spin to play</p>
          </div>
        )}
      </div>

      {/* Bet Amount */}
      <div className="mb-4">
        <label className="block text-sm font-semibold mb-2">Bet Amount: ${betAmount}</label>
        <input
          type="range"
          min={config.minBet}
          max={config.maxBet}
          step={10}
          value={betAmount}
          onChange={(e) => setBetAmount(Number(e.target.value))}
          disabled={isSpinning}
          className="w-full"
        />
        <div className="flex gap-2 mt-2">
          {[config.minBet, Math.floor((config.minBet + config.maxBet) / 2), config.maxBet].map(
            (amount) => (
              <button
                key={amount}
                onClick={() => setBetAmount(amount)}
                disabled={isSpinning}
                className="flex-1 bg-gray-700 hover:bg-gray-600 py-1 rounded text-sm"
              >
                ${amount}
              </button>
            )
          )}
        </div>
      </div>

      {/* Result Display */}
      {result && (
        <div
          className={`mb-4 p-4 rounded-lg border ${
            result.result.win
              ? 'bg-green-900 border-green-500 text-green-100'
              : 'bg-red-900 border-red-500 text-red-100'
          }`}
        >
          <p className="font-bold">
            {result.result.win ? '🎉 WIN!' : '😢 Loss'}
          </p>
          <p>Bet: ${result.bet}</p>
          <p>Win: ${result.winAmount}</p>
          <p className={result.netChange >= 0 ? 'text-green-400' : 'text-red-400'}>
            Net: {result.netChange >= 0 ? '+' : ''}${result.netChange}
          </p>
          <p className="text-sm mt-2">New Balance: ${result.balanceAfter.toFixed(2)}</p>
        </div>
      )}

      {/* Spin Button */}
      <button
        onClick={handleSpin}
        disabled={isSpinning || isLoading}
        className="w-full bg-gradient-to-r from-neon-purple to-neon-pink hover:from-purple-700 hover:to-pink-700 text-white font-bold py-3 rounded-lg flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <Play className="w-5 h-5" />
        {isSpinning ? 'Spinning...' : 'SPIN'}
      </button>
    </div>
  );
};

export default SlotMachine;
