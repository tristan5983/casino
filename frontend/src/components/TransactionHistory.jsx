import React, { useState, useEffect } from 'react';
import { ChevronRight } from 'lucide-react';

const TransactionHistory = () => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadTransactions();
  }, []);

  const loadTransactions = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/balance/transactions', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      const data = await response.json();
      setTransactions(data.transactions || []);
    } catch (error) {
      console.error('Failed to load transactions:', error);
    }
    setLoading(false);
  };

  return (
    <div className="card p-6">
      <h2 className="text-2xl font-bold mb-4 neon-cyan">Transaction History</h2>

      {loading ? (
        <div className="text-center py-8 text-gray-400">Loading...</div>
      ) : transactions.length === 0 ? (
        <div className="text-center py-8 text-gray-400">No transactions yet</div>
      ) : (
        <div className="space-y-2 max-h-80 overflow-y-auto">
          {transactions.map((tx) => (
            <div
              key={tx.id}
              className="flex justify-between items-center p-3 bg-dark-input rounded-lg hover:bg-gray-700 transition"
            >
              <div className="flex-1">
                <p className="font-semibold text-sm">{tx.game || tx.type}</p>
                <p className="text-xs text-gray-400">
                  {new Date(tx.created_at).toLocaleString()}
                </p>
              </div>
              <div className="text-right">
                <p
                  className={`font-bold ${
                    tx.type === 'WIN' ? 'text-neon-green' : 'text-neon-pink'
                  }`}
                >
                  {tx.type === 'WIN' ? '+' : '-'}${Math.abs(tx.amount).toFixed(2)}
                </p>
                <p className="text-xs text-gray-400">
                  ${tx.balance_after.toFixed(2)}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}

      <button
        onClick={loadTransactions}
        className="w-full mt-4 bg-dark-input hover:bg-gray-700 py-2 rounded-lg text-sm transition"
      >
        Refresh
      </button>
    </div>
  );
};

export default TransactionHistory;
