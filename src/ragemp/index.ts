/**
 * RAGE MP Integration Layer
 * This file integrates the API with RAGE MP server
 */

import '../types/ragemp';
import { db } from '../database/database';
import { AuthService } from '../services/authService';
import { JobService } from '../services/jobService';
import { PoliceService } from '../services/policeService';
import { PlayerManager } from '../services/playerManager';

const players = new Map<string, any>();

console.log('[Server] GameMode started!');
console.log('[Server] Database initialized');
console.log('[Server] Available jobs:', Object.keys(db.getAllJobs()));

// Player events
mp.events.add('playerJoin', (player: any) => {
  console.log(`[Server] Player ${player.name} connected`);
  
  // Show login UI
  player.call('client:showLogin');
});

mp.events.add('playerQuit', (player: any, exitType: string, reason: string) => {
  console.log(`[Server] Player ${player.name} disconnected (${exitType}: ${reason})`);
  
  // Save player data and remove session
  if (players.has(player.name)) {
    const playerData = players.get(player.name);
    if (playerData) {
      PlayerManager.removeSession(playerData.id);
    }
    players.delete(player.name);
  }
});

// Authentication
mp.events.add('server:auth:register', (player: any, username: string, password: string) => {
  console.log(`[Server] Registration attempt: ${username}`);
  
  const result = AuthService.register(username, password);
  
  if (result.success && result.player) {
    const session = PlayerManager.createSession(result.player);
    players.set(player.name, result.player);
    
    player.call('client:auth:success', [JSON.stringify(session)]);
    player.outputChatBox(`Welcome ${username}! You have $${result.player.money}`);
    
    console.log(`[Server] ${username} registered successfully`);
  } else {
    player.call('client:auth:error', [result.error || 'Registration failed']);
    console.log(`[Server] Registration failed for ${username}: ${result.error}`);
  }
});

mp.events.add('server:auth:login', (player: any, username: string, password: string) => {
  console.log(`[Server] Login attempt: ${username}`);
  
  const result = AuthService.login(username, password);
  
  if (result.success && result.player) {
    const session = PlayerManager.createSession(result.player);
    players.set(player.name, result.player);
    
    player.call('client:auth:success', [JSON.stringify(session)]);
    player.outputChatBox(`Welcome back ${username}! You have $${result.player.money}`);
    player.setVariable('username', username);
    player.setVariable('money', result.player.money);
    player.setVariable('bank', result.player.bank);
    
    console.log(`[Server] ${username} logged in successfully`);
  } else {
    player.call('client:auth:error', [result.error || 'Login failed']);
    console.log(`[Server] Login failed for ${username}: ${result.error}`);
  }
});

// Job commands
mp.events.addCommand('hire', (player: any, jobId: string) => {
  const username = player.getVariable('username');
  if (!username) {
    player.outputChatBox('!{red}You must be logged in!');
    return;
  }
  
  const result = JobService.hirePlayer(username, jobId);
  if (result.success) {
    player.outputChatBox(`!{green}You are now hired as ${jobId}!`);
    player.setVariable('job', jobId);
  } else {
    player.outputChatBox(`!{red}${result.error || 'Failed to hire'}`);
  }
});

mp.events.addCommand('fire', (player: any) => {
  const username = player.getVariable('username');
  if (!username) {
    player.outputChatBox('!{red}You must be logged in!');
    return;
  }
  
  const result = JobService.firePlayer(username);
  if (result.success) {
    player.outputChatBox('!{green}You quit your job!');
    player.setVariable('job', null);
  } else {
    player.outputChatBox(`!{red}${result.error || 'Failed to fire'}`);
  }
});

mp.events.addCommand('duty', (player: any) => {
  const username = player.getVariable('username');
  if (!username) {
    player.outputChatBox('!{red}You must be logged in!');
    return;
  }
  
  const result = JobService.toggleOnDuty(username);
  if (result.success && result.data) {
    const status = result.data.isOnDuty ? 'on duty' : 'off duty';
    player.outputChatBox(`!{green}You are now ${status}!`);
    player.setVariable('isOnDuty', result.data.isOnDuty);
  } else {
    player.outputChatBox(`!{red}${result.error || 'Failed to toggle duty'}`);
  }
});

mp.events.addCommand('givemoney', (player: any, targetName: string, amount: string) => {
  const username = player.getVariable('username');
  if (!username) {
    player.outputChatBox('!{red}You must be logged in!');
    return;
  }
  
  const amountNum = parseInt(amount);
  if (isNaN(amountNum) || amountNum <= 0) {
    player.outputChatBox('!{red}Invalid amount!');
    return;
  }
  
  const fromPlayer = db.getPlayer(username);
  if (!fromPlayer || fromPlayer.money < amountNum) {
    player.outputChatBox('!{red}Insufficient funds!');
    return;
  }
  
  db.addMoney(username, -amountNum);
  const toUpdated = db.addMoney(targetName, amountNum);
  
  if (toUpdated) {
    player.outputChatBox(`!{green}You gave $${amountNum} to ${targetName}`);
    player.setVariable('money', fromPlayer.money - amountNum);
    
    // Notify target player if online
    mp.players.forEach((p: any) => {
      if (p.getVariable('username') === targetName) {
        p.outputChatBox(`!{green}You received $${amountNum} from ${username}`);
        p.setVariable('money', toUpdated.money);
      }
    });
  } else {
    player.outputChatBox('!{red}Player not found!');
  }
});

