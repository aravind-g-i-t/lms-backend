// application/usecases/video/GetZegoTokenUseCase.ts

import { IVideoCallService } from "@domain/interfaces/IVideoCallService";

export class GetVideoCallTokenUseCase {
  constructor(private zegoService: IVideoCallService) {}

  execute(userId: string, roomId: string) {
    return this.zegoService.generateToken(userId, roomId);
  }
}
