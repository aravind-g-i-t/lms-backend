// domain/interfaces/IZegoTokenService.ts
export interface IVideoCallService {
  generateToken(userId: string, roomId: string): string;
}
