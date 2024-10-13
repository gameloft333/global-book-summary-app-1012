import { DailyUsage } from '../types';
import config from '../config';

interface UserData {
  id: string;
  remainingUsage: DailyUsage;
}

export function getUserData(userId: string): UserData {
  const storedData = localStorage.getItem(`user_${userId}`);
  if (storedData) {
    const parsedData = JSON.parse(storedData);
    return {
      id: userId,
      remainingUsage: {
        zhSummary: parsedData.remainingUsage.zhSummary ?? config.dailyLimits.zhSummary,
        enSummary: parsedData.remainingUsage.enSummary ?? config.dailyLimits.enSummary,
        zhAnalysis: parsedData.remainingUsage.zhAnalysis ?? config.dailyLimits.zhAnalysis,
        enAnalysis: parsedData.remainingUsage.enAnalysis ?? config.dailyLimits.enAnalysis
      }
    };
  }
  return {
    id: userId,
    remainingUsage: { ...config.dailyLimits }
  };
}

export function updateUserUsage(userId: string, type: 'zhSummary' | 'enSummary' | 'zhAnalysis' | 'enAnalysis'): void {
  const userData = getUserData(userId);
  if (userData.remainingUsage[type] > 0) {
    userData.remainingUsage[type]--;
    localStorage.setItem(`user_${userId}`, JSON.stringify(userData));
  }
}

export function setUserUsage(userId: string, type: 'zhSummary' | 'enSummary' | 'zhAnalysis' | 'enAnalysis', value: number): void {
  const userData = getUserData(userId);
  userData.remainingUsage[type] = value;
  localStorage.setItem(`user_${userId}`, JSON.stringify(userData));
}
