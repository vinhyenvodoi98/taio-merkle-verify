import { EnvironmentConfig } from './types';

export const PRODUCTION_CONFIG: EnvironmentConfig = {
  LEAF_TAG: process.env.MERKLE_LEAF_TAG || 'prod_merkle_leaf_tag',
  BRANCH_TAG: process.env.MERKLE_BRANCH_TAG || 'prod_merkle_branch_tag',
} as const; 