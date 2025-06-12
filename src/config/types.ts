export type Environment = 'staging' | 'production';

export interface RedisConfig {
  url: string;
  tls: {
    rejectUnauthorized: boolean;
  };
}

export interface MerkleConfig {
  leafTag: string;
  branchTag: string;
}

export interface EnvironmentConfig {
  environment: Environment;
  merkle: MerkleConfig;
  redis: RedisConfig;
} 