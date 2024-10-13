import { DailyUsage } from '../types';
import config from '../config';
import databaseService from './databaseService';

export async function getUserData(userId: string): Promise<{ id: string; remainingUsage: DailyUsage }> {
  let player = await databaseService.getPlayerById(userId);
  if (!player) {
    player = await databaseService.createPlayer(userId);
  }
  return {
    id: player.userId,
    remainingUsage: player.dailyUsage
  };
}

export async function updateUserUsage(userId: string, type: keyof DailyUsage, pointsToDeduct: number): Promise<void> {
  await databaseService.updatePlayerUsage(userId, type, -pointsToDeduct);
}

export async function setUserUsage(userId: string, type: keyof DailyUsage, value: number): Promise<void> {
  const player = await databaseService.getPlayerById(userId);
  if (!player) throw new Error('Player not found');
  const currentUsage = player.dailyUsage[type];
  const difference = value - currentUsage;
  await databaseService.updatePlayerUsage(userId, type, difference);
}

export async function rechargeUserUsage(userId: string, type: keyof DailyUsage, amount: number): Promise<void> {
  await databaseService.addRechargeRecord(userId, type, amount);
}
