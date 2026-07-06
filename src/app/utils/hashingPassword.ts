import bcryptjs from 'bcryptjs';
import { ENV } from '../config/env';

export const hashingPassword = async (password: string): Promise<string> => {
  const saltRound = Number(ENV.BCRYPT.SALT_NUMBER);

  return await bcryptjs.hash(password, saltRound);
};
