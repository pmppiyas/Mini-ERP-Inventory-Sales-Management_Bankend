import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.join(process.cwd(), '.env').toString() });

export const ENV = {
  PORT: process.env.PORT,
  NODE_ENV: process.env.NODE_ENV as string,
  BCRYPT: {
    SALT_NUMBER: process.env.SALT_NUMBER as string,
  },
};
