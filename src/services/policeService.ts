import { db } from '../database/database';
import { PlayerManager } from './playerManager';

const POLICE_SALARY = 1500;

export class PoliceService {
  static recruitOfficer(username: string) {
    const player = db.getPlayer(username);
    if (!player) {
      return { success: false, error: 'Player not found' };
    }

    if (player.isPolice) {
      return { success: false, error: 'Player is already police' };
    }

    const updated = db.setPoliceStatus(username, true);
    if (updated) {
      PlayerManager.updateSession(updated.id, updated);
    }
    return { success: true, data: updated };
  }

  static fireOfficer(username: string) {
    const player = db.getPlayer(username);
    if (!player || !player.isPolice) {
      return { success: false, error: 'Player is not police' };
    }

    const updated = db.setPoliceStatus(username, false);
    if (updated) {
      PlayerManager.updateSession(updated.id, updated);
    }
    return { success: true, data: updated };
  }

  static clockIn(username: string) {
    const player = db.getPlayer(username);
    if (!player || !player.isPolice) {
      return { success: false, error: 'Player is not police' };
    }

    const updated = db.setOnDuty(username, true);
    if (updated) {
      PlayerManager.updateSession(updated.id, updated);
    }
    return { success: true, data: updated };
  }

  static clcockOut(username: string) {
    const player = db.getPlayer(username);
    if (!player || !player.isPolice) {
      return { success: false, error: 'Player is not police' };
    }

    const updated = db.setOnDuty(username, false);
    if (updated) {
      PlayerManager.updateSession(updated.id, updated);
    }
    return { success: true, data: updated };
  }

  static paySalary(username: string) {
    const player = db.getPlayer(username);
    if (!player || !player.isPolice || !player.isOnDuty) {
      return { success: false, error: 'Invalid police status' };
    }

    const updated = db.addMoney(username, POLICE_SALARY);
    if (updated) {
      PlayerManager.updateSession(updated.id, updated);
    }
    return { success: true, data: updated, message: `Salary of $${POLICE_SALARY} paid` };
  }

  static getOfficers() {
    const allPlayers = db.getAllPlayers();
    return Object.values(allPlayers).filter((p: any) => p.isPolice);
  }
}
