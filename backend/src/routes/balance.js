import express from 'express';
import { getBalance, getTransactionHistory, getGameHistory } from '../controllers/balanceController.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

router.get('/balance', authenticateToken, getBalance);
router.get('/transactions', authenticateToken, getTransactionHistory);
router.get('/game-history', authenticateToken, getGameHistory);

export default router;
