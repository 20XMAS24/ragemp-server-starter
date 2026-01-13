import { Router } from 'express';
import { db } from '../database/database';
import { JobService } from '../services/jobService';
import { ApiResponse } from '../types';

const router = Router();

router.get('/list', (req, res) => {
  const jobs = db.getAllJobs();
  res.json({
    success: true,
    message: 'All jobs',
    data: jobs
  } as ApiResponse);
});

router.post('/hire', (req, res) => {
  const { username, jobId } = req.body;

  if (!username || !jobId) {
    return res.json({ success: false, message: 'Username and jobId required' } as ApiResponse);
  }

  const result = JobService.hirePlayer(username, jobId);
  res.json({
    success: result.success,
    message: result.error || 'Player hired',
    data: result.data
  } as ApiResponse);
});

router.post('/fire', (req, res) => {
  const { username } = req.body;

  if (!username) {
    return res.json({ success: false, message: 'Username required' } as ApiResponse);
  }

  const result = JobService.firePlayer(username);
  res.json({
    success: result.success,
    message: 'Player fired',
    data: result.data
  } as ApiResponse);
});

router.post('/duty/toggle', (req, res) => {
  const { username } = req.body;

  if (!username) {
    return res.json({ success: false, message: 'Username required' } as ApiResponse);
  }

  const result = JobService.toggleOnDuty(username);
  res.json({
    success: result.success,
    message: result.error || 'Duty toggled',
    data: result.data
  } as ApiResponse);
});

router.post('/earn', (req, res) => {
  const { username, amount } = req.body;

  if (!username || !amount || amount <= 0) {
    return res.json({ success: false, message: 'Invalid data' } as ApiResponse);
  }

  const result = JobService.earnMoney(username, amount);
  res.json({
    success: result.success,
    message: result.error || `Earned $${amount}`,
    data: result.data
  } as ApiResponse);
});

export default router;
