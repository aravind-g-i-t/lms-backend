export interface ITokenService {
  generateAccessToken(payload: object): Promise<string>;
  generateRefreshToken(payload:object):Promise<string>;
  verifyAccessToken<T extends object>(token: string): Promise<VerifiedToken<T>>;
  verifyRefreshToken<T extends object>(token: string): Promise<VerifiedToken<T>>;
  decodeToken<T extends object>(token: string): T | null;
}

export type VerifiedToken<T> = T & {
  iat?: number;
  exp?: number;
  iss?: string;
  aud?: string;
};