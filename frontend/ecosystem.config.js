// Configuration PM2 pour le frontend
module.exports = {
  apps: [
    {
      name: 'annonceauto-frontend',
      script: 'node_modules/next/dist/bin/next',
      args: 'start -p 3000',
      instances: 1,
      exec_mode: 'cluster',
      env: {
        NODE_ENV: 'production',
      },
      error_file: './logs/error.log',
      out_file: './logs/output.log',
      log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
      merge_logs: true,
      autorestart: true,
      watch: false,
      max_memory_restart: '500M',
    },
  ],
};



