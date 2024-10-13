import Loki from 'lokijs';
import { DailyUsage } from '../types';

interface Player {
  userId: string;
  dailyUsage: DailyUsage;
  rechargeHistory: Array<{
    type: keyof DailyUsage;
    amount: number;
    date: Date;
  }>;
}

class DatabaseService {
  private db: Loki;
  private players: Collection<Player>;

  constructor() {
    this.db = new Loki('player_database', {
      adapter: new Loki.LokiMemoryAdapter()
    });
    this.databaseInitialize();
  }

  private databaseInitialize() {
    this.players = this.db.getCollection('players');
    if (this.players === null) {
      this.players = this.db.addCollection('players');
    }
  }

  async getPlayerById(userId: string): Promise<Player | null> {
    return this.players.findOne({ userId });
  }

  async createPlayer(userId: string): Promise<Player> {
    const newPlayer: Player = {
      userId,
      dailyUsage: {
        zhSummary: 0,
        enSummary: 0,
        zhAnalysis: 0,
        enAnalysis: 0,
      },
      rechargeHistory: [],
    };
    return this.players.insert(newPlayer);
  }

  async updatePlayerUsage(userId: string, usageType: keyof DailyUsage, amount: number): Promise<Player> {
    const player = this.players.findOne({ userId });
    if (!player) throw new Error('Player not found');

    player.dailyUsage[usageType] += amount;
    return this.players.update(player);
  }

  async addRechargeRecord(userId: string, type: keyof DailyUsage, amount: number): Promise<Player> {
    const player = this.players.findOne({ userId });
    if (!player) throw new Error('Player not found');

    player.rechargeHistory.push({ type, amount, date: new Date() });
    player.dailyUsage[type] += amount;
    return this.players.update(player);
  }

  async getAllPlayers(): Promise<Player[]> {
    return this.players.find();
  }

  saveDatabase() {
    this.db.saveDatabase();
  }
}

const databaseService = new DatabaseService();
export default databaseService;
