module.exports = {
  apps: [
    {
      name: "momenti-server",
      cwd: "./server",
      script: "npm",
      args: "run dev",
      watch: false,
    },
    {
      name: "momenti-client",
      cwd: "./client",
      script: "npm",
      args: "run dev",
      watch: false,
    },
  ],
};

