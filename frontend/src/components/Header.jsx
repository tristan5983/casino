import React, { useState, useEffect } from 'react';
import { LogOut, TrendingUp, TrendingDown, Wallet } from 'lucide-react';

const Header = ({ user, balance, onLogout }) => {
  return (
    <header className="bg-dark-card border-b border-gray-800 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <div className="text-3xl">🎰</div>
          <div>
            <h1 className="text-2xl font-bold neon-purple">CASINO</h1>
            <p className="text-xs text-gray-400">Simulation Platform</p>
          </div>
        </div>

        {user && (
          <div className="flex items-center gap-6">
            <div className="hidden md:flex flex-col items-end">
              <p className="text-sm text-gray-400">Balance</p>
              <p className="text-2xl font-bold neon-green flex items-center gap-2">
                <Wallet className="w-6 h-6" />
                ${balance.toFixed(2)}
              </p>
            </div>

            <div className="hidden md:flex flex-col items-end">
              <p className="text-sm text-gray-400">User</p>
              <p className="text-lg font-semibold">{user.username}</p>
            </div>

            <button
              onClick={onLogout}
              className="bg-neon-pink hover:bg-pink-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition"
            >
              <LogOut className="w-4 h-4" />
              <span className="hidden md:inline">Logout</span>
            </button>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
