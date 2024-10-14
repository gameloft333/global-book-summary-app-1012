import { DailyUsage } from '../types';
import config from '../config';
import databaseService from './databaseService';
import i18next from 'i18next';

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

export async function claimDailyUsage(userId: string): Promise<void> {
  const player = await databaseService.getPlayerById(userId);
  if (!player) throw new Error('Player not found');

  const today = new Date().toISOString().split('T')[0];
  if (player.lastClaimDate === today) {
    throw new Error(i18next.t('alreadyClaimed'));
  }

  for (const type of Object.keys(config.dailyClaimAmount) as Array<keyof DailyUsage>) {
    const claimAmount = config.dailyClaimAmount[type];
    await databaseService.updatePlayerUsage(userId, type, claimAmount);
  }

  await databaseService.updatePlayerLastClaimDate(userId, today);
}

export async function getRemainingClaims(userId: string): Promise<DailyClaim> {
  const player = await databaseService.getPlayerById(userId);
  if (!player) throw new Error('Player not found');

  const today = new Date().toISOString().split('T')[0];
  if (player.lastClaimDate !== today) {
    return config.dailyClaimLimits;
  }

  return player.remainingClaims;
}

export async function resetClaimStatus(userId: string): Promise<void> {
  await databaseService.resetClaimStatus(userId);
}
