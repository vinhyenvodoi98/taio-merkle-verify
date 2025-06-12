import { EnvironmentConfig } from './types';
import stagingConfig from './staging';
import productionConfig from './production';

export const getConfig = (): EnvironmentConfig => {
  const env = process.env.NEXT_PUBLIC_APP_ENV || 'staging';
  return env === 'production' ? productionConfig : stagingConfig;
};

export const CONFIG = getConfig();

// Re-export types and configs
export * from './types';
export * from './staging';
export * from './production';