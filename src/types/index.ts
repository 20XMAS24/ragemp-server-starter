export interface Player {
  id: string;
  username: string;
  password: string;
  money: number;
  bank: number;
  job: string | null;
  jobRank: number;
  isPolice: boolean;
  isOnDuty: boolean;
  createdAt: number;
  lastLogin: number;
}

export interface Job {
  id: string;
  name: string;
  salary: number;
  maxRank: number;
  description: string;
}

export interface PlayerSession {
  playerId: string;
  username: string;
  money: number;
  bank: number;
  job: string | null;
  isPolice: boolean;
  isOnDuty: boolean;
}

export interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
  error?: string;
}
