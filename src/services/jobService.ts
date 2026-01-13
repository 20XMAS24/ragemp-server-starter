import { db } from '../database/database';
import { PlayerManager } from './playerManager';

export class JobService {
  static hirePlayer(username: string, jobId: string, initialRank: number = 0) {
    const job = db.getJob(jobId);
    if (!job) {
      return { success: false, error: 'Job not found' };
    }

    if (initialRank > job.maxRank) {
      return { success: false, error: `Max rank for this job is ${job.maxRank}` };
    }

    const player = db.setJob(username, jobId, initialRank);
    if (player) {
      const playerId = player.id;
      PlayerManager.updateSession(playerId, player);
    }
    return { success: true, data: player };
  }

  static firePlayer(username: string) {
    const player = db.updatePlayer(username, {
      job: null,
      jobRank: 0,
      isOnDuty: false
    });
    if (player) {
      PlayerManager.updateSession(player.id, player);
      return { success: true, data: player };
    }
    return { success: false, error: 'Player not found' };
  }

  static promotePlayer(username: string, newRank: number) {
    const player = db.getPlayer(username);
    if (!player || !player.job) {
      return { success: false, error: 'Player has no job' };
    }

    const job = db.getJob(player.job);
    if (!job || newRank > job.maxRank) {
      return { success: false, error: 'Invalid rank' };
    }

    const updated = db.updatePlayer(username, { jobRank: newRank });
    if (updated) {
      PlayerManager.updateSession(updated.id, updated);
    }
    return { success: true, data: updated };
  }

  static toggleOnDuty(username: string) {
    const player = db.getPlayer(username);
    if (!player || (!player.job && !player.isPolice)) {
      return { success: false, error: 'Player has no job' };
    }

    const updated = db.setOnDuty(username, !player.isOnDuty);
    if (updated) {
      PlayerManager.updateSession(updated.id, updated);
    }
    return { success: true, data: updated };
  }

  static earnMoney(username: string, amount: number) {
    const player = db.getPlayer(username);
    if (!player) {
      return { success: false, error: 'Player not found' };
    }

    if (!player.isOnDuty) {
      return { success: false, error: 'Player is not on duty' };
    }

    const updated = db.addMoney(username, amount);
    if (updated) {
      PlayerManager.updateSession(updated.id, updated);
    }
    return { success: true, data: updated };
  }
}
