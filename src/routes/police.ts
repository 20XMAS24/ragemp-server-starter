import { Router } from 'express';
import { PoliceService } from '../services/policeService';
import { ApiResponse } from '../types';

const router = Router();

router.post('/recruit', (req, res) => {
  const { username } = req.body;

  if (!username) {
    return res.json({ success: false, message: 'Username required' } as ApiResponse);
  }

  const result = PoliceService.recruitOfficer(username);
  res.json({
    success: result.success,
    message: result.error || 'Officer recruited',
    data: result.data
  } as ApiResponse);
});

router.post('/fire', (req, res) => {
  const { username } = req.body;

  if (!username) {
    return res.json({ success: false, message: 'Username required' } as ApiResponse);
  }

  const result = PoliceService.fireOfficer(username);
  res.json({
    success: result.success,
    message: result.error || 'Officer fired',
    data: result.data
  } as ApiResponse);
});

router.post('/duty/in', (req, res) => {
  const { username } = req.body;

  if (!username) {
    return res.json({ success: false, message: 'Username required' } as ApiResponse);
  }

  const result = PoliceService.clockIn(username);
  res.json({
    success: result.success,
    message: result.error || 'Clocked in',
    data: result.data
  } as ApiResponse);
});

router.post('/duty/out', (req, res) => {
  const { username } = req.body;

  if (!username) {
    return res.json({ success: false, message: 'Username required' } as ApiResponse);
  }

  const result = PoliceService.clcockOut(username);
  res.json({
    success: result.success,
    message: result.error || 'Clocked out',
    data: result.data
  } as ApiResponse);
});

router.post('/salary', (req, res) => {
  const { username } = req.body;

  if (!username) {
    return res.json({ success: false, message: 'Username required' } as ApiResponse);
  }

  const result = PoliceService.paySalary(username);
  res.json({
    success: result.success,
    message: result.error || result.message,
    data: result.data
  } as ApiResponse);
});

router.get('/officers', (req, res) => {
  const officers = PoliceService.getOfficers();
  res.json({
    success: true,
    message: 'All police officers',
    data: officers
  } as ApiResponse);
});

export default router;
