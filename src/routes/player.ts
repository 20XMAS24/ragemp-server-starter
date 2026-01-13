import { Router } from 'express';
import { db } from '../database/database';
import { PlayerManager } from '../services/playerManager';
import { ApiResponse, PlayerSession } from '../types';

const router = Router();

router.get('/info', (req, res) => {
  const { playerId } = req.query;
  if (!playerId) {
    return res.json({ success: false, message: 'Player ID required' } as ApiResponse);
  }

  const session = PlayerManager.getSession(playerId as string);
  if (!session) {
    return res.json({ success: false, message: 'Player not found' } as ApiResponse);
  }

  res.json({
    success: true,
    message: 'Player info',
    data: session
  } as ApiResponse);
});

router.get('/all', (req, res) => {
  const sessions = PlayerManager.getAllSessions();
  res.json({
    success: true,
    message: 'All online players',
    data: sessions
  } as ApiResponse);
});

router.post('/transfer', (req, res) => {
  const { fromUsername, toUsername, amount } = req.body;

  if (!fromUsername || !toUsername || !amount || amount <= 0) {
    return res.json({ success: false, message: 'Invalid transfer data' } as ApiResponse);
  }

  const fromPlayer = db.getPlayer(fromUsername);
  const toPlayer = db.getPlayer(toUsername);

  if (!fromPlayer || !toPlayer) {
    return res.json({ success: false, message: 'Player not found' } as ApiResponse);
  }

  if (fromPlayer.money < amount) {
    return res.json({ success: false, message: 'Insufficient funds' } as ApiResponse);
  }

  db.addMoney(fromUsername, -amount);
  const toUpdated = db.addMoney(toUsername, amount);

  if (toUpdated) {
    PlayerManager.updateSession(toUpdated.id, toUpdated);
  }

  res.json({
    success: true,
    message: `Transferred $${amount} to ${toUsername}`,
    data: toUpdated
  } as ApiResponse);
});

router.post('/bank/deposit', (req, res) => {
  const { username, amount } = req.body;

  if (!username || !amount || amount <= 0) {
    return res.json({ success: false, message: 'Invalid deposit data' } as ApiResponse);
  }

  const player = db.getPlayer(username);
  if (!player || player.money < amount) {
    return res.json({ success: false, message: 'Insufficient cash' } as ApiResponse);
  }

  db.addMoney(username, -amount);
  const updated = db.addBank(username, amount);

  if (updated) {
    PlayerManager.updateSession(updated.id, updated);
  }

  res.json({
    success: true,
    message: `Deposited $${amount}`,
    data: updated
  } as ApiResponse);
});

router.post('/bank/withdraw', (req, res) => {
  const { username, amount } = req.body;

  if (!username || !amount || amount <= 0) {
    return res.json({ success: false, message: 'Invalid withdraw data' } as ApiResponse);
  }

  const player = db.getPlayer(username);
  if (!player || player.bank < amount) {
    return res.json({ success: false, message: 'Insufficient bank funds' } as ApiResponse);
  }

  db.addBank(username, -amount);
  const updated = db.addMoney(username, amount);

  if (updated) {
    PlayerManager.updateSession(updated.id, updated);
  }

  res.json({
    success: true,
    message: `Withdrew $${amount}`,
    data: updated
  } as ApiResponse);
});

export default router;
