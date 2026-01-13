import { v4 as uuidv4 } from 'uuid';
import { db } from '../database/database';
import { Player } from '../types';

const MIN_USERNAME_LENGTH = 3;
const MAX_USERNAME_LENGTH = 20;
const MIN_PASSWORD_LENGTH = 6;

export class AuthService {
  static validateUsername(username: string): { valid: boolean; error?: string } {
    if (!username || username.length < MIN_USERNAME_LENGTH) {
      return { valid: false, error: `Username must be at least ${MIN_USERNAME_LENGTH} characters` };
    }
    if (username.length > MAX_USERNAME_LENGTH) {
      return { valid: false, error: `Username must be no more than ${MAX_USERNAME_LENGTH} characters` };
    }
    if (!/^[a-zA-Z0-9_]+$/.test(username)) {
      return { valid: false, error: 'Username can only contain letters, numbers, and underscores' };
    }
    return { valid: true };
  }

  static validatePassword(password: string): { valid: boolean; error?: string } {
    if (!password || password.length < MIN_PASSWORD_LENGTH) {
      return { valid: false, error: `Password must be at least ${MIN_PASSWORD_LENGTH} characters` };
    }
    return { valid: true };
  }

  static register(username: string, password: string): { success: boolean; player?: Player; error?: string } {
    const usernameValidation = this.validateUsername(username);
    if (!usernameValidation.valid) {
      return { success: false, error: usernameValidation.error };
    }

    const passwordValidation = this.validatePassword(password);
    if (!passwordValidation.valid) {
      return { success: false, error: passwordValidation.error };
    }

    if (db.getPlayer(username)) {
      return { success: false, error: 'Username already exists' };
    }

    const playerId = uuidv4();
    const player = db.createPlayer(username, password, playerId);
    return { success: true, player };
  }

  static login(username: string, password: string): { success: boolean; player?: Player; error?: string } {
    const player = db.getPlayer(username);
    if (!player) {
      return { success: false, error: 'Player not found' };
    }

    if (player.password !== password) {
      return { success: false, error: 'Invalid password' };
    }

    db.updatePlayer(username, { lastLogin: Date.now() });
    return { success: true, player };
  }
}
