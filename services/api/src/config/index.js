const config = {
  env: process.env.NODE_ENV || 'development',
  port: process.env.PORT || 3000,
  jwtSecret: 'simple api secret',
  services: {
    api: 'api',
    reportsGenerator: 'reports-generator',
  },
  queue: {
    tasks: 'tasks',
    completedTasks: 'completed_tasks',
  },
};

export default config;
