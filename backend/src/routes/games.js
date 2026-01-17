import express from 'express';
import { playSlot, getGameConfig } from '../controllers/gameController.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

router.post('/play', authenticateToken, playSlot);
router.get('/config/:gameType', getGameConfig);

export default router;
