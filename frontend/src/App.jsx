import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import AuthPage from './pages/AuthPage';
import SlotMachine from './components/SlotMachine';
import TransactionHistory from './components/TransactionHistory';
import { gamesAPI, balanceAPI } from './utils/api';

function App() {
  const [user, setUser] = useState(null);
  const [balance, setBalance] = useState(0);
  const [gameConfigs, setGameConfigs] = useState({});
  const [loading, setLoading] = useState(false);
  const [refreshBalance, setRefreshBalance] = useState(0);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  useEffect(() => {
    if (user) {
      loadBalance();
      loadGameConfigs();
    }
  }, [user, refreshBalance]);

  const loadBalance = async () => {
    try {
      const response = await balanceAPI.getBalance();
      setBalance(response.data.balance);
    } catch (error) {
      console.error('Failed to load balance:', error);
    }
  };

  const loadGameConfigs = async () => {
    try {
      const games = ['classic777', 'neoncyber', 'ancientgold'];
      const configs = {};

      for (const game of games) {
        const response = await gamesAPI.getConfig(game);
        configs[game] = response.data;
      }

      setGameConfigs(configs);
    } catch (error) {
      console.error('Failed to load game configs:', error);
    }
  };

  const handlePlayGame = async (gameType, betAmount) => {
    setLoading(true);
    try {
      const response = await gamesAPI.play(gameType, betAmount);
      setBalance(response.data.balanceAfter);
      setRefreshBalance((prev) => prev + 1);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.error || 'Failed to play game');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    setBalance(0);
    setGameConfigs({});
  };

  const handleAuthSuccess = (userData) => {
    setUser(userData);
    localStorage.setItem('user', JSON.stringify(userData));
  };

  if (!user) {
    return <AuthPage onAuthSuccess={handleAuthSuccess} />;
  }

  return (
    <div className="min-h-screen bg-dark-bg">
      <Header user={user} balance={balance} onLogout={handleLogout} />

      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* Games Grid */}
        <section className="mb-12">
          <h2 className="text-3xl font-bold mb-6 neon-cyan">Choose Your Game</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Object.entries(gameConfigs).map(([key, config]) => (
              <SlotMachine
                key={key}
                gameType={key}
                config={config}
                onPlay={handlePlayGame}
                isLoading={loading}
              />
            ))}
          </div>
        </section>

        {/* Sidebar */}
        <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-3">
            <TransactionHistory key={refreshBalance} />
          </div>
        </section>

        {/* Footer */}
        <footer className="mt-16 py-8 border-t border-gray-800 text-center text-gray-500 text-sm">
          <p>🎰 Casino Simulation Platform - For Entertainment Purposes Only</p>
          <p className="mt-2">All gambling is simulated with virtual currency</p>
        </footer>
      </main>
    </div>
  );
}

export default App;
