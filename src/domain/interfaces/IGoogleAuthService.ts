export interface IGoogleAuthService {
  getUserInfo(accessToken: string): Promise<{
    sub: string;
    email: string;
    name: string;
    picture?: string;
  }>;
}
