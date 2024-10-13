import { DailyUsage } from '../../types';
import databaseService from '../../services/databaseService';

export const getPlayerById = async (userId: string) => {
  return await databaseService.getPlayerById(userId);
};

export const createPlayer = async (userId: string) => {
  return await databaseService.createPlayer(userId);
};

export const updatePlayerUsage = async (userId: string, usageType: keyof DailyUsage, amount: number) => {
  return await databaseService.updatePlayerUsage(userId, usageType, amount);
};

export const addRechargeRecord = async (userId: string, type: keyof DailyUsage, amount: number) => {
  return await databaseService.addRechargeRecord(userId, type, amount);
};
