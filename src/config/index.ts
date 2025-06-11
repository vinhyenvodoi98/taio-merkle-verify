import { Environment, EnvironmentConfig } from './types';
import { STAGING_CONFIG } from './staging';
import { PRODUCTION_CONFIG } from './production';

export const getEnvironmentConfig = (): EnvironmentConfig => {
  const env = process.env.NEXT_PUBLIC_APP_ENV as Environment || 'staging';

  switch (env) {
    case 'production':
      return PRODUCTION_CONFIG;
    case 'staging':
    default:
      return STAGING_CONFIG;
  }
};

export const MERKLE_CONFIG = getEnvironmentConfig();

// Re-export types and configs
export * from './types';
export * from './staging';
export * from './production';