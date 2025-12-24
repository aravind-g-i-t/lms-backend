// infrastructure/services/ZegoTokenService.ts
import { IVideoCallService } from "@domain/interfaces/IVideoCallService";
import crypto from "crypto";


export class ZegoService implements IVideoCallService {
  generateToken(userId: string, roomId: string): string {
    const appID = Number(process.env.ZEGO_APP_ID);
    const serverSecret = process.env.ZEGO_SERVER_SECRET!;

    const payload = {
      app_id: appID,
      user_id: userId,
      room_id: roomId,
      privilege: { 1: 1, 2: 1 },
      exp: Math.floor(Date.now() / 1000) + 3600
    };

    const base64Payload = Buffer.from(JSON.stringify(payload)).toString("base64");

    const signature = crypto
      .createHmac("sha256", serverSecret)
      .update(base64Payload)
      .digest("base64");

    return `${base64Payload}.${signature}`;
  }
}
