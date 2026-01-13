import { v4 as uuidv4 } from 'uuid';
import { db } from '../database/database';
import { Player, PlayerSession } from '../types';

const activeSessions = new Map<string, PlayerSession>();
const usernameToId = new Map<string, string>();

export class PlayerManager {
  static createSession(player: Player): PlayerSession {
    const session: PlayerSession = {
      playerId: player.id,
      username: player.username,
      money: player.money,
      bank: player.bank,
      job: player.job,
      isPolice: player.isPolice,
      isOnDuty: player.isOnDuty
    };
    activeSessions.set(player.id, session);
    usernameToId.set(player.username.toLowerCase(), player.id);
    return session;
  }

  static getSession(playerId: string): PlayerSession | null {
    return activeSessions.get(playerId) || null;
  }

  static getSessionByUsername(username: string): PlayerSession | null {
    const id = usernameToId.get(username.toLowerCase());
    return id ? activeSessions.get(id) || null : null;
  }

  static updateSession(playerId: string, player: Player) {
    const session = activeSessions.get(playerId);
    if (session) {
      session.money = player.money;
      session.bank = player.bank;
      session.job = player.job;
      session.isPolice = player.isPolice;
      session.isOnDuty = player.isOnDuty;
    }
  }

  static removeSession(playerId: string) {
    const session = activeSessions.get(playerId);
    if (session) {
      usernameToId.delete(session.username.toLowerCase());
    }
    activeSessions.delete(playerId);
  }

  static getAllSessions(): PlayerSession[] {
    return Array.from(activeSessions.values());
  }
}
