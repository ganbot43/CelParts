module.exports = {
  apps: [
    {
      name: "joymarperu-app",
      script: ".output/server/index.mjs",
      cwd: __dirname,
      instances: 1,
      exec_mode: "fork",
      node_args: "-r dotenv/config",
      env: {
        NODE_ENV: "production",
        PORT: 3018
      },
      env_file: ".env"
    }
  ]
}