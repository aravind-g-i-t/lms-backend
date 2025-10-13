import { GooogleAuthGetUserInfoOutput } from "@domain/types";

export interface IGoogleAuthService {
  getUserInfo(accessToken: string): Promise<GooogleAuthGetUserInfoOutput>;
}
