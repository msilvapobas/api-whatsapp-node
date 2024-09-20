module.exports = {
  apps: [
    {
      name: 'app-sebaarevalo-wapp',
      script: './dist/app.js', // Ruta al archivo JavaScript compilado
      watch: ['src/**/*.ts'],
      ignore_watch: ['node_modules'],
      max_memory_restart: '1000M',
      exec_mode: 'cluster',
      instances: 1,
      cron_restart: "59 23 * * *",
      interpreter: 'node',
      env: {
        NODE_ENV: 'development'
      },
      env_production: {
        NODE_ENV: 'production'
      },
      output: './logs/out.log', // Ruta para los logs de salida
      error: './logs/error.log', // Ruta para los logs de error
      log_date_format: 'YYYY-MM-DD HH:mm Z'
    }
  ]
};
