export const jwtConfig: { secret: string; expiresIn: string } = {
  secret: process.env.JWT_SECRET || "supersecret",
  expiresIn: process.env.JWT_EXPIRES_IN || "1h",
};
