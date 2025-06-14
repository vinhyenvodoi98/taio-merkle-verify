import Redis from 'ioredis';
import { CONFIG } from '@/config';
import { MerkleProof } from 'taio-merkle';

export class RedisOperations {
  private static instance: RedisOperations;
  private client: Redis | null = null;
  private isConnecting: boolean = false;
  private connectionPromise: Promise<Redis> | null = null;

  private constructor() {}

  public static getInstance(): RedisOperations {
    if (!RedisOperations.instance) {
      RedisOperations.instance = new RedisOperations();
    }
    return RedisOperations.instance;
  }

  private async getClient(): Promise<Redis> {
    if (this.client?.status === 'ready') {
      return this.client;
    }

    if (this.isConnecting) {
      return this.connectionPromise!;
    }

    this.isConnecting = true;
    this.connectionPromise = this.connect();
    
    try {
      this.client = await this.connectionPromise;
      return this.client;
    } finally {
      this.isConnecting = false;
      this.connectionPromise = null;
    }
  }

  private async connect(): Promise<Redis> {
    const client = new Redis(CONFIG.redis.url, {
      maxRetriesPerRequest: 3,
      retryStrategy: (times) => {
        const delay = Math.min(times * 50, 2000);
        return delay;
      },
      ...CONFIG.redis.tls
    });

    client.on('error', (error) => {
      console.error('Redis connection error:', error);
    });

    client.on('connect', () => {
      console.log('Redis connected successfully');
    });

    return client;
  }

  public async disconnect(): Promise<void> {
    if (this.client) {
      await this.client.quit();
      this.client = null;
    }
  }

  public static async set(key: string, value: string, ttlSeconds?: number): Promise<void> {
    const client = await this.getInstance().getClient();
    if (ttlSeconds) {
      await client.set(key, value, 'EX', ttlSeconds);
    } else {
      await client.set(key, value);
    }
  }

  public static async get(key: string): Promise<string | null> {
    const client = await this.getInstance().getClient();
    return await client.get(key);
  }

  public static async del(key: string): Promise<void> {
    const client = await this.getInstance().getClient();
    await client.del(key);
  }

  public static async exists(key: string): Promise<boolean> {
    const client = await this.getInstance().getClient();
    const result = await client.exists(key);
    return result === 1;
  }

  public static async setHash(key: string, data: Record<string, string>): Promise<void> {
    const client = await this.getInstance().getClient();
    await client.hmset(key, data);
  }

  public static async getHash(key: string): Promise<Record<string, string>> {
    const client = await this.getInstance().getClient();
    return await client.hgetall(key);
  }

  public static async setHashField(key: string, field: string, value: string): Promise<void> {
    const client = await this.getInstance().getClient();
    await client.hset(key, field, value);
  }

  public static async getHashField(key: string, field: string): Promise<string | null> {
    const client = await this.getInstance().getClient();
    return await client.hget(key, field);
  }

  public static async setEpoch(epoch: number): Promise<void> {
    const client = await this.getInstance().getClient();
    await client.set('merkle:current:epoch', epoch.toString());
  }

  public static async getCurrentEpoch(): Promise<number | null> {
    const client = await this.getInstance().getClient();
    const epoch = await client.get('merkle:current:epoch');
    return epoch ? parseInt(epoch, 10) : null;
  }

  public static async setMerkleRoot(epoch: number, root: string): Promise<void> {
    const client = await this.getInstance().getClient();
    await client.set(`merkle:root:${epoch}`, root);
  }

  public static async getMerkleRoot(epoch: number): Promise<string | null> {
    const client = await this.getInstance().getClient();
    return await client.get(`merkle:root:${epoch}`);
  }

  public static async setMerkleProof(epoch: string, userId: string, userProof: { balance: string, proof: MerkleProof }): Promise<void> {
    const client = await this.getInstance().getClient();
    const key = `merkle:proof:${userId}:${epoch}`;
    await client.set(key, JSON.stringify(userProof));
  }

  public static async getMerkleProof(epoch: string, userId: string): Promise<{ balance: string, proof: MerkleProof } | null> {
    const client = await this.getInstance().getClient();
    const key = `merkle:proof:${userId}:${epoch}`;
    const proof = await client.get(key);
    return proof ? JSON.parse(proof) : null;
  }
}
