import { EnvironmentConfig } from './types';

export const STAGING_CONFIG: EnvironmentConfig = {
  LEAF_TAG: process.env.MERKLE_LEAF_TAG || 'stg_merkle_leaf_tag',
  BRANCH_TAG: process.env.MERKLE_BRANCH_TAG || 'stg_merkle_branch_tag',
} as const;