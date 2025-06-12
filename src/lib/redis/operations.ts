import { Redis } from 'ioredis';
import { redisClient } from './client';

export class RedisOperations {
  private static async getClient(): Promise<Redis> {
    return await redisClient.connect();
  }

  public static async set(key: string, value: string, ttlSeconds?: number): Promise<void> {
    const client = await this.getClient();
    if (ttlSeconds) {
      await client.set(key, value, 'EX', ttlSeconds);
    } else {
      await client.set(key, value);
    }
  }

  public static async get(key: string): Promise<string | null> {
    const client = await this.getClient();
    return await client.get(key);
  }

  public static async del(key: string): Promise<void> {
    const client = await this.getClient();
    await client.del(key);
  }

  public static async exists(key: string): Promise<boolean> {
    const client = await this.getClient();
    const result = await client.exists(key);
    return result === 1;
  }

  public static async setHash(key: string, data: Record<string, string>): Promise<void> {
    const client = await this.getClient();
    await client.hmset(key, data);
  }

  public static async getHash(key: string): Promise<Record<string, string>> {
    const client = await this.getClient();
    return await client.hgetall(key);
  }

  public static async setHashField(key: string, field: string, value: string): Promise<void> {
    const client = await this.getClient();
    await client.hset(key, field, value);
  }

  public static async getHashField(key: string, field: string): Promise<string | null> {
    const client = await this.getClient();
    return await client.hget(key, field);
  }
}
