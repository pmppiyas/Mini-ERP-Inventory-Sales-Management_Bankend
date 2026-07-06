import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.join(process.cwd(), '.env').toString() });

export const ENV = {
  PORT: process.env.PORT,
  NODE_ENV: process.env.NODE_ENV as string,
  BCRYPT: {
    SALT_NUMBER: process.env.SALT_NUMBER as string,
  },
  JWT: {
    ACCESS_TOKEN: process.env.ACCESS_TOKEN as string,
    ACCESS_EXPIRED: process.env.ACCESS_EXPIRED as string,
    REFRESH_SECRET: process.env.REFRESH_SECRET as string,
    REFRESH_EXPIRED: process.env.REFRESH_EXPIRED as string,
  },

  EXPRESS_SESSION_SECRET: process.env.EXPRESS_SESSION_SECRET as string,
};
