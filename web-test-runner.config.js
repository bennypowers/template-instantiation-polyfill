import webDevServerConfig from './web-dev-server.config.js';

export default {
  ...webDevServerConfig,
  files: '**/*.test.ts',
};
