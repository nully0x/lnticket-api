const dotenv = require("dotenv");

dotenv.config();

const config: any | unknown = {
  jwt_secret: process.env.jwt_secret,
  port: process.env.PORT || 3000,
  NodeEnv: process.env.NODE_ENV || "dev",
};

export default config;
