interface StorageAdapter {
  save(key: string, data: any): void;
  load(key: string): any;
}

class LocalStorageAdapter implements StorageAdapter {
  save(key: string, data: any): void {
    localStorage.setItem(key, JSON.stringify(data));
  }

  load(key: string): any {
    const data = localStorage.getItem(key);
    if (data) {
      return JSON.parse(data);
    }
    return null;
  }
}

class Score {
  constructor(public name: string, public value: number) {}
}

class LeaderboardManager {
  private static LEADERBOARD_STORAGE_KEY = 'leaderboard';
  private storageAdapter: StorageAdapter;
  private scores: Score[];

  constructor(storageAdapter: StorageAdapter = new LocalStorageAdapter()) {
    this.storageAdapter = storageAdapter;
    this.scores = this.loadScores();
  }

  private loadScores(): Score[] {
    const scoresData = this.storageAdapter.load(LeaderboardManager.LEADERBOARD_STORAGE_KEY);
    if (!scoresData || !Array.isArray(scoresData)) {
      return [];
    }

    return scoresData.map((scoreData) => {
      if (typeof scoreData.name === 'string' && typeof scoreData.value === 'number') {
        return new Score(scoreData.name, scoreData.value);
      }
      return null;
    }).filter((score) => score !== null);
  }

  private saveScores(): void {
    this.storageAdapter.save(LeaderboardManager.LEADERBOARD_STORAGE_KEY, this.scores);
  }

  addScore(name: string, value: number): void {
    this.scores.push(new Score(name, value));
    this.scores.sort((a, b) => b.value - a.value);
    this.scores = this.scores.slice(0, 10); // Keep only top 10 scores
    this.saveScores();
  }

  viewTopScores(): Score[] {
    return this.scores.slice(0, 10); // Return top 10 scores
  }
}

export default LeaderboardManager;
