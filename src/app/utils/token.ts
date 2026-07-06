import jwt, { JwtPayload, SignOptions } from 'jsonwebtoken';

import { IUserResponse } from '../module/user/user,interface';
import { ENV } from '../config/env';

export const createUserToken = (user: Partial<IUserResponse>) => {
  const jwtPayload = {
    userId: user._id,
    email: user.email,
    role: user.role,
  };

  const accessToken = generateToken(
    jwtPayload,
    ENV.JWT.ACCESS_TOKEN,
    ENV.JWT.ACCESS_EXPIRED
  );

  const refreshToken = generateToken(
    jwtPayload,
    ENV.JWT.REFRESH_SECRET,
    ENV.JWT.REFRESH_EXPIRED
  );
  return {
    accessToken,
    refreshToken,
  };
};

export const generateToken = (
  payload: JwtPayload,
  secret: string,
  expiresIn: string | number = '1d'
): string => {
  const token = jwt.sign(payload, secret, {
    expiresIn,
    algorithm: 'HS256',
  } as SignOptions);

  return token;
};

export const verifyToken = (token: string, secret: string) => {
  const verifiedToken = jwt.verify(token, secret);
  return verifiedToken;
};