// Police commands
mp.events.addCommand('makecop', (player: any, targetName?: string) => {
  const username = targetName || player.getVariable('username');
  if (!username) {
    player.outputChatBox('!{red}You must be logged in!');
    return;
  }
  
  const result = PoliceService.recruitOfficer(username);
  if (result.success) {
    player.outputChatBox(`!{green}${username} is now a police officer!`);
  } else {
    player.outputChatBox(`!{red}${result.error || 'Failed to recruit'}`);
  }
});

mp.events.addCommand('salary', (player: any) => {
  const username = player.getVariable('username');
  if (!username) {
    player.outputChatBox('!{red}You must be logged in!');
    return;
  }
  
  const result = PoliceService.paySalary(username);
  if (result.success) {
    player.outputChatBox(`!{green}${result.message || 'Salary paid'}`);
    if (result.data) {
      player.setVariable('money', result.data.money);
    }
  } else {
    player.outputChatBox(`!{red}${result.error || 'Failed to pay salary'}`);
  }
});

// Bank commands
mp.events.addCommand('deposit', (player: any, amount: string) => {
  const username = player.getVariable('username');
  if (!username) {
    player.outputChatBox('!{red}You must be logged in!');
    return;
  }
  
  const amountNum = parseInt(amount);
  if (isNaN(amountNum) || amountNum <= 0) {
    player.outputChatBox('!{red}Invalid amount!');
    return;
  }
  
  const playerData = db.getPlayer(username);
  if (!playerData || playerData.money < amountNum) {
    player.outputChatBox('!{red}Insufficient cash!');
    return;
  }
  
  db.addMoney(username, -amountNum);
  const updated = db.addBank(username, amountNum);
  
  if (updated) {
    player.outputChatBox(`!{green}Deposited $${amountNum}`);
    player.setVariable('money', updated.money);
    player.setVariable('bank', updated.bank);
  }
});

mp.events.addCommand('withdraw', (player: any, amount: string) => {
  const username = player.getVariable('username');
  if (!username) {
    player.outputChatBox('!{red}You must be logged in!');
    return;
  }
  
  const amountNum = parseInt(amount);
  if (isNaN(amountNum) || amountNum <= 0) {
    player.outputChatBox('!{red}Invalid amount!');
    return;
  }
  
  const playerData = db.getPlayer(username);
  if (!playerData || playerData.bank < amountNum) {
    player.outputChatBox('!{red}Insufficient bank funds!');
    return;
  }
  
  db.addBank(username, -amountNum);
  const updated = db.addMoney(username, amountNum);
  
  if (updated) {
    player.outputChatBox(`!{green}Withdrew $${amountNum}`);
    player.setVariable('money', updated.money);
    player.setVariable('bank', updated.bank);
  }
});

// Info commands
mp.events.addCommand('stats', (player: any) => {
  const username = player.getVariable('username');
  if (!username) {
    player.outputChatBox('!{red}You must be logged in!');
    return;
  }
  
  const playerData = db.getPlayer(username);
  if (playerData) {
    player.outputChatBox('!{yellow}===== Player Stats =====');
    player.outputChatBox(`!{white}Username: ${playerData.username}`);
    player.outputChatBox(`!{green}Cash: $${playerData.money}`);
    player.outputChatBox(`!{green}Bank: $${playerData.bank}`);
    player.outputChatBox(`!{cyan}Job: ${playerData.job || 'None'}`);
    player.outputChatBox(`!{cyan}Rank: ${playerData.jobRank}`);
    player.outputChatBox(`!{magenta}Police: ${playerData.isPolice ? 'Yes' : 'No'}`);
    player.outputChatBox(`!{magenta}On Duty: ${playerData.isOnDuty ? 'Yes' : 'No'}`);
  }
});

mp.events.addCommand('jobs', (player: any) => {
  const jobs = db.getAllJobs();
  player.outputChatBox('!{yellow}===== Available Jobs =====');
  Object.values(jobs).forEach((job: any) => {
    player.outputChatBox(`!{cyan}${job.name} !{white}- $${job.salary}/hour (${job.description})`);
  });
  player.outputChatBox('!{white}Use: /hire <job_id>');
});

mp.events.addCommand('help', (player: any) => {
  player.outputChatBox('!{yellow}===== Server Commands =====');
  player.outputChatBox('!{cyan}/stats !{white}- View your stats');
  player.outputChatBox('!{cyan}/jobs !{white}- View available jobs');
  player.outputChatBox('!{cyan}/hire <job> !{white}- Get a job');
  player.outputChatBox('!{cyan}/fire !{white}- Quit job');
  player.outputChatBox('!{cyan}/duty !{white}- Toggle on/off duty');
  player.outputChatBox('!{cyan}/givemoney <player> <amount> !{white}- Transfer money');
  player.outputChatBox('!{cyan}/deposit <amount> !{white}- Deposit to bank');
  player.outputChatBox('!{cyan}/withdraw <amount> !{white}- Withdraw from bank');
  player.outputChatBox('!{cyan}/makecop [player] !{white}- Recruit police');
  player.outputChatBox('!{cyan}/salary !{white}- Get police salary');
});

console.log('[Server] All events and commands registered!');
console.log('[Server] Type /help in game for commands');
