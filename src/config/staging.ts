import { EnvironmentConfig } from './types';

const config: EnvironmentConfig = {
  environment: 'staging',
  merkle: {
    leafTag: process.env.MERKLE_LEAF_TAG || 'leafTag',
    branchTag: process.env.MERKLE_BRANCH_TAG || 'branchTag',
  },
  redis: {
    url: process.env.REDIS_URL || 'redis://localhost:6379',
    tls: {
      rejectUnauthorized: true,
    },
  },
};

export default config;
