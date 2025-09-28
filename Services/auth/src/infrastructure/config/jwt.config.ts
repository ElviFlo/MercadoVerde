export const jwtConfig = {
  secret: process.env.JWT_SECRET || "dev_secret_change_me",
  refreshSecret: process.env.JWT_REFRESH_SECRET || process.env.JWT_SECRET || "dev_refresh_secret_change_me",
  accessTtl: process.env.JWT_ACCESS_TTL || "15m",
  refreshTtl: process.env.JWT_REFRESH_TTL || "7d",
};
