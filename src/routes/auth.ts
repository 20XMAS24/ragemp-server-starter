import { Router } from 'express';
import { AuthService } from '../services/authService';
import { PlayerManager } from '../services/playerManager';
import { ApiResponse } from '../types';

const router = Router();

router.post('/register', (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.json({ success: false, message: 'Username and password required' } as ApiResponse);
  }

  const result = AuthService.register(username, password);
  if (!result.success) {
    return res.json({ success: false, message: result.error } as ApiResponse);
  }

  const session = PlayerManager.createSession(result.player!);
  res.json({
    success: true,
    message: 'Account created successfully',
    data: session
  } as ApiResponse);
});

router.post('/login', (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.json({ success: false, message: 'Username and password required' } as ApiResponse);
  }

  const result = AuthService.login(username, password);
  if (!result.success) {
    return res.json({ success: false, message: result.error } as ApiResponse);
  }

  const session = PlayerManager.createSession(result.player!);
  res.json({
    success: true,
    message: 'Login successful',
    data: session
  } as ApiResponse);
});

router.post('/logout', (req, res) => {
  const { playerId } = req.body;
  if (playerId) {
    PlayerManager.removeSession(playerId);
  }
  res.json({
    success: true,
    message: 'Logout successful'
  } as ApiResponse);
});

export default router;
