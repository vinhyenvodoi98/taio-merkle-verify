export type Environment = 'staging' | 'production';

export interface EnvironmentConfig {
  LEAF_TAG: string;
  BRANCH_TAG: string;
} 