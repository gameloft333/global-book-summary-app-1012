import { DailyUsage } from '../types';

interface Player {
  userId: string;
  dailyUsage: DailyUsage;
}

class DatabaseService {
  private players: Map<string, Player> = new Map();

  constructor() {
    this.loadFromStorage();
  }

  private loadFromStorage() {
    const storedData = localStorage.getItem('players');
    if (storedData) {
      const parsedData = JSON.parse(storedData);
      this.players = new Map(parsedData);
    }
  }

  private saveToStorage() {
    localStorage.setItem('players', JSON.stringify(Array.from(this.players.entries())));
  }

  async getPlayerById(userId: string): Promise<Player | undefined> {
    return this.players.get(userId);
  }

  async createPlayer(userId: string): Promise<Player> {
    const newPlayer: Player = {
      userId,
      dailyUsage: {
        zhSummary: 0,
        enSummary: 0,
        zhAnalysis: 0,
        enAnalysis: 0
      }
    };
    this.players.set(userId, newPlayer);
    this.saveToStorage();
    return newPlayer;
  }

  async updatePlayerUsage(userId: string, type: keyof DailyUsage, change: number): Promise<void> {
    const player = this.players.get(userId);
    if (player) {
      player.dailyUsage[type] += change;
      this.players.set(userId, player);
      this.saveToStorage();
    }
  }

  async addRechargeRecord(userId: string, type: keyof DailyUsage, amount: number): Promise<void> {
    const player = this.players.get(userId);
    if (player) {
      player.dailyUsage[type] += amount;
      this.players.set(userId, player);
      this.saveToStorage();
    }
  }
}

const databaseService = new DatabaseService();
export default databaseService;
