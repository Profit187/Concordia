module.exports = {
  apps : [{
    name   : "concordia",
    script : "index.js",
    cwd: "/home/ec2-user/concordia",
    env_production: {
      NODE_ENV: "production", 
      QUICK_DB_LOCATION: "/home/ec2-user/concordia.db"
    },
  }]
}