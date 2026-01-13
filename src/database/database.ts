import * as fs from 'fs';
import * as path from 'path';

interface DatabaseData {
  players: Record<string, any>;
  jobs: Record<string, any>;
}

const DB_PATH = path.join(process.cwd(), 'database', 'data.json');
const JOBS_PATH = path.join(process.cwd(), 'database', 'jobs.json');

function ensureDatabase() {
  const dir = path.dirname(DB_PATH);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }

  if (!fs.existsSync(DB_PATH)) {
    fs.writeFileSync(DB_PATH, JSON.stringify({ players: {} }, null, 2));
  }

  if (!fs.existsSync(JOBS_PATH)) {
    const defaultJobs = {
      jobs: {
        'police': {
          id: 'police',
          name: 'Police Officer',
          salary: 1500,
          maxRank: 5,
          description: 'Law enforcement officer'
        },
        'taxi': {
          id: 'taxi',
          name: 'Taxi Driver',
          salary: 1000,
          maxRank: 3,
          description: 'Transport service provider'
        },
        'miner': {
          id: 'miner',
          name: 'Miner',
          salary: 1200,
          maxRank: 2,
          description: 'Stone and ore miner'
        }
      }
    };
    fs.writeFileSync(JOBS_PATH, JSON.stringify(defaultJobs, null, 2));
  }
}

export class Database {
  private data: DatabaseData = { players: {}, jobs: {} };

  constructor() {
    ensureDatabase();
    this.loadData();
  }

  private loadData() {
    try {
      const playersData = fs.readFileSync(DB_PATH, 'utf-8');
      this.data = { ...JSON.parse(playersData), jobs: this.loadJobs() };
    } catch (error) {
      this.data = { players: {}, jobs: this.loadJobs() };
    }
  }

  private loadJobs() {
    try {
      const jobsData = fs.readFileSync(JOBS_PATH, 'utf-8');
      return JSON.parse(jobsData).jobs;
    } catch (error) {
      return {};
    }
  }

  private save() {
    fs.writeFileSync(DB_PATH, JSON.stringify({ players: this.data.players }, null, 2));
  }

  getPlayer(username: string) {
    return this.data.players[username.toLowerCase()] || null;
  }

  getAllPlayers() {
    return this.data.players;
  }

  createPlayer(username: string, password: string, id: string) {
    const player = {
      id,
      username,
      password,
      money: 5000,
      bank: 10000,
      job: null,
      jobRank: 0,
      isPolice: false,
      isOnDuty: false,
      createdAt: Date.now(),
      lastLogin: Date.now()
    };
    this.data.players[username.toLowerCase()] = player;
    this.save();
    return player;
  }

  updatePlayer(username: string, updates: Partial<any>) {
    const player = this.getPlayer(username);
    if (!player) return null;

    const updated = { ...player, ...updates, lastLogin: Date.now() };
    this.data.players[username.toLowerCase()] = updated;
    this.save();
    return updated;
  }

  addMoney(username: string, amount: number) {
    const player = this.getPlayer(username);
    if (!player) return null;

    return this.updatePlayer(username, {
      money: Math.max(0, player.money + amount)
    });
  }

  addBank(username: string, amount: number) {
    const player = this.getPlayer(username);
    if (!player) return null;

    return this.updatePlayer(username, {
      bank: Math.max(0, player.bank + amount)
    });
  }

  setJob(username: string, jobId: string, rank: number = 0) {
    return this.updatePlayer(username, {
      job: jobId,
      jobRank: rank,
      isOnDuty: false
    });
  }

  setPoliceStatus(username: string, isPolice: boolean) {
    return this.updatePlayer(username, {
      isPolice,
      isOnDuty: false
    });
  }

  setOnDuty(username: string, isOnDuty: boolean) {
    const player = this.getPlayer(username);
    if (!player || (!player.job && !player.isPolice)) {
      return null;
    }
    return this.updatePlayer(username, { isOnDuty });
  }

  getJob(jobId: string) {
    return this.data.jobs[jobId] || null;
  }

  getAllJobs() {
    return this.data.jobs;
  }
}

export const db = new Database();
